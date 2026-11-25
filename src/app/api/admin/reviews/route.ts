import { NextRequest, NextResponse } from "next/server";
import admin from "../../../../utils/firebaseAdmin";
import { Review } from "../../../../types/review";

export async function GET(req: NextRequest) {
  try {
    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    const snapshot = await db
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .get();

    const reviews: Review[] = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching all reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
