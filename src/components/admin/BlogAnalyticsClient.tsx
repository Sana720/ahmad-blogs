"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

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
  const time = getPostTime(p);
  if (!time) return '';
  return new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Custom Tooltip for rich presentation
function CustomChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#232946] text-white p-3 rounded-lg shadow-xl text-xs max-w-xs border border-gray-700">
        <p className="font-semibold text-sm line-clamp-2 mb-1.5">{data.fullTitle || data.name}</p>
        {data.displayDate && (
          <p className="text-gray-300 text-[11px] mb-1">Published: {data.displayDate}</p>
        )}
        <div className="flex items-center gap-1.5 font-bold text-[#3CB371] text-sm mt-1">
          <span>{data.views}</span>
          <span className="text-gray-300 font-normal text-xs">views</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function BlogAnalyticsClient() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<'trend' | 'top'>('trend');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const snap = await getDocs(collection(db, "posts"));
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching analytics posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Chronological trend data
  const trendData = useMemo(() => {
    const sorted = [...posts].sort((a, b) => getPostTime(a) - getPostTime(b));
    return sorted.map((post, idx) => {
      const dateStr = formatPostDate(post);
      const shortTitle = post.title
        ? (post.title.length > 15 ? post.title.slice(0, 15) + '…' : post.title)
        : `Post #${idx + 1}`;

      return {
        name: dateStr || shortTitle,
        shortTitle,
        fullTitle: post.title || 'Untitled',
        views: Number(post.views) || 0,
        displayDate: dateStr,
      };
    });
  }, [posts]);

  // Top 10 posts data
  const topData = useMemo(() => {
    const sorted = [...posts].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
    return sorted.slice(0, 10).map((post, idx) => {
      const shortTitle = post.title
        ? (post.title.length > 14 ? post.title.slice(0, 14) + '…' : post.title)
        : `#${idx + 1}`;

      return {
        name: shortTitle,
        fullTitle: post.title || 'Untitled',
        views: Number(post.views) || 0,
        displayDate: formatPostDate(post),
      };
    });
  }, [posts]);

  const activeData = chartView === 'trend' ? trendData : topData;
  const totalViews = useMemo(() => posts.reduce((acc, p) => acc + (Number(p.views) || 0), 0), [posts]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#232946]">Blog Analytics</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total Views across all blogs: <span className="font-semibold text-[#3CB371]">{totalViews}</span>
          </p>
        </div>

        {/* View toggle */}
        <div className="flex bg-[#f4f7f6] p-1 rounded-lg self-start sm:self-auto border border-[#eaf0f6]">
          <button
            type="button"
            onClick={() => setChartView('trend')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              chartView === 'trend'
                ? 'bg-white text-[#3CB371] shadow-sm'
                : 'text-gray-600 hover:text-[#232946]'
            }`}
          >
            Chronological Trend
          </button>
          <button
            type="button"
            onClick={() => setChartView('top')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              chartView === 'top'
                ? 'bg-white text-[#3CB371] shadow-sm'
                : 'text-gray-600 hover:text-[#232946]'
            }`}
          >
            Top 10 Posts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-sm text-gray-400">
          <div className="w-5 h-5 border-2 border-[#3CB371] border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading analytics...
        </div>
      ) : activeData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-sm text-gray-400">
          No blog post analytics data available yet.
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'trend' ? (
              <AreaChart data={activeData} margin={{ top: 10, right: 15, left: -15, bottom: 25 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3CB371" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3CB371" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#718096', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval="preserveStartEnd"
                  angle={-20}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#718096', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3CB371"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                  dot={{ r: 4, stroke: '#3CB371', strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#3CB371' }}
                />
              </AreaChart>
            ) : (
              <BarChart data={activeData} margin={{ top: 10, right: 15, left: -15, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#718096', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#718096', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="views"
                  fill="#3CB371"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
