import React from 'react';
import { cloudinaryUrl } from '../../utils/cloudinary';
import Image from 'next/image';
export default function WelcomeCard({ name, stats }: { name: string, stats: { posts: number, subscribers: number } }) {
  return (
    <div className="flex items-center bg-gradient-to-r from-[#eaf0f6] to-[#f7f8fa] rounded-2xl shadow p-6 mb-8">
      <Image
  src={cloudinaryUrl('https://res.cloudinary.com/dmklge3gp/image/upload/v1756490593/434514610_975938324187768_1172821101792539874_n_cyqkbx.jpg', 256)}
        alt="Welcome"
        width={112}
        height={112}
        className="w-16 h-16 md:w-28 md:h-28 mr-6"
      />
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
