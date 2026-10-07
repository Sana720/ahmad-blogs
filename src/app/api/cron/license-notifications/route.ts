import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { sendFeedbackEmail, sendRenewalReminderEmail } from '@/utils/resend';
import { License } from '@/types/license';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');

  // Verify CRON_SECRET if configured
  if (process.env.CRON_SECRET) {
    const isValidHeader = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isValidParam = secretParam === process.env.CRON_SECRET;
    if (!isValidHeader && !isValidParam) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const db = admin.firestore();
    const now = new Date();

    // Auto-ensure default coupons are active in Firestore
    const defaultCoupons = ['RENEW10', 'COMEBACK10', 'EXISTINGUSER', 'EXISTING10'];
    for (const code of defaultCoupons) {
      const couponSnap = await db.collection('coupons').where('code', '==', code).limit(1).get();
      if (couponSnap.empty) {
        await db.collection('coupons').add({
          code,
          discountPercentage: 10,
          isActive: true,
          createdAt: now.toISOString(),
          description: `Automated 10% discount coupon (${code})`
        });
      }
    }

    const licensesSnapshot = await db.collection('licenses')
      .where('status', '==', 'ACTIVE')
      .get();

    let feedbackSentCount = 0;
    let renewalSentCount = 0;

    for (const doc of licensesSnapshot.docs) {
      const license = doc.data() as License;
      if (!license.customerEmail) continue;

      // 1. Check 15-Day Post-Purchase Feedback Email
      if (license.createdAt && !license.feedbackEmailSent) {
        const createdAt = new Date(license.createdAt);
        const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceCreated >= 15) {
          const result = await sendFeedbackEmail(
            license.customerEmail,
            license.customerEmail.split('@')[0],
            license.productId || 'Digital Product'
          );

          if (result.success) {
            await doc.ref.update({
              feedbackEmailSent: true,
              updatedAt: now.toISOString()
            });
            feedbackSentCount++;
          }
        }
      }

      // 2. Check Pre-Expiration Renewal Emails (7, 3, and 1 Days before expiresAt)
      if (license.expiresAt) {
        const expiresAt = new Date(license.expiresAt);
        const diffMs = expiresAt.getTime() - now.getTime();
        const daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // 7-day reminder
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 3 && !license.renewal7DayEmailSent) {
          const result = await sendRenewalReminderEmail(
            license.customerEmail,
            license.customerEmail.split('@')[0],
            license.productId || 'Digital Product',
            license.planId,
            7,
            'RENEW10'
          );

          if (result.success) {
            await doc.ref.update({
              renewal7DayEmailSent: true,
              updatedAt: now.toISOString()
            });
            renewalSentCount++;
          }
        }
        // 3-day reminder
        else if (daysUntilExpiry <= 3 && daysUntilExpiry > 1 && !license.renewal3DayEmailSent) {
          const result = await sendRenewalReminderEmail(
            license.customerEmail,
            license.customerEmail.split('@')[0],
            license.productId || 'Digital Product',
            license.planId,
            3,
            'RENEW10'
          );

          if (result.success) {
            await doc.ref.update({
              renewal3DayEmailSent: true,
              updatedAt: now.toISOString()
            });
            renewalSentCount++;
          }
        }
        // 1-day urgent reminder
        else if (daysUntilExpiry <= 1 && daysUntilExpiry >= 0 && !license.renewal1DayEmailSent) {
          const result = await sendRenewalReminderEmail(
            license.customerEmail,
            license.customerEmail.split('@')[0],
            license.productId || 'Digital Product',
            license.planId,
            1,
            'RENEW10'
          );

          if (result.success) {
            await doc.ref.update({
              renewal1DayEmailSent: true,
              updatedAt: now.toISOString()
            });
            renewalSentCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notification cron completed. Sent ${feedbackSentCount} feedback emails and ${renewalSentCount} renewal reminders.`,
      feedbackSentCount,
      renewalSentCount
    });

  } catch (error: any) {
    console.error('Error in license notifications cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
