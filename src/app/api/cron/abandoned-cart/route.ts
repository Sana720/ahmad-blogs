import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendAbandonedCartEmail } from '@/utils/resend';
import { Order } from '@/types/license';

// This is required to force Vercel to run this as a serverless function, not statically compiled
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Optional: Add basic security so only Vercel Cron or authorized users can hit this
  const authHeader = request.headers.get('authorization');
  // If you configure a CRON_SECRET in your Vercel env, you can check it here
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const ordersRef = collection(db, 'orders');
    // We only care about pending orders
    const pendingQuery = query(ordersRef, where('paymentStatus', '==', 'PENDING'));
    const snapshot = await getDocs(pendingQuery);

    const now = new Date();
    const ONE_HOUR = 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;
    const FORTY_EIGHT_HOURS = 48 * ONE_HOUR;

    let emailsSent = 0;

    for (const orderDoc of snapshot.docs) {
      const orderData = orderDoc.data() as Order;
      
      // If we don't have an email to send to, or no creation date, skip
      if (!orderData.customerEmail || !orderData.createdAt) continue;

      const orderDate = new Date(orderData.createdAt);
      const timeDiff = now.getTime() - orderDate.getTime();

      // If it's been more than 48 hours, we probably don't want to keep trying to send emails
      if (timeDiff > FORTY_EIGHT_HOURS) {
        continue;
      }

      // Check if it's been > 24 hours and we haven't sent the 2nd email
      if (timeDiff > TWENTY_FOUR_HOURS && !orderData.abandonmentEmail2Sent) {
        // Send 24-hour email
        const result = await sendAbandonedCartEmail(
          orderData.customerEmail,
          orderData.customerName,
          orderData.productId, // Optionally map this to a real product name if needed
          orderData.planId,
          '24-hour'
        );

        if (result.success) {
          await updateDoc(doc(db, 'orders', orderDoc.id), {
            abandonmentEmail2Sent: true,
            updatedAt: new Date().toISOString()
          });
          emailsSent++;
        }
      }
      // Otherwise check if it's been > 1 hour and we haven't sent the 1st email
      else if (timeDiff > ONE_HOUR && !orderData.abandonmentEmail1Sent) {
        // Send 1-hour email
        const result = await sendAbandonedCartEmail(
          orderData.customerEmail,
          orderData.customerName,
          orderData.productId,
          orderData.planId,
          '1-hour'
        );

        if (result.success) {
          await updateDoc(doc(db, 'orders', orderDoc.id), {
            abandonmentEmail1Sent: true,
            updatedAt: new Date().toISOString()
          });
          emailsSent++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron job executed successfully. ${emailsSent} emails sent.` 
    });
    
  } catch (error: any) {
    console.error('Error in abandoned cart cron job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
