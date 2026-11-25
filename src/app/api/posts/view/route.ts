import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, slug, collection = 'posts' } = body || {};

    if (!postId && !slug) {
      return NextResponse.json({ error: 'Missing postId or slug' }, { status: 400 });
    }

    const colName = collection === 'posts_hindi' ? 'posts_hindi' : 'posts';

    if (!admin.apps.length) {
      return NextResponse.json({ error: 'Admin SDK not initialized' }, { status: 500 });
    }

    const db = admin.firestore();

    if (postId) {
      const docRef = db.collection(colName).doc(postId);
      await docRef.set(
        { views: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );
      return NextResponse.json({ ok: true, id: postId });
    }

    if (slug) {
      const snap = await db.collection(colName).where('slug', '==', slug).limit(1).get();
      if (!snap.empty) {
        const docRef = snap.docs[0].ref;
        await docRef.set(
          { views: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );
        return NextResponse.json({ ok: true, id: docRef.id });
      }
    }

    return NextResponse.json({ ok: false, error: 'Document not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error incrementing post view:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

