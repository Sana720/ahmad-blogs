import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { verifyWebhookSignature } from '@/utils/paypal';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Extract headers for PayPal signature verification
    const headersList = req.headers;
    const transmissionId = headersList.get('paypal-transmission-id');
    const transmissionTime = headersList.get('paypal-transmission-time');
    const certUrl = headersList.get('paypal-cert-url');
    const authAlgo = headersList.get('paypal-auth-algo');
    const transmissionSig = headersList.get('paypal-transmission-sig');

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      return NextResponse.json({ error: 'Missing PayPal signature headers' }, { status: 400 });
    }

    // Verify the signature
    const isValid = await verifyWebhookSignature(
      transmissionId,
      transmissionTime,
      certUrl,
      authAlgo,
      transmissionSig,
      body
    );

    if (!isValid) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const eventType = body.event_type;
    const resource = body.resource;
    
    const db = admin.firestore();

    if (eventType === 'PAYMENT.CAPTURE.REFUNDED' || eventType === 'PAYMENT.CAPTURE.REVERSED') {
      const transactionId = resource.id; // Or capture ID depending on the payload structure
      // Wait, for refunds, resource is the refund object. The original capture ID is in `resource.custom_id` or we can find it by links.
      // Usually, we can query our orders by paypalOrderId, but the webhook might just give us the capture ID.
      // Let's find the order by paypalTransactionId:
      const captureId = resource.links?.find((link: any) => link.rel === 'up')?.href?.split('/').pop() || '';
      
      let orderQuery = await db.collection('orders').where('paypalTransactionId', '==', captureId).limit(1).get();
      
      if (orderQuery.empty) {
        // Fallback: try finding by resource ID in case it's the capture itself
        orderQuery = await db.collection('orders').where('paypalTransactionId', '==', resource.id).limit(1).get();
      }

      if (!orderQuery.empty) {
        const orderDoc = orderQuery.docs[0];
        const order = orderDoc.data();

        // Mark order as refunded
        await orderDoc.ref.update({
          paymentStatus: 'REFUNDED',
          paypalStatus: 'REFUNDED',
          updatedAt: new Date().toISOString()
        });

        // Revoke the license
        if (order.licenseId) {
          const licenseRef = db.collection('licenses').doc(order.licenseId);
          await licenseRef.update({
            status: 'REFUNDED',
            revokedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

          // Revoke all activations for this license
          const activations = await db.collection('activations').where('licenseId', '==', order.licenseId).get();
          const batch = db.batch();
          activations.forEach(doc => {
            batch.update(doc.ref, { status: 'REVOKED' });
          });
          await batch.commit();
        }
      }
    }

    // Always return 200 to PayPal so they don't retry
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error in paypal webhook:', error);
    // Still return 200 so PayPal doesn't retry infinitely on non-fixable errors
    return NextResponse.json({ success: false, error: 'Internal Server Error' });
  }
}
