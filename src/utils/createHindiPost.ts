import { db } from "@/utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface HindiPostInput {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  categoryId: string;
  coverImage?: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: Timestamp;
}

export async function createHindiPost({
  title,
  slug,
  content,
  authorId,
  categoryId,
  coverImage,
  summary,
  tags = [],
  published = true,
  publishedAt = Timestamp.now(),
}: HindiPostInput): Promise<string> {
  const docRef = await addDoc(collection(db, "posts_hindi"), {
    title,
    slug,
    content,
    authorId,
    categoryId,
    coverImage,
    summary,
    tags,
    published,
    publishedAt,
    views: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lang: "hi",
  });
  return docRef.id;
}
