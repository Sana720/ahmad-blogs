"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Product } from "../../utils/productsData";
import { getFirestoreProducts } from "../../utils/productsFirestore";

export default function ProductsClient() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Extension", "Template", "SaaS"];

  useEffect(() => {
    getFirestoreProducts().then((data) => {
      setProductsList(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = selectedCategory === "All"
    ? productsList
    : productsList.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3CB371] bg-[#eaf0f6] px-3 py-1 rounded-full">
            Digital Store
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#232946] mt-4 mb-6 leading-tight">
            Premium Digital Products
          </h1>
          <p className="text-[#555] text-lg font-normal">
            Handcrafted Chrome extensions, Next.js templates, and productivity tools to supercharge your workflow and business.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#3CB371] text-white shadow-md shadow-[#3cb371]/20 scale-105"
                  : "bg-gray-50 text-[#555] hover:bg-gray-100"
              }`}
            >
              {category === "All" ? "All Products" : category}s
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3CB371]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {product.pricingType && (
                  <span className="absolute top-4 left-4 bg-[#3CB371] text-white text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
                    {product.pricingType}
                  </span>
                )}
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-[#232946] px-3 py-1 rounded-full shadow-sm z-10">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  {/* Rating Stars */}
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
                  <span className="text-xs font-semibold text-gray-500 ml-1">
                    {product.rating} ({product.reviewsCount})
                  </span>
                </div>

                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="text-xl font-extrabold text-[#232946] mb-2 hover:text-[#3CB371] transition-colors leading-snug">
                    {product.title}
                  </h3>
                </Link>

                <p className="text-[#666] text-sm mb-6 line-clamp-2">
                  {product.description}
                </p>

                {/* Card Footer */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Price</span>
                    <span className="text-xl font-black text-[#232946]">
                      {product.price.endsWith('$') ? `$${product.price.slice(0, -1)}` : (product.price.startsWith('$') || isNaN(Number(product.price)) ? product.price : `$${product.price}`)}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#3CB371] hover:bg-[#2e945b] text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-[#3cb371]/10"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
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
