import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// --- Types ---
interface Category {
  id: number;
  name: string;
}

interface PageProps {
  categories: Category[];
  [key: string]: any;
}

// --- Icons ---
const Icons = {
    Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Pencil: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    FolderOpen: () => <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
};

export default function Index() {
  const { categories } = usePage<PageProps>().props;
  const pageProps = usePage().props;
  const processing = pageProps.processing as boolean;

  // 2. PANGGIL HOOK
  const { t } = useTranslation();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    // [TRANSLATE] Confirm
    if (!confirm(t("Are you sure you want to delete this category?"))) return;

    setDeletingId(id);

    router.delete(`/dashboard/categories/${id}`, {
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
            {/* [TRANSLATE] Title */}
            📂 {t("Category List")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {/* [TRANSLATE] Description */}
                {t("Manage book grouping for easier searching.")}
            </p>
        </div>

        <Link
          href="/dashboard/categories/create"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:scale-95"
        >
          <Icons.Plus />
          {/* [TRANSLATE] Button */}
          <span>{t("Add Category")}</span>
        </Link>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="w-20 px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  {t("No.")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  {t("Category Name")}
                </th>
                <th className="w-48 px-6 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                  {t("Action")}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="group hover:bg-indigo-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  >
                    {/* Kolom Nomor Urut */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {index + 1}
                    </td>

                    {/* Kolom Nama Kategori */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </div>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Tombol Edit */}
                        <Link
                          href={`/dashboard/categories/${category.id}/edit`}
                          className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-white bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/50 rounded-lg transition-all"
                          title={t("Edit Category")}
                        >
                          <Icons.Pencil />
                        </Link>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deletingId === category.id || processing}
                          className={`p-2 rounded-lg transition-all ${
                            deletingId === category.id 
                                ? "bg-red-50 text-red-400 cursor-not-allowed" 
                                : "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/50"
                          }`}
                          title={t("Delete Category")}
                        >
                          {deletingId === category.id ? (
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
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Icons.FolderOpen />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{t("No categories yet")}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                        {t("Create a new category to start grouping books.")}
                      </p>
                      <Link
                        href="/dashboard/categories/create"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        <Icons.Plus />
                        <span className="ml-2">{t("Create Category")}</span>
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