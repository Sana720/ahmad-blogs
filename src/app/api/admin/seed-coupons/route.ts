import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = admin.firestore();
    const couponRef = db.collection('coupons');

    const defaultCoupons = [
      { code: 'RENEW10', discountPercentage: 10, description: '10% OFF renewal coupon' },
      { code: 'COMEBACK10', discountPercentage: 10, description: '10% OFF abandoned cart comeback coupon' },
      { code: 'EXISTINGUSER', discountPercentage: 10, description: '10% OFF existing user coupon' },
      { code: 'EXISTING10', discountPercentage: 10, description: '10% OFF existing user special coupon' },
    ];
    
    let createdCount = 0;
    let updatedCount = 0;

    for (const c of defaultCoupons) {
      const snap = await couponRef.where('code', '==', c.code).limit(1).get();
      if (snap.empty) {
        await couponRef.add({
          code: c.code,
          discountPercentage: c.discountPercentage,
          isActive: true,
          createdAt: new Date().toISOString(),
          description: c.description
        });
        createdCount++;
      } else {
        const doc = snap.docs[0];
        await doc.ref.update({ isActive: true, discountPercentage: c.discountPercentage, updatedAt: new Date().toISOString() });
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Coupons processed: ${createdCount} created, ${updatedCount} verified active.`,
      codes: defaultCoupons.map(c => c.code) 
    });

  } catch (error: any) {
    console.error('Error seeding coupons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
