import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { License, Activation } from '@/types/license';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { licenseKey, productId, deviceId, browserId } = body;

    if (!licenseKey || !productId || !deviceId) {
      return NextResponse.json({ error: 'Missing required fields (licenseKey, productId, deviceId)' }, { status: 400 });
    }

    const db = admin.firestore();

    // 1. Find the license
    const licenseSnapshot = await db.collection('licenses')
      .where('key', '==', licenseKey)
      .where('productId', '==', productId)
      .limit(1)
      .get();

    if (licenseSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
    }

    const licenseDoc = licenseSnapshot.docs[0];
    const license = licenseDoc.data() as License;

    // 2. Check basic license status
    if (license.status !== 'ACTIVE') {
      return NextResponse.json({ error: `License is ${license.status.toLowerCase()}` }, { status: 403 });
    }

    // 3. Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // Auto-expire it
      await licenseDoc.ref.update({ status: 'EXPIRED', updatedAt: new Date().toISOString() });
      return NextResponse.json({ error: 'License has expired' }, { status: 403 });
    }

    // 4. Check if this device is already activated
    const activationSnapshot = await db.collection('activations')
      .where('licenseId', '==', licenseDoc.id)
      .where('deviceId', '==', deviceId)
      .limit(1)
      .get();

    if (!activationSnapshot.empty) {
      const activationDoc = activationSnapshot.docs[0];
      const activation = activationDoc.data() as Activation;
      
      if (activation.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Device activation has been revoked' }, { status: 403 });
      }

      // Already activated, just update last seen
      await activationDoc.ref.update({
        lastSeenAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'License already activated on this device',
        license: {
          key: license.key,
          planId: license.planId,
          expiresAt: license.expiresAt
        }
      });
    }

    // 5. If new device, check limits
    if (license.activationCount >= license.maxDevices) {
      return NextResponse.json({ error: 'Maximum device limit reached for this license' }, { status: 403 });
    }

    // 6. Create new activation using a batch to ensure atomicity
    const batch = db.batch();

    const newActivationRef = db.collection('activations').doc();
    const newActivation: Activation = {
      id: newActivationRef.id,
      licenseId: licenseDoc.id,
      deviceId,
      browserId: browserId || 'unknown',
      activatedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    batch.set(newActivationRef, newActivation);

    // Update license count
    batch.update(licenseDoc.ref, {
      activated: true,
      activationCount: admin.firestore.FieldValue.increment(1),
      updatedAt: new Date().toISOString()
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'License activated successfully',
      license: {
        key: license.key,
        planId: license.planId,
        expiresAt: license.expiresAt
      }
    });

  } catch (error: any) {
    console.error('Error in license activation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
