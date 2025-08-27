'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../utils/firebase';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/authors', label: 'Authors' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/settings', label: 'Settings' },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.replace('/admin/login');
  };

  return (
    <aside className="bg-[#232946] text-white w-full md:w-64 min-h-screen p-6 flex flex-col gap-2">
      <div className="text-2xl font-extrabold mb-8 tracking-tight text-center">Admin Panel</div>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded px-4 py-2 font-medium transition-colors duration-150 ${
            pathname === link.href
              ? 'bg-[#3CB371] text-white'
              : 'hover:bg-[#3CB371]/80 text-[#eaf0f6] hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
      >
        Logout
      </button>
    </aside>
  );
}
