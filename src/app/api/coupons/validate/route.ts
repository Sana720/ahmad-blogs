import { NextResponse } from 'next/server';
import admin from '@/utils/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawCode = body.code;
    const planPrice = typeof body.planPrice === 'number' ? body.planPrice : null;

    if (!rawCode || typeof rawCode !== 'string' || !rawCode.trim()) {
      return NextResponse.json(
        { valid: false, error: 'Please enter a coupon code.' },
        { status: 400 }
      );
    }

    const code = rawCode.trim().toUpperCase();
    const db = admin.firestore();

    // Look up coupon by code
    const couponQuery = await db.collection('coupons')
      .where('code', '==', code)
      .limit(1)
      .get();

    if (couponQuery.empty) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code.' },
        { status: 404 }
      );
    }

    const couponDoc = couponQuery.docs[0];
    const couponData = couponDoc.data();

    // 1. Check if active
    if (couponData.isActive === false) {
      return NextResponse.json(
        { valid: false, error: 'This coupon is no longer active.' },
        { status: 400 }
      );
    }

    // 2. Check expiration date (supports string, number, or Firestore Timestamp)
    if (couponData.expiresAt) {
      const expiresDate = typeof couponData.expiresAt?.toDate === 'function'
        ? couponData.expiresAt.toDate()
        : new Date(couponData.expiresAt);

      if (!isNaN(expiresDate.getTime()) && expiresDate < new Date()) {
        return NextResponse.json(
          { valid: false, error: 'This coupon has expired.' },
          { status: 400 }
        );
      }
    }

    // 3. Check usage limit if configured
    if (
      typeof couponData.usageLimit === 'number' &&
      typeof couponData.timesUsed === 'number' &&
      couponData.timesUsed >= couponData.usageLimit
    ) {
      return NextResponse.json(
        { valid: false, error: 'This coupon has reached its maximum usage limit.' },
        { status: 400 }
      );
    }

    const discountPercentage = Number(couponData.discountPercentage) || 0;
    if (discountPercentage <= 0) {
      return NextResponse.json(
        { valid: false, error: 'This coupon offers no discount.' },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    let finalPrice = planPrice;

    if (planPrice !== null && planPrice > 0) {
      discountAmount = parseFloat(((planPrice * discountPercentage) / 100).toFixed(2));
      finalPrice = parseFloat(Math.max(0, planPrice - discountAmount).toFixed(2));
    }

    return NextResponse.json({
      valid: true,
      code,
      discountPercentage,
      description: couponData.description || `${discountPercentage}% OFF`,
      discountAmount,
      finalPrice,
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, error: error.message || 'Failed to validate coupon.' },
      { status: 500 }
    );
  }
}

