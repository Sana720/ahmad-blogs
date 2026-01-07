import React from "react";

export default function HomeSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
            {/* Featured Section Skeleton */}
            <section className="mt-12">
                <div className="rounded-xl overflow-hidden shadow bg-white border border-gray-100">
                    {/* Image Placeholder */}
                    <div className="w-full bg-gray-200" style={{ aspectRatio: '16/7' }}></div>
                    <div className="p-6">
                        {/* Meta Row */}
                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <div className="flex items-center gap-1">
                                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-20 h-4 bg-gray-200 rounded"></div>
                            <div className="flex gap-2">
                                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                        {/* Title */}
                        <div className="w-3/4 h-8 bg-gray-200 rounded mb-3"></div>
                        {/* Excerpt */}
                        <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </section>

            {/* Grid Section Skeleton */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl overflow-hidden shadow bg-white border border-gray-100">
                        {/* Image Placeholder */}
                        <div className="w-full bg-gray-200" style={{ aspectRatio: '16/7' }}></div>
                        <div className="p-4">
                            {/* Meta Row */}
                            <div className="flex items-center gap-3 mb-2 mt-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            </div>
                            {/* Title */}
                            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                            {/* Excerpt */}
                            <div className="w-full h-3 bg-gray-200 rounded mb-1"></div>
                            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-12 mb-12">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
