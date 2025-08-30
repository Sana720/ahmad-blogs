import { db } from "@/utils/firebase";
import { collection, getDocs, query, where, orderBy, Query } from "firebase/firestore";

export interface HindiPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  categoryId: string;
  coverImage?: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: any;
  views?: number;
  createdAt?: any;
  updatedAt?: any;
  lang?: string;
}

export async function getHindiPosts(params?: { categoryId?: string }): Promise<HindiPost[]> {
  let q: Query = query(collection(db, "posts_hindi"), orderBy("publishedAt", "desc"));
  if (params?.categoryId) {
    q = query(q, where("categoryId", "==", params.categoryId));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HindiPost));
}
