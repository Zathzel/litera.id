import { motion } from "framer-motion";
import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

// --- 1. ICON SET ---
const Icons = {
  Dashboard: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Book: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Category: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Home: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Moon: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Logout: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  User: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Bookmark: ({ className }: { className?: string }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
};

// --- 2. COMPONENTS ---

// NavItem dengan Desain Baru
const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => {
  return (
    <Link href={href} className="relative block group mb-1">
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/40 dark:to-transparent rounded-r-xl border-l-[3px] border-indigo-600 dark:border-indigo-400"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <div
        className={`relative flex items-center gap-3 px-5 py-2.5 transition-all duration-200 ${
          active
            ? "text-indigo-700 dark:text-indigo-300 font-bold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/30 rounded-r-xl mr-2"
        }`}
      >
        {/* Icon dengan efek glow halus saat active */}
        <div className={`${active ? "drop-shadow-md text-indigo-600 dark:text-indigo-400" : ""}`}>
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm tracking-wide">{label}</span>
      </div>
    </Link>
  );
};

// Section Divider (Pemisah Menu)
const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="px-5 mb-2 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            {title}
        </h3>
        {children}
    </div>
);

// --- 3. INTERFACES ---
interface MenuItem {
    label: string;
    href: string;
    icon: any;
    exact?: boolean; 
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            role?: string; 
        };
    };
    [key: string]: any;
}

// --- 4. MAIN COMPONENT ---
export default function DashboardSidebar() {
  const { url, props } = usePage<PageProps>(); 
  const { auth } = props; 
  const isAdmin = auth.user.role === 'admin'; 

  // --- Dark Mode Logic ---
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

  // --- CONFIG MENU ---
  const isActive = (href: string, exact = false) => {
    return exact ? url === href : url.startsWith(href);
  };

  // 1. Menu Umum (Overview)
  const commonMenuItems: MenuItem[] = [
    { label: isAdmin ? "Dashboard Home" : "Ringkasan", href: "/dashboard", icon: Icons.Dashboard, exact: true },
  ];

  // 2. Menu Admin (Administration)
  const adminMenuItems: MenuItem[] = [
    { label: "Kelola Buku", href: "/dashboard/books", icon: Icons.Book },
    { label: "Kelola Kategori", href: "/dashboard/categories", icon: Icons.Category },
    { label: "Kelola User", href: "/dashboard/users", icon: Icons.Users },
  ];

  // 3. Menu User (Personal)
  const personalMenuItems: MenuItem[] = [
    { label: "Bookmark Saya", href: "/dashboard/bookmarks", icon: Icons.Bookmark }, 
    { label: "Profile & Settings", href: "/profile", icon: Icons.User }, 
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-30 sticky top-0"
    >
      {/* --- HEADER LOGO --- */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50">
        <Link href="/" className="flex items-center gap-3 group">
           <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
             L
           </div>
           <div>
                <span className="block text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none">
                    Litera<span className="text-indigo-600 dark:text-indigo-400">.id</span>
                </span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    {isAdmin ? "Admin Panel" : "Reader Space"}
                </span>
           </div>
        </Link>
      </div>

      {/* --- NAVIGATION SCROLL AREA --- */}
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar space-y-2">
        
        {/* 1. Overview Section (Selalu Muncul) */}
        <MenuSection title="Overview">
            {commonMenuItems.map((item) => (
                <NavItem key={item.href} {...item} active={isActive(item.href, item.exact)} />
            ))}
        </MenuSection>

        {/* 2. Admin Section (Hanya Jika Admin) */}
        {isAdmin && (
            <div className="relative">
                {/* Garis Pemisah Halus */}
                <div className="mx-5 my-4 border-t border-dashed border-gray-200 dark:border-gray-700/50" />
                
                <MenuSection title="Administrator">
                    {adminMenuItems.map((item) => (
                        <NavItem key={item.href} {...item} active={isActive(item.href, item.exact)} />
                    ))}
                </MenuSection>
            </div>
        )}

        {/* 3. Personal Section (Garis Pemisah & Menu) */}
        <div className="relative">
            <div className="mx-5 my-4 border-t border-dashed border-gray-200 dark:border-gray-700/50" />
            
            <MenuSection title="Personal Area">
                {personalMenuItems.map((item) => (
                    <NavItem key={item.href} {...item} active={isActive(item.href, item.exact)} />
                ))}
            </MenuSection>
        </div>

      </nav>

      {/* --- FOOTER ACTIONS --- */}
      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Home Button */}
            <Link
                href="/"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shadow-sm"
                title="Halaman Depan"
            >
                <Icons.Home className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">Home</span>
            </Link>

            {/* Dark Mode Button */}
            <button
                onClick={toggleDarkMode}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shadow-sm"
                title="Ganti Tema"
            >
                {darkMode ? <Icons.Moon className="w-5 h-5 mb-1" /> : <Icons.Sun className="w-5 h-5 mb-1" />}
                <span className="text-[10px] font-bold">{darkMode ? "Dark" : "Light"}</span>
            </button>
        </div>

        {/* Logout Button */}
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all border border-transparent hover:border-red-200"
        >
            <Icons.Logout className="w-4 h-4" />
            <span>Keluar Sesi</span>
        </button>
      </div>
    </motion.aside>
  );
}