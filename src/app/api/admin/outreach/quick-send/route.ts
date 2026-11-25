import { NextResponse } from 'next/server';
import admin from '../../../../../utils/firebaseAdmin';
// removed client SDK imports
import { sendOutreachEmail, replaceTemplateVariables } from '../../../../../utils/outreachEmailService';
import { getSettings, isSuppressed } from '../../../../../utils/outreachFirestore';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { leads, subject, htmlBody } = body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No valid leads provided' }, { status: 400 });
    }
    if (!subject || !htmlBody) {
      return NextResponse.json({ error: 'Missing subject or HTML body' }, { status: 400 });
    }

    const settings = await getSettings();
    const senderName = settings?.senderName || 'Ahmad Blogs';
    const senderEmail = settings?.senderEmail || process.env.NEXT_PUBLIC_FROM_EMAIL || 'support@ahmadblogs.com';
    const unsubscribeUrlBase = `https://www.ahmadblogs.com/unsubscribe`;
    const productUrl = settings?.defaultProductUrl || 'https://www.ahmadblogs.com/products/google-chrome-profile-lock';
    
    // Create a "Quick Send" pseudo-campaign for tracking in logs
    const pseudoCampaignRef = await admin.firestore().collection('outreach_campaigns').add({
      name: `Quick Blast - ${new Date().toLocaleDateString()}`,
      subject: subject,
      status: 'Sending',
      source: 'QuickSend',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const campaignId = pseudoCampaignRef.id;

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    // IMPORTANT: Vercel functions time out after 15s (hobby) or 60s (pro).
    // For a simple blast, if there are thousands of leads, this will timeout.
    // For small lists (e.g. 50-100), this works fine.
    
    // Send in batches of 10 to be gentle to Resend
    const chunkSize = 10;
    for (let i = 0; i < leads.length; i += chunkSize) {
      const chunk = leads.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (lead) => {
        // Double check suppression globally
        const suppressed = await isSuppressed(lead.email);
        if (suppressed) {
          skipped++;
          await admin.firestore().collection('outreach_email_logs').add({
            campaignId, 
            leadId: 'quick-send', 
            recipientEmail: lead.email,
            subject: subject, 
            status: 'Failed', 
            errorMessage: 'Suppressed',
            eventType: 'system.suppressed', 
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return;
        }

        const tokenPayload = Buffer.from(JSON.stringify({ email: lead.email })).toString('base64');
        const unsubscribeUrl = `${unsubscribeUrlBase}?token=${tokenPayload}`;

        const mergedSubject = replaceTemplateVariables(subject, lead);
        const mergedHtml = replaceTemplateVariables(htmlBody, lead, {
           unsubscribeUrl,
           productUrl,
        });

        const result = await sendOutreachEmail({
            to: lead.email,
            fromName: senderName,
            fromEmail: senderEmail,
            replyTo: settings?.replyToEmail,
            subject: mergedSubject,
            htmlBody: mergedHtml,
            campaignId,
            leadId: 'quick-send'
        });

        await admin.firestore().collection('outreach_email_logs').add({
            campaignId,
            leadId: 'quick-send',
            recipientEmail: lead.email,
            subject: mergedSubject,
            status: result.success ? 'Sent' : 'Failed',
            providerMessageId: result.providerMessageId || null,
            errorMessage: result.error || null,
            eventType: result.success ? 'system.sent' : 'system.error',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sentAt: result.success ? admin.firestore.FieldValue.serverTimestamp() : null,
        });

        if (result.success) sent++;
        else failed++;
      }));
    }

    // Actually we just update the pseudo campaign document
    await admin.firestore().collection('outreach_campaigns').doc(campaignId).update({
       status: 'Completed',
       completedAt: admin.firestore.FieldValue.serverTimestamp(),
       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
       stats: { sent, failed, skipped }
    });

    return NextResponse.json({
      success: true,
      summary: { sent, failed, skipped }
    });

  } catch (error: any) {
    console.error('Quick send error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
