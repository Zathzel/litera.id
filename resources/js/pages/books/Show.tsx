import React, { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "../../layouts/public/PublicLayout";
import axios from "axios";

// --- TIPE DATA ---
interface Category {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    cover_path: string;
    category: Category;
    is_bookmarked: boolean;
    ratings_avg_rating: number | null; // Rata-rata dari database
}

interface Props {
    book: Book;
    relatedBooks?: Book[];
    userRating: number | null; // Rating user saat ini (dari Controller)
    auth: { user: { id: number; name: string } | null };
}

// --- ICONS ---
const Icons = {
    Bookmark: ({ solid }: { solid?: boolean }) => (
        <svg
            className={`w-6 h-6 transition-all duration-300 ${
                solid
                    ? "text-red-500 fill-red-500 scale-125 transform"
                    : "text-white/80 hover:text-white/90"
            }`}
            fill={solid ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
        </svg>
    ),
    Search: () => (
        <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    ),
    Star: ({ filled }: { filled?: boolean }) => (
        <svg
            className={`w-8 h-8 transition-colors duration-200 ${
                filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.838 5.666h5.968c.969 0 1.371 1.24.588 1.81l-4.825 3.511 1.838 5.666c.3.921-.755 1.688-1.542 1.115l-4.825-3.511-4.825 3.511c-.787.573-1.842-.194-1.542-1.115l1.838-5.666-4.825-3.511c-.783-.57-.381-1.81.588-1.81h5.968l1.838-5.666z"
            />
        </svg>
    ),
};

// --- BUTTON BOOKMARK ---
const BookmarkButton = ({ book, user }: { book: Book; user: any }) => {
    const [isBookmarked, setIsBookmarked] = useState(book.is_bookmarked);
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        if (!user) {
            if (confirm("Silakan login untuk menyimpan bookmark.")) {
                window.location.href = "/login";
            }
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`/books/${book.id}/bookmark`);
            setIsBookmarked(response.data.is_bookmarked);
        } catch (err) {
            alert("Gagal menyimpan bookmark. Coba lagi.");
        }
        setLoading(false);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={loading}
            onClick={toggle}
            className={`p-3 rounded-full ${
                isBookmarked ? "bg-red-500/10" : "bg-black/30 backdrop-blur"
            } border border-white/10 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait`}
        >
            <Icons.Bookmark solid={isBookmarked} />
        </motion.button>
    );
};

// --- WIDGET RATING ---
const RatingWidget = ({ bookId, initialUserRating, avgRating, user }: { bookId: number, initialUserRating: number | null, avgRating: number | null, user: any }) => {
    const [rating, setRating] = useState(initialUserRating || 0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRating = async (value: number) => {
        if (!user) {
            if (confirm("Silakan login untuk memberi rating.")) {
                window.location.href = "/login";
            }
            return;
        }

        setRating(value);
        setIsSubmitting(true);
        
        try {
            await axios.post(`/books/${bookId}/rate`, { rating: value });
            // Opsional: Reload page agar rata-rata global terupdate, atau biarkan UI lokal saja
            router.reload({ only: ['book', 'userRating'] }); 
        } catch (error) {
            console.error("Gagal memberi rating", error);
            alert("Terjadi kesalahan saat menyimpan rating.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hover || rating;
    const averageScore = avgRating ? parseFloat(avgRating.toString()).toFixed(1) : "0.0";

    return (
        <div className="flex flex-col gap-2 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Berikan Penilaian
            </span>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`transition-transform duration-200 ${hover === star ? 'scale-110' : ''}`}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            disabled={isSubmitting}
                        >
                            <Icons.Star filled={star <= displayRating} />
                        </button>
                    ))}
                </div>
                
                <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600 mx-2"></div>
                
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                        {averageScore}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Rata-rata
                    </span>
                </div>
            </div>
            {isSubmitting && <span className="text-xs text-indigo-500 animate-pulse">Menyimpan...</span>}
        </div>
    );
};

// --- SHOW PAGE ---
const Show: React.FC<Props> = ({ book, relatedBooks = [], userRating, auth }) => {
    const [searchRelated, setSearchRelated] = useState("");

    // --- FILTER BUKU TERKAIT ---
    const filtered = useMemo(() => {
        if (!relatedBooks) return [];

        return relatedBooks.filter((b) => {
            const searchTerm = searchRelated.toLowerCase();
            const matchSearch =
                b.title.toLowerCase().includes(searchTerm) ||
                (b.author && b.author.toLowerCase().includes(searchTerm));

            return matchSearch;
        });
    }, [searchRelated, relatedBooks]);

    const coverUrl =
        book.cover_path && book.cover_path.startsWith("http")
            ? book.cover_path
            : `/storage/${book.cover_path}`;

    return (
        <PublicLayout>
            {/* BACKGROUND GRADIENT */}
            <div
                className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at top left, var(--tw-color-indigo-400), transparent 50%), radial-gradient(circle at bottom right, var(--tw-color-indigo-400), transparent 50%)`,
                }}
            ></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
                
                {/* SECTION DETAIL BUKU UTAMA */}
                <div className="flex flex-col md:flex-row gap-12 bg-white dark:bg-gray-900/70 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800">
                    
                    {/* COVER */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-full md:w-80 flex-shrink-0"
                    >
                        <img
                            src={coverUrl}
                            className="w-full aspect-[2/3] rounded-xl object-cover border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-transform duration-500"
                            alt={book.title}
                        />

                        <div className="absolute top-4 right-4">
                            <BookmarkButton book={book} user={auth.user} />
                        </div>
                    </motion.div>

                    {/* TEXT DETAIL */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 space-y-6"
                    >
                        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-snug tracking-tight">
                            {book.title}
                        </h1>

                        <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                            {book.author}
                        </p>

                        <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100">
                            {book.category.name}
                        </div>

                        {/* DESKRIPSI */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                Deskripsi
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-base">
                                {book.description ||
                                    "Belum ada deskripsi untuk buku ini."}
                            </p>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <Link
                                href={`/books/${book.id}/read`}
                                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-full transition transform hover:scale-[1.02]"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.409 9.175 5 7.5 5 4.582 5 2 7.238 2 10c0 2.239 2.07 4.102 5.093 4.551A9 9 0 0012 20.25c2.474 0 4.792-.612 6.807-1.748C20.897 18.156 22 16.29 22 14c0-2.762-2.582-5-5.5-5-.466 0-.916.05-1.353.14M12 6.253v13"
                                    />
                                </svg>
                                Mulai Baca
                            </Link>
                        </div>

                        {/* SECTION RATING */}
                        <RatingWidget 
                            bookId={book.id} 
                            initialUserRating={userRating} 
                            avgRating={book.ratings_avg_rating}
                            user={auth.user}
                        />

                    </motion.div>
                </div>

                {/* SECTION BUKU TERKAIT */}
                {relatedBooks.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-indigo-500/50 pb-2">
                            📚 Buku Lain dari Kategori yang Sama
                        </h2>

                        {/* SEARCH DI RELATED */}
                        <div className="relative mb-8 w-full md:w-2/3 lg:w-1/2">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan judul atau penulis..."
                                value={searchRelated}
                                onChange={(e) => setSearchRelated(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* GRID BUKU TERKAIT */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                            <AnimatePresence>
                                {filtered.map((b) => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="group transition transform hover:scale-[1.05] rounded-xl"
                                    >
                                        <Link href={`/books/${b.id}`}>
                                            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                                <img
                                                    src={
                                                        b.cover_path && b.cover_path.startsWith("http")
                                                            ? b.cover_path
                                                            : `/storage/${b.cover_path}`
                                                    }
                                                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                                    alt={b.title}
                                                />
                                            </div>

                                            <h3 className="mt-4 font-extrabold text-sm text-gray-900 dark:text-white line-clamp-2">
                                                {b.title}
                                            </h3>

                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {b.author}
                                            </p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* HASIL PENCARIAN KOSONG */}
                        {filtered.length === 0 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-500 dark:text-gray-400 py-10 border-t border-gray-200 dark:border-gray-700 mt-6"
                            >
                                🔍 Tidak ada buku terkait yang cocok dengan pencarian **"{searchRelated}"**.
                            </motion.p>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default Show;