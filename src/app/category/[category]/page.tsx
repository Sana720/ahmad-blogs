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
