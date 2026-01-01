import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
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
  // Fetch normal posts with limit
  // Note: We fetch 'perPage' from *each* collection to ensure we have enough recent content after merging.
  // Ideally, we'd have a single collection or a server-side index, but this is a significant optimization over fetching ALL docs.
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(perPage * page + 5)); // Fetch enough for current page + buffer
  const querySnapshot = await getDocs(postsQuery);

  const postsData: (Post & { createdAt?: string })[] = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Post, 'slug'> & { slug?: string, createdAt?: string };
    return {
      ...data,
      slug: data.slug || doc.id,
      createdAt: data.createdAt,
      isGuest: false,
    };
  });

  // Fetch approved guest posts with limit
  const guestQuery = query(collection(db, "guest_posts"), where("status", "==", "approved"), orderBy("submittedAt", "desc"), limit(perPage * page + 5));
  const guestSnapshot = await getDocs(guestQuery);

  const guestPosts: (Post & { createdAt?: string; isGuest: boolean; imageUrl?: string })[] = guestSnapshot.docs
    .map((doc) => {
      const data = doc.data() as any; // Using 'any' for simplicity, or define a robust GuestPost type
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
  // Filter out Hindi posts (category 'हिंदी' or 'Hindi')
  allPosts = allPosts.filter(post => {
    const cats = Array.isArray(post.category) ? post.category : [post.category];
    return !cats.some(cat => cat === 'हिंदी' || cat === 'Hindi');
  });
  // Pagination
  const totalPages = Math.ceil(allPosts.length / perPage);
  const paginated = allPosts.slice((page - 1) * perPage, page * perPage);
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
