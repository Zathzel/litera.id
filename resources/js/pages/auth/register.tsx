import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

// --- IMPORTS DARI LOGIC ---
import { Form } from '@inertiajs/react';
import { login } from '@/routes';
import { store } from '@/routes/register';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// --- GLOBAL TYPE ---
declare global {
    interface Window {
        route: (name: string, params?: any, absolute?: boolean) => string;
    }
}

// --- ICONS (TETAP SAMA) ---
const Icons = {
    User: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Mail: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    Lock: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" y1="11" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    ),
    ShieldCheck: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
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

// --- ANIMATED ILLUSTRATION (TETAP SAMA) ---
const AnimatedBook = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-zinc-900">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]"
            />

            <svg viewBox="0 0 400 400" className="w-full max-w-md h-auto relative z-10 drop-shadow-2xl">
                {[...Array(5)].map((_, i) => (
                    <motion.circle 
                        key={i}
                        cx={200 + (i * 30 - 60)} 
                        cy={150} 
                        r={2 + (i % 3)} 
                        fill="white"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ 
                            opacity: [0, 1, 0], 
                            y: -100 - (i * 20),
                            x: Math.sin(i) * 20 
                        }}
                        transition={{ 
                            duration: 3 + i, 
                            repeat: Infinity, 
                            delay: i * 0.5, 
                            ease: "easeOut" 
                        }}
                    />
                ))}

                <motion.g 
                    initial={{ y: 10 }} 
                    animate={{ y: -10 }} 
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                >
                    <motion.path
                        d="M60 300 C 60 300, 180 300, 200 320 C 220 300, 340 300, 340 300 V 100 C 340 100, 220 100, 200 120 C 180 100, 60 100, 60 100 Z"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M200 320 V 120"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    />
                    <motion.path d="M80 140 H 180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.0 }} />
                    <motion.path d="M80 160 H 180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.1 }} />
                    <motion.path d="M80 180 H 160" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.2 }} />
                    <motion.path d="M220 140 H 320" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.3 }} />
                    <motion.path d="M220 160 H 320" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.4 }} />
                    <motion.path d="M220 180 H 280" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.5 }} />
                </motion.g>

                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.2 }}></div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function Register() {
    // 2. PANGGIL HOOK
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black selection:bg-indigo-500/30">
            {/* [TRANSLATE] */}
            <Head title={t("Create New Account")} />

            {/* --- LEFT COLUMN: ARTWORK / BRANDING --- */}
            <div className="hidden lg:flex relative flex-col justify-between bg-zinc-900 text-white overflow-hidden">
                <AnimatedBook />
                
                <div className="absolute top-12 left-12 z-20 flex items-center gap-3 text-2xl font-bold tracking-tight pointer-events-none">
                    <div className="w-10 h-10 bg-white text-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">L</div>
                    Litera.id
                </div>

                <div className="absolute bottom-12 left-12 z-20 max-w-lg pointer-events-none">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-serif leading-relaxed text-zinc-200">
                            {/* [TRANSLATE] */}
                            "{t("The only thing that you absolutely have to know, is the location of the library.")}"
                        </p>
                        <footer className="flex items-center gap-4 pt-4">
                            <div className="h-px w-8 bg-indigo-500/50"></div>
                            <div className="text-sm font-medium text-indigo-200">
                                Albert Einstein
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* --- RIGHT COLUMN: FORM AREA --- */}
            <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative bg-white dark:bg-zinc-950">
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
                            {/* [TRANSLATE] */}
                            {t("Start Your Journey")}
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-500 dark:text-zinc-400"
                        >
                            {/* [TRANSLATE] */}
                            {t("Join the largest community of readers today.")}
                        </motion.p>
                    </div>

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Name Input */}
                                    <div className="space-y-2">
                                        {/* [TRANSLATE] */}
                                        <Label htmlFor="name" className="text-sm font-medium leading-none">{t("Full Name")}</Label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                <Icons.User className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                placeholder="John Doe"
                                                className="pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2">
                                        {/* [TRANSLATE] */}
                                        <Label htmlFor="email" className="text-sm font-medium leading-none">{t("Email")}</Label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                <Icons.Mail className="w-5 h-5" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                placeholder="nama@email.com"
                                                className="pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Group */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            {/* [TRANSLATE] */}
                                            <Label htmlFor="password" className="text-sm font-medium leading-none">{t("Password")}</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                    <Icons.Lock className="w-5 h-5" />
                                                </div>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
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

                                        {/* Confirm Password Input */}
                                        <div className="space-y-2">
                                            {/* [TRANSLATE] */}
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium leading-none">{t("Confirm")}</Label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                                    <Icons.ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <Input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="password_confirmation"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                                                >
                                                    {showConfirmPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        tabIndex={5}
                                        className="w-full h-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95 mt-4"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4" />
                                                {/* [TRANSLATE] */}
                                                {t("Creating Account...")}
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                {/* [TRANSLATE] */}
                                                {t("Register Now")}
                                                <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>

                                    {/* Login Link */}
                                    <div className="text-center text-sm pt-2">
                                        {/* [TRANSLATE] */}
                                        <span className="text-zinc-500 dark:text-zinc-400">{t("Already have an account?")} </span>
                                        <TextLink
                                            href={login()}
                                            tabIndex={6}
                                            className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-all"
                                        >
                                            {/* [TRANSLATE] */}
                                            {t("Login here")}
                                        </TextLink>
                                    </div>
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
        </div>
    );
}