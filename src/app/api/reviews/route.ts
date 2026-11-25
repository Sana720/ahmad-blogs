import { NextRequest, NextResponse } from "next/server";
import admin from "../../../utils/firebaseAdmin";
import { Review } from "../../../types/review";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    const snapshot = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc")
      .get();

    const reviews: Review[] = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, authorName, rating, text } = body;

    if (!productId || !authorName || !rating || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    const newReview: Omit<Review, "id"> = {
      productId,
      authorName,
      rating: Number(rating),
      text,
      createdAt: Date.now(),
      status: "pending",
      source: "user",
    };

    const docRef = await db.collection("reviews").add(newReview);

    return NextResponse.json(
      { success: true, review: { id: docRef.id, ...newReview } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
