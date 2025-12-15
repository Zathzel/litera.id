// resources/js/Pages/Dashboard/Index.tsx

import DashboardLayout from "../../layouts/dashboard/DashboardLayout";
import { Link, usePage } from "@inertiajs/react";

interface DashboardProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
  stats?: {
    totalBooks: number;
    totalCategories: number;
  };
  // --- PERBAIKAN ERROR TS 2344 ---
  // Menambahkan index signature agar sesuai dengan constraint PageProps Inertia
  [key: string]: any;
}

export default function DashboardIndex() {
  // Mengambil data user & stats dari props dengan tipe yang sudah diperbaiki
  const { auth, stats } = usePage<DashboardProps>().props;

  // Fallback jika stats belum dikirim
  const bookCount = stats?.totalBooks ?? 0;
  const categoryCount = stats?.totalCategories ?? 0;

  return (
    <DashboardLayout>
      {/* --- Welcome Banner --- */}
      {/* Note: Jika warning tailwind mengganggu, biarkan bg-gradient-to-r karena itu standar v3. 
          bg-linear-to-r adalah sintaks untuk Tailwind v4. */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">
            Halo, {auth.user.name}! 👋
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Selamat datang kembali di panel admin Litera. Berikut adalah ringkasan data perpustakaan Anda hari ini.
          </p>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-20 -mb-10 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      </div>

      {/* --- Statistik Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Buku */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Buku</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{bookCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-2xl">
              📚
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Koleksi buku digital tersedia
          </div>
        </div>

        {/* Card 2: Total Kategori */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{categoryCount}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-2xl">
              📂
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Genre dan klasifikasi buku
          </div>
        </div>

        {/* Card 3: Admin Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-pink-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Admin</p>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">Aktif</h3>
            </div>
            <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-2xl">
              👤
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Login sebagai {auth.user.email}
          </div>
        </div>
      </div>

      {/* --- Quick Actions --- */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        🚀 Aksi Cepat
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/books/create"
          className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
              📖
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">Tambah Buku Baru</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload PDF dan cover buku</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <Link
          href="/dashboard/categories/create"
          className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-purple-500 hover:ring-1 hover:ring-purple-500 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
              🏷️
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 transition-colors">Buat Kategori</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tambahkan genre buku baru</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}