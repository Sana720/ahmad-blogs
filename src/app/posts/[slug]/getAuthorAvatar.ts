import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAuthorAvatarByName(name: string): Promise<string | undefined> {
  const snap = await getDocs(collection(db, "authors"));
  const authors = snap.docs.map(d => d.data());
  console.log('All authors:', authors);
  // Try exact match first
  let author = authors.find(a => a.name === name);
  // If not found, try case-insensitive and partial match
  if (!author) {
    author = authors.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
  }
  console.log('Looking for author:', name, 'Found:', author);
  return author?.avatar;
}
