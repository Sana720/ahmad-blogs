import React from 'react';

export default function WelcomeCard({ name, stats }: { name: string, stats: { posts: number, subscribers: number } }) {
  return (
    <div className="flex items-center bg-gradient-to-r from-[#eaf0f6] to-[#f7f8fa] rounded-2xl shadow p-6 mb-8">
      <img src="/public/illustration.svg" alt="Welcome" className="w-28 h-28 mr-6 hidden md:block" />
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
