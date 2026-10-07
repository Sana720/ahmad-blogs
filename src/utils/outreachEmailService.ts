import { resend } from './resend';
import { Lead } from './outreachFirestore';

export interface SendOutreachEmailOptions {
  to: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  campaignId?: string;
  leadId?: string;
}

/**
 * Replaces variables like {{firstName}} in a template string.
 */
export const replaceTemplateVariables = (template: string, lead: Partial<Lead>, customVars?: Record<string, string>) => {
  let result = template;
  
  const vars: Record<string, string> = {
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    fullName: lead.fullName || (lead.firstName && lead.lastName ? `${lead.firstName} ${lead.lastName}` : ''),
    companyName: lead.companyName || '',
    jobTitle: lead.jobTitle || '',
    website: lead.website || '',
    industry: lead.industry || '',
    ...customVars,
  };

  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
};

/**
 * Appends a safe unsubscribe footer to HTML emails.
 */
const appendFooter = (html: string, unsubscribeUrl: string, businessName: string, businessAddress: string) => {
  const footer = `
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 20px 0;" />
    <div style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5; font-family: sans-serif;">
      <p style="margin: 0 0 8px 0;">This email was sent by ${businessName}</p>
      <p style="margin: 0 0 16px 0;">${businessAddress}</p>
      <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from these communications.</p>
    </div>
  `;

  // If the html contains a closing body tag, inject right before it. Otherwise just append.
  if (html.includes('</body>')) {
    return html.replace('</body>', `${footer}</body>`);
  }
  return html + footer;
};

/**
 * Sends an outreach email using the existing Resend integration.
 */
export async function sendOutreachEmail(options: SendOutreachEmailOptions) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Simulated sending Outreach Email.');
    return { success: true, simulated: true, providerMessageId: 'simulated_' + Date.now() };
  }

  try {
    const fromAddress = `${options.fromName} <${options.fromEmail}>`;
    
    const tags = [];
    if (options.campaignId) tags.push({ name: 'campaign_id', value: options.campaignId });
    if (options.leadId) tags.push({ name: 'lead_id', value: options.leadId });
    tags.push({ name: 'source', value: 'outreach' });

    const payload: any = {
      from: fromAddress,
      to: [options.to],
      subject: options.subject,
      html: options.htmlBody,
      tags,
    };

    if (options.replyTo) {
      payload.reply_to = options.replyTo;
    }

    if (options.textBody) {
      payload.text = options.textBody;
    }

    const data = await resend.emails.send(payload);

    return { success: true, data, providerMessageId: data.data?.id };
  } catch (error: any) {
    console.error('Error sending outreach email:', error);
    return { success: false, error: error.message };
  }
}
