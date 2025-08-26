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
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const { title, excerpt, url } = req.body;
  if (!title || !url) { res.status(400).json({ error: 'Missing fields' }); return; }

  if (!admin || !admin.apps || !admin.apps.length) {
    res.status(500).json({ error: 'Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT in env.' });
    return;
  }

  try {
    const db = admin.firestore();
    const snap = await db.collection('newsletter').get();
    const subscribers = snap.docs.map((d) => d.data()).filter(Boolean) as Array<Record<string, unknown>>;
    const html = `<div style="font-family: system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial;line-height:1.4;color:#111"><h2>${title}</h2><p>${excerpt || ''}</p><p><a href="${url}">Read post</a></p></div>`;
    const sendLimit = Number(process.env.NOTIFY_SEND_LIMIT || 200);
    for (const s of subscribers.slice(0, sendLimit)) {
      const to = (s as any).email;
      if (!to) continue;
      // best-effort send
      // eslint-disable-next-line no-await-in-loop
      await sendPostEmail(to, `New post: ${title}`, html);
    }

    res.status(200).json({ ok: true, sent: subscribers.length });
    return;
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    return;
  }
}
