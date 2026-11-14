"use client";

import AdminLayout from '../../components/admin/AdminLayout';
import RequireAuth from '../../components/admin/RequireAuth';
import BlogAnalytics from '../../components/admin/BlogAnalytics';
import { dashboardCards } from '../../components/admin/dashboardCards';
import WelcomeCard from '../../components/admin/WelcomeCard';
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Image from "next/image";
import { cloudinaryUrl } from '../../utils/cloudinary';

function getPostTime(p: any): number {
  const raw = p.date || p.createdAt || p.created || p.publishedAt || p.updatedAt;
  if (!raw) return 0;
  if (typeof raw === 'string') {
    const t = new Date(raw).getTime();
    return isNaN(t) ? 0 : t;
  }
  if (raw?.toDate && typeof raw.toDate === 'function') {
    return raw.toDate().getTime();
  }
  if (raw?.seconds) {
    return raw.seconds * 1000;
  }
  return 0;
}

function formatPostDate(p: any): string {
  const raw = p.date || p.createdAt || p.created || p.publishedAt || p.updatedAt;
  if (!raw) return 'Recent';
  if (typeof raw === 'string') {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return raw;
  }
  if (raw?.toDate && typeof raw.toDate === 'function') {
    return raw.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (raw?.seconds) {
    return new Date(raw.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return 'Recent';
}

export default function AdminDashboard() {
  type StatKey = 'posts' | 'authors' | 'categories' | 'views';
  const [stats, setStats] = useState<{ posts: number; authors: number; categories: number; views: number }>({
    posts: 0,
    authors: 0,
    categories: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);

  // GA4 states
  const [gaSummary, setGaSummary] = useState<any>(null);
  const [gaSource, setGaSource] = useState<'30days' | 'realtime'>('30days');
  const [gaLoading, setGaLoading] = useState(true);
  const [gaError, setGaError] = useState<{ message: string; help?: string } | null>(null);

  const fetchGaSummary = useCallback(async () => {
    setGaLoading(true);
    setGaError(null);
    try {
      const res = await fetch('/api/analytics/summary');
      const json = await res.json();
      if (json.ok && json.data) {
        setGaSummary(json.data);
        setGaSource(json.source || '30days');
      } else {
        setGaError({
          message: json.error || 'Failed to fetch Google Analytics data',
          help: json.help
        });
      }
    } catch (e: any) {
      setGaError({ message: e.message || 'Could not connect to Analytics API' });
    } finally {
      setGaLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [postsSnap, authorsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, 'posts')),
          getDocs(collection(db, 'authors')),
          getDocs(collection(db, 'categories'))
        ]);

        const allPosts: any[] = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const totalViews = allPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);

        setStats({
          posts: postsSnap.size,
          authors: authorsSnap.size,
          categories: categoriesSnap.size,
          views: totalViews,
        });

        // 1. Recent Blogs sorted by date descending
        const sortedByDate = [...allPosts].sort((a, b) => getPostTime(b) - getPostTime(a));
        setRecentBlogs(sortedByDate.slice(0, 5));

        // 2. Top Posts sorted by views descending
        const sortedByViews = [...allPosts].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
        setTopPosts(sortedByViews.slice(0, 5));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    }

    loadDashboardData();
    fetchGaSummary();
  }, [fetchGaSummary]);

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-2 md:px-0">
          <WelcomeCard name="Admin" stats={{ posts: stats.posts, subscribers: 99 }} />

          {/* Stat Cards */}
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
                <div className="bg-[#f7f8fa] rounded-xl p-5 mt-6 border border-[#eaf0f6]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#232946]">
                        {gaSource === 'realtime' ? 'Google Analytics (Realtime)' : 'Google Analytics (Last 30 Days)'}
                      </h3>
                      {gaSource === 'realtime' && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                          title="Realtime data active. 30-day historical rollup takes 24-48 hours after adding GA4."
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Stream
                        </span>
                      )}
                    </div>
                    <button
                      onClick={fetchGaSummary}
                      disabled={gaLoading}
                      className="text-xs font-semibold text-[#3CB371] hover:text-[#2e8b57] flex items-center gap-1 disabled:opacity-50 transition"
                    >
                      <svg className={`w-3.5 h-3.5 ${gaLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {gaLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  {gaSource === 'realtime' && gaSummary && (
                    <p className="text-xs text-gray-500 mb-3">
                      Showing live reader traffic. Historical 30-day reports will automatically appear once Google finishes its initial 24–48h processing.
                    </p>
                  )}

                  {gaLoading && !gaSummary && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-6 justify-center">
                      <div className="w-4 h-4 border-2 border-[#3CB371] border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to Google Analytics...</span>
                    </div>
                  )}

                  {!gaLoading && gaError && !gaSummary && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      <div className="font-semibold flex items-center gap-1.5 mb-1">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Google Analytics Notice
                      </div>
                      <p className="text-xs text-amber-700 mb-2">{gaError.message}</p>
                      {gaError.help && (
                        <p className="text-xs text-amber-900 bg-amber-100 p-2 rounded">{gaError.help}</p>
                      )}
                    </div>
                  )}

                  {gaSummary && (
                    <>
                      <div className={`grid gap-3 ${gaSource === 'realtime' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
                        <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                          <div className="text-xs text-gray-500 font-medium">Active Users</div>
                          <div className="text-[#3CB371] text-xl font-bold mt-1">
                            {gaSummary.totals?.[0]?.metricValues?.[0]?.value ?? '0'}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                          <div className="text-xs text-gray-500 font-medium">Page Views</div>
                          <div className="text-[#3CB371] text-xl font-bold mt-1">
                            {gaSource === 'realtime'
                              ? (gaSummary.totals?.[0]?.metricValues?.[1]?.value ?? '0')
                              : (gaSummary.totals?.[0]?.metricValues?.[4]?.value ?? '0')}
                          </div>
                        </div>

                        {gaSource === '30days' ? (
                          <>
                            <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                              <div className="text-xs text-gray-500 font-medium">Sessions</div>
                              <div className="text-[#3CB371] text-xl font-bold mt-1">
                                {gaSummary.totals?.[0]?.metricValues?.[1]?.value ?? '0'}
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                              <div className="text-xs text-gray-500 font-medium">Bounce Rate</div>
                              <div className="text-[#3CB371] text-xl font-bold mt-1">
                                {gaSummary.totals?.[0]?.metricValues?.[2]?.value
                                  ? `${(parseFloat(gaSummary.totals[0].metricValues[2].value) * 100).toFixed(1)}%`
                                  : '0%'}
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                              <div className="text-xs text-gray-500 font-medium">Avg Duration</div>
                              <div className="text-[#3CB371] text-xl font-bold mt-1">
                                {gaSummary.totals?.[0]?.metricValues?.[3]?.value
                                  ? `${Math.round(parseFloat(gaSummary.totals[0].metricValues[3].value))}s`
                                  : '0s'}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                              <div className="text-xs text-gray-500 font-medium">Status</div>
                              <div className="text-emerald-600 text-sm font-bold mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Connected
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-[#eaf0f6]">
                              <div className="text-xs text-gray-500 font-medium">Rollup Status</div>
                              <div className="text-gray-600 text-xs font-semibold mt-1.5">
                                Aggregating (24h)
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Dimensions Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Top Countries */}
                        {gaSummary?.rows && gaSummary.rows.some((r: any) => r.dimensionValues?.[0]?.value) && (
                          <div className="bg-white p-4 rounded-lg border border-[#eaf0f6]">
                            <div className="font-bold text-[#232946] text-xs uppercase tracking-wider mb-2">Top Countries</div>
                            <ul className="text-xs divide-y divide-gray-100">
                              {gaSummary.rows.filter((row: any) => row.dimensionValues?.[0]?.value).slice(0, 5).map((row: any, idx: number) => (
                                <li key={idx} className="flex justify-between py-1.5">
                                  <span className="text-gray-700 truncate pr-2">{row.dimensionValues[0].value}</span>
                                  <span className="text-[#3CB371] font-semibold">{row.metricValues?.[0]?.value || 0}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Top Devices */}
                        {gaSummary?.rows && gaSummary.rows.some((r: any) => r.dimensionValues?.[1]?.value) && (
                          <div className="bg-white p-4 rounded-lg border border-[#eaf0f6]">
                            <div className="font-bold text-[#232946] text-xs uppercase tracking-wider mb-2">Top Devices</div>
                            <ul className="text-xs divide-y divide-gray-100">
                              {gaSummary.rows.filter((row: any) => row.dimensionValues?.[1]?.value).slice(0, 5).map((row: any, idx: number) => (
                                <li key={idx} className="flex justify-between py-1.5">
                                  <span className="text-gray-700 capitalize">{row.dimensionValues[1].value}</span>
                                  <span className="text-[#3CB371] font-semibold">{row.metricValues?.[0]?.value || 0}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Top Pages */}
                        {gaSummary?.rows && gaSummary.rows.some((r: any) => r.dimensionValues?.[2]?.value) && (
                          <div className="bg-white p-4 rounded-lg border border-[#eaf0f6]">
                            <div className="font-bold text-[#232946] text-xs uppercase tracking-wider mb-2">Top Pages</div>
                            <ul className="text-xs divide-y divide-gray-100">
                              {gaSummary.rows.filter((row: any) => row.dimensionValues?.[2]?.value).slice(0, 5).map((row: any, idx: number) => (
                                <li key={idx} className="flex justify-between py-1.5">
                                  <span className="text-gray-700 truncate pr-2" title={row.dimensionValues[2].value}>{row.dimensionValues[2].value}</span>
                                  <span className="text-[#3CB371] font-semibold">{row.metricValues?.[0]?.value || 0}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Top Sources */}
                        {gaSummary?.rows && gaSummary.rows.some((r: any) => r.dimensionValues?.[3]?.value) && (
                          <div className="bg-white p-4 rounded-lg border border-[#eaf0f6]">
                            <div className="font-bold text-[#232946] text-xs uppercase tracking-wider mb-2">Top Sources</div>
                            <ul className="text-xs divide-y divide-gray-100">
                              {gaSummary.rows.filter((row: any) => row.dimensionValues?.[3]?.value).slice(0, 5).map((row: any, idx: number) => (
                                <li key={idx} className="flex justify-between py-1.5">
                                  <span className="text-gray-700 truncate pr-2">{row.dimensionValues[3].value}</span>
                                  <span className="text-[#3CB371] font-semibold">{row.metricValues?.[0]?.value || 0}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Top Posts */}
              <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#232946]">Top Posts (by Views)</h3>
                  <span className="text-xs text-gray-500 font-medium">Ranked by reader visits</span>
                </div>
                {topPosts.length === 0 ? (
                  <div className="text-sm text-gray-400 py-4 text-center">No posts found yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {topPosts.map((post, idx) => (
                      <li key={post.id} className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs font-bold text-gray-400">#{idx + 1}</span>
                        <Image
                          src={cloudinaryUrl(post.image || '/file.svg', 96) || '/file.svg'}
                          alt={post.title || 'Post'}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover bg-[#eaf0f6] flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#232946] text-sm truncate">{post.title}</div>
                          <div className="text-xs text-[#3CB371] flex items-center gap-2 mt-0.5">
                            <span className="text-gray-500">{formatPostDate(post)}</span>
                            <span>•</span>
                            <span className="font-semibold">{post.views || 0} views</span>
                          </div>
                        </div>
                        <a
                          href={`/posts/${post.slug || post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3CB371] text-xs font-bold hover:underline px-2 py-1 rounded hover:bg-[#3CB371]/10 transition"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#232946]">Recent Blogs</h3>
                <a href="/admin/posts" className="text-xs text-[#3CB371] font-semibold hover:underline">Manage All</a>
              </div>
              <ul className="space-y-4">
                {recentBlogs.length === 0 ? (
                  <li className="text-sm text-gray-400 py-4 text-center">No recent blogs found.</li>
                ) : (
                  recentBlogs.map(blog => (
                    <li key={blog.id} className="flex items-start gap-3 py-1">
                      <Image
                        src={cloudinaryUrl(blog.image || '/file.svg', 96) || '/file.svg'}
                        alt={blog.title || 'Blog'}
                        width={44}
                        height={44}
                        className="rounded-lg object-cover bg-[#eaf0f6] flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-[#232946] text-sm break-words line-clamp-2">{blog.title}</div>
                          <a
                            href={`/posts/${blog.slug || blog.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3CB371] text-xs font-bold hover:underline flex-shrink-0 ml-1"
                          >
                            View
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <span>{formatPostDate(blog)}</span>
                          <span>•</span>
                          <span className="text-[#3CB371] font-semibold">{blog.views || 0} views</span>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
