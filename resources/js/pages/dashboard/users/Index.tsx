import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

// Tipe Data User
interface User {
  id: number;
  name: string;
  email: string;
  role: string; // admin / user
  created_at: string;
  avatar?: string;
}

interface PageProps {
  users: {
    data: User[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters?: {
    search?: string;
  };
  auth: {
    user: User;
  };
  [key: string]: any;
}

export default function UserIndex() {
  const { users, filters, auth } = usePage<PageProps>().props;
  
  const [search, setSearch] = useState(filters?.search || "");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Handle Search dengan Debounce atau Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.get("/dashboard/users", { search }, { preserveState: true });
    }
  };

  const handleDelete = (id: number) => {
    if (id === auth.user.id) {
        alert("Anda tidak dapat menghapus akun Anda sendiri.");
        return;
    }
    if (!confirm("Yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.")) return;

    setDeletingId(id);
    router.delete(`/dashboard/users/${id}`, {
      onFinish: () => setDeletingId(null),
    });
  };

  return (
    <DashboardLayout>
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            👥 Kelola User
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total {users.total} pengguna terdaftar.
            </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
            <input 
                type="text" 
                placeholder="Cari nama atau email... (Enter)" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal Gabung
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {users.data.length > 0 ? (
                users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition duration-150">
                    
                    {/* Kolom Nama & Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            {/* Avatar Placeholder: Inisial Nama */}
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                                user.role === 'admin' ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600'
                            }`}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {user.name} 
                            {user.id === auth.user.id && <span className="ml-2 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">You</span>}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Reader'}
                      </span>
                    </td>

                    {/* Kolom Tanggal */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {user.id !== auth.user.id ? (
                            <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition p-2 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg ${
                                    deletingId === user.id ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                title="Hapus User"
                            >
                                {deletingId === user.id ? (
                                    <span className="text-xs">Menghapus...</span>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Akun Anda</span>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-lg font-medium">Tidak ada user ditemukan.</p>
                    <p className="text-sm">Coba kata kunci pencarian lain.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Sederhana */}
        {users.links.length > 3 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <div className="flex gap-1">
                    {users.links.map((link, k) => (
                        <Link
                            key={k}
                            href={link.url || "#"}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded text-sm ${
                                link.active 
                                    ? "bg-indigo-600 text-white" 
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}