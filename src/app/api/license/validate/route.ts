import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { License, Activation } from '@/types/license';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { licenseKey, productId, deviceId } = body;

    if (!licenseKey || !productId || !deviceId) {
      return NextResponse.json({ valid: false, error: 'Missing required fields' }, { status: 400 });
    }

    const db = admin.firestore();

    // 1. Find the license
    const licenseSnapshot = await db.collection('licenses')
      .where('key', '==', licenseKey)
      .where('productId', '==', productId)
      .limit(1)
      .get();

    if (licenseSnapshot.empty) {
      return NextResponse.json({ valid: false, error: 'Invalid license key' });
    }

    const licenseDoc = licenseSnapshot.docs[0];
    const license = licenseDoc.data() as License;

    // 2. Check basic license status
    if (license.status !== 'ACTIVE') {
      return NextResponse.json({ valid: false, error: `License is ${license.status.toLowerCase()}` });
    }

    // 3. Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // Auto-expire it if we catch it during validation
      await licenseDoc.ref.update({ status: 'EXPIRED', updatedAt: new Date().toISOString() });
      return NextResponse.json({ valid: false, error: 'License has expired' });
    }

    // 4. Check if the specific device is activated
    const activationSnapshot = await db.collection('activations')
      .where('licenseId', '==', licenseDoc.id)
      .where('deviceId', '==', deviceId)
      .limit(1)
      .get();

    if (activationSnapshot.empty) {
      return NextResponse.json({ valid: false, error: 'Device not activated' });
    }

    const activationDoc = activationSnapshot.docs[0];
    const activation = activationDoc.data() as Activation;
    
    if (activation.status !== 'ACTIVE') {
      return NextResponse.json({ valid: false, error: 'Device activation has been revoked' });
    }

    // 5. Update last seen asynchronously (don't wait for it to return response faster)
    activationDoc.ref.update({
      lastSeenAt: new Date().toISOString()
    }).catch(err => console.error('Failed to update lastSeenAt', err));

    return NextResponse.json({
      valid: true,
      license: {
        planId: license.planId,
        expiresAt: license.expiresAt
      }
    });

  } catch (error: any) {
    console.error('Error in license validation:', error);
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
