import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { createOrder } from '@/utils/paypal';
import { Order, Plan } from '@/types/license';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, customerEmail, customerName } = body;

    if (!planId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields (planId, customerEmail)' }, { status: 400 });
    }

    // 1. Fetch the plan from Firestore to ensure the price is correct and it's active
    const db = admin.firestore();
    const planDoc = await db.collection('plans').doc(planId).get();

    if (!planDoc.exists) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const plan = planDoc.data() as Plan;

    if (!plan.active) {
      return NextResponse.json({ error: 'This plan is no longer available' }, { status: 400 });
    }

    // Process Discount Code
    let finalPrice = plan.price;
    const bodyCode = body.discountCode?.trim().toUpperCase();
    let appliedCode = '';
    const originalAmount = plan.price;

    if (bodyCode) {
      // Dynamic coupon lookup from admin panel
      const couponQuery = await db.collection('coupons')
        .where('code', '==', bodyCode)
        .where('isActive', '==', true)
        .limit(1)
        .get();
        
      if (!couponQuery.empty) {
        const couponData = couponQuery.docs[0].data();
        const discountPercentage = couponData.discountPercentage || 0;
        finalPrice = finalPrice * (1 - (discountPercentage / 100));
        appliedCode = bodyCode;
      } else {
        return NextResponse.json({ error: 'Invalid or inactive coupon code.' }, { status: 400 });
      }
    }

    // 2. Create the order in PayPal
    // We convert the price to string with 2 decimal places (e.g. 9.99)
    const amountStr = finalPrice.toFixed(2);
    const { jsonResponse, httpStatusCode } = await createOrder(amountStr, plan.currency);

    if (httpStatusCode !== 200 && httpStatusCode !== 201) {
      console.error('PayPal Order Creation Failed:', jsonResponse);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    const paypalOrderId = jsonResponse.id;

    // 3. Save the pending order in Firestore
    const newOrderRef = db.collection('orders').doc();
    
    const newOrder: Order = {
      id: newOrderRef.id,
      paypalOrderId: paypalOrderId,
      customerEmail,
      customerName: customerName || '',
      productId: plan.productId || 'default-product', // handle existing ones that might not have it yet
      planId,
      amount: parseFloat(amountStr), // The actual paid amount sent to PayPal
      currency: plan.currency,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (appliedCode) {
      newOrder.discountCode = appliedCode;
      newOrder.originalAmount = originalAmount;
    }

    await newOrderRef.set(newOrder);

    // 4. Return the PayPal Order ID so the frontend JS SDK can render the popup
    return NextResponse.json({
      orderId: paypalOrderId,
      success: true
    });

  } catch (error: any) {
    console.error('Error in create-order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
