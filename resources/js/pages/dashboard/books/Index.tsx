import { usePage, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useState } from "react";

// --- Types ---
interface Book {
  id: number;
  title: string;
  author: string | null;
  description: string | null;
  category: { name: string } | null;
  file_path: string;
  cover_path: string | null;
}

interface PageProps {
  books: {
    data: Book[];
    links?: any;
    meta?: any;
  };
  [key: string]: any;
}

// --- Icons Components ---
const Icons = {
    Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Pencil: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    BookOpen: () => <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
};

export default function Index() {
  const { books } = usePage<PageProps>().props;
  const pageProps = usePage().props;
  const processing = pageProps.processing as boolean;

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    setDeletingId(id);

    router.delete(`/dashboard/books/${id}`, {
      onFinish: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <DashboardLayout>
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            📚 Daftar Buku
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola koleksi perpustakaan digital Anda.
            </p>
        </div>

        <Link
          href="/dashboard/books/create"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:scale-95"
        >
          <Icons.Plus />
          <span>Tambah Buku</span>
        </Link>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  Detail Buku
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
              {books?.data?.length > 0 ? (
                books.data.map((book: Book) => (
                  <tr
                    key={book.id}
                    className="group hover:bg-indigo-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  >
                    {/* Kolom Cover */}
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="w-14 h-20 flex-shrink-0">
                        {book.cover_path ? (
                          <img
                            src={`/storage/${book.cover_path}`}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-md shadow-md border border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center border border-gray-200 dark:border-gray-600 text-gray-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Kolom Detail */}
                    <td className="px-6 py-4 align-top">
                      <div className="max-w-xs">
                        <div className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                          by {book.author || "Unknown Author"}
                        </div>
                        {book.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                            {book.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Kolom Kategori */}
                    <td className="px-6 py-4 whitespace-nowrap align-top pt-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                        {book.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Tombol Edit */}
                        <Link
                          href={`/dashboard/books/${book.id}/edit`}
                          className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-white bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/50 rounded-lg transition-all"
                          title="Edit Buku"
                        >
                          <Icons.Pencil />
                        </Link>

                        {/* Tombol Delete */}
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={deletingId === book.id || processing}
                          className={`p-2 rounded-lg transition-all ${
                            deletingId === book.id 
                                ? "bg-red-50 text-red-400 cursor-not-allowed" 
                                : "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/50"
                          }`}
                          title="Hapus Buku"
                        >
                          {deletingId === book.id ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Icons.Trash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* --- Empty State --- */
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Icons.BookOpen />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada buku</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                        Mulai tambahkan koleksi buku digital Anda untuk ditampilkan di perpustakaan.
                      </p>
                      <Link
                        href="/dashboard/books/create"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        <Icons.Plus />
                        <span className="ml-2">Tambah Buku Sekarang</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}