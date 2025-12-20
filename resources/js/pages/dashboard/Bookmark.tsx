import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// --- Tipe Data ---
interface Category {
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string | null;
  cover_path: string | null;
  category: Category | null;
  progress?: number; 
}

interface Props {
  bookmarks: Book[];
}

export default function Bookmark({ bookmarks }: Props) {
  // 2. PANGGIL HOOK
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Filter buku
  const filteredBooks = bookmarks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Hapus Bookmark
  const handleRemoveBookmark = (bookId: number) => {
    setProcessingId(bookId);
    router.post(
      `/books/${bookId}/bookmark`, 
      {}, 
      {
        preserveScroll: true,
        onFinish: () => setProcessingId(null),
      }
    );
  };

  return (
    <DashboardLayout>
      {/* [TRANSLATE] Head Title */}
      <Head title={t("My Bookmarks")} />

      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {/* [TRANSLATE] */}
            🔖 {t("My Library")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {/* [TRANSLATE] */}
                {t("Collection of books you saved to read later.")}
            </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            // [TRANSLATE] Placeholder
            placeholder={t("Search book title...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div 
                key={book.id} 
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Cover Image Area */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {book.cover_path ? (
                  <img
                    src={`/storage/${book.cover_path}`}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                
                {/* Badge Kategori */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {/* [TRANSLATE] Fallback category */}
                  {book.category?.name || t("General")}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {/* [TRANSLATE] Fallback Author */}
                  {book.author || t("Unknown Author")}
                </p>

                {/* Tombol Aksi */}
                <div className="mt-auto flex items-center gap-2">
                  {/* Tombol Baca */}
                  <Link
                    href={`/books/${book.id}/read`}
                    className="flex-1 inline-flex justify-center items-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    📖 {t("Read")}
                  </Link>

                  {/* Tombol Hapus Bookmark */}
                  <button
                    onClick={() => handleRemoveBookmark(book.id)}
                    disabled={processingId === book.id}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-red-200"
                    title={t("Remove from Bookmarks")}
                  >
                    {processingId === book.id ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-4">
                <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {/* [TRANSLATE] Logic */}
                {search ? t("Book not found") : t("No bookmarks yet")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                {search 
                  ? t("Try using different keywords.") 
                  : t("You haven't bookmarked any books yet. Explore our collection and save your favorites here.")}
            </p>
            {!search && (
                <Link 
                    href="/dashboard/books" 
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-500/30"
                >
                    {t("Browse Books")}
                </Link>
            )}
        </div>
      )}
    </DashboardLayout>
  );
}