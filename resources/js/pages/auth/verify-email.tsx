import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT ROUTE HELPER ---
import { logout } from '@/routes';

// --- GLOBAL ROUTE TYPE ---
declare global {
    interface Window {
        route: (name: string, params?: any, absolute?: boolean) => string;
    }
}

// --- ICONS ---
const Icons = {
    MailOpen: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
            <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
        </svg>
    ),
    Send: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    ),
    LogOut: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    ),
    Loader: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    ),
    CheckCircle: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
    )
};

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan route standar Laravel untuk mengirim ulang verifikasi
        post(window.route('verification.send'));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 relative overflow-hidden selection:bg-indigo-500/30">
            <Head title="Verifikasi Email" />

            {/* --- BACKGROUND AMBIENCE --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[20%] w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[120px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </div>

            {/* --- MAIN CARD --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md relative z-10 p-6"
            >
                <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden">
                    
                    {/* Decor Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-red-500"></div>

                    {/* Icon Header */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }} 
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm transform rotate-3"
                            >
                                <Icons.MailOpen className="w-10 h-10" />
                            </motion.div>
                            
                            {/* Floating paper plane */}
                            <motion.div 
                                animate={{ y: [-5, 5, -5], x: [2, -2, 2] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-md text-indigo-500 border border-zinc-100 dark:border-zinc-700"
                            >
                                <Icons.Send className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Cek Email Anda
                        </h1>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
                            <p>
                                Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda memverifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan?
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                Jika Anda tidak menerima email tersebut, kami dengan senang hati akan mengirimkannya lagi.
                            </p>
                        </div>
                    </div>

                    {/* Notification Area */}
                    <AnimatePresence>
                        {status === 'verification-link-sent' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex gap-3 items-start text-left">
                                    <Icons.CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                        Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="space-y-4">
                        <form onSubmit={submit}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-white px-8 py-3 text-sm font-bold text-white dark:text-zinc-900 shadow-lg transition-all duration-200 hover:bg-zinc-700 dark:hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Icons.Loader className="w-4 h-4 animate-spin" />
                                        Mengirim...
                                    </span>
                                ) : (
                                    "Kirim Ulang Email Verifikasi"
                                )}
                            </button>
                        </form>

                        <div className="flex justify-center">
                            <Link
                                href={logout()} // Menggunakan helper logout()
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                            >
                                <Icons.LogOut className="w-4 h-4" />
                                Keluar / Ganti Akun
                            </Link>
                        </div>
                    </div>

                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
                        Belum menerima email? Cek folder Spam.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}