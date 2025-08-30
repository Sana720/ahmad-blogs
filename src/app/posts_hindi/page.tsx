import { getHindiPosts, HindiPost } from "@/utils/getHindiPosts";
import Link from "next/link";

export default async function HindiPostsPage() {
  const posts: HindiPost[] = await getHindiPosts();
  return (
    <main>
      <h1>हिंदी पोस्ट्स</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/posts_hindi/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
