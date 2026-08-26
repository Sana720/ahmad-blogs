import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { captureOrder } from '@/utils/paypal';
import { sendLicenseEmail } from '@/utils/resend';
import { License, Order, LicenseStatus } from '@/types/license';
import crypto from 'crypto';

function generateLicenseKey(): string {
  // Generates a key in the format: CPLP-XXXX-XXXX-XXXX
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
    const { orderId } = body; // This is the PayPal order ID

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const db = admin.firestore();

    // 1. Capture the order in PayPal
    const { jsonResponse, httpStatusCode } = await captureOrder(orderId);

    // If already captured, PayPal might return an error, but let's handle standard success
    if (httpStatusCode !== 200 && httpStatusCode !== 201) {
      console.error('PayPal Order Capture Failed:', jsonResponse);
      return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 });
    }

    // PayPal returns the captured transaction details
    const captureData = jsonResponse.purchase_units[0].payments.captures[0];
    const transactionId = captureData.id;
    const captureStatus = captureData.status; // e.g. 'COMPLETED'
    const captureAmount = parseFloat(captureData.amount.value);
    const captureCurrency = captureData.amount.currency_code;

    // 2. Find the pending order in our database using paypalOrderId
    const ordersSnapshot = await db.collection('orders').where('paypalOrderId', '==', orderId).limit(1).get();
    
    if (ordersSnapshot.empty) {
      console.error(`Order ${orderId} not found in database.`);
      return NextResponse.json({ error: 'Order not found in system' }, { status: 404 });
    }

    const orderDoc = ordersSnapshot.docs[0];
    const order = orderDoc.data() as Order;

    // 3. Verify security: Amount and Currency must match what we expect
    if (order.amount !== captureAmount || order.currency !== captureCurrency) {
      console.error(`Amount mismatch for order ${order.id}. Expected ${order.amount} ${order.currency}, got ${captureAmount} ${captureCurrency}`);
      // Mark as failed/suspect
      await orderDoc.ref.update({
        paymentStatus: 'FAILED',
        paypalStatus: 'AMOUNT_MISMATCH',
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ error: 'Payment amount mismatch. Fulfillment rejected.' }, { status: 400 });
    }

    // 4. Generate the License
    const licenseKey = generateLicenseKey();
    
    // We should fetch the plan to know maxDevices, duration, etc.
    const planDoc = await db.collection('plans').doc(order.planId).get();
    const plan = planDoc.data() as any;

    let productName = 'Digital Product';
    if (order.productId) {
      const productDoc = await db.collection('products').doc(order.productId).get();
      if (productDoc.exists) {
        productName = productDoc.data()?.title || productName;
      }
    }

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
      productId: order.productId || 'default-product',
      planId: order.planId,
      orderId: orderDoc.id, // our internal order ID
      customerEmail: order.customerEmail,
      status: 'ACTIVE' as LicenseStatus,
      activated: false,
      activationCount: 0,
      maxDevices: plan.maxDevices || 1,
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5. Use a batch to write both License and Update Order simultaneously
    const batch = db.batch();
    
    // Create license
    batch.set(newLicenseRef, newLicense);

    // Update order
    batch.update(orderDoc.ref, {
      paymentStatus: 'COMPLETED',
      paypalTransactionId: transactionId,
      paypalStatus: captureStatus,
      licenseId: newLicenseRef.id,
      updatedAt: new Date().toISOString()
    });

    await batch.commit();

    // 5b. Send Email via Resend
    // We do this asynchronously so it doesn't block the UI returning success
    sendLicenseEmail(order.customerEmail, order.customerName, plan.name, licenseKey, productName)
      .catch(err => console.error('Failed to send license email:', err));

    // 6. Return success and the license to the frontend
    return NextResponse.json({
      success: true,
      licenseKey: licenseKey,
      customerEmail: order.customerEmail,
      planName: plan.name
    });

  } catch (error: any) {
    console.error('Error in capture-order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
