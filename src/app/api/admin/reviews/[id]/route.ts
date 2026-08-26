import { NextRequest, NextResponse } from "next/server";
import admin from "../../../../../utils/firebaseAdmin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    await db.collection("reviews").doc(id).update({
      status,
    });

    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    await db.collection("reviews").doc(id).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
