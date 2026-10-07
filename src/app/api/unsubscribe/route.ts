import { NextResponse } from 'next/server';
import { addSuppression } from '../../../utils/outreachFirestore';
import { getDocs, query, collection, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import crypto from 'crypto';

// In a real application, you should use a secure secret to verify signed tokens.
// For demonstration, we'll verify the signature if possible, or trust the token payload.
// Let's assume the token is base64 encoded JSON of { email: "example@example.com", sig: "..." }
// Or, if using an existing auth library, verify it there.

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // A placeholder for token decoding. You must implement actual secure token validation.
    // For this implementation plan, we assume the token is the raw email or a simple base64 payload.
    // WARNING: In production, verify HMAC signature to prevent malicious unsubscribes.
    let email = '';
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(decoded);
      email = payload.email;
    } catch (e) {
      // If it fails to parse as JSON, assume it's a test token or raw email for local testing
      email = token.includes('@') ? token : ''; 
    }

    if (!email) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    email = email.toLowerCase();

    // 1. Add to global suppression list
    await addSuppression(email, 'Unsubscribed', 'Unsubscribe Page');

    // 2. Mark any existing lead as unsubscribed
    const leadsRef = collection(db, 'outreach_leads');
    const q = query(leadsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const leadDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'outreach_leads', leadDoc.id), {
        unsubscribeStatus: true,
        status: 'Unsubscribed',
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully.' });
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
