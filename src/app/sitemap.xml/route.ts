import { NextResponse } from 'next/server';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const baseUrl = 'https://ahmadblogs.com';
  let urls = [
    `${baseUrl}/`,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    `${baseUrl}/services`,
    `${baseUrl}/portfolio`,
    `${baseUrl}/privacy-policy`,
    `${baseUrl}/terms`,
  ];

  // Fetch all English post slugs
  const postsSnap = await getDocs(collection(db, 'posts'));
  const postUrls = postsSnap.docs.map(doc => {
    const data = doc.data();
    const slug = data.slug || doc.id;
    return `${baseUrl}/posts/${slug}`;
  });
  urls = urls.concat(postUrls);

  // Fetch all Hindi post slugs
  const hindiSnap = await getDocs(collection(db, 'posts_hindi'));
  const hindiUrls = hindiSnap.docs.map(doc => {
    const data = doc.data();
    const slug = data.slug || doc.id;
    return `${baseUrl}/posts_hindi/${slug}`;
  });
  urls = urls.concat(hindiUrls);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      url => `  <url>\n    <loc>${url}</loc>\n    <priority>${url === baseUrl + '/' ? '1.0' : '0.8'}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
