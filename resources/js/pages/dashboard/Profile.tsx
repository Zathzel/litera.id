import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
// 1. Import Hook Translation
import useTranslation from "@/hooks/UseTranslation"; 

// --- Tipe Data ---
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  locale?: string;
}

interface PageProps {
  auth: {
    user: User;
  };
  locale?: string; 
  [key: string]: any;
}

export default function Profile() {
  const { auth, locale } = usePage<PageProps>().props;
  const user = auth.user;

  // 2. Panggil Hook Translation
  const { t } = useTranslation(); 

  // --- FORM 1: Update Profil ---
  const { 
    data: dataProfile, 
    setData: setDataProfile, 
    patch: patchProfile, 
    errors: errorsProfile, 
    processing: processingProfile, 
    recentlySuccessful: recentlySuccessfulProfile 
  } = useForm({
    name: user.name,
    email: user.email,
  });

  const submitProfile: FormEventHandler = (e) => {
    e.preventDefault();
    patchProfile('/profile'); 
  };

  // --- FORM 2: Update Password ---
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { 
    data: dataPassword, 
    setData: setDataPassword, 
    put: putPassword, 
    errors: errorsPassword, 
    processing: processingPassword, 
    reset: resetPassword,
    recentlySuccessful: recentlySuccessfulPassword
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const submitPassword: FormEventHandler = (e) => {
    e.preventDefault();
    putPassword('/password', {
      preserveScroll: true,
      onSuccess: () => resetPassword(),
      onError: (errors) => {
        if (errors.password) {
          resetPassword("password", "password_confirmation");
          passwordInput.current?.focus();
        }
        if (errors.current_password) {
          resetPassword("current_password");
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  // --- FORM 3: Update Bahasa ---
  const {
    data: dataLang,
    setData: setDataLang,
    patch: patchLang,
    processing: processingLang,
    recentlySuccessful: recentlySuccessfulLang
  } = useForm({
    locale: user.locale || locale || 'id', 
  });

  const submitLanguage: FormEventHandler = (e) => {
    e.preventDefault();
    patchLang('/profile/locale', {
        onSuccess: () => {
            window.location.reload(); 
        }
    });
  };

  return (
    <DashboardLayout>
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          ⚙️ {t("Account Settings")}
        </h1>
      </div>

      <div className="space-y-6 pb-10">
        
        {/* --- CARD 1: Informasi Profil --- */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("Profile Information")}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("Update your account's profile information and email address.")}
                </p>
            </header>

            <form onSubmit={submitProfile} className="space-y-6 max-w-xl">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Full Name")}
                </label>
                <input
                    id="name"
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={dataProfile.name}
                    onChange={(e) => setDataProfile("name", e.target.value)}
                    required
                />
                {errorsProfile.name && <p className="text-red-500 text-sm mt-1">{errorsProfile.name}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Email")}
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={dataProfile.email}
                    onChange={(e) => setDataProfile("email", e.target.value)}
                    required
                />
                {errorsProfile.email && <p className="text-red-500 text-sm mt-1">{errorsProfile.email}</p>}
                </div>

                <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processingProfile}
                    className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {processingProfile ? t("Saving...") : t("Save Profile")}
                </button>

                {recentlySuccessfulProfile && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                    ✓ {t("Saved.")}
                    </span>
                )}
                </div>
            </form>
          </div>
        </div>

        {/* --- CARD 2: Update Password --- */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("Update Password")}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("Ensure your account is using a long, random password to stay secure.")}
                </p>
            </header>

            <form onSubmit={submitPassword} className="space-y-6 max-w-xl">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Current Password")}
                </label>
                <input
                    ref={currentPasswordInput}
                    id="current_password"
                    type="password"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={dataPassword.current_password}
                    onChange={(e) => setDataPassword("current_password", e.target.value)}
                />
                {errorsPassword.current_password && (
                    <p className="text-red-500 text-sm mt-1">{errorsPassword.current_password}</p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("New Password")}
                </label>
                <input
                    ref={passwordInput}
                    id="password"
                    type="password"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={dataPassword.password}
                    onChange={(e) => setDataPassword("password", e.target.value)}
                />
                {errorsPassword.password && (
                    <p className="text-red-500 text-sm mt-1">{errorsPassword.password}</p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Confirm Password")}
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={dataPassword.password_confirmation}
                    onChange={(e) => setDataPassword("password_confirmation", e.target.value)}
                />
                {errorsPassword.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errorsPassword.password_confirmation}</p>
                )}
                </div>

                <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processingPassword}
                    className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {processingPassword ? t("Updating...") : t("Update Password")}
                </button>

                {recentlySuccessfulPassword && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                    ✓ {t("Password Updated.")}
                    </span>
                )}
                </div>
            </form>
          </div>
        </div>

        {/* --- CARD 3: Pengaturan Bahasa --- */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("Language & Preferences")}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("Select the language you want to use for the application interface.")}
                </p>
            </header>

            <form onSubmit={submitLanguage} className="space-y-6 max-w-xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("Select Language")}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pilihan Bahasa Indonesia */}
                        <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${dataLang.locale === 'id' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}>
                            <input 
                                type="radio" 
                                name="locale" 
                                value="id" 
                                checked={dataLang.locale === 'id'} 
                                onChange={(e) => setDataLang("locale", e.target.value)}
                                className="sr-only" 
                            />
                            <span className="text-2xl mr-3">🇮🇩</span>
                            <div>
                                <span className="block font-bold text-gray-900 dark:text-white">Indonesia</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">Bahasa Indonesia</span>
                            </div>
                            {dataLang.locale === 'id' && (
                                <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </label>

                        {/* Pilihan Bahasa Inggris */}
                        <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${dataLang.locale === 'en' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}>
                            <input 
                                type="radio" 
                                name="locale" 
                                value="en" 
                                checked={dataLang.locale === 'en'} 
                                onChange={(e) => setDataLang("locale", e.target.value)}
                                className="sr-only" 
                            />
                            <span className="text-2xl mr-3">🇺🇸</span>
                            <div>
                                <span className="block font-bold text-gray-900 dark:text-white">English</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">United States</span>
                            </div>
                            {dataLang.locale === 'en' && (
                                <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processingLang}
                        className="inline-flex items-center px-6 py-2 bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {processingLang ? t("Changing...") : t("Save Language")}
                    </button>

                    {recentlySuccessfulLang && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                        ✓ {t("Language Changed.")}
                        </span>
                    )}
                </div>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}