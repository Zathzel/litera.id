import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface User {
    name: string;
    email?: string;
    avatar?: string; // Optional avatar url
}

interface NavbarProps {
    auth: {
        user: User | null;
    };
}

// --- ICONS (Uniform Stroke & Size) ---
const Icons = {
    Sun: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    ),
    Moon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    ),
    Menu: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    ),
    Close: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    ),
    User: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    Logout: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
    ),
    Bookmark: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
    ),
    ChevronDown: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    ),
    Dashboard: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    )
};

// --- COMPONENT: DESKTOP NAV LINK ---
const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
    <Link href={href} className="relative px-4 py-2 text-sm font-medium transition-colors">
        <span className={`relative z-10 transition-colors duration-200 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"}`}>
            {children}
        </span>
        {active && (
            <motion.div
                layoutId="navbar-active-pill"
                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full -z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </Link>
);

// --- COMPONENT: MOBILE NAV LINK ---
const MobileNavLink = ({ href, children, active, icon: Icon }: { href: string; children: React.ReactNode; active: boolean, icon?: any }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            active
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
    </Link>
);

export default function Navbar({ auth }: NavbarProps) {
    const { url } = usePage();
    const { post } = useForm();
    
    const [darkMode, setDarkMode] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle Theme
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const handleLogout = () => {
        post("/logout");
        setDropdownOpen(false);
    };

    const isActive = (path: string) => url === path || url.startsWith(path + '/');

    return (
        <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none px-4 pt-4 md:pt-6">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`
                    pointer-events-auto w-full max-w-5xl rounded-2xl border transition-all duration-300
                    ${scrolled || mobileMenuOpen
                        ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-700/50 shadow-xl shadow-zinc-200/20 dark:shadow-black/40"
                        : "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg border-transparent shadow-sm"
                    }
                `}
            >
                <div className="px-5 h-16 flex items-center justify-between">
                    
                    {/* --- LEFT: LOGO --- */}
                    <Link href="/" className="flex items-center gap-2.5 group outline-none">
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-100">
                            Litera.id
                        </span>
                    </Link>

                    {/* --- CENTER: DESKTOP MENU --- */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
                        <NavLink href="/" active={url === "/"}>Home</NavLink>
                        <NavLink href="/books" active={isActive("/books")}>Buku</NavLink>
                        <NavLink href="/categories" active={isActive("/categories")}>Kategori</NavLink>
                    </div>

                    {/* --- RIGHT: ACTIONS --- */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-all active:scale-95"
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
                        </button>

                        {/* Bookmark Icon (Only if Logged In) */}
                        {auth.user && (
                            <Link
                                href="/bookmarks"
                                className={`p-2 rounded-full transition-all active:scale-95 relative group ${
                                    isActive("/bookmarks")
                                        ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-400"
                                        : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                }`}
                                title="Bookmark Saya"
                            >
                                <Icons.Bookmark className="w-5 h-5" />
                                {isActive("/bookmarks") && <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>}
                            </Link>
                        )}

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>

                        {/* Auth Buttons / User Dropdown */}
                        {!auth.user ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all">
                                    Sign up
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all active:scale-95 ${
                                        dropdownOpen 
                                        ? "border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-900/20" 
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800"
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 max-w-[80px] truncate">
                                        {auth.user.name.split(" ")[0]}
                                    </span>
                                    <Icons.ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden py-2 z-50 ring-1 ring-black/5"
                                        >
                                            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                                                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{auth.user.name}</p>
                                            </div>
                                            
                                            <div className="px-1">
                                                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                                    <Icons.Dashboard className="w-4 h-4" />
                                                    Dashboard
                                                </Link>
                                                <Link href="/bookmarks" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                                    <Icons.Bookmark className="w-4 h-4" />
                                                    Bookmark Saya
                                                </Link>
                                            </div>

                                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
                                            
                                            <div className="px-1">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                                    <Icons.Logout className="w-4 h-4" />
                                                    Log out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE HAMBURGER --- */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 active:scale-95 transition"
                        >
                            {darkMode ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors active:scale-95"
                        >
                            {mobileMenuOpen ? <Icons.Close className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE MENU (Accordion) --- */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Apple-like ease
                            className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800 md:hidden bg-zinc-50/50 dark:bg-black/20 backdrop-blur-sm"
                        >
                            <div className="p-4 space-y-2">
                                <MobileNavLink href="/" active={url === "/"} icon={Icons.Dashboard}>Home</MobileNavLink>
                                <MobileNavLink href="/books" active={isActive("/books")} icon={({className}:{className?:string}) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}>Buku</MobileNavLink>
                                <MobileNavLink href="/categories" active={isActive("/categories")} icon={({className}:{className?:string}) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>}>Kategori</MobileNavLink>
                                
                                <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-2 mx-4"></div>
                                
                                {!auth.user ? (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Link href="/login" className="flex justify-center px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 font-bold text-sm active:scale-95 transition">
                                            Log in
                                        </Link>
                                        <Link href="/register" className="flex justify-center px-4 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm shadow-lg active:scale-95 transition">
                                            Sign up
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">Akun</div>
                                        <MobileNavLink href="/dashboard" active={isActive("/dashboard")} icon={Icons.Dashboard}>Dashboard</MobileNavLink>
                                        <MobileNavLink href="/bookmarks" active={isActive("/bookmarks")} icon={Icons.Bookmark}>Bookmark Saya</MobileNavLink>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                                        >
                                            <Icons.Logout className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
}