import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface User {
    name: string;
    email?: string;
    avatar?: string; 
}

interface NavbarProps {
    auth: {
        user: User | null;
    };
}

// --- ICONS (Minimalis & Konsisten) ---
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
    <Link href={href} className="relative px-3 py-1.5 text-sm font-medium transition-colors group">
        <span className={`relative z-10 transition-colors duration-200 ${active ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"}`}>
            {children}
        </span>
        {active && (
            <motion.div
                layoutId="navbar-indicator"
                className="absolute inset-x-0 -bottom-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
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
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
        }`}
    >
        {Icon && <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`} />}
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

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
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
        <header className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-2 px-2" : "pt-0 px-0"}`}>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`
                    w-full max-w-7xl transition-all duration-300
                    ${scrolled 
                        ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm rounded-2xl" 
                        : "bg-white/0 dark:bg-zinc-900/0 backdrop-blur-none border-b border-transparent" // Transparent at top
                    }
                    ${!scrolled && "border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm"} // Line when not scrolled but not floating
                `}
            >
                <div className="px-4 md:px-6 h-16 flex items-center justify-between">
                    
                    {/* --- LEFT: LOGO --- */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group outline-none">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
                                <span className="font-bold text-lg">L</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                                Litera
                            </span>
                        </Link>

                        {/* Desktop Menu (Clean Links) */}
                        <div className="hidden md:flex items-center gap-6">
                            <NavLink href="/" active={url === "/"}>Home</NavLink>
                            <NavLink href="/books" active={isActive("/books")}>Buku</NavLink>
                            <NavLink href="/categories" active={isActive("/categories")}>Kategori</NavLink>
                        </div>
                    </div>

                    {/* --- RIGHT: ACTIONS --- */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme Toggle (Simple Icon) */}
                        <button
                            onClick={toggleDarkMode}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
                        </button>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                        {/* Auth Section */}
                        {!auth.user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                                    Sign up
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <Icons.ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden py-1 z-50 origin-top-right"
                                        >
                                            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                                                <p className="text-xs font-medium text-zinc-400">Halo,</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{auth.user.name.split(" ")[0]}</p>
                                            </div>
                                            
                                            <div className="py-1">
                                                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                                    <Icons.Dashboard className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link href="/bookmarks" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                                    <Icons.Bookmark className="w-4 h-4" /> Bookmarks
                                                </Link>
                                            </div>

                                            <div className="border-t border-zinc-100 dark:border-zinc-800 py-1">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left">
                                                    <Icons.Logout className="w-4 h-4" /> Log out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE TOGGLE --- */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={toggleDarkMode} className="text-zinc-500 dark:text-zinc-400">
                            {darkMode ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-800 dark:text-zinc-200">
                            {mobileMenuOpen ? <Icons.Close className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE MENU --- */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800 md:hidden bg-white dark:bg-zinc-900"
                        >
                            <div className="p-4 space-y-1">
                                <MobileNavLink href="/" active={url === "/"} icon={Icons.Dashboard}>Home</MobileNavLink>
                                <MobileNavLink href="/books" active={isActive("/books")} icon={({className}:{className?:string})=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}>Buku</MobileNavLink>
                                
                                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>
                                
                                {!auth.user ? (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Link href="/login" className="flex justify-center px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-sm">Log in</Link>
                                        <Link href="/register" className="flex justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm">Sign up</Link>
                                    </div>
                                ) : (
                                    <>
                                        <MobileNavLink href="/dashboard" active={isActive("/dashboard")} icon={Icons.Dashboard}>Dashboard</MobileNavLink>
                                        <MobileNavLink href="/bookmarks" active={isActive("/bookmarks")} icon={Icons.Bookmark}>Bookmarks</MobileNavLink>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left">
                                            <Icons.Logout className="w-4 h-4" /> Log out
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
}