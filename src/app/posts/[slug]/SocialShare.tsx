"use client";

import React from "react";

export default function SocialShare({ post }: { post: any }) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;
  const shareUrl = window.location.href;
  return (
    <div className="max-w-3xl mx-auto flex gap-4 mb-16">
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="hover:text-[#3CB371]"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="#3CB371"/></svg>
      </a>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="hover:text-[#3CB371]"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#3CB371"/></svg>
      </a>
      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="hover:text-[#3CB371]"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="#3CB371"/></svg>
      </a>
      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="hover:text-[#3CB371]"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="7" fill="#3CB371"/><rect x="11" y="13" width="2" height="4" fill="#3CB371"/><circle cx="8" cy="8" r="1" fill="#3CB371"/></svg>
      </a>
    </div>
  );
}