import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { sendLicenseEmail } from '@/utils/resend';
import { License, LicenseStatus, Order } from '@/types/license';

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const block = () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `CPLP-${block()}-${block()}-${block()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerEmail, customerName, productId, planId, paymentMethod } = body;

    if (!customerEmail || !productId || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = admin.firestore();

    // 1. Fetch Plan details
    const planDoc = await db.collection('plans').doc(planId).get();
    if (!planDoc.exists) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    const plan = planDoc.data() as any;

    // 2. Fetch Product details
    let productName = 'Digital Product';
    const productDoc = await db.collection('products').doc(productId).get();
    if (productDoc.exists) {
      productName = productDoc.data()?.title || productName;
    }

    // 3. Create a pseudo-order for this manual generation
    const orderRef = db.collection('orders').doc();
    const newOrder: Order = {
      id: orderRef.id,
      paypalOrderId: `MANUAL_${Date.now()}`,
      customerEmail,
      customerName: customerName || 'Valued Customer',
      productId,
      planId,
      amount: plan.price || 0,
      currency: plan.currency || 'USD',
      paymentStatus: 'COMPLETED',
      paypalStatus: paymentMethod || 'MANUAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. Generate the License
    const licenseKey = generateLicenseKey();
    let expiresAt: string | null = null;
    if (!plan.lifetime && plan.durationDays) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + plan.durationDays);
      expiresAt = expirationDate.toISOString();
    }

    const newLicenseRef = db.collection('licenses').doc();
    const newLicense: License = {
      id: newLicenseRef.id,
      key: licenseKey,
      productId,
      planId,
      orderId: orderRef.id,
      customerEmail,
      status: 'ACTIVE' as LicenseStatus,
      activated: false,
      activationCount: 0,
      maxDevices: plan.maxDevices || 1,
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newOrder.licenseId = newLicenseRef.id;

    // 5. Save to Firestore
    const batch = db.batch();
    batch.set(orderRef, newOrder);
    batch.set(newLicenseRef, newLicense);
    await batch.commit();

    // 6. Send Email via Resend
    sendLicenseEmail(customerEmail, newOrder.customerName || 'Valued Customer', plan.name, licenseKey, productName)
      .catch(err => console.error('Failed to send manual license email:', err));

    return NextResponse.json({
      success: true,
      license: newLicense,
    });

  } catch (error: any) {
    console.error('Error in manual generate license:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
