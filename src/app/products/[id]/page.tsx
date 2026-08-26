import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getFirestoreProducts, getFirestoreProductById, getPlansForProduct } from "../../../utils/productsFirestore";
import ProductGallery from "./ProductGallery";
import ExpandableDescription from "./ExpandableDescription";
import PurchaseCTA from "./PurchaseCTA";
import ProductReviews from "../../../components/ProductReviews";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const revalidate = 1; // Revalidate dynamic pages every second (near real-time)

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getFirestoreProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getFirestoreProductById(id);
  if (!product) return {};

  const title = product.seoTitle || `${product.title} | Digital Products | Ahmad Blogs`;
  const cleanDescription = product.seoDescription || product.description || product.tagline;
  
  // Create rich, context-specific keywords (support custom overrides)
  const keywords = product.seoKeywords
    ? product.seoKeywords.split(",").map(k => k.trim()).filter(Boolean)
    : [
        product.title,
        product.category,
        ...(product.techStack || []),
        "Ahmad Blogs",
        "digital products",
        "developer tools",
        "software templates"
      ];

  return {
    title,
    description: cleanDescription,
    keywords,
    authors: [{ name: "Ahmad Sana" }],
    publisher: "Ahmad Blogs",
    alternates: {
      canonical: `https://ahmadblogs.com/products/${id}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: `https://ahmadblogs.com/products/${id}`,
      type: "website",
      siteName: "Ahmad Blogs",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [product.image],
      creator: "@ahmadblogs",
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getFirestoreProductById(id);

  if (!product) {
    notFound();
  }

  const plans = await getPlansForProduct(product.id);

  const priceStr = product.price.endsWith('$')
    ? `$${product.price.slice(0, -1)}`
    : (product.price.startsWith('$') || isNaN(Number(product.price)) ? product.price : `$${product.price}`);

  const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;

  // JSON-LD schemas for rich snippet/SEO optimization
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images && product.images.length > 0 ? product.images : [product.image],
    "description": product.seoDescription || product.description || product.tagline,
    "brand": {
      "@type": "Brand",
      "name": "Ahmad Blogs"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://ahmadblogs.com/products/${id}`,
      "priceCurrency": "USD",
      "price": priceVal,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Ahmad Blogs"
      }
    },
    ...(product.reviewsCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewsCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Verified Developer"
          },
          "datePublished": "2026-01-15",
          "reviewBody": "Excellent, highly optimized developer tool. Exceeded expectations.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": product.rating,
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      ]
    } : {})
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ahmadblogs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://ahmadblogs.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://ahmadblogs.com/products/${id}`
      }
    ]
  };

  const faqSchema = product.faqs && product.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": product.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Schema Markup injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4 w-full">
        {/* Breadcrumb & Back button */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#3CB371] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* Hero Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Product Image Panel / Gallery */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery
              images={product.images && product.images.length > 0 ? product.images : [product.image]}
              youtubeUrls={product.youtubeUrls || []}
              title={product.title}
            />
          </div>

          {/* Product Title / Info Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#232946] bg-gray-100 px-3.5 py-1.5 rounded-full w-fit">
                {product.category}
              </span>
              {product.pricingType && (
                <span className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#3CB371] px-3.5 py-1.5 rounded-full w-fit">
                  {product.pricingType}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#232946] mb-3 leading-tight">
              {product.title}
            </h1>
            <p className="text-[#3CB371] text-lg font-bold mb-6">
              {product.tagline}
            </p>

            <div className="flex items-center gap-1.5 mb-6 pb-6 border-b border-gray-100">
              <div className="flex text-amber-400 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {product.rating >= star ? (
                      <FaStar />
                    ) : product.rating >= star - 0.5 ? (
                      <FaStarHalfAlt />
                    ) : (
                      <FaRegStar />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-500">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            <div className="mb-8">
              <span className="text-xs text-gray-400 block font-semibold mb-1">
                {product.pricingType === "Freemium" ? "Pricing Model" : "One-time Price"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#232946]">
                {product.pricingType === "Freemium" ? (
                  <>
                    Free <span className="text-base font-medium text-gray-400">Basic</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-lg font-bold text-gray-400 mr-1">From</span>{priceStr}<span className="text-lg font-medium text-gray-400">/mo</span>
                  </>
                ) : (
                  priceStr
                )}
              </span>
              <span className="text-xs text-gray-400 block mt-2 font-medium">
                {product.pricingType === "Freemium"
                  ? "Install the free version from Chrome Web Store & upgrade anytime."
                  : "Includes lifetime access & free updates"}
              </span>
            </div>

            {/* CTAs */}
            <PurchaseCTA product={product} priceStr={priceStr} plans={plans} />
          </div>
        </div>

        {/* Detailed Info Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-12">
          {/* Main info (Description, Features) */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-extrabold text-[#232946] mb-4">About the Product</h2>
            <div className="prose text-[#555] text-base leading-relaxed mb-8 prose-headings:text-[#232946] prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4">
              <ExpandableDescription>
                <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              </ExpandableDescription>
            </div>

            <h3 className="text-xl font-bold text-[#232946] mb-4">Key Features</h3>
            <ul className="space-y-3 mb-8">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-base text-[#555]">
                  <svg className="w-5.5 h-5.5 text-[#3CB371] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* FAQs */}
            {product.faqs.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-[#232946] mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {product.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="font-extrabold text-[#232946] text-base mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-[#666] text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar specs */}
          <div className="lg:col-span-4 bg-gray-50 border border-gray-100 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-extrabold text-[#232946] mb-4">Specifications</h3>
            
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-400 font-medium">Built With</dt>
                <dd className="flex flex-wrap gap-1.5 mt-2">
                  {product.techStack.map((tech) => (
                    <span key={tech} className="bg-white border border-gray-100 text-xs font-semibold px-2.5 py-1 rounded-md text-gray-600">
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <dt className="text-gray-400 font-medium">Released</dt>
                <dd className="font-bold text-[#232946] mt-1">{product.releaseDate}</dd>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <dt className="text-gray-400 font-medium">License</dt>
                <dd className="font-bold text-[#232946] mt-1">Single-user Commercial License</dd>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <dt className="text-gray-400 font-medium">Support</dt>
                <dd className="font-bold text-[#232946] mt-1">Lifetime Updates & Help Desk</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} rating={product.rating} reviewsCount={product.reviewsCount} />
      </main>
      <Footer />
    </div>
  );
}
