import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAuthorsMap(): Promise<Record<string, string>> {
  const authorsSnap = await getDocs(collection(db, "authors"));
  const authorMap: Record<string, string> = {};

  authorsSnap.docs.forEach(doc => {
    const data = doc.data();
    if (data.name && data.avatar) {
      authorMap[data.name.toLowerCase()] = data.avatar;
    }
  });

  return authorMap;
}
