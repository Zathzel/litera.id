import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";

// --- Tipe Data ---
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface PageProps {
  auth: {
    user: User;
  };
  [key: string]: any;
}

export default function Profile() {
  const user = usePage<PageProps>().props.auth.user;

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
    // MENGGUNAKAN URL STRING (Bukan route())
    // Pastikan route ini ada di web.php Anda. Standar Laravel Breeze adalah '/profile'
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
    // MENGGUNAKAN URL STRING. Standar Laravel biasanya '/password' atau '/user/password'
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

  return (
    <DashboardLayout>
      {/* --- HEADER (Style match Index.tsx) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          ⚙️ Pengaturan Akun
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* --- CARD 1: Informasi Profil --- */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Informasi Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Perbarui nama akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submitProfile} className="space-y-6 max-w-xl">
                {/* Nama */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lengkap
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

                {/* Email */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
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

                {/* Action Button */}
                <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processingProfile}
                    className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {processingProfile ? "Menyimpan..." : "Simpan Profil"}
                </button>

                {recentlySuccessfulProfile && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                    ✓ Tersimpan.
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
                Ganti Password
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Pastikan akun Anda aman dengan menggunakan password yang kuat.
                </p>
            </header>

            <form onSubmit={submitPassword} className="space-y-6 max-w-xl">
                {/* Password Saat Ini */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password Saat Ini
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

                {/* Password Baru */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password Baru
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

                {/* Konfirmasi Password */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Konfirmasi Password
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

                {/* Action Button */}
                <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processingPassword}
                    className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {processingPassword ? "Memperbarui..." : "Update Password"}
                </button>

                {recentlySuccessfulPassword && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                    ✓ Password diperbarui.
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