"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function BlogAnalyticsClient() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const snap = await getDocs(collection(db, "posts"));
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const sorted = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const data = sorted.map(post => ({
    name: post.title.length > 12 ? post.title.slice(0, 12) + '…' : post.title,
    views: post.views || 0,
    date: post.date,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-[#eaf0f6] mb-10">
      <h2 className="text-lg font-bold mb-4 text-[#232946]">Blog Analytics (Views Trend)</h2>
      {loading ? (
        <div className="text-[#3CB371]">Loading analytics...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#232946', fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#232946', fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#3CB371" strokeWidth={3} dot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#3CB371' }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
