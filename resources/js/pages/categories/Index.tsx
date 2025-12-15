import React from "react";
import PublicLayout from "../../layouts/public/PublicLayout";
import { Link } from "@inertiajs/react";
import { motion, Variants } from "framer-motion";

// --- TIPE DATA ---
interface Category {
  id: number;
  name: string;
}

// --- ASET & STYLE ---

const GridPattern = () => (
  <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="grid-pattern-cat" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 40L40 0H20L0 20M40 40V20L20 40" strokeWidth="2" fill="none" className="opacity-10" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern-cat)" />
  </svg>
);

const gradients = [
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-sky-500",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 100 
    } 
  },
};

export default function CategoryIndex({ categories }: { categories: Category[] }) {
  return (
    <PublicLayout>
      <div className="relative min-h-screen pb-20">
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <GridPattern />
        </div>

        {/* UPDATE DISINI: Mengubah pt-16 menjadi pt-28 md:pt-32 agar turun ke bawah navbar */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 md:pt-32">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-16 space-y-4">
            <motion.span 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase"
            >
               Eksplorasi
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
            >
              Kategori <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Pilihan</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Temukan buku berdasarkan topik yang Anda minati. Dari teknologi hingga sejarah, semua ada di sini.
            </motion.p>
          </div>

          {/* --- CATEGORY GRID --- */}
          {categories.length === 0 ? (
            // Empty State
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700"
            >
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Belum ada kategori</h3>
              <p className="text-gray-500 dark:text-gray-400">Silakan cek kembali nanti.</p>
            </motion.div>
          ) : (
            // Grid List
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {categories.map((cat, index) => {
                const gradient = gradients[index % gradients.length];

                return (
                  <motion.div variants={itemVariants} key={cat.id}>
                    <Link
                      href={`/books?category=${cat.id}`} 
                      className="group relative block h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Icon Placeholder dengan Gradient Dinamis */}
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                             <span className="text-xl font-bold">{cat.name.charAt(0).toUpperCase()}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                               Jelajahi Koleksi
                            </p>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}