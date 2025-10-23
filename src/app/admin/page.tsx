"use client";

import AdminLayout from '../../components/admin/AdminLayout';
import BlogAnalytics from '../../components/admin/BlogAnalytics';
import { dashboardCards } from '../../components/admin/dashboardCards';
import WelcomeCard from '../../components/admin/WelcomeCard';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Image from "next/image";
import { cloudinaryUrl } from '../../utils/cloudinary';

export default function AdminDashboard() {
  type StatKey = 'posts' | 'authors' | 'categories' | 'views';
  const [stats, setStats] = useState<{ posts: number; authors: number; categories: number; views: number }>({ posts: 0, authors: 0, categories: 0, views: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [gaSummary, setGaSummary] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      const postsSnap = await getDocs(collection(db, 'posts'));
      const authorsSnap = await getDocs(collection(db, 'authors'));
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const totalViews = postsSnap.docs.reduce((sum, doc) => sum + (doc.data().views || 0), 0);
      setStats({
        posts: postsSnap.size,
        authors: authorsSnap.size,
        categories: categoriesSnap.size,
        views: totalViews,
      });
      setLoading(false);
    }
    async function fetchRecentBlogs() {
      try {
        const q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(5));
        const snap = await getDocs(q);
        if (snap.empty) {
          // Fallback: fetch without orderBy if no posts or no date field
          const fallbackSnap = await getDocs(collection(db, 'posts'));
          setRecentBlogs(fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setRecentBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (_e) {
          // Fallback: fetch without orderBy if error (e.g., missing date field)
          const fallbackSnap = await getDocs(collection(db, 'posts'));
          setRecentBlogs(fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
    }
    async function fetchTopPosts() {
      const q = query(collection(db, 'posts'), orderBy('views', 'desc'), limit(5));
      const snap = await getDocs(q);
      setTopPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    async function fetchGaSummary() {
      try {
        const res = await fetch('/api/analytics/summary');
        const json = await res.json();
        setGaSummary(json.data);
      } catch (e) {
        setGaSummary(null);
      }
    }
    fetchStats();
    fetchRecentBlogs();
    fetchTopPosts();
    fetchGaSummary();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2 md:px-0">
        <WelcomeCard name="Admin" stats={{ posts: stats.posts, subscribers: 99 }} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map(card => (
            <div key={card.key} className={`rounded-2xl shadow flex flex-col items-center justify-center p-6 ${card.color} border border-[#eaf0f6]`}>
              <div className="mb-2">{card.icon}</div>
              <div className="text-2xl font-bold text-[#232946]">{loading ? '...' : stats[card.key as StatKey]}</div>
              <div className="text-base text-[#3CB371] font-semibold mt-1">{card.title}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Analytics and Visitors Chart */}
          <div className="col-span-2">
            <div className="mb-8">
              <BlogAnalytics />
              {/* Google Analytics Summary */}
              <div className="bg-[#f7f8fa] rounded-xl p-4 mt-6">
                <h3 className="text-lg font-bold text-[#232946] mb-2">Google Analytics (Last 30 Days)</h3>
                {gaSummary ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-[#232946]">Active Users:</div>
                      <div className="text-[#3CB371] text-xl font-bold">{gaSummary.totals?.[0]?.metricValues?.[0]?.value || '-'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#232946]">Sessions:</div>
                      <div className="text-[#3CB371] text-xl font-bold">{gaSummary.totals?.[0]?.metricValues?.[1]?.value || '-'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#232946]">Bounce Rate:</div>
                      <div className="text-[#3CB371] text-xl font-bold">{gaSummary.totals?.[0]?.metricValues?.[2]?.value || '-'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#232946]">Avg. Session Duration:</div>
                      <div className="text-[#3CB371] text-xl font-bold">{gaSummary.totals?.[0]?.metricValues?.[3]?.value || '-'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#232946]">Page Views:</div>
                      <div className="text-[#3CB371] text-xl font-bold">{gaSummary.totals?.[0]?.metricValues?.[4]?.value || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[#888]">Loading Google Analytics data...</div>
                )}
                {/* Top Countries */}
                {gaSummary?.rows && (
                  <div className="mt-6">
                    <div className="font-bold text-[#232946] mb-2">Top Countries</div>
                    <ul className="text-sm">
                      {gaSummary.rows.filter((row: any) => row.dimensionValues?.[0]?.value).slice(0, 5).map((row: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                          <span>{row.dimensionValues?.[0]?.value}</span>
                          <span className="text-[#3CB371]">{row.metricValues?.[0]?.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Top Devices */}
                {gaSummary?.rows && (
                  <div className="mt-6">
                    <div className="font-bold text-[#232946] mb-2">Top Devices</div>
                    <ul className="text-sm">
                      {gaSummary.rows.filter((row: any) => row.dimensionValues?.[1]?.value).slice(0, 5).map((row: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                          <span>{row.dimensionValues?.[1]?.value}</span>
                          <span className="text-[#3CB371]">{row.metricValues?.[0]?.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Top Pages */}
                {gaSummary?.rows && (
                  <div className="mt-6">
                    <div className="font-bold text-[#232946] mb-2">Top Pages</div>
                    <ul className="text-sm">
                      {gaSummary.rows.filter((row: any) => row.dimensionValues?.[2]?.value).slice(0, 5).map((row: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                          <span>{row.dimensionValues?.[2]?.value}</span>
                          <span className="text-[#3CB371]">{row.metricValues?.[0]?.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Top Sources */}
                {gaSummary?.rows && (
                  <div className="mt-6">
                    <div className="font-bold text-[#232946] mb-2">Top Sources</div>
                    <ul className="text-sm">
                      {gaSummary.rows.filter((row: any) => row.dimensionValues?.[3]?.value).slice(0, 5).map((row: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b py-1">
                          <span>{row.dimensionValues?.[3]?.value}</span>
                          <span className="text-[#3CB371]">{row.metricValues?.[0]?.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* Top Posts */}
            <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] mt-8">
              <h3 className="text-lg font-bold text-[#232946] mb-4">Top Posts (by Views)</h3>
              <ul className="space-y-4">
                {topPosts.map(post => (
                  <li key={post.id} className="flex items-center gap-3">
                    <Image
                      src={cloudinaryUrl(post.image || '/file.svg', 96) || '/file.svg'}
                      alt={post.title}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover bg-[#eaf0f6]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[#232946] text-base truncate">{post.title}</div>
                      <div className="text-xs text-[#3CB371] flex gap-2 mt-1">
                        <span>{post.date}</span>
                        <span>• {post.views || 0} views</span>
                      </div>
                    </div>
                    <a href={`/posts/${post.slug}`} className="text-[#3CB371] text-xs font-bold hover:underline">View</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Recent Blogs */}
          <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6]">
            <h3 className="text-lg font-bold text-[#232946] mb-4">Recent Blogs</h3>
            <ul className="space-y-4">
              {recentBlogs.length === 0 && (
                <li className="text-[#888]">No recent blogs found. Make sure your posts have a <b>date</b> field.</li>
              )}
              {recentBlogs.map(blog => (
                <li key={blog.id} className="flex items-start gap-3 py-2">
                  <Image
                    src={cloudinaryUrl(blog.image || '/file.svg', 96) || '/file.svg'}
                    alt={blog.title}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover bg-[#eaf0f6] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="font-semibold text-[#232946] text-base break-words line-clamp-2 max-w-full">{blog.title}</div>
                      <a href={`/posts/${blog.slug}`} className="text-[#3CB371] text-xs font-bold hover:underline sm:ml-4 sm:self-start">View</a>
                    </div>
                    <div className="text-xs text-[#3CB371] flex gap-2 mt-1">
                      <span>{blog.date || <span className='text-[#888]'>No date</span>}</span>
                      <span>• {blog.views || 0} views</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
