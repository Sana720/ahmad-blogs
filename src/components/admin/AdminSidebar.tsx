'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../utils/firebase';
import { useState } from 'react';

const linkGroups = [
  {
    title: 'Main',
    links: [
      { href: '/admin', label: 'Dashboard' },
      { href: '/admin/orders', label: 'Orders' },
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/licenses', label: 'Licenses' },
      { href: '/admin/coupons', label: 'Coupons' },
      { href: '/admin/portfolio', label: 'Portfolio' },
    ]
  },
  {
    title: 'Content',
    links: [
      { href: '/admin/posts', label: 'Posts' },
      { href: '/admin/categories', label: 'Categories' },
      { href: '/admin/authors', label: 'Authors' },
      { href: '/admin/comments', label: 'Comments' },
      { href: '/admin/reviews', label: 'Reviews' },
      { href: '/admin/guest-posts', label: 'Guest Posts' },
    ]
  },
  {
    title: 'Outreach & Marketing',
    links: [
      { href: '/admin/outreach', label: 'Dashboard' },
      { href: '/admin/outreach/quick-send', label: 'Quick Send' },
      { href: '/admin/outreach/leads', label: 'Leads' },
      { href: '/admin/outreach/lists', label: 'Lists' },
      { href: '/admin/outreach/campaigns', label: 'Campaigns' },
      { href: '/admin/outreach/templates', label: 'Templates' },
      { href: '/admin/outreach/suppression', label: 'Suppression' },
      { href: '/admin/outreach/logs', label: 'Email Logs' },
      { href: '/admin/newsletter', label: 'Newsletter' },
    ]
  },
  {
    title: 'System',
    links: [
      { href: '/admin/contacts', label: 'Contacts' },
      { href: '/admin/settings', label: 'Settings' },
    ]
  }
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.replace('/admin/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#232946] text-white p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="text-xl font-extrabold tracking-tight">Admin Panel</div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-[#232946] text-white w-64 h-screen p-6 flex-col gap-2 sticky top-0 z-20 overflow-y-auto
        ${isOpen ? 'fixed flex inset-y-0 left-0' : 'hidden md:flex'}`}>
        
        <div className="hidden md:block text-2xl font-extrabold mb-8 tracking-tight text-center">Admin Panel</div>
        
        <div className="flex flex-col gap-4 mt-4 md:mt-0 pb-10">
          {linkGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-4">{group.title}</h3>
              {group.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${pathname === link.href
                      ? 'bg-[#3CB371] text-white'
                      : 'hover:bg-[#3CB371]/80 text-[#eaf0f6] hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
        >
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
