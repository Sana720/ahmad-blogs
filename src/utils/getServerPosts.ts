import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "./firebase";
import { getAuthorsMap } from "./getAuthorAvatar";

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
  // Parallel Fetching: Start all requests immediately
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(perPage * page + 5));
  const guestQuery = query(collection(db, "guest_posts"), where("status", "==", "approved"), orderBy("submittedAt", "desc"), limit(perPage * page + 5));

  const [postsSnapshot, guestSnapshot, authorsMap] = await Promise.all([
    getDocs(postsQuery),
    getDocs(guestQuery),
    getAuthorsMap()
  ]);

  const postsData: (Post & { createdAt?: string })[] = postsSnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Post, 'slug'> & { slug?: string, createdAt?: string };
    return {
      ...data,
      slug: data.slug || doc.id,
      createdAt: data.createdAt,
      isGuest: false,
    };
  });

  const guestPosts: (Post & { createdAt?: string; isGuest: boolean; imageUrl?: string })[] = guestSnapshot.docs
    .map((doc) => {
      const data = doc.data() as any;
      return {
        slug: doc.id,
        title: data.title,
        author: data.author,
        created: data.submittedAt,
        category: data.category,
        content: data.content,
        image: data.imageUrl || undefined,
        isGuest: true,
        status: data.status,
      };
    });

  // Merge and sort all posts
  let allPosts = [...postsData, ...guestPosts];
  allPosts.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created ? new Date(a.created).getTime() : 0);
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created ? new Date(b.created).getTime() : 0);
    return bTime - aTime;
  });

  // Filter out Hindi posts
  allPosts = allPosts.filter(post => {
    const cats = Array.isArray(post.category) ? post.category : [post.category];
    return !cats.some(cat => cat === 'हिंदी' || cat === 'Hindi');
  });

  // Pagination
  const totalPages = Math.ceil(allPosts.length / perPage);
  const paginated = allPosts.slice((page - 1) * perPage, page * perPage);

  // Assign avatars from the map
  const postsWithAvatars = paginated.map((post) => {
    let avatar = undefined;
    if (post.author) {
      // Try exact match first, then partial match if needed (though map is exact/lowercase)
      avatar = authorsMap[post.author.toLowerCase()];
      if (!avatar) {
        // Fallback: Check if any author in map contains this name (legacy behavior approximation)
        const foundKey = Object.keys(authorsMap).find(k => k.includes(post.author!.toLowerCase()));
        if (foundKey) avatar = authorsMap[foundKey];
      }
    }
    const { createdAt, ...rest } = post;
    return { ...rest, authorAvatar: avatar };
  });

  return { posts: postsWithAvatars, totalPages };
}
