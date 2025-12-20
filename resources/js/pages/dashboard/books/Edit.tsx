import { useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useState } from "react";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  category_id: number;
  file_path: string;
  cover_path: string | null;
}

interface EditProps {
  book: Book;
  categories: Category[];
}

export default function Edit({ book, categories }: EditProps) {
  // 2. PANGGIL HOOK
  const { t } = useTranslation();

  const { data, setData, put, processing, errors } = useForm({
    title: book.title,
    author: book.author,
    description: book.description || "",
    category_id: String(book.category_id),
    file: null as File | null,
    cover: null as File | null,
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(
    book.cover_path ? `/storage/${book.cover_path}` : null
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/dashboard/books/${book.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {t("Edit Book")}
        </h1>

        <form
          onSubmit={submit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          {/* TITLE */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Book Title")}
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* AUTHOR */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Author")}
            </label>
            <input
              type="text"
              value={data.author}
              onChange={(e) => setData("author", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            {errors.author && <p className="text-red-500 mt-1">{errors.author}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Description / Synopsis")}
            </label>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white resize-none"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Category")}
            </label>
            <select
              value={data.category_id}
              onChange={(e) => setData("category_id", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- {t("select category")} --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* FILE */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Replace Book File")} <span className="text-gray-400 text-sm">({t("optional")})</span>
            </label>
            <input
              type="file"
              accept=".pdf,.epub"
              onChange={(e) => setData("file", e.target.files?.[0] || null)}
              className="w-full dark:text-gray-300"
            />
            {errors.file && <p className="text-red-500 mt-1">{errors.file}</p>}

            <a
              href={`/storage/${book.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline block mt-2"
            >
              {t("View current file")}
            </a>
          </div>

          {/* COVER */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t("Replace Cover")} <span className="text-gray-400 text-sm">({t("optional")})</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setData("cover", file);
                if (file) setCoverPreview(URL.createObjectURL(file));
              }}
              className="w-full dark:text-gray-300"
            />

            {coverPreview && (
              <img
                src={coverPreview}
                className="w-32 h-40 object-cover mt-2 rounded-lg shadow-md"
                alt="Preview Cover"
              />
            )}
            {errors.cover && <p className="text-red-500 mt-1">{errors.cover}</p>}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition 
              ${processing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {processing ? t("Saving...") : t("Update Book")}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}