import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Only initialize if we have a key, so local dev without a key doesn't crash on import
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Sends a license key email to the customer
 */
export async function sendLicenseEmail(
  toEmail: string,
  customerName: string | undefined,
  planName: string,
  licenseKey: string,
  productName: string = 'Digital Product'
) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    console.warn(`Simulated Email to ${toEmail}: Your ${planName} license key is ${licenseKey}`);
    return { success: true, simulated: true };
  }

  const name = customerName || 'Valued Customer';
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'ahmad@ahmadblogs.com';

  try {
    const data = await resend.emails.send({
      from: `Ahmad Blogs <${fromEmail}>`,
      to: [toEmail],
      cc: ['saahmed311@gmail.com'],
      subject: `Your ${productName} License Key (${planName})`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://www.ahmadblogs.com/apple-touch-icon.png" alt="Ahmad Blogs" style="height: 60px; width: auto; border-radius: 12px;" />
          </div>

          <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px; text-align: center;">
            Thank you for your purchase, ${name}! 🎉
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            Your payment for the <strong>${planName}</strong> plan of <strong>${productName}</strong> has been processed successfully. Here is your license key:
          </p>

          <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Your License Key</p>
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: 1px;">
              ${licenseKey}
            </div>
          </div>

          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            <strong>How to activate:</strong> Simply copy the license key above and paste it into the extension's settings to unlock your premium features.
          </p>

          <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin: 20px 0 30px 0; font-size: 14px; color: #92400e; line-height: 1.5;">
            <strong>⚠️ Note:</strong> Make sure to activate this license in the Chrome profile signed into <strong>${toEmail}</strong>. The extension verifies and binds the license to this email profile only.
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">If you have any questions, need technical support, or just want to say hi, feel free to reply directly to this email or reach out on WhatsApp.</p>
            
            <div style="margin-top: 24px; padding-left: 16px; border-left: 4px solid #3CB371;">
              <p style="margin: 0; font-weight: 700; color: #111827;">Ahmad Sana</p>
              <p style="margin: 4px 0; color: #4b5563;"><a href="https://www.ahmadblogs.com" style="color: #3CB371; text-decoration: none; font-weight: 600;">ahmadblogs.com</a></p>
              <p style="margin: 0; color: #4b5563;">+91-720 936 2004 (WhatsApp/Call)</p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending license email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an abandoned cart / pending transaction follow-up email
 */
export async function sendAbandonedCartEmail(
  toEmail: string,
  customerName: string | undefined,
  productName: string,
  planId: string,
  stage: '1-hour' | '24-hour'
) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    console.warn(`Simulated Abandoned Cart Email (${stage}) to ${toEmail} for ${productName}`);
    return { success: true, simulated: true };
  }

  const name = customerName || 'there';
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'ahmad@ahmadblogs.com';
  const productSlug = 'google-chrome-profile-lock';
  const productUrl = `https://www.ahmadblogs.com/products/${productSlug}?coupon=COMEBACK10`;

  const subject = stage === '1-hour' 
    ? `Need help completing your purchase for ${productName}?` 
    : `Here is a 10% discount for ${productName}!`;

  const heading = stage === '1-hour'
    ? `Hi ${name}, did you face any issues?`
    : `Hi ${name}, still thinking about ${productName}?`;

  const bodyContent = stage === '1-hour'
    ? `<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
        We noticed that you started the checkout process for <strong>${productName}</strong> but didn't quite finish. 
        If you faced any payment errors or technical issues, please reply to this email and let me know so I can help!
       </p>
       <div style="text-align: center; margin: 30px 0;">
         <a href="${productUrl}" style="background-color: #3CB371; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
           Complete My Purchase
         </a>
       </div>`
    : `<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
        We noticed you left <strong>${productName}</strong> in your cart yesterday. 
        To help you get started, here is a <strong>10% off</strong> coupon code valid for the next 48 hours:
       </p>
       <div style="background-color: #f3f4f6; border: 2px dashed #3CB371; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
         <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Use Code at Checkout</p>
         <div style="font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: 900; color: #111827; letter-spacing: 2px;">
           COMEBACK10
         </div>
       </div>
       <div style="text-align: center; margin: 30px 0;">
         <a href="${productUrl}" style="background-color: #3CB371; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
           Claim My Discount & Checkout
         </a>
       </div>`;

  try {
    const data = await resend.emails.send({
      from: `Ahmad Blogs <${fromEmail}>`,
      to: [toEmail],
      cc: ['saahmed311@gmail.com'],
      subject,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://www.ahmadblogs.com/apple-touch-icon.png" alt="Ahmad Blogs" style="height: 60px; width: auto; border-radius: 12px;" />
          </div>

          <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px; text-align: center;">
            ${heading}
          </h2>
          
          ${bodyContent}

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">If you have any questions, need technical support, or just want to say hi, feel free to reply directly to this email or reach out on WhatsApp.</p>
            
            <div style="margin-top: 24px; padding-left: 16px; border-left: 4px solid #3CB371;">
              <p style="margin: 0; font-weight: 700; color: #111827;">Ahmad Sana</p>
              <p style="margin: 4px 0; color: #4b5563;"><a href="https://www.ahmadblogs.com" style="color: #3CB371; text-decoration: none; font-weight: 600;">ahmadblogs.com</a></p>
              <p style="margin: 0; color: #4b5563;">+91-720 936 2004 (WhatsApp/Call)</p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a 15-day post-purchase feedback request email
 */
export async function sendFeedbackEmail(
  toEmail: string,
  customerName: string | undefined,
  productName: string = 'Digital Product'
) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    console.warn(`Simulated Feedback Email to ${toEmail} for ${productName}`);
    return { success: true, simulated: true };
  }

  const name = customerName || 'there';
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'ahmad@ahmadblogs.com';
  const reviewUrl = 'https://chromewebstore.google.com/detail/google-chrome-profile-loc/bmbbfecnhkbkealeikkbejhjcnfmdjcn/reviews';

  try {
    const data = await resend.emails.send({
      from: `Ahmad Blogs <${fromEmail}>`,
      to: [toEmail],
      cc: ['saahmed311@gmail.com'],
      subject: `How is your experience with ${productName}? 🌟`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://www.ahmadblogs.com/apple-touch-icon.png" alt="Ahmad Blogs" style="height: 60px; width: auto; border-radius: 12px;" />
          </div>

          <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px; text-align: center;">
            Hi ${name}, how is ${productName} working for you?
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            It's been 15 days since you unlocked <strong>${productName}</strong>. We want to ensure you're getting the best performance and value from it!
          </p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 700; margin-bottom: 12px;">Got a minute to share your thoughts?</p>
            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">Your feedback helps us continuously refine and improve our products for everyone.</p>
            <a href="${reviewUrl}" target="_blank" style="background-color: #3CB371; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 15px;">
              Leave a Quick Review
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">If you ever encounter any issues or need custom setup assistance, just reply directly to this email or reach out on WhatsApp.</p>
            
            <div style="margin-top: 24px; padding-left: 16px; border-left: 4px solid #3CB371;">
              <p style="margin: 0; font-weight: 700; color: #111827;">Ahmad Sana</p>
              <p style="margin: 4px 0; color: #4b5563;"><a href="https://www.ahmadblogs.com" style="color: #3CB371; text-decoration: none; font-weight: 600;">ahmadblogs.com</a></p>
              <p style="margin: 0; color: #4b5563;">+91-720 936 2004 (WhatsApp/Call)</p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return { success: false, error };
  }
}

/**
 * Sends pre-expiration subscription renewal reminder email with 10% coupon
 */
export async function sendRenewalReminderEmail(
  toEmail: string,
  customerName: string | undefined,
  productName: string = 'Digital Product',
  planId: string,
  daysLeft: number,
  couponCode: string = 'RENEW10'
) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    console.warn(`Simulated Renewal Email (${daysLeft} days left) to ${toEmail} for ${productName}`);
    return { success: true, simulated: true };
  }

  const name = customerName || 'there';
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'ahmad@ahmadblogs.com';
  const productSlug = 'google-chrome-profile-lock';
  const productUrl = `https://www.ahmadblogs.com/products/${productSlug}?coupon=${couponCode}`;

  let subject = `Renew your ${productName} subscription – 10% OFF inside!`;
  let urgencyText = `Your subscription for <strong>${productName}</strong> will expire in <strong>${daysLeft} days</strong>.`;

  if (daysLeft === 1) {
    subject = `URGENT: Your ${productName} subscription expires tomorrow! (10% OFF)`;
    urgencyText = `Your subscription for <strong>${productName}</strong> expires <strong>tomorrow</strong>! Don't lose access to premium features.`;
  } else if (daysLeft === 3) {
    subject = `3 days left on your ${productName} subscription – Save 10% on Renewal`;
  }

  try {
    const data = await resend.emails.send({
      from: `Ahmad Blogs <${fromEmail}>`,
      to: [toEmail],
      cc: ['saahmed311@gmail.com'],
      subject,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://www.ahmadblogs.com/apple-touch-icon.png" alt="Ahmad Blogs" style="height: 60px; width: auto; border-radius: 12px;" />
          </div>

          <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px; text-align: center;">
            Hi ${name}, keep your access uninterrupted!
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            ${urgencyText} To help you stay uninterrupted across all your systems, here is an exclusive <strong>10% OFF coupon code</strong> for your renewal:
          </p>

          <div style="background-color: #f3f4f6; border: 2px dashed #3CB371; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">10% Renewal Coupon Code</p>
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 900; color: #111827; letter-spacing: 2px;">
              ${couponCode}
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${productUrl}" style="background-color: #3CB371; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 16px;">
              Renew Now & Claim 10% OFF
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">If you have any questions or need billing assistance, reply directly to this email or reach out on WhatsApp.</p>
            
            <div style="margin-top: 24px; padding-left: 16px; border-left: 4px solid #3CB371;">
              <p style="margin: 0; font-weight: 700; color: #111827;">Ahmad Sana</p>
              <p style="margin: 4px 0; color: #4b5563;"><a href="https://www.ahmadblogs.com" style="color: #3CB371; text-decoration: none; font-weight: 600;">ahmadblogs.com</a></p>
              <p style="margin: 0; color: #4b5563;">+91-720 936 2004 (WhatsApp/Call)</p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending renewal email:', error);
    return { success: false, error };
  }
}

