import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 bg-white">
        {children}
      </main>
    </div>
  );
}
