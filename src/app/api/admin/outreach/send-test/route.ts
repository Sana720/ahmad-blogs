import { NextResponse } from 'next/server';
import { sendOutreachEmail, replaceTemplateVariables } from '../../../../../utils/outreachEmailService';
import { getSettings } from '../../../../../utils/outreachFirestore';
import admin from '../../../../../utils/firebaseAdmin';

export async function POST(req: Request) {
  try {
    // Basic Admin Authorization check using Firebase Admin
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
    const { email, templateId, templateSubject, templateHtml } = body;

    if (!email || !templateHtml || !templateSubject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch settings for sender info
    const settings = await getSettings();
    const senderName = settings?.senderName || 'Ahmad Blogs';
    const senderEmail = settings?.senderEmail || process.env.NEXT_PUBLIC_FROM_EMAIL || 'support@ahmadblogs.com';
    const businessName = settings?.businessName || 'Ahmad Blogs';
    const businessAddress = settings?.businessAddress || 'Online';
    const replyTo = settings?.replyToEmail;

    // Simulate lead for preview variables
    const simulatedLead = {
      firstName: 'Test',
      lastName: 'User',
      companyName: 'Test Company',
      email: email,
    };

    const unsubscribeUrl = `https://www.ahmadblogs.com/unsubscribe?token=TEST_TOKEN`;
    const productUrl = settings?.defaultProductUrl || 'https://www.ahmadblogs.com/products/google-chrome-profile-lock';

    const mergedSubject = replaceTemplateVariables(templateSubject, simulatedLead);
    const mergedHtml = replaceTemplateVariables(templateHtml, simulatedLead, {
      unsubscribeUrl,
      productUrl,
      discountCode: settings?.defaultDiscountCode || '',
    });

    // Send the test email
    const result = await sendOutreachEmail({
      to: email,
      fromName: senderName,
      fromEmail: senderEmail,
      replyTo: replyTo,
      subject: `[TEST] ${mergedSubject}`,
      htmlBody: mergedHtml,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, providerMessageId: result.providerMessageId });

  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
