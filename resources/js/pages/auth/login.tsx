import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS DARI LOGIC BARU ---
import { Form } from '@inertiajs/react'; 
import { store } from '@/routes/login';
import { register } from '@/routes';
import { request } from '@/routes/password';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// --- GLOBAL TYPE ---
declare global {
    interface Window {
        route: (name: string, params?: any, absolute?: boolean) => string;
    }
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

// --- ICONS ---
const Icons = {
    Mail: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    Lock: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" y1="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    ),
    Eye: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    EyeOff: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
    ),
    ArrowRight: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )
};

// --- ANIMATED ILLUSTRATION ---
const AnimatedBook = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-zinc-900">
            {/* 1. Background Gradient Blob */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"
            />

            <svg viewBox="0 0 400 400" className="w-full max-w-md h-auto relative z-10 drop-shadow-2xl">
                {/* 2. Floating Elements (Particles) */}
                {[...Array(6)].map((_, i) => (
                    <motion.rect 
                        key={i}
                        x={150 + (i * 40 - 80)} 
                        y={200} 
                        width={4}
                        height={4}
                        fill="white"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ 
                            opacity: [0, 0.8, 0], 
                            y: -120 - (i * 15),
                            rotate: i * 45
                        }}
                        transition={{ 
                            duration: 4 + i, 
                            repeat: Infinity, 
                            delay: i * 0.3, 
                            ease: "easeOut" 
                        }}
                    />
                ))}

                {/* 3. The Book (Stroke Animation) */}
                <motion.g 
                    initial={{ y: 10 }} 
                    animate={{ y: -10 }} 
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                >
                    <motion.path
                        d="M60 300 C 60 300, 180 300, 200 320 C 220 300, 340 300, 340 300 V 100 C 340 100, 220 100, 200 120 C 180 100, 60 100, 60 100 Z"
                        fill="none"
                        stroke="url(#gradient-login)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M200 320 V 120"
                        stroke="url(#gradient-login)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    />
                    <motion.path d="M80 140 H 180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.0, repeat: Infinity, repeatDelay: 5 }} />
                    <motion.path d="M80 160 H 180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.2, repeat: Infinity, repeatDelay: 5 }} />
                    <motion.path d="M220 140 H 320" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.4, repeat: Infinity, repeatDelay: 5 }} />
                </motion.g>

                <defs>
                    <linearGradient id="gradient-login" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.2 }}></div>
        </div>
    );
};

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black selection:bg-purple-500/30">
            <Head title="Masuk ke Akun" />

            {/* --- LEFT COLUMN: FORM AREA --- */}
            <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative bg-white dark:bg-zinc-950">
                {/* Mobile Logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">L</div>
                        Litera.id
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Header Text */}
                    <div className="space-y-2 text-center lg:text-left">
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight"
                        >
                            Selamat Datang Kembali
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-500 dark:text-zinc-400"
                        >
                            Masukkan detail akun Anda untuk melanjutkan membaca.
                        </motion.p>
                    </div>

                    {/* Status Message */}
                    <AnimatePresence>
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800"
                            >
                                {status}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* FORM COMPONENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                <Icons.Mail className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="nama@email.com"
                                                className="pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    tabIndex={4}
                                                >
                                                    Lupa password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                <Icons.Lock className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        tabIndex={3}
                                        className="relative w-full h-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Masuk
                                                <Icons.ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>

                                    {/* Register Link */}
                                    {canRegister && (
                                        <div className="text-center text-sm">
                                            <span className="text-zinc-500 dark:text-zinc-400">Belum punya akun? </span>
                                            <TextLink
                                                href={register()}
                                                className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-all"
                                                tabIndex={5}
                                            >
                                                Daftar Sekarang
                                            </TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </motion.div>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 text-xs text-zinc-400 dark:text-zinc-500 flex gap-4">
                    <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Terms of Service</a>
                </div>
            </div>

            {/* --- RIGHT COLUMN: ANIMATED ARTWORK --- */}
            <div className="hidden lg:flex relative flex-col justify-between bg-zinc-900 text-white overflow-hidden">
                <AnimatedBook />
                
                {/* Branding Overlay */}
                <div className="absolute top-12 left-12 z-20 flex items-center gap-3 text-2xl font-bold tracking-tight pointer-events-none">
                    <div className="w-10 h-10 bg-white text-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">L</div>
                    Litera.id
                </div>

                {/* Quote Overlay */}
                <div className="absolute bottom-12 left-12 z-20 max-w-lg pointer-events-none">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-serif leading-relaxed text-zinc-200">
                            "Aku selalu membayangkan bahwa Surga itu pastilah sejenis perpustakaan."
                        </p>
                        <footer className="flex items-center gap-4 pt-4">
                            <div className="h-px w-8 bg-purple-500/50"></div>
                            <div className="text-sm font-medium text-purple-200">
                                Jorge Luis Borges
                                <span className="block text-xs text-zinc-500 font-normal">Penulis & Penyair</span>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}