import { NextRequest, NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';
import { sendContactNotificationEmail } from '@/utils/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    // 1. Save to Firestore (Admin SDK)
    let contactDocId = null;
    try {
      if (admin.apps.length) {
        const docRef = await admin.firestore().collection('contacts').add({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          source: 'contact_page',
        });
        contactDocId = docRef.id;
      }
    } catch (dbError) {
      console.error('Failed to save contact to Firestore:', dbError);
      // We do not block email sending if Firestore has a transient glitch
    }

    // 2. Dispatch email to saahmed311@gmail.com via Resend
    const emailResult = await sendContactNotificationEmail({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    if (!emailResult.success) {
      console.error('Failed to send contact notification email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      id: contactDocId,
      emailSent: emailResult.success,
      message: 'Message sent successfully!',
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit message. Please try again.' },
      { status: 500 }
    );
  }
}

