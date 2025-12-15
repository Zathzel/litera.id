import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "../../layouts/public/PublicLayout";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";

// --- TYPES ---
interface Category {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    cover_path: string;
    category: Category;
    is_bookmarked: boolean;
}

interface Props {
    books: Book[];
}

// --- ASSETS & ICONS ---
const GridPattern = () => (
    <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
        <defs>
            <pattern id="grid-pattern-bm" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" strokeWidth="2" fill="none" className="opacity-10" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern-bm)" />
    </svg>
);

const Icons = {
    Search: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    StarSolid: () => (
        <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.838 5.666h5.968c.969 0 1.371 1.24.588 1.81l-4.825 3.511 1.838 5.666c.3.921-.755 1.688-1.542 1.115l-4.825-3.511-4.825 3.511c-.787.573-1.842-.194-1.542-1.115l1.838-5.666-4.825-3.511c-.783-.57-.381-1.81.588-1.81h5.968l1.838-5.666z" />
        </svg>
    ),
    Trash: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Book: () => (
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    )
};

// --- COMPONENT: TOAST NOTIFICATION (Simple Custom) ---
const Toast = ({ message, visible, onClose }: { message: string, visible: boolean, onClose: () => void }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 20, x: '-50%' }}
                className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium"
            >
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

// --- COMPONENT: REMOVE BUTTON ---
const RemoveButton = ({ id, onRemove, setNotification }: { id: number, onRemove: (id: number) => void, setNotification: (msg: string) => void }) => {
    const [loading, setLoading] = useState(false);

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        
        setLoading(true);
        try {
            const res = await axios.post(`/books/${id}/bookmark`);
            if (res.data.status === 'removed' || res.data.status === 'success') {
                onRemove(id);
                setNotification("Buku dihapus dari koleksi bookmark");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="absolute top-2 right-2 z-30 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 group/btn"
            title="Hapus Bookmark"
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Icons.Trash />
            )}
        </button>
    );
};

// --- MAIN PAGE ---
const Bookmarks: React.FC<Props> = ({ books }) => {
    // State
    const [localBooks, setLocalBooks] = useState<Book[]>(books);
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState<string | null>(null);

    // Logic: Filter Client Side (UX yang lebih cepat untuk bookmark list)
    const filteredBooks = useMemo(() => {
        return localBooks.filter(b => 
            b.title.toLowerCase().includes(search.toLowerCase()) || 
            b.author?.toLowerCase().includes(search.toLowerCase())
        );
    }, [localBooks, search]);

    // Handler: Hapus buku dari state lokal
    const handleRemove = (id: number) => {
        setLocalBooks(prev => prev.filter(b => b.id !== id));
    };

    // Handler: Notifikasi Toast
    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <PublicLayout>
            <Head title="Koleksi Bookmark" />
            
            {/* Toast Notification */}
            <Toast 
                message={notification || ""} 
                visible={!!notification} 
                onClose={() => setNotification(null)} 
            />

            <div className="relative min-h-screen pb-32">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <GridPattern />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
                    
                    {/* HEADER SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                        <div className="space-y-3 flex-1">
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider"
                            >
                                <Icons.StarSolid />
                                <span>Koleksi Pribadi</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                            >
                                Bookmark <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Anda</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-500 dark:text-gray-400 max-w-lg text-lg"
                            >
                                {localBooks.length} buku tersimpan untuk dibaca nanti.
                            </motion.p>
                        </div>

                        {/* LOCAL SEARCH BAR */}
                        {localBooks.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative w-full md:w-80"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Icons.Search />
                                </div>
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari di bookmark..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* CONTENT GRID */}
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                        <AnimatePresence mode="popLayout">
                            {filteredBooks.map((book, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    key={book.id}
                                    className="group relative"
                                >
                                    {/* Card Image Container */}
                                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-800 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-yellow-500/20 group-hover:-translate-y-2">
                                        
                                        {/* Remove Button Component */}
                                        <RemoveButton id={book.id} onRemove={handleRemove} setNotification={showNotification} />

                                        <img
                                            src={book.cover_path.startsWith("http") ? book.cover_path : `/storage/${book.cover_path}`}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                        {/* Action Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            <Link
                                                href={`/books/${book.id}/read`}
                                                className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-full shadow-xl hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Lanjut Baca
                                            </Link>
                                        </div>

                                        {/* Category Badge (Overlay) */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-black/40 backdrop-blur-md text-white rounded-md border border-white/10">
                                                {book.category.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="mt-4 space-y-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {book.author}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* EMPTY STATE */}
                    {localBooks.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-gray-900/50"
                        >
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-6">
                                <Icons.Book />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Belum ada Bookmark
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
                                Sepertinya Anda belum menyimpan buku apapun. Jelajahi koleksi kami dan simpan buku favorit Anda di sini.
                            </p>
                            <Link
                                href="/books"
                                className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Jelajahi Buku
                            </Link>
                        </motion.div>
                    )}

                    {/* NOT FOUND STATE (SEARCH) */}
                    {localBooks.length > 0 && filteredBooks.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">Tidak menemukan buku dengan kata kunci "{search}"</p>
                            <button onClick={() => setSearch("")} className="mt-2 text-yellow-600 font-medium hover:underline">Reset pencarian</button>
                        </div>
                    )}

                </div>
            </div>
        </PublicLayout>
    );
};

export default Bookmarks;