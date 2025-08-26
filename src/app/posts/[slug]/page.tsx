
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { notFound } from 'next/navigation';
import { db } from "../../../utils/firebase";
import { collection, query, where, getDocs, limit, doc, updateDoc, increment } from "firebase/firestore";


import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Fetch post title for metadata
  const { db } = await import("../../../utils/firebase");
  const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
  const q = query(collection(db, "posts"), where("slug", "==", params.slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return { title: "Post Not Found | Ahmed Blogs" };
  const post = querySnapshot.docs[0].data();
  return {
    title: `${post.title} | Ahmed Blogs`,
    description: post.excerpt || post.content?.slice(0, 120) || "Read this post on Ahmed Blogs."
  };
}

export default async function PostPage({ params }: any) {
  const q = query(collection(db, "posts"), where("slug", "==", params.slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return notFound();
  const postDoc = querySnapshot.docs[0];
  const post = postDoc.data();

  // Increment the views field for analytics
  try {
    const postRef = doc(db, "posts", postDoc.id);
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (e) {
    // Ignore errors for analytics
  }

  const allPostsSnap = await getDocs(collection(db, "posts"));
  const similarPosts = allPostsSnap.docs
    .filter((doc) => doc.id !== postDoc.id)
    .slice(0, 3)
    .map((doc) => doc.data());

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 bg-white flex-1">
        {/* Title */}
        <div className="flex flex-col items-center mt-2 mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#232946] text-center mb-2">{post.title}</h1>
          {/* Meta row under title */}
          <div className="flex items-center gap-3 text-[#232946] text-base font-medium mb-4">
            <span className="inline-flex items-center gap-1">
              <img src={post.authorAvatar || '/public/file.svg'} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
              <span>{post.author}</span>
            </span>
            <span>{post.date}</span>
            <span> ▣ {post.category}</span>
          </div>
        </div>
        {/* Image */}
        <div className="flex justify-center mb-8">
          <img src={post.image} alt={post.title} className="rounded-xl w-full max-w-3xl object-cover" style={{height: 320, background: '#eaf0f6', objectFit: 'cover'}} />
        </div>
        {/* Content */}
        <div className="max-w-3xl mx-auto text-lg text-[#232946] space-y-6">
          {Array.isArray(post.content) ? (
            <>
              <p>{post.content[0]}</p>
              <p>{post.content[1]}</p>
              <h2 className="text-2xl font-bold mt-8 mb-2">Creative Design</h2>
              <p>{post.content[2]}</p>
              {/* Blockquote styled section */}
              <blockquote className="border-l-4 border-[#3CB371] bg-[#f7f8fa] p-4 my-4 text-[#232946] italic">
                <span className="text-[#3CB371] text-xl font-bold">“</span>
                <span className="align-middle">{post.content[3]}</span>
                <span className="text-[#3CB371] text-xl font-bold">”</span>
              </blockquote>
              <p>{post.content[4]}</p>
            </>
          ) : (
            post.content && <p>{post.content}</p>
          )}
        </div>
        {/* Tags */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 mb-6 gap-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="bg-[#f7f8fa] text-[#232946] px-4 py-2 rounded-lg text-base font-medium">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Social Share Icons */}
        {typeof window !== 'undefined' && (
          <div className="max-w-3xl mx-auto flex gap-4 mb-16">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="hover:text-[#3CB371]"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="#3CB371"/></svg>
            </a>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="hover:text-[#3CB371]"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#3CB371"/></svg>
            </a>
            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="hover:text-[#3CB371]"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="#3CB371"/></svg>
            </a>
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="hover:text-[#3CB371]"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="7" fill="#3CB371"/><rect x="11" y="13" width="2" height="4" fill="#3CB371"/><circle cx="8" cy="8" r="1" fill="#3CB371"/></svg>
            </a>
          </div>
        )}
        {/* Similar Posts */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-extrabold text-center mb-10 text-[#232946]">Similar Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarPosts.map((sp: any, idx: number) => (
              <div key={sp.slug || idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                {sp.image && (
                  <img src={sp.image} alt={sp.title} className="rounded-lg w-full h-40 object-cover mb-4" style={{background: '#eaf0f6', objectFit: 'cover'}} />
                )}
                <div className="flex items-center gap-2 text-[#232946] text-sm mb-1">
                  <span>{sp.date}</span>
                  <span>• {sp.category}</span>
                </div>
                <a href={`/posts/${sp.slug}`} className="block text-lg font-bold text-center hover:text-[#3CB371] text-[#232946]">{sp.title}</a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

