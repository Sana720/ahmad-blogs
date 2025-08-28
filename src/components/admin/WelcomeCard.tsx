import React from 'react';
import Image from 'next/image';
export default function WelcomeCard({ name, stats }: { name: string, stats: { posts: number, subscribers: number } }) {
  return (
    <div className="flex items-center bg-gradient-to-r from-[#eaf0f6] to-[#f7f8fa] rounded-2xl shadow p-6 mb-8">
      <Image src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Welcome" className="w-28 h-28 mr-6 hidden md:block" />
      <div>
        <h2 className="text-2xl font-bold text-[#232946] mb-1">Welcome Back! <span className="text-2xl">👋</span></h2>
        <div className="text-[#3CB371] text-lg font-semibold mb-2">Good evening!</div>
        <div className="flex gap-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#232946]">{stats.posts}</span>
            <span className="text-[#3CB371] text-sm">Total Post</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#232946]">{stats.subscribers}</span>
            <span className="text-[#3CB371] text-sm">Subscriber</span>
          </div>
        </div>
      </div>
    </div>
  );
}
