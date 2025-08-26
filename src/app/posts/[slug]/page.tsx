
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { notFound } from 'next/navigation';
import { db } from "../../../utils/firebase";
import { collection, query, where, getDocs, limit, doc, updateDoc, increment } from "firebase/firestore";

interface PostPageProps {
  params: { slug: string };
}




export default async function PostPage({ params }: PostPageProps) {
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
        {/* Tags and Social Icons */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 mb-16 gap-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="bg-[#f7f8fa] text-[#232946] px-4 py-2 rounded-lg text-base font-medium">#{tag}</span>
            ))}
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            {/* Social icons */}
            <a href="#" className="text-[#232946] hover:text-[#3CB371]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="#3CB371"/></svg>
            </a>
            <a href="#" className="text-[#232946] hover:text-[#3CB371]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="#3CB371"/></svg>
            </a>
            <a href="#" className="text-[#232946] hover:text-[#3CB371]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="5" stroke="#3CB371" strokeWidth="2"/><circle cx="17" cy="7" r="1.5" fill="#3CB371"/></svg>
            </a>
            <a href="#" className="text-[#232946] hover:text-[#3CB371]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#3CB371"/><polygon points="13,12 11,13 11,11" fill="#fff"/></svg>
            </a>
            <a href="#" className="text-[#232946] hover:text-[#3CB371]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="7" fill="#3CB371"/><rect x="11" y="13" width="2" height="4" fill="#3CB371"/><circle cx="8" cy="8" r="1" fill="#3CB371"/></svg>
            </a>
          </div>
        </div>
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

