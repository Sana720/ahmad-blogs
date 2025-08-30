import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `Category: ${category} | Ahmed Blogs`,
    description: `Browse all posts in the ${category} category on Ahmed Blogs. Discover articles, guides, and news about ${category}.`,
    openGraph: {
      title: `Category: ${category} | Ahmed Blogs`,
      description: `Browse all posts in the ${category} category on Ahmed Blogs. Discover articles, guides, and news about ${category}.`,
      url: `https://ahmadblogs.com/category/${encodeURIComponent(category)}`,
      type: "website",
      images: [
        {
          url: "/favicon.svg",
          width: 512,
          height: 512,
          alt: "Ahmed Blogs Logo",
        },
      ],
      siteName: "Ahmed Blogs",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Category: ${category} | Ahmed Blogs`,
      description: `Browse all posts in the ${category} category on Ahmed Blogs. Discover articles, guides, and news about ${category}.`,
      images: ["/favicon.svg"],
      creator: "@ahmadblogs"
    },
    alternates: {
      canonical: `https://ahmadblogs.com/category/${encodeURIComponent(category)}`
    }
  };
}
import { db } from '../../../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Header from '../../../components/Header';
import CategoryMenu from '../../../components/CategoryMenu';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const q = query(collection(db, 'posts'), where('category', 'array-contains', params.category));
  const snap = await getDocs(q);
  const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="bg-white min-h-screen flex flex-col">
  <Header categoryMenu={<CategoryMenu />} />
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-extrabold mb-8 text-[#232946] capitalize">Category: {params.category}</h1>
        {posts.length === 0 ? (
          <div className="text-[#888] text-lg">No posts found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <div key={post.slug} className="rounded-xl overflow-hidden shadow bg-white">
                {post.image && (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={post.image || '/placeholder.png'}
                      alt={post.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                )}
                <div className="p-4">
                  <Link href={`/posts/${post.slug}`} className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</Link>
                  <p className="text-[#444] text-sm font-normal line-clamp-2">{typeof post.content === 'string' ? post.content.slice(0, 120) + (post.content.length > 120 ? '...' : '') : post.excerpt || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
