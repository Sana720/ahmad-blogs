import { NextResponse } from 'next/server';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreProducts } from '../../utils/productsFirestore';

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
    `${baseUrl}/products`,
  ];

  try {
    // Fetch all English post slugs
    const postsSnap = await getDocs(collection(db, 'posts'));
    const postUrls = postsSnap.docs.map(doc => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      return `${baseUrl}/posts/${slug}`;
    });
    urls = urls.concat(postUrls);
  } catch (err) {
    console.error("Error fetching posts for sitemap:", err);
  }

  try {
    // Fetch all Hindi post slugs
    const hindiSnap = await getDocs(collection(db, 'posts_hindi'));
    const hindiUrls = hindiSnap.docs.map(doc => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      return `${baseUrl}/posts_hindi/${slug}`;
    });
    urls = urls.concat(hindiUrls);
  } catch (err) {
    console.error("Error fetching Hindi posts for sitemap:", err);
  }

  try {
    // Fetch all products
    const products = await getFirestoreProducts();
    const productUrls = products.map(p => `${baseUrl}/products/${p.id}`);
    urls = urls.concat(productUrls);
  } catch (err) {
    console.error("Error fetching products for sitemap:", err);
  }

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
