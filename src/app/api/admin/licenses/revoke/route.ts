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

    await licenseRef.update({
      status: 'REVOKED',
      revokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'License revoked successfully.' });
  } catch (error: any) {
    console.error('Error revoking license:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
