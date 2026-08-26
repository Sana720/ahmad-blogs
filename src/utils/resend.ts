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
  const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'support@yourdomain.com';

  try {
    const data = await resend.emails.send({
      from: `Ahmed Blogs <${fromEmail}>`,
      to: [toEmail],
      subject: `Your ${productName} License Key (${planName})`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://ahmadblogs.com/apple-touch-icon.png" alt="Ahmad Blogs" style="height: 60px; width: auto; border-radius: 12px;" />
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

          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            <strong>How to activate:</strong> Simply copy the license key above and paste it into the product's settings to unlock your premium features.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <div style="color: #374151; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">If you have any questions, need technical support, or just want to say hi, feel free to reply directly to this email or reach out on WhatsApp.</p>
            
            <div style="margin-top: 24px; padding-left: 16px; border-left: 4px solid #3CB371;">
              <p style="margin: 0; font-weight: 700; color: #111827;">Ahmad Sana</p>
              <p style="margin: 4px 0; color: #4b5563;"><a href="https://ahmadblogs.com" style="color: #3CB371; text-decoration: none; font-weight: 600;">ahmadblogs.com</a></p>
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
