import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface IndexProps {
  categories: Category[];
}

export default function Index({ categories }: IndexProps) {
  // --- PERBAIKAN TYPE ASSERION UNTUK MENGATASI ERROR TS 2322 ---
  // Casting 'processing' sebagai boolean
  const pageProps = usePage().props;
  const processing = pageProps.processing as boolean;
  // -----------------------------------------------------------------

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    setDeletingId(id);

    router.delete(`/dashboard/categories/${id}`, {
      onFinish: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Daftar Kategori
        </h1>

        <Link
          href="/dashboard/categories/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {/* Mengganti PlusIcon dengan karakter Unicode (+) */}
          <span className="text-xl leading-none mr-2">+</span>
          Tambah Kategori
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-16 px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="w-36 px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center items-center space-x-4">
                      {/* Tombol Edit: Menggunakan karakter ✏️ (Pensil) */}
                      <Link
                        href={`/dashboard/categories/${category.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-150 ease-in-out p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-700 text-xl leading-none"
                        title="Edit Kategori"
                      >
                        <span aria-label="Edit" role="img">✏️</span>
                      </Link>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id || processing}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition duration-150 ease-in-out p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 text-xl leading-none ${
                          deletingId === category.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title="Hapus Kategori"
                      >
                        {deletingId === category.id ? (
                          // Spinner tetap dipertahankan karena ini fungsionalitas UX
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
                          // Mengganti TrashIcon dengan karakter Unicode 🗑️ (Tempat Sampah)
                          <span aria-label="Hapus" role="img">🗑️</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Tampilan jika data kosong */}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      Belum ada kategori.
                    </div>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                      Klik tombol "Tambahl Kategori" untuk membuat yang pertama.
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