"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "");

  if (images.length <= 1) {
    return (
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
        <Image
          src={images[0] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 600px"
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Large Image */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 600px"
          priority
        />
      </div>

      {/* Thumbnails Row */}
      <div className="flex flex-wrap gap-3 mt-2">
        {images.map((img, idx) => {
          const isActive = img === activeImage;
          return (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                isActive ? "border-[#3CB371] scale-105 shadow-sm" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`${title} Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
