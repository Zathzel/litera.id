import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import PublicLayout from "../layouts/public/PublicLayout";

// ==========================================
// 1. ASET SVG & ILUSTRASI CUSTOM
// ==========================================

// Ilustrasi Hero: Tablet E-Reader dengan elemen melayang (SVG Murni + Framer Motion)
const HeroIllustration = () => (
  <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
    {/* Floating Background Blob */}
    <motion.path
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
      fill="#E0E7FF"
      className="dark:fill-indigo-900/30"
      d="M45.7,-76.3C58.9,-69.3,69.1,-56.3,76.3,-42.4C83.5,-28.5,87.7,-13.7,85.5,0.1C83.4,14,74.9,26.9,65.1,38.1C55.3,49.3,44.2,58.8,31.8,65.3C19.4,71.8,5.7,75.3,-7.4,74.1C-20.5,72.9,-33,67,-43.7,59.1C-54.4,51.2,-63.3,41.3,-70.3,29.2C-77.3,17.1,-82.4,2.8,-79.4,-10.2C-76.4,-23.2,-65.3,-34.9,-53.8,-42.9C-42.3,-50.9,-30.4,-55.2,-18.3,-57.4C-6.2,-59.6,6.1,-59.7,19.2,-59.7"
      transform="translate(250 250) scale(2.5)"
    />
    {/* Device Body */}
    <rect x="100" y="80" width="300" height="400" rx="30" className="fill-white dark:fill-gray-800" stroke="#4F46E5" strokeWidth="8" />
    {/* Screen */}
    <rect x="120" y="120" width="260" height="320" rx="10" className="fill-gray-100 dark:fill-gray-900" />
    {/* Skeleton UI (Garis-garis teks) */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.2 }}>
       <rect x="140" y="150" width="100" height="20" rx="4" className="fill-gray-300 dark:fill-gray-700" />
       <rect x="140" y="190" width="220" height="10" rx="4" className="fill-gray-300 dark:fill-gray-700" />
       <rect x="140" y="210" width="200" height="10" rx="4" className="fill-gray-300 dark:fill-gray-700" />
       <rect x="140" y="230" width="210" height="10" rx="4" className="fill-gray-300 dark:fill-gray-700" />
       <rect x="140" y="270" width="220" height="10" rx="4" className="fill-gray-300 dark:fill-gray-700" />
       <rect x="140" y="290" width="180" height="10" rx="4" className="fill-gray-300 dark:fill-gray-700" />
    </motion.g>
    {/* Floating Element: Book Icon */}
    <motion.g animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
       <circle cx="380" cy="150" r="40" className="fill-indigo-500 shadow-lg" />
       <path d="M365 140L375 160L395 135" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    {/* Floating Element: Heart */}
    <motion.g animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
       <circle cx="100" cy="350" r="30" className="fill-pink-500 shadow-lg" />
       <text x="85" y="360" fill="white" fontSize="24">❤️</text>
    </motion.g>
  </svg>
);

// Ikon Fitur
const Icons = {
  Moon: () => (
    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Bookmark: () => (
    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
};

// Background Grid Pattern
const GridPattern = () => (
  <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 40L40 0H20L0 20M40 40V20L20 40" strokeWidth="2" fill="none" className="opacity-10" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
  </svg>
);

// ==========================================
// 2. KOMPONEN DATA DUMMY (BUKU & MARQUEE)
// ==========================================

const MockBook = ({ color, title, rotate }: { color: string; title: string; rotate: number }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.05, rotate: 0, zIndex: 10 }}
    className={`relative w-32 h-48 rounded-r-md shadow-xl flex flex-col justify-between p-3 border-l-4 border-white/20 cursor-pointer transition-all duration-300`}
    style={{ backgroundColor: color, rotate: `${rotate}deg`, boxShadow: '5px 5px 15px rgba(0,0,0,0.2)' }}
  >
    <div className="space-y-2">
      <div className="w-full h-2 bg-white/30 rounded-full" />
      <div className="w-3/4 h-2 bg-white/30 rounded-full" />
    </div>
    <div className="text-white/80 text-xs font-bold font-serif tracking-widest rotate-180 [writing-mode:vertical-lr] h-full max-h-[100px]">
       {title}
    </div>
  </motion.div>
);

const books = [
  { color: "#4F46E5", title: "REACT", rotate: -3 },
  { color: "#DB2777", title: "DESIGN", rotate: 2 },
  { color: "#059669", title: "NATURE", rotate: -2 },
  { color: "#D97706", title: "HISTORY", rotate: 3 },
  { color: "#7C3AED", title: "MAGIC", rotate: -1 },
  { color: "#2563EB", title: "CODING", rotate: 2 },
  { color: "#DC2626", title: "DANGER", rotate: -3 },
];

// ==========================================
// 3. MAIN COMPONENT: LANDING PAGE
// ==========================================

const LandingPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="relative overflow-hidden">
        
        {/* --- BACKGROUND GLOBAL --- */}
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 transition-colors duration-300">
            <GridPattern />
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* --- SECTION 1: HERO --- */}
        <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 lg:px-12 py-20 lg:py-32 max-w-7xl mx-auto gap-12">
          <div className="flex-1 text-center md:text-left space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Perpustakaan Digital No. 1
               </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight">
                Baca Buku Digital <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Tanpa Batas.
                </span>
              </h2>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Akses ribuan buku PDF & EPUB dengan pengalaman membaca modern. Mode malam, pencarian cepat, dan sinkronisasi progres di semua perangkat.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/books" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                 Mulai Membaca
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </Link>
              <Link href="/register" className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-full text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Buat Akun Gratis
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex-1 w-full max-w-lg relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-[100px] opacity-20"></div>
             <HeroIllustration />
          </motion.div>
        </header>

        {/* --- WAVE DIVIDER SVG --- */}
        <div className="relative -mt-20 z-20">
           <svg className="w-full h-24 md:h-48 fill-gray-50 dark:fill-gray-800/50" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"></path>
           </svg>
        </div>

        {/* --- SECTION 2: FEATURES --- */}
        <section className="relative z-20 bg-gray-50 dark:bg-gray-800/50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Didesain untuk <span className="text-indigo-600 dark:text-indigo-400">Kenyamanan</span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Kami fokus pada hal-hal kecil yang membuat pengalaman membaca digital terasa seperti buku fisik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{ title: "Dark Mode Nyaman", desc: "Lindungi mata Anda saat membaca di malam hari.", icon: Icons.Moon },
                { title: "Pencarian Cerdas", desc: "Temukan kutipan atau bab tertentu dalam hitungan detik.", icon: Icons.Search },
                { title: "Simpan Progres", desc: "Lanjutkan membaca tepat di halaman terakhir Anda.", icon: Icons.Bookmark }
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -10 }}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <f.icon />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{f.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 3: INFINITE BOOK SHELF (Marquee) --- */}
        <section className="py-24 overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center mb-12 px-6">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-sm uppercase">Koleksi Terbaru</span>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Ribuan Judul Menanti</h3>
            </div>
            <div className="relative w-full flex">
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
                <div className="flex gap-8 whitespace-nowrap">
                    {[...books, ...books, ...books].map((book, i) => (
                        <motion.div key={i} animate={{ x: ["0%", "-100%"] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="flex-shrink-0 py-10 px-2">
                            <MockBook color={book.color} title={book.title} rotate={book.rotate} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- SECTION 4: STEPS (How it Works) --- */}
        <section className="py-24 px-6 relative bg-gray-50 dark:bg-gray-800/30">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                   <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Mulai dalam 3 Langkah</h3>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                   {/* Connecting Line (Desktop Only) */}
                   <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 z-0">
                      <svg className="w-full overflow-visible" height="100">
                         <path d="M0,0 C150,50 300,-50 450,0 C600,50 750,-50 900,0" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-700" strokeDasharray="10 10"/>
                      </svg>
                   </div>
                   {/* Step Items */}
                   {[{icon: "📝", title: "Daftar Akun", desc: "Buat akun gratis dalam 30 detik."}, 
                     {icon: "🔍", title: "Pilih Buku", desc: "Jelajahi ribuan koleksi eksklusif."}, 
                     {icon: "📖", title: "Mulai Membaca", desc: "Nikmati reader canggih di perangkat apapun."}
                   ].map((step, i) => (
                       <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-indigo-50 dark:border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                             <span className="text-2xl">{step.icon}</span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">{step.desc}</p>
                       </div>
                   ))}
                </div>
             </div>
        </section>

        {/* --- SECTION 5: CTA & STATS --- */}
        <section className="py-20 px-6">
             <div className="max-w-6xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-indigo-900 dark:bg-gray-900 shadow-2xl">
                   <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90 dark:opacity-80" />
                      <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" /></svg>
                   </div>
                   <div className="relative z-10 px-8 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="text-center md:text-left space-y-4 flex-1">
                         <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Siap menyelami dunia literasi?</h2>
                         <p className="text-indigo-100 text-lg max-w-md">Bergabunglah sekarang dan dapatkan akses ke koleksi eksklusif kami.</p>
                      </div>
                      <div className="flex flex-col items-center gap-6">
                          <div className="flex gap-8 text-white/90 mb-2">
                              <div className="text-center"><div className="text-2xl font-bold">5K+</div><div className="text-xs opacity-70 uppercase">Buku</div></div>
                              <div className="w-px bg-white/20 h-10"></div>
                              <div className="text-center"><div className="text-2xl font-bold">2K+</div><div className="text-xs opacity-70 uppercase">Member</div></div>
                          </div>
                          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/register" className="px-8 py-4 bg-white text-indigo-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                            Daftar Gratis Sekarang
                          </motion.a>
                      </div>
                   </div>
                </div>
             </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default LandingPage;