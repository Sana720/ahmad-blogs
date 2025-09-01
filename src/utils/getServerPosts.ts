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
  // Always fetch all posts, sort by createdAt descending (newest first)
  const querySnapshot = await getDocs(collection(db, "posts"));
  let postsData: (Post & { createdAt?: string })[] = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Post, 'slug'> & { slug?: string, createdAt?: string };
    return {
      ...data,
      slug: data.slug || doc.id,
      createdAt: data.createdAt,
    };
  });
  // Sort by createdAt descending (newest first)
  postsData.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
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
      const { createdAt, ...rest } = post;
      return { ...rest, authorAvatar: avatar };
    })
  );
  return { posts: postsWithAvatars, totalPages };
}
