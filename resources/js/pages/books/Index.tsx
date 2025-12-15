import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "../../layouts/public/PublicLayout";
import { Link } from "@inertiajs/react";
import axios from "axios";

// --- TIPE DATA ---
interface User {
    id: number;
    name: string;
    email: string;
}

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
    ratings_avg_rating: number | null; // Field baru dari Backend (withAvg)
}

interface Props {
    books: Book[];
    categories: Category[];
    auth: { user: User | null };
}

// --- ASET SVG & UI COMPONENTS ---

const GridPattern = () => (
    <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
        <defs>
            <pattern id="grid-pattern-books" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" strokeWidth="2" fill="none" className="opacity-10" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern-books)" />
    </svg>
);

const Icons = {
    Search: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    BookOpen: () => (
        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    // Icon Bintang (Bookmark) - Besar
    Star: ({ solid }: { solid?: boolean }) => (
        <svg 
            className={`w-6 h-6 transition-all duration-300 ${solid ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-white hover:text-yellow-200'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.838 5.666h5.968c.969 0 1.371 1.24.588 1.81l-4.825 3.511 1.838 5.666c.3.921-.755 1.688-1.542 1.115l-4.825-3.511-4.825 3.511c-.787.573-1.842-.194-1.542-1.115l1.838-5.666-4.825-3.511c-.783-.57-.381-1.81.588-1.81h5.968l1.838-5.666z" />
        </svg>
    ),
    // Icon Bintang Kecil untuk Rating Display
    StarMini: ({ filled, half }: { filled?: boolean, half?: boolean }) => (
        <svg className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
};

// --- KOMPONEN TOMBOL BOOKMARK ---
const BookmarkButton = ({ book, user }: { book: Book, user: User | null }) => {
    const [isBookmarked, setIsBookmarked] = useState(book.is_bookmarked);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!user) {
            if (confirm("Silakan login untuk menyimpan bookmark.")) {
                window.location.href = "/login";
            }
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`/books/${book.id}/bookmark`);
            if (response.data.status === 'success' || response.data.status === 'added' || response.data.status === 'removed') {
                setIsBookmarked(response.data.is_bookmarked);
            }
        } catch (error) {
            console.error("Gagal bookmark:", error);
            alert("Gagal menyimpan bookmark. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            title={isBookmarked ? "Hapus Bookmark" : "Simpan ke Bookmark"}
            className="absolute top-2 right-2 z-30 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all transform hover:scale-110 active:scale-95 border border-white/10 shadow-sm group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-100" 
        >
            <Icons.Star solid={isBookmarked} />
        </button>
    );
};

// --- KOMPONEN TAMPILAN RATING ---
const RatingDisplay = ({ rating }: { rating: number | null }) => {
    const score = rating ? parseFloat(rating.toString()) : 0;
    
    return (
        <div className="flex items-center gap-1 mt-1">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Icons.StarMini key={star} filled={star <= Math.round(score)} />
                ))}
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                {score > 0 ? score.toFixed(1) : '-'}
            </span>
        </div>
    );
};

// --- HALAMAN UTAMA ---
const Index: React.FC<Props> = ({ books, categories, auth }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Filtering Logic
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory ? book.category.id === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [books, searchTerm, selectedCategory]);

    return (
        <PublicLayout>
            <div className="relative min-h-screen pb-20">
                {/* Background Pattern */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <GridPattern />
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 md:pt-32">

                    {/* HEADER SECTION */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider text-sm"
                            >
                                <span className="w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                                Katalog Perpustakaan
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
                            >
                                Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Pengetahuan</span>
                            </motion.h1>
                        </div>

                        {/* SEARCH BAR */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full md:w-96"
                        >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari judul atau penulis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white transition-all"
                            />
                        </motion.div>
                    </div>

                    {/* FILTER CATEGORY */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-3 mb-10"
                    >
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                                selectedCategory === null
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500"
                            }`}
                        >
                            Semua
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                                    selectedCategory === cat.id
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* BOOK GRID */}
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        <AnimatePresence>
                            {filteredBooks.map((book) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={book.id}
                                    className="group relative flex flex-col"
                                >
                                    {/* COVER CARD */}
                                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                                        
                                        {/* TOMBOL BOOKMARK (Overlay) */}
                                        <BookmarkButton book={book} user={auth.user} />

                                        <img
                                            src={book.cover_path && book.cover_path.startsWith("http") ? book.cover_path : `/storage/${book.cover_path}`}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Tombol Hover (Desktop) */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="pointer-events-auto px-6 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-indigo-700 dark:text-indigo-300 font-bold rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                        
                                        {/* Link Wrapper (Mobile) */}
                                        <Link href={`/books/${book.id}`} className="absolute inset-0 z-10 md:hidden" aria-label="Lihat detail buku" />
                                    </div>

                                    {/* INFO BUKU */}
                                    <div className="mt-4 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                                {book.category.name}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {book.title}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {book.author}
                                        </p>
                                        
                                        {/* TAMPILAN RATING */}
                                        <RatingDisplay rating={book.ratings_avg_rating} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* EMPTY STATE */}
                    {filteredBooks.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                            <Icons.BookOpen />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Tidak ada buku ditemukan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                Coba cari dengan kata kunci lain atau pilih kategori "Semua".
                            </p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                                className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors"
                            >
                                Reset Pencarian
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </PublicLayout>
    );
};

export default Index;