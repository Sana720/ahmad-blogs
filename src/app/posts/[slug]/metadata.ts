import { Metadata } from "next";
import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

interface GenerateMetadataProps {
  params: { slug: string };
}

type Post = {
  slug: string;
  title: string;
  author?: string;
  content?: string;
  image?: string;
  excerpt?: string;
  summary?: string;
};

async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsSnap = await getDocs(collection(db, "posts"));
  let postDoc = postsSnap.docs.find((doc) => {
    const data = doc.data() as Post;
    return data.slug === slug;
  });
  if (!postDoc) {
    postDoc = postsSnap.docs.find((doc) => doc.id === slug);
  }
  if (!postDoc) return null;
  const post = postDoc.data() as Post;
  post.slug = post.slug || postDoc.id;
  return post;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const description = post.summary || post.excerpt || post.content?.slice(0, 160) || post.title;
  const image = post.image || "/default-og.png";
  return {
    title: `${post.title} | Ahmad Blogs`,
    description,
    openGraph: {
      title: `${post.title} | Ahmad Blogs`,
      description,
      images: [image],
      type: "article",
      url: `/posts/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ahmad Blogs`,
      description,
      images: [image],
    },
  };
}
