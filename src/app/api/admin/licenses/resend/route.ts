import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { sendLicenseEmail } from '@/utils/resend';
import { License, Order } from '@/types/license';

export async function POST(req: Request) {
  try {
    const { licenseId } = await req.json();

    if (!licenseId) {
      return NextResponse.json({ error: 'Missing licenseId' }, { status: 400 });
    }

    const db = admin.firestore();
    const licenseDoc = await db.collection('licenses').doc(licenseId).get();
    
    if (!licenseDoc.exists) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    const license = licenseDoc.data() as License;
    
    // Fetch associated order to get customer name
    const orderDoc = await db.collection('orders').doc(license.orderId).get();
    const order = orderDoc.data() as Order;

    // Fetch plan to get the plan name
    const planDoc = await db.collection('plans').doc(license.planId).get();
    const planName = planDoc.data()?.name || 'Pro';

    let productName = 'Digital Product';
    if (license.productId) {
      const productDoc = await db.collection('products').doc(license.productId).get();
      if (productDoc.exists) {
        productName = productDoc.data()?.title || productName;
      }
    }

    // Send the email
    const emailResult = await sendLicenseEmail(
      license.customerEmail,
      order?.customerName || '',
      planName,
      license.key,
      productName
    );

    if (!emailResult.success && !emailResult.simulated) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json({ error: 'Failed to send email via provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'License email resent successfully.' });
  } catch (error: any) {
    console.error('Error resending license email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
