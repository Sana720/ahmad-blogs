import type { NextApiRequest, NextApiResponse } from 'next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import admin from '../../utils/firebaseAdmin';

async function sendWelcomeEmail(email: string) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }], subject: 'Welcome to the newsletter' }],
      from: { email: 'no-reply@yourdomain.com', name: 'Ahmed Blogs' },
      content: [{ type: 'text/html', value: `<div style="font-family: system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial;line-height:1.4;color:#111"><h2>Welcome to Ahmed Blogs</h2><p>Thanks for subscribing — we’ll send future posts directly to your inbox.</p><p>— Ahmed</p></div>` }],
    }),
  });
  return res.ok;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    // Prefer server-side admin SDK write when available (bypasses rules)
    if (admin && admin.apps && admin.apps.length) {
      const adb = admin.firestore();
      await adb.collection('newsletter').add({ email, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    } else {
      // fallback to client SDK write (keeps original behavior)
      await addDoc(collection(db, 'newsletter'), { email, createdAt: serverTimestamp() });
    }

    // Send welcome email (best effort)
    try { await sendWelcomeEmail(email); } catch (e) { console.error('sendWelcomeEmail failed', e); }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save' });
  }
}
