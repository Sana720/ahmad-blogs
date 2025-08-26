"use client";

import AdminLayout from '../../components/admin/AdminLayout';
import BlogAnalytics from '../../components/admin/BlogAnalytics';
import { dashboardCards } from '../../components/admin/dashboardCards';
import WelcomeCard from '../../components/admin/WelcomeCard';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../utils/firebase';

export default function AdminDashboard() {
  type StatKey = 'posts' | 'authors' | 'categories' | 'views';
  const [stats, setStats] = useState<{ posts: number; authors: number; categories: number; views: number }>({ posts: 0, authors: 0, categories: 0, views: 0 });
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

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
      const q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(5));
      const snap = await getDocs(q);
      setRecentBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchStats();
    fetchRecentBlogs();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2 md:px-0">
        <WelcomeCard name="Admin" stats={{ posts: stats.posts, subscribers: 23000 }} />

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
            </div>
          </div>
          {/* Recent Blogs */}
          <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6]">
            <h3 className="text-lg font-bold text-[#232946] mb-4">Recent Blogs</h3>
            <ul className="space-y-4">
              {recentBlogs.map(blog => (
                <li key={blog.id} className="flex items-center gap-3">
                  <img src={blog.image || '/public/file.svg'} alt={blog.title} className="w-12 h-12 rounded-lg object-cover bg-[#eaf0f6]" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#232946] text-base truncate">{blog.title}</div>
                    <div className="text-xs text-[#3CB371] flex gap-2 mt-1">
                      <span>{blog.date}</span>
                      <span>• {blog.views || 0} views</span>
                    </div>
                  </div>
                  <a href={`/posts/${blog.slug}`} className="text-[#3CB371] text-xs font-bold hover:underline">View</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
