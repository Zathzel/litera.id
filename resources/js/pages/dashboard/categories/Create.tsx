import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useForm } from "@inertiajs/react";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

export default function Create() {
  // 2. PANGGIL HOOK
  const { t } = useTranslation();

  const { data, setData, post, errors, processing } = useForm({
    name: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/dashboard/categories");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {t("Add Category")}
      </h1>

      <div className="max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              {t("Category Name")}
            </label>

            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            />

            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <button
            disabled={processing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {t("Save")}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}