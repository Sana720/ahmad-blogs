
import { getServerPosts } from "../utils/getServerPosts";
import Header from "../components/Header";
import CategoryMenu from "../components/CategoryMenu";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import Loader from "../components/Loader";
import { Suspense } from "react";

interface HomeProps {
  searchParams?: { page?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const POSTS_PER_PAGE = 2; // 1 featured + 2 grid = 3 total per page
  const page = Number(searchParams?.page) || 1;
  // Always fetch all posts to determine featured and grid
  const { posts: allPosts, totalPages } = await getServerPosts(1, 1000); // get all posts
  // Find the featured post (if any), otherwise use the newest
  const featured = allPosts.length > 0 ? (allPosts.find((p: any) => p.featured) || allPosts[0]) : undefined;
  // Remove featured from the list
  const postsWithoutFeatured = featured ? allPosts.filter((p: any) => p.slug !== featured.slug) : allPosts;
  // Paginate grid posts (excluding featured)
  const gridStart = (page - 1) * POSTS_PER_PAGE;
  const gridPosts = postsWithoutFeatured.slice(gridStart, gridStart + POSTS_PER_PAGE);
  // Calculate total pages for grid (excluding featured)
  const gridTotalPages = Math.ceil(postsWithoutFeatured.length / POSTS_PER_PAGE);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header categoryMenu={<CategoryMenu />} />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <div className="max-w-4xl mx-auto px-4">
            {featured && (
              <section className="mt-12">
                <div className="rounded-xl overflow-hidden shadow bg-white">
                  {featured.image && (
                    <div className="relative w-full max-w-full overflow-hidden bg-[#f4f4f4]" style={{ aspectRatio: '16/7' }}>
                      <Image
                        src={featured.image || "/placeholder.png"}
                        alt={featured.title}
                        fill
                        className="object-cover rounded-md w-full h-full max-w-full"
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 900px"
                        priority={true}
                        quality={70}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[#232946] text-base mb-4 font-medium mt-2">
                      <span className="inline-flex items-center gap-1">
                        {featured.authorAvatar ? (
                          <Image
                            src={featured.authorAvatar}
                            alt={featured.author || "Author"}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👨‍🎨</span>
                        )}
                        <span>{featured.author}</span>
                      </span>
                      <span>{featured.date}</span>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(Array.isArray(featured.category) ? featured.category : [featured.category])
                          .filter((cat: unknown): cat is string => typeof cat === 'string' && !!cat)
                          .map((cat: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-[#eaf0f6] text-[#3CB371] text-[10px] sm:text-xs md:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>
                    </div>
                    <Link
                      href={`/posts/${featured.slug}`}
                      className="block mt-3 text-lg sm:text-xl md:text-2xl font-extrabold leading-snug hover:text-[#3CB371] text-[#222] break-words"
                    >
                      {featured.title}
                    </Link>
                    <p className="text-[#444] text-base font-normal">
                      {featured.excerpt
                        ? featured.excerpt
                        : typeof featured.content === "string"
                          ? featured.content.slice(0, 120) + (featured.content.length > 120 ? "..." : "")
                          : ""}
                    </p>
                  </div>
                </div>
              </section>
            )}
            {gridPosts.length > 0 && (
              <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridPosts.map((post: any, idx: number) => (
                  <div key={post.slug || idx} className="rounded-xl overflow-hidden shadow bg-white">
                    {post.image && (
                        <div className="relative w-full max-w-full overflow-hidden bg-[#f4f4f4]" style={{ aspectRatio: '16/7' }}>
                          <Image
                            src={post.image || "/placeholder.png"}
                            alt={post.title}
                            fill
                            className="object-cover rounded-md w-full h-full max-w-full"
                            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 600px"
                            loading="lazy"
                            quality={60}
                          />
                        </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-3 text-[#232946] text-base mb-2 font-medium mt-2">
                        <span className="inline-flex items-center gap-1">
                          {post.authorAvatar ? (
                            <Image
                              src={post.authorAvatar}
                              alt={post.author || "Author"}
                              width={28}
                              height={28}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">👨‍🎨</span>
                          )}
                          <span>{post.author || "Unknown"}</span>
                        </span>
                        <span>{post.created ? new Date(post.created).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(post.category) ? post.category : [post.category])
                            .filter((cat: unknown): cat is string => typeof cat === 'string' && !!cat)
                            .map((cat: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-[#eaf0f6] text-[#3CB371] text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {cat}
                              </span>
                            ))}
                        </div>
                      </div>
                      <Link 
                        href={`/posts/${post.slug}`} 
                        className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]"
                      >
                        {post.title}
                      </Link>
                      <p className="text-[#444] text-sm font-normal line-clamp-2">{typeof post.content === "string" ? post.content.slice(0, 120) + (post.content.length > 120 ? "..." : "") : post.excerpt || ""}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
            <div className="flex justify-center items-center gap-2 mt-12">
              {Array.from({ length: gridTotalPages }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;
                return (
                  <Link
                    key={pageNum}
                    href={`/?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg border font-semibold transition-colors duration-150 ${isActive ? 'bg-[#3CB371] text-white border-[#3CB371]' : 'bg-white text-[#232946] border-gray-200 hover:bg-[#eaf0f6]'}`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


