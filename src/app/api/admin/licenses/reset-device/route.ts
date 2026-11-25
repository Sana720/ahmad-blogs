import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { licenseId } = await req.json();

    if (!licenseId) {
      return NextResponse.json({ error: 'Missing licenseId' }, { status: 400 });
    }

    const db = admin.firestore();
    const licenseRef = db.collection('licenses').doc(licenseId);
    
    const docSnap = await licenseRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    // 1. Delete associated activation records in activations collection
    const activationsSnapshot = await db.collection('activations')
      .where('licenseId', '==', licenseId)
      .get();

    const batch = db.batch();
    activationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 2. Reset the activation count and flag on the license
    batch.update(licenseRef, {
      activated: false,
      activationCount: 0,
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Device limit reset successfully.' });
  } catch (error: any) {
    console.error('Error resetting device limit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
