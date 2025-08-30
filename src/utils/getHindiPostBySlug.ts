import { db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { HindiPost } from "./getHindiPosts";

function normalizeSlug(s: string) {
  return s.toString().normalize('NFC').trim();
}

export async function getHindiPostBySlug(slug: string): Promise<HindiPost | null> {
  const normalizedSlug = normalizeSlug(slug);
  // Log for debugging
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Looking for slug:', normalizedSlug);
  }
  const q = query(collection(db, "posts_hindi"), where("slug", "==", normalizedSlug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('No post found for slug:', normalizedSlug);
    }
    return null;
  }
  // Also log the found slug for comparison
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Found post slug:', snapshot.docs[0].data().slug);
  }
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as HindiPost;
}
