import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getFirestoreProducts, getFirestoreProductById } from "../../../utils/productsFirestore";
import ProductGallery from "./ProductGallery";
import MarkdownRenderer from "../../posts/[slug]/MarkdownRenderer";
import ExpandableDescription from "./ExpandableDescription";

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

  return {
    title: `${product.title} | Digital Products`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getFirestoreProductById(id);

  if (!product) {
    notFound();
  }

  const priceStr = product.price.endsWith('$')
    ? `$${product.price.slice(0, -1)}`
    : (product.price.startsWith('$') || isNaN(Number(product.price)) ? product.price : `$${product.price}`);

  return (
    <div className="bg-white min-h-screen flex flex-col">
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
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    className={`w-4 h-4 ${idx < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
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
                    {priceStr} <span className="text-base font-medium text-gray-400">Premium Upgrade</span>
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
            <div className="flex flex-col sm:flex-row gap-3">
              {product.downloadUrl && (
                <a
                  href={product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3.5 bg-[#3CB371] hover:bg-[#2e945b] text-white text-base font-extrabold rounded-xl transition-all shadow-md shadow-[#3cb371]/20 cursor-pointer"
                >
                  {product.pricingType === "Freemium" ? "Install Free Extension" : "Download Now"}
                </a>
              )}
              {product.purchaseUrl && (
                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 text-center py-3.5 text-base font-extrabold rounded-xl transition-all cursor-pointer ${
                    product.pricingType === "Freemium"
                      ? "bg-white hover:bg-gray-50 text-[#3CB371] border-2 border-[#3CB371]"
                      : "bg-[#3CB371] hover:bg-[#2e945b] text-white shadow-md shadow-[#3cb371]/20"
                  }`}
                >
                  {product.pricingType === "Freemium" ? `Get Premium (${priceStr})` : "Buy Now"}
                </a>
              )}
              {product.demoUrl && (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3.5 bg-gray-50 hover:bg-gray-100 text-[#232946] text-base font-extrabold rounded-xl border border-gray-200 transition-all cursor-pointer"
                >
                  Live Demo
                </a>
              )}
            </div>
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
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400 block font-medium">Built With</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.techStack.map((tech) => (
                    <span key={tech} className="bg-white border border-gray-100 text-xs font-semibold px-2.5 py-1 rounded-md text-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <span className="text-gray-400 block font-medium">Released</span>
                <span className="font-bold text-[#232946] block mt-1">{product.releaseDate}</span>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <span className="text-gray-400 block font-medium">License</span>
                <span className="font-bold text-[#232946] block mt-1">Single-user Commercial License</span>
              </div>

              <div className="pt-4 border-t border-gray-200/60">
                <span className="text-gray-400 block font-medium">Support</span>
                <span className="font-bold text-[#232946] block mt-1">Lifetime Updates & Help Desk</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
