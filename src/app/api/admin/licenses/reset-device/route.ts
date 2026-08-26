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

    // Reset the activation count and flag
    await licenseRef.update({
      activated: false,
      activationCount: 0,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Device limit reset successfully.' });
  } catch (error: any) {
    console.error('Error resetting device limit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
