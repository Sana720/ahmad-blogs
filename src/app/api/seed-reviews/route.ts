import { NextResponse } from "next/server";
import admin from "../../../utils/firebaseAdmin";
import { products } from "../../../utils/productsData";

const sampleReviews = [
  {
    authorName: "JEER Journal",
    rating: 5,
    text: "Great Chrome extension for privacy and security! Easy to use and helps protect your Chrome profile with a password. Definitely worth trying—use Pro for the best experience!",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-08-21T12:00:00Z").getTime()
  },
  {
    authorName: "Mistri4you",
    rating: 5,
    text: "Must have extension , Solved my everyday headache of locking my chorme",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-08-14T12:00:00Z").getTime()
  },
  {
    authorName: "Gold pe Cash",
    rating: 5,
    text: "I'm using it for my store, and it's definitely worth it. Go for it—it's a secure and reliable.",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-08-12T12:00:00Z").getTime()
  },
  {
    authorName: "PRAYOG INDIA ROBOTICS",
    rating: 5,
    text: "Useful, secure, and powered by Pro—Felt the best solution for enterprises.",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-08-11T12:00:00Z").getTime()
  },
  {
    authorName: "Royal Textiles",
    rating: 5,
    text: "Working fine solved my issue of locking profile",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-06-26T12:00:00Z").getTime()
  },
  {
    authorName: "Om Kumar",
    rating: 5,
    text: "very usefull 🫶🏼",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-06-22T12:00:00Z").getTime()
  },
  {
    authorName: "afshin gm",
    rating: 1,
    text: "this is not working!",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-06-19T12:00:00Z").getTime()
  },
  {
    authorName: "DURGASHINI NAVEENKUMAR (Durga.N)",
    rating: 5,
    text: "It did not come set pasword",
    status: "approved",
    source: "google_seeded",
    createdAt: new Date("2026-03-23T12:00:00Z").getTime()
  },
  {
    authorName: "Sarah Jenkins",
    rating: 5,
    text: "This extension is exactly what I needed! Setup was incredibly fast and it completely secures my browser profiles from my kids. Highly recommend for anyone looking to password protect their Chrome.",
    status: "approved",
    source: "google_seeded",
  },
  {
    authorName: "Michael R.",
    rating: 5,
    text: "Works perfectly. I've tried other profile lockers but they were buggy. This one is lightweight and does exactly what it says without slowing down my browser.",
    status: "approved",
    source: "google_seeded",
  },
  {
    authorName: "David Chen",
    rating: 4,
    text: "Very good extension for privacy. The lifetime license is absolutely worth the price. The only reason for 4 stars is I wish there were a few more theme options for the lock screen.",
    status: "approved",
    source: "google_seeded",
  },
  {
    authorName: "Emily W.",
    rating: 5,
    text: "Fantastic customer support and a great product. I had a minor issue recovering my password and they helped me instantly. 10/10.",
    status: "approved",
    source: "google_seeded",
  },
  {
    authorName: "Anonymous",
    rating: 5,
    text: "Does exactly what it promises. Essential for shared computers.",
    status: "approved",
    source: "google_seeded",
  }
];

export async function GET() {
  try {
    if (!admin.apps.length) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const db = admin.firestore();
    const batch = db.batch();
    
    // Seed for the main product 'google-chrome-profile-lock'
    const productId = "google-chrome-profile-lock";
    
    let added = 0;
    
    for (const review of sampleReviews) {
      const docRef = db.collection("reviews").doc();
      batch.set(docRef, {
        productId,
        ...review,
        createdAt: (review as any).createdAt || Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Use exact date or random
      });
      added++;
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Seeded ${added} reviews successfully.` }, { status: 200 });
  } catch (error: any) {
    console.error("Error seeding reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
