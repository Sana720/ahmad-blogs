import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { doc, writeBatch, collection } from 'firebase/firestore';
import { Plan } from '@/types/license';

export async function GET(req: Request) {
  try {
    const plansRef = collection(db, 'plans');

    const initialPlans: Omit<Plan, 'id'>[] = [
      {
        productId: 'default',
        name: 'Monthly',
        slug: 'monthly',
        price: 1.99,
        currency: 'USD',
        durationDays: 30,
        lifetime: false,
        active: true,
        maxDevices: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        productId: 'default',
        name: 'Yearly',
        slug: 'yearly',
        price: 4.99,
        currency: 'USD',
        durationDays: 365,
        lifetime: false,
        active: true,
        maxDevices: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        productId: 'default',
        name: 'Lifetime',
        slug: 'lifetime',
        price: 9.99,
        currency: 'USD',
        durationDays: null,
        lifetime: true,
        active: true,
        maxDevices: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const batch = writeBatch(db);

    for (const plan of initialPlans) {
      // Use slug as the document ID for easier querying later
      const docRef = doc(plansRef, plan.slug);
      batch.set(docRef, plan, { merge: true }); // merge to avoid overwriting if already exists
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Plans seeded successfully.' });
  } catch (error: any) {
    console.error('Error seeding plans:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
