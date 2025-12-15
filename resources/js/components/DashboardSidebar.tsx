import { motion } from "framer-motion";
import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

// --- 1. Icon Set (Inline SVG agar tidak perlu install library & anti-error) ---
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Book: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Category: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// --- 2. Komponen NavItem (Untuk memecah kode agar rapi) ---
const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => {
  return (
    <Link href={href} className="relative block group">
      {/* Background Pill untuk Active State */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl border-l-4 border-indigo-600 dark:border-indigo-400"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
          active
            ? "text-indigo-700 dark:text-indigo-300 font-semibold"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
      >
        <Icon />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
};

export default function DashboardSidebar() {
  const { url } = usePage(); // Mendapatkan URL saat ini untuk Active State
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    router.post("/logout");
  };

  // --- 3. Konfigurasi Menu (Data Driven) ---
  const menuItems = [
    { label: "Dashboard Home", href: "/dashboard", icon: Icons.Dashboard, exact: true },
    { label: "Daftar Buku", href: "/dashboard/books", icon: Icons.Book },
    { label: "Kategori Buku", href: "/dashboard/categories", icon: Icons.Category },
  ];

  // Helper untuk cek active state
  const isActive = (href: string, exact = false) => {
    return exact ? url === href : url.startsWith(href);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-30 sticky top-0"
    >
      {/* Header / Logo Area */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-1">
            {/* Logo Ikon Sederhana */}
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
             L
           </div>
           <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
             Litera<span className="text-indigo-600 dark:text-indigo-400">.id</span>
           </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 ml-1 mt-1 font-medium">
          ADMIN DASHBOARD
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4 custom-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.href, item.exact)}
          />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 m-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
          >
            <span className="flex items-center gap-2">
               {darkMode ? <Icons.Moon /> : <Icons.Sun />}
               <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </span>
            {/* Toggle Switch Visual */}
            <div className={`w-8 h-4 flex items-center rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
               <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-3' : ''}`}></div>
            </div>
          </button>

          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <Icons.Home />
            <span>Halaman Depan</span>
          </Link>

          {/* Divider Halus */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition group"
          >
            <Icons.Logout />
            <span className="group-hover:translate-x-1 transition-transform">Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}