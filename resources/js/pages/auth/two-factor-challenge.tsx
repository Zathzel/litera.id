import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

// --- IMPORT INPUT OTP (Functional Logic tetap dipakai untuk UX terbaik) ---
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';

// --- GLOBAL ROUTE TYPE ---
declare global {
    interface Window {
        route: (name: string, params?: any, absolute?: boolean) => string;
    }
}

// --- ICONS ---
const Icons = {
    ShieldCheck: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    Smartphone: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
    ),
    FileKey: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="16" r="2" /><path d="m16 10-4.5 4.5" /><path d="m15 11 1 1" /></svg>
    ),
    ArrowRight: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    ),
    Loader: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    ),
    RefreshCcw: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
    )
};

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const recoveryInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        code: '',
        recovery_code: '',
    });

    // Update form data when code (OTP) changes
    useEffect(() => {
        setData('code', code);
    }, [code]);

    // Auto-focus logic when switching modes
    useEffect(() => {
        if (showRecoveryInput && recoveryInputRef.current) {
            recoveryInputRef.current.focus();
        }
    }, [showRecoveryInput]);

    const toggleRecoveryMode = () => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
        setData({ code: '', recovery_code: '' });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(window.route('two-factor.login'));
    };

    const content = useMemo(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode Pemulihan',
                description: 'Masukkan kode pemulihan darurat Anda untuk mengakses akun.',
                icon: <Icons.FileKey className="w-10 h-10" />,
                color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
                toggleText: 'Gunakan Aplikasi Authenticator',
            };
        }
        return {
            title: 'Kode Autentikasi',
            description: 'Buka aplikasi authenticator Anda dan masukkan kode 6 digit.',
            icon: <Icons.Smartphone className="w-10 h-10" />,
            color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
            toggleText: 'Gunakan Kode Pemulihan',
        };
    }, [showRecoveryInput]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 relative overflow-hidden selection:bg-indigo-500/30">
            <Head title="Verifikasi Dua Langkah" />

            {/* --- BACKGROUND AMBIENCE --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply dark:mix-blend-screen"></div>
                {/* Tech Grid */}
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
                <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden flex flex-col">
                    
                    {/* Top Decor */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${showRecoveryInput ? 'from-amber-500 to-orange-500' : 'from-indigo-500 to-emerald-500'} transition-all duration-500`}></div>

                    {/* Header Section */}
                    <div className="text-center mb-8 space-y-4">
                        <motion.div 
                            key={showRecoveryInput ? 'recovery' : 'auth'}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${content.color} shadow-inner mb-2`}
                        >
                            {content.icon}
                        </motion.div>
                        
                        <motion.div
                            key={showRecoveryInput ? 'text-recovery' : 'text-auth'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {content.title}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 px-4 leading-relaxed">
                                {content.description}
                            </p>
                        </motion.div>
                    </div>

                    {/* Form Area */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="min-h-[100px] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {showRecoveryInput ? (
                                    <motion.div
                                        key="recovery-input"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full"
                                    >
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                                                <Icons.FileKey className="w-5 h-5" />
                                            </div>
                                            <input
                                                ref={recoveryInputRef}
                                                id="recovery_code"
                                                type="text"
                                                name="recovery_code"
                                                value={data.recovery_code}
                                                onChange={(e) => setData('recovery_code', e.target.value)}
                                                className={`flex h-12 w-full rounded-xl border bg-zinc-50 dark:bg-zinc-800/50 px-10 py-2 text-sm font-mono tracking-wider ring-offset-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 transition-all duration-200 ${errors.recovery_code ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                                placeholder="xxxxx-xxxxx-xxxxx"
                                                autoComplete="off"
                                            />
                                        </div>
                                        {errors.recovery_code && <p className="text-sm text-red-500 font-medium mt-2 text-center">{errors.recovery_code}</p>}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="otp-input"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center w-full"
                                    >
                                        {/* InputOTP styling wrapper to force center and spacing */}
                                        <div className="flex justify-center w-full">
                                            <InputOTP
                                                maxLength={OTP_MAX_LENGTH}
                                                value={code}
                                                onChange={setCode}
                                                pattern={REGEXP_ONLY_DIGITS}
                                                disabled={processing}
                                            >
                                                <InputOTPGroup className="gap-2 md:gap-3">
                                                    {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className={`w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl border rounded-md bg-zinc-50 dark:bg-zinc-800/50 transition-all duration-200 
                                                                ${errors.code ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}
                                                            `}
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                        {errors.code && <p className="text-sm text-red-500 font-medium mt-3 text-center">{errors.code}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 
                                    ${showRecoveryInput 
                                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20 focus-visible:ring-amber-500' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 focus-visible:ring-indigo-500'
                                    }`}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Icons.Loader className="w-4 h-4 animate-spin" />
                                        Memverifikasi...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Masuk
                                        <Icons.ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>

                            <div className="relative flex items-center justify-center pt-2">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white dark:bg-zinc-900 px-2 text-xs text-zinc-400 uppercase tracking-wider">Atau</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={toggleRecoveryMode}
                                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors py-2"
                            >
                                <Icons.RefreshCcw className="w-4 h-4" />
                                {content.toggleText}
                            </button>
                        </div>
                    </form>

                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
                    <Icons.ShieldCheck className="w-4 h-4" />
                    <p className="text-xs font-medium">Secure Authentication System</p>
                </div>
            </motion.div>
        </div>
    );
}