import { NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { addSuppression } from '../../../../utils/outreachFirestore';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    // 1. Verify Webhook Signature (skipping actual crypto check for this plan, but in prod you must check svix signature)
    // const svix_id = req.headers.get("svix-id");
    // const svix_timestamp = req.headers.get("svix-timestamp");
    // const svix_signature = req.headers.get("svix-signature");
    
    let event;
    try {
      event = JSON.parse(bodyText);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!event || !event.type || !event.data) {
       return NextResponse.json({ success: true }); // Acknowledge invalid shapes to avoid retries
    }

    const { type, data } = event;
    const providerMessageId = data.email_id;
    const toEmail = (data.to?.[0] || '').toLowerCase();

    if (!providerMessageId) return NextResponse.json({ success: true });

    // Look up existing email log by providerMessageId
    const logsRef = collection(db, 'outreach_email_logs');
    const q = query(logsRef, where('providerMessageId', '==', providerMessageId));
    const snapshot = await getDocs(q);

    let logDocRef = null;
    let leadId = null;
    let campaignId = null;

    if (!snapshot.empty) {
      logDocRef = snapshot.docs[0].ref;
      const logData = snapshot.docs[0].data();
      leadId = logData.leadId;
      campaignId = logData.campaignId;
    }

    // Map Resend events to our statuses
    // 'email.sent', 'email.delivered', 'email.bounced', 'email.complained', 'email.clicked', 'email.opened'
    
    let newStatus = '';
    const now = Timestamp.now();
    const updatePayload: any = { eventType: type, updatedAt: now };

    switch (type) {
      case 'email.sent':
        newStatus = 'Sent';
        updatePayload.sentAt = now;
        break;
      case 'email.delivered':
        newStatus = 'Delivered';
        updatePayload.deliveredAt = now;
        break;
      case 'email.bounced':
        newStatus = 'Bounced';
        updatePayload.bouncedAt = now;
        if (toEmail) await addSuppression(toEmail, 'Permanent Bounce', 'Resend Webhook');
        break;
      case 'email.complained':
        newStatus = 'Complained';
        updatePayload.failedAt = now;
        if (toEmail) await addSuppression(toEmail, 'Complaint', 'Resend Webhook');
        break;
      case 'email.clicked':
        newStatus = 'Clicked';
        updatePayload.clickedAt = now;
        break;
    }

    if (newStatus && logDocRef) {
       updatePayload.status = newStatus;
       await updateDoc(logDocRef, updatePayload);
    }

    // If it bounced or complained, update the lead status as well
    if (leadId && (newStatus === 'Bounced' || newStatus === 'Complained')) {
       await updateDoc(doc(db, 'outreach_leads', leadId), {
         status: newStatus === 'Bounced' ? 'Invalid' : 'Do Not Contact',
         updatedAt: now
       });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    // Still return 200 so Resend doesn't endlessly retry if it's our logic error, 
    // unless it's a transient DB error.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
