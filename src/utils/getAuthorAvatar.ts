import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAuthorAvatarByName(authorName: string) {
  if (!authorName) return undefined;
  const authorsSnap = await getDocs(collection(db, "authors"));
  const authors = authorsSnap.docs.map(doc => doc.data());
  // Partial and case-insensitive match
  const found = authors.find(a => a.name && a.name.toLowerCase().includes(authorName.toLowerCase()));
  return found?.avatar || undefined;
}
