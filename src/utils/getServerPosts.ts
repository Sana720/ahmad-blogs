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
  const querySnapshot = await getDocs(collection(db, "posts"));
  let postsData: Post[] = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Post, 'slug'> & { slug?: string };
    return {
      ...data,
      slug: data.slug || doc.id,
    };
  });
  // Sort by date descending (newest first)
  postsData = postsData.sort((a, b) => new Date(b.date || b.created || 0).getTime() - new Date(a.date || a.created || 0).getTime());
  // Pagination
  const totalPages = Math.ceil(postsData.length / perPage);
  const paginated = postsData.slice((page - 1) * perPage, page * perPage);
  // Fetch author avatars for all posts
  const postsWithAvatars = await Promise.all(
    paginated.map(async (post) => {
      const avatar = post.author ? await getAuthorAvatarByName(post.author) : undefined;
      return { ...post, authorAvatar: avatar };
    })
  );
  return { posts: postsWithAvatars, totalPages };
}
