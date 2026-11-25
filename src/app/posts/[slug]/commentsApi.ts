import { db } from "../../../utils/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, DocumentData } from "firebase/firestore";
import { getDocs as getDocsAuthors } from "firebase/firestore";

export interface AddCommentArgs {
  postId: string;
  author: string;
  email: string;
  content: string;
  parentId?: string | null;
}

export async function addComment({ postId, author, email, content, parentId }: AddCommentArgs): Promise<void> {
  await addDoc(collection(db, "comments"), {
    postId,
    author,
    email,
    content,
    parentId: parentId || null,
    created: serverTimestamp(),
  });
}

export async function getComments(postId: string): Promise<DocumentData[]> {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("created", "asc")
  );
  const snap = await getDocs(q);
  // Fetch all authors for avatar lookup
  const authorsSnap = await getDocsAuthors(collection(db, "authors"));
  const authors = authorsSnap.docs.map(d => d.data());
  return snap.docs.map(doc => {
    const data = doc.data();
    const author = authors.find((a: any) => a.name === data.author);
    return {
      id: doc.id,
      ...data,
      avatar: author?.avatar || undefined,
    };
  });
}
