import { NextResponse } from 'next/server';
import admin from '../../../../../utils/firebaseAdmin';
import { db } from '../../../../../utils/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { sendOutreachEmail, replaceTemplateVariables } from '../../../../../utils/outreachEmailService';
import { getSettings, isSuppressed, Lead } from '../../../../../utils/outreachFirestore';

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
    const { campaignId, action } = body; // action can be 'start', 'pause', 'cancel', 'process_batch'

    if (!campaignId || !action) {
      return NextResponse.json({ error: 'Missing campaignId or action' }, { status: 400 });
    }

    const campaignRef = doc(db, 'outreach_campaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = campaignSnap.data();

    // --- PAUSE / CANCEL ACTIONS ---
    if (action === 'pause') {
       await updateDoc(campaignRef, { status: 'Paused', updatedAt: Timestamp.now() });
       return NextResponse.json({ success: true, status: 'Paused' });
    }

    if (action === 'cancel') {
       await updateDoc(campaignRef, { status: 'Cancelled', updatedAt: Timestamp.now() });
       return NextResponse.json({ success: true, status: 'Cancelled' });
    }

    // --- START / PROCESS ACTION ---
    if (action === 'start') {
       if (campaign.status === 'Sending') {
         return NextResponse.json({ error: 'Campaign is already sending' }, { status: 400 });
       }
       await updateDoc(campaignRef, { status: 'Sending', startedAt: campaign.startedAt || Timestamp.now(), updatedAt: Timestamp.now() });
       
       // Trigger the first batch asynchronously (fire and forget for Vercel functions, though Vercel might kill it)
       // In a real Vercel environment, this should ideally use a queue like Inngest, Upstash QStash, or Vercel Cron.
       // For this implementation, we will process a small batch directly in the response, 
       // and the client will need to poll `action: 'process_batch'` until complete.
    }

    if (action === 'start' || action === 'process_batch') {
      // Re-fetch to ensure we have latest status
      const currentCampSnap = await getDoc(campaignRef);
      const currentCamp = currentCampSnap.data()!;
      if (currentCamp.status !== 'Sending') {
         return NextResponse.json({ success: true, status: currentCamp.status, message: 'Campaign is not in Sending state.' });
      }

      const settings = await getSettings();
      const batchLimit = settings?.defaultEmailsPerMinute || 5;

      const listId = currentCamp.listId;
      const templateId = currentCamp.templateId;

      const templateSnap = await getDoc(doc(db, 'outreach_templates', templateId));
      if (!templateSnap.exists()) return NextResponse.json({ error: 'Template missing' }, { status: 400 });
      const template = templateSnap.data();

      // Find leads for this list
      const leadsRef = collection(db, 'outreach_leads');
      // In Firestore, array-contains is used for listIds
      const leadsQuery = query(leadsRef, where('listIds', 'array-contains', listId));
      const leadsSnap = await getDocs(leadsQuery);
      
      const allLeads = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));

      // Find who we already sent to in this campaign
      const logsQuery = query(collection(db, 'outreach_email_logs'), where('campaignId', '==', campaignId));
      const logsSnap = await getDocs(logsQuery);
      const sentLeadIds = new Set(logsSnap.docs.map(d => d.data().leadId));

      // Filter leads
      const pendingLeads = allLeads.filter(lead => 
        !sentLeadIds.has(lead.id) && 
        lead.status !== 'Unsubscribed' && 
        lead.status !== 'Invalid' &&
        lead.status !== 'Do Not Contact' &&
        !lead.unsubscribeStatus
      );

      if (pendingLeads.length === 0) {
        await updateDoc(campaignRef, { status: 'Completed', completedAt: Timestamp.now(), updatedAt: Timestamp.now() });
        return NextResponse.json({ success: true, status: 'Completed', sent: 0, pending: 0 });
      }

      // Take a batch
      const batch = pendingLeads.slice(0, batchLimit);
      let sentCount = 0;

      const senderName = settings?.senderName || 'Ahmad Blogs';
      const senderEmail = settings?.senderEmail || process.env.NEXT_PUBLIC_FROM_EMAIL || 'support@ahmadblogs.com';
      const unsubscribeUrlBase = `https://www.ahmadblogs.com/unsubscribe`;
      const productUrl = settings?.defaultProductUrl || 'https://www.ahmadblogs.com/products/google-chrome-profile-lock';

      for (const lead of batch) {
         // Re-check suppression right before sending
         const suppressed = await isSuppressed(lead.email);
         if (suppressed) {
            // Log as suppressed and skip
            await addDoc(collection(db, 'outreach_email_logs'), {
              campaignId, leadId: lead.id, recipientEmail: lead.email,
              subject: template.subject, status: 'Failed', errorMessage: 'Suppressed',
              eventType: 'system.suppressed', createdAt: Timestamp.now()
            });
            continue;
         }

         // Token logic should be secure. This is a simplified token for demonstration.
         const tokenPayload = Buffer.from(JSON.stringify({ email: lead.email, leadId: lead.id })).toString('base64');
         const unsubscribeUrl = `${unsubscribeUrlBase}?token=${tokenPayload}`;

         const mergedSubject = replaceTemplateVariables(template.subject, lead);
         const mergedHtml = replaceTemplateVariables(template.htmlBody, lead, {
           unsubscribeUrl,
           productUrl,
           discountCode: settings?.defaultDiscountCode || '',
         });

         const result = await sendOutreachEmail({
            to: lead.email,
            fromName: senderName,
            fromEmail: senderEmail,
            replyTo: settings?.replyToEmail,
            subject: mergedSubject,
            htmlBody: mergedHtml,
            campaignId,
            leadId: lead.id
         });

         await addDoc(collection(db, 'outreach_email_logs'), {
            campaignId,
            leadId: lead.id,
            recipientEmail: lead.email,
            subject: mergedSubject,
            status: result.success ? 'Sent' : 'Failed',
            providerMessageId: result.providerMessageId || null,
            errorMessage: result.error || null,
            eventType: result.success ? 'system.sent' : 'system.error',
            createdAt: Timestamp.now(),
            sentAt: result.success ? Timestamp.now() : null,
         });

         if (result.success) {
            sentCount++;
            // Update lead status
            await updateDoc(doc(db, 'outreach_leads', lead.id!), {
               status: 'Contacted',
               lastContactedAt: Timestamp.now(),
               updatedAt: Timestamp.now()
            });
         }
      }

      const remaining = pendingLeads.length - batch.length;
      if (remaining <= 0) {
        await updateDoc(campaignRef, { status: 'Completed', completedAt: Timestamp.now(), updatedAt: Timestamp.now() });
      }

      return NextResponse.json({ 
         success: true, 
         status: remaining <= 0 ? 'Completed' : 'Sending',
         sentInBatch: sentCount,
         pendingRemaining: Math.max(0, remaining)
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Process campaign error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
