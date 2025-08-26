import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../utils/firebaseAdmin';

async function sendPostEmail(to: string, subject: string, html: string) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: 'no-reply@yourdomain.com', name: 'Ahmed Blogs' },
      content: [{ type: 'text/html', value: html }],
    }),
  });
  return res.ok;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { title, excerpt, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Missing fields' });

  if (!admin || !admin.apps || !admin.apps.length) {
    return res.status(500).json({ error: 'Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT in env.' });
  }

  try {
    const db = admin.firestore();
  const snap = await db.collection('newsletter').get();
  const subscribers = snap.docs.map((d: any) => d.data()).filter(Boolean) as any[];
    const html = `<div style="font-family: system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial;line-height:1.4;color:#111"><h2>${title}</h2><p>${excerpt || ''}</p><p><a href="${url}">Read post</a></p></div>`;
    // send to all subscribers sequentially (small lists ok on free tier)
  // Safety: avoid sending thousands of emails in a single request on free tier
  const limit = Number(process.env.NOTIFY_SEND_LIMIT || 200);
  for (const s of subscribers.slice(0, limit)) {
      const to = (s as any).email;
      if (!to) continue;
      await sendPostEmail(to, `New post: ${title}`, html);
    }

    return res.status(200).json({ ok: true, sent: subscribers.length });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
