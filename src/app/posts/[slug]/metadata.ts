
import { Metadata } from "next";
import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { publisher } from "../../../utils/publisherSchema";

type Post = {
  slug: string;
  title: string;
  author?: string;
  content?: string;
  image?: string;
  excerpt?: string;
  date?: string;
  created?: string;
  category?: string | string[];
  tags?: string[];
};

interface GenerateMetadataProps {
  params: { slug: string };
}

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
  if (!post) {
    return {
      title: "Ahmad Blogs",
      description: "Ahmad Blogs – Latest posts, news, and updates.",
      openGraph: {
        title: "Ahmad Blogs",
        description: "Ahmad Blogs – Latest posts, news, and updates.",
        url: "https://ahmadblogs.com/",
        images: ["/default-og.png"],
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: "Ahmad Blogs",
        description: "Ahmad Blogs – Latest posts, news, and updates.",
        images: ["/default-og.png"]
      }
    };
  }
  const description = post.excerpt || post.content?.slice(0, 160) || post.title;
  const image = post.image || "/default-og.png";
  const canonicalUrl = `https://ahmadblogs.com/posts/${post.slug}`;
  return {
    title: `${post.title} | Ahmad Blogs`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        hi: `https://ahmadblogs.com/posts_hindi/${post.slug}`
      }
    },
    openGraph: {
      title: `${post.title} | Ahmad Blogs`,
      description,
      url: canonicalUrl,
      images: [image],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ahmad Blogs`,
      description,
      images: [image]
    },
    robots: {
      index: true,
      follow: true
    },
    other: {
      "article:published_time": String(post.date || post.created || ''),
      "article:author": post.author || "Ahmad Blogs"
    }
  };
}
