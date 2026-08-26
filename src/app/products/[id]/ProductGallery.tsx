"use client";
import React from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  youtubeUrls?: string[];
  title: string;
}

export default function ProductGallery({ images, youtubeUrls = [], title }: ProductGalleryProps) {
  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const mediaItems = [
    ...youtubeUrls.map((url) => ({ type: "youtube" as const, url, id: getYoutubeId(url) })),
    ...images.map((url) => ({ type: "image" as const, url })),
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [images, youtubeUrls]);

  const activeMedia = mediaItems[activeIndex] || mediaItems[0];

  if (mediaItems.length === 0) return null;

  if (mediaItems.length === 1) {
    return (
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
        {activeMedia.type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${activeMedia.id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={activeMedia.url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Large Image / Video */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
        {activeMedia.type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${activeMedia.id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={activeMedia.url}
            alt={title}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex flex-wrap gap-3 mt-2">
        {mediaItems.map((media, idx) => {
          const isActive = idx === activeIndex;
          
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-gray-100 flex items-center justify-center ${
                isActive ? "border-[#3CB371] scale-105 shadow-sm" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {media.type === "youtube" ? (
                <>
                  <Image
                    src={`https://img.youtube.com/vi/${media.id}/mqdefault.jpg`}
                    alt={`${title} Video Thumbnail`}
                    fill
                    className="object-cover opacity-70"
                    sizes="80px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={media.url}
                  alt={`${title} Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
