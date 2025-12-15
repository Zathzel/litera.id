import { usePage, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useState } from "react";

// Update Type Definition Lokal (atau update di file types global Anda)
interface Book {
  id: number;
  title: string;
  author: string | null;
  description: string | null; // <--- Tambahkan ini
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          📚 Daftar Buku
        </h1>

        <Link
          href="/dashboard/books/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <span className="text-xl leading-none mr-2">+</span>
          Tambah Buku
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Judul & Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {books?.data?.map((book: Book) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.cover_path ? (
                      <img
                        src={`/storage/${book.cover_path}`}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 shadow-sm">
                        No Cover
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {book.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {book.author || "Penulis tidak diketahui"}
                    </div>
                    {/* Menampilkan Description (Truncated) */}
                    {book.description && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1 max-w-xs">
                        {book.description}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {book.category?.name || "Uncategorized"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center items-center gap-3">
                      {/* Tombol Preview (Eye) */}
                      <a
                        href={`/storage/${book.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition p-1 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full text-xl leading-none"
                        title="Lihat PDF"
                      >
                        <span aria-label="Preview" role="img">👁️</span>
                      </a>

                      {/* Tombol Edit (Pencil) */}
                      <Link
                        href={`/dashboard/books/${book.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition p-1 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full text-xl leading-none"
                        title="Edit Buku"
                      >
                        <span aria-label="Edit" role="img">✏️</span>
                      </Link>

                      {/* Tombol Delete (Trash) */}
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={deletingId === book.id || processing}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition p-1 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full text-xl leading-none ${
                          deletingId === book.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title="Hapus Buku"
                      >
                        {deletingId === book.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-red-600 dark:text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <span aria-label="Hapus" role="img">🗑️</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* State Kosong */}
              {books?.data?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center"
                  >
                    <div className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      Belum ada buku.
                    </div>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                      Mulai tambahkan koleksi buku digital Anda.
                    </p>
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