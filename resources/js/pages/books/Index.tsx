import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicLayout from "../../layouts/public/PublicLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

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
  ratings_avg_rating: number | null;
}

interface Props {
  books: Book[];
  categories: Category[];
  auth: { user: User | null };
}

// --- ICONS & ASSETS (TETAP SAMA) ---
const GridPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px] dark:opacity-10"></div>
  </div>
);

const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  BookOpen: () => <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Star: ({ solid }: { solid?: boolean }) => (
    <svg className={`w-5 h-5 transition-all duration-300 ${solid ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-sm' : 'text-white hover:text-yellow-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.563.044.793.77.362 1.145l-4.193 3.637a.563.563 0 00-.172.527l1.285 5.386a.562.562 0 01-.84.613l-4.685-2.822a.562.562 0 00-.555 0l-4.685 2.822a.562.562 0 01-.84-.613l1.285-5.386a.562.562 0 00-.172-.527L2.343 10.54c-.43-.375-.2-.1.1-.362.362 1.145l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  StarMini: ({ filled }: { filled?: boolean }) => (
    <svg className={`w-3.5 h-3.5 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};

// --- COMPONENTS ---

const BookmarkButton = ({ book, user }: { book: Book, user: User | null }) => {
  // 2. PANGGIL HOOK DI SUB-COMPONENT
  const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(book.is_bookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!user) {
      // [TRANSLATE]
      if (confirm(t("Please login to save bookmarks."))) router.visit("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/books/${book.id}/bookmark`);
      if (['success', 'added', 'removed'].includes(response.data.status)) {
        setIsBookmarked(response.data.is_bookmarked);
      }
    } catch (error) {
      console.error("Gagal bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="absolute top-3 right-3 z-30 p-2.5 bg-black/40 backdrop-blur-md rounded-full hover:bg-indigo-600 transition-all transform hover:scale-110 active:scale-95 border border-white/20 shadow-lg group/btn" 
    >
      <div className={loading ? "animate-pulse" : ""}>
        <Icons.Star solid={isBookmarked} />
      </div>
    </button>
  );
};

const RatingDisplay = ({ rating }: { rating: number | null }) => {
  const score = rating ? parseFloat(rating.toString()) : 0;
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icons.StarMini key={star} filled={star <= Math.round(score)} />
        ))}
      </div>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 pt-0.5">
        {score > 0 ? score.toFixed(1) : '0.0'}
      </span>
    </div>
  );
};

// --- MAIN PAGE ---

const Index: React.FC<Props> = ({ books, categories, auth }) => {
  // 2. PANGGIL HOOK DI MAIN COMPONENT
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory ? book.category.id === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  return (
    <PublicLayout>
      <div className="relative min-h-screen pb-20 font-sans">
        <GridPattern />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40">

          {/* HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                {/* [TRANSLATE] */}
                {t("Library Catalog")}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {/* [TRANSLATE] */}
                {t("Discover Your Next")} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {t("Favorite Book")}
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                {/* [TRANSLATE] */}
                {t("Explore thousands of digital book collections from various categories. Read anytime, anywhere.")}
              </p>
            </motion.div>

            {/* SEARCH BAR (Floating) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-lg mx-auto"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                // [TRANSLATE]
                placeholder={t("Search title, author, or topic...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xl shadow-indigo-500/10 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
              />
            </motion.div>
          </div>

          {/* CATEGORY FILTER */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  selectedCategory === null
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg transform scale-105"
                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                {/* [TRANSLATE] */}
                {t("All")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 transform scale-105"
                      : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* BOOK GRID */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={book.id}
                  className="group relative"
                >
                  {/* CARD CONTAINER */}
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-md bg-gray-100 dark:bg-zinc-800 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/10">
                    
                    <BookmarkButton book={book} user={auth.user} />

                    <img
                      src={book.cover_path && book.cover_path.startsWith("http") ? book.cover_path : `/storage/${book.cover_path}`}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">{book.title}</p>
                        <p className="text-gray-300 text-sm mb-4">{book.author}</p>
                        <Link
                          href={`/books/${book.id}`}
                          className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg"
                        >
                          {/* [TRANSLATE] */}
                          {t("Read Now")}
                        </Link>
                      </div>
                    </div>

                    {/* Full Link for Mobile/Accessibility */}
                    <Link href={`/books/${book.id}`} className="absolute inset-0 z-10 md:hidden" aria-label={`Baca ${book.title}`} />
                  </div>

                  {/* INFO (Visible when not hovered) */}
                  <div className="mt-4 space-y-1 transition-opacity duration-300 group-hover:opacity-50">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                        {book.category.name}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {book.author}
                    </p>
                    <RatingDisplay rating={book.ratings_avg_rating} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* EMPTY STATE */}
          {filteredBooks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-full mb-6">
                <Icons.BookOpen />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {/* [TRANSLATE] */}
                {t("Book not found")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                {/* [TRANSLATE] */}
                {t("We couldn't find any books matching that keyword. Try using other terms or reset category filters.")}
              </p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
              >
                {/* [TRANSLATE] */}
                {t("Reset Search")}
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;