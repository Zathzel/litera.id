import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Link, usePage } from "@inertiajs/react";

// --- TIPE DATA ---
interface DashboardProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string; // Pastikan role ada di sini
    };
  };
  stats?: {
    // Stats Admin
    totalBooks?: number;
    totalCategories?: number;
    totalUsers?: number;
    // Stats Reader (Bisa dikirim dari controller nanti)
    myBookmarks?: number;
    booksRead?: number;
  };
  [key: string]: any;
}

export default function DashboardIndex() {
  const { auth, stats } = usePage<DashboardProps>().props;
  const isAdmin = auth.user.role === 'admin';

  // --- STATISTIK ---
  // Gunakan optional chaining dan fallback value
  const stat1 = isAdmin ? (stats?.totalBooks ?? 0) : (stats?.myBookmarks ?? 0);
  const stat1Label = isAdmin ? "Total Buku" : "Bookmark Saya";
  const stat1Icon = isAdmin ? "📚" : "🔖";
  const stat1Color = "indigo";

  const stat2 = isAdmin ? (stats?.totalCategories ?? 0) : (stats?.booksRead ?? 0);
  const stat2Label = isAdmin ? "Total Kategori" : "Buku Selesai";
  const stat2Icon = isAdmin ? "📂" : "✅";
  const stat2Color = "purple";

  // Card ke-3 (Info User / Total User)
  const stat3Label = isAdmin ? "Total Pengguna" : "Status Akun";
  const stat3Value = isAdmin ? (stats?.totalUsers ?? 0) : "Active Reader";
  const stat3Icon = isAdmin ? "👥" : "👤";
  const stat3Color = "pink";

  return (
    <DashboardLayout>
      {/* --- WELCOME BANNER --- */}
      <div className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-xl mb-8 ${
          isAdmin 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
            : "bg-gradient-to-r from-emerald-500 to-teal-600"
      }`}>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">
            Halo, {auth.user.name}! 👋
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            {isAdmin 
                ? "Selamat datang di Panel Admin. Kelola perpustakaan digital Anda dengan mudah di sini."
                : "Selamat datang kembali! Lanjutkan petualangan membaca Anda dan temukan buku baru hari ini."
            }
          </p>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-20 -mb-10 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      </div>

      {/* --- STAT CARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-${stat1Color}-500`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat1Label}</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat1}</h3>
            </div>
            <div className={`p-3 bg-${stat1Color}-50 dark:bg-${stat1Color}-900/30 rounded-lg text-2xl`}>
              {stat1Icon}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-${stat2Color}-500`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat2Label}</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat2}</h3>
            </div>
            <div className={`p-3 bg-${stat2Color}-50 dark:bg-${stat2Color}-900/30 rounded-lg text-2xl`}>
              {stat2Icon}
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-${stat3Color}-500`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat3Label}</p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-2">{stat3Value}</h3>
            </div>
            <div className={`p-3 bg-${stat3Color}-50 dark:bg-${stat3Color}-900/30 rounded-lg text-2xl`}>
              {stat3Icon}
            </div>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS (Admin) / RECENT & LIBRARY (User) --- */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        {isAdmin ? "🚀 Aksi Cepat" : "📚 Mulai Membaca"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isAdmin ? (
            // --- ADMIN ACTIONS ---
            <>
                <Link
                    href="/dashboard/books/create"
                    className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xl">📖</div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">Tambah Buku Baru</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Upload PDF ke koleksi</p>
                        </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link
                    href="/dashboard/users"
                    className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-pink-500 hover:ring-1 hover:ring-pink-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-xl">👥</div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 transition-colors">Kelola Pengguna</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lihat daftar member</p>
                        </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </>
        ) : (
            // --- USER SHORTCUTS ---
            <>
                <Link
                    href="/dashboard/bookmarks"
                    className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xl">🔖</div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 transition-colors">Perpustakaan Saya</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lanjutkan bacaan tersimpan</p>
                        </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link
                    href="/books"
                    className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-teal-500 hover:ring-1 hover:ring-teal-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-xl">🔍</div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-teal-600 transition-colors">Jelajahi Buku</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Temukan bacaan baru</p>
                        </div>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </>
        )}
      </div>
    </DashboardLayout>
  );
}