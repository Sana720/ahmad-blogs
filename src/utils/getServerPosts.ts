import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { getAuthorAvatarByName } from "./getAuthorAvatar";

type Post = {
  slug: string;
  title: string;
  author?: string;
  created?: string;
  categories?: string[];
  content?: string;
  image?: string;
  featured?: boolean;
  date?: string;
  category?: string;
  excerpt?: string;
  authorAvatar?: string;
};

export async function getServerPosts(page = 1, perPage = 5): Promise<{ posts: Post[]; totalPages: number }> {
  // Always fetch all posts, sort by doc ID descending (newest first)
  type PostWithId = Post & { _docId: string };
  const querySnapshot = await getDocs(collection(db, "posts"));
  let postsData: PostWithId[] = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Post, 'slug'> & { slug?: string };
    return {
      ...data,
      slug: data.slug || doc.id,
      _docId: doc.id,
    };
  });
  // Sort by doc ID descending (Firestore auto-IDs are roughly chronological)
  postsData.sort((a, b) => b._docId.localeCompare(a._docId));
  // Filter out Hindi posts (category 'हिंदी' or 'Hindi')
  postsData = postsData.filter(post => {
    const cats = Array.isArray(post.category) ? post.category : [post.category];
    return !cats.some(cat => cat === 'हिंदी' || cat === 'Hindi');
  });
  // Pagination
  const totalPages = Math.ceil(postsData.length / perPage);
  const paginated = postsData.slice((page - 1) * perPage, page * perPage);
  // Fetch author avatars for all posts
  const postsWithAvatars = await Promise.all(
    paginated.map(async (post) => {
      const avatar = post.author ? await getAuthorAvatarByName(post.author) : undefined;
      // Remove _docId from returned object
      const { _docId, ...rest } = post;
      return { ...rest, authorAvatar: avatar };
    })
  );
  return { posts: postsWithAvatars, totalPages };
}
