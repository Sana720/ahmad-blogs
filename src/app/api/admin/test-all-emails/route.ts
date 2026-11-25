import { NextResponse } from 'next/server';
import { 
  sendLicenseEmail, 
  sendAbandonedCartEmail, 
  sendFeedbackEmail, 
  sendRenewalReminderEmail 
} from '@/utils/resend';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetEmail = url.searchParams.get('email') || 'saahmed311@gmail.com';

  const results: Record<string, any> = {};

  try {
    // 1. Send License Purchase Email
    results['1_license_purchase'] = await sendLicenseEmail(
      targetEmail,
      'Ahmad (Test User)',
      'Monthly Plan',
      'CPLP-TEST-8888-9999',
      'ChatGPT Plus Pro Extension'
    );

    // 2. Send Abandoned Cart (1-Hour Stage)
    results['2_abandoned_cart_1hour'] = await sendAbandonedCartEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension',
      'monthly-plan',
      '1-hour'
    );

    // 3. Send Abandoned Cart (24-Hour Stage with 10% Coupon)
    results['3_abandoned_cart_24hour'] = await sendAbandonedCartEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension',
      'monthly-plan',
      '24-hour'
    );

    // 4. Send 15-Day Post-Purchase Feedback Request
    results['4_feedback_15day'] = await sendFeedbackEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension'
    );

    // 5. Send 7-Day Renewal Reminder
    results['5_renewal_7day'] = await sendRenewalReminderEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension',
      'monthly-plan',
      7,
      'RENEW10'
    );

    // 6. Send 3-Day Renewal Reminder
    results['6_renewal_3day'] = await sendRenewalReminderEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension',
      'monthly-plan',
      3,
      'RENEW10'
    );

    // 7. Send 1-Day Urgent Renewal Reminder
    results['7_renewal_1day'] = await sendRenewalReminderEmail(
      targetEmail,
      'Ahmad (Test User)',
      'ChatGPT Plus Pro Extension',
      'monthly-plan',
      1,
      'RENEW10'
    );

    return NextResponse.json({
      success: true,
      message: `All 7 email templates triggered to ${targetEmail} with CC to saahmed311@gmail.com.`,
      results
    });

  } catch (error: any) {
    console.error('Error triggering test emails:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
