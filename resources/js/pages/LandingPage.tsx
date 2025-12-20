import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from "framer-motion";
import { Link } from "@inertiajs/react";
import PublicLayout from "@/layouts/public/PublicLayout";
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// ==========================================
// 1. SUB-COMPONENTS & ASSETS
// ==========================================

// --- 3D BOOK COMPONENT (HERO) ---
const Book3D = () => {
  // 2. PANGGIL HOOK DI SUB-COMPONENT
  const { t } = useTranslation();
  
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * 32.5;
    const mouseY = (e.clientY - rect.top) * 32.5;
    const rX = (mouseY / height - 32.5 / 2) * -1;
    const rY = (mouseX / width - 32.5 / 2);
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", transform }}
        className="relative w-64 h-80 md:w-80 md:h-[480px] cursor-pointer"
    >
        {/* Book Spine (Back) */}
        <div className="absolute inset-0 bg-gray-900 rounded-r-xl transform translate-z-[-20px]" style={{ transform: 'translateZ(-25px)' }}></div>
        
        {/* Book Pages */}
        <div className="absolute top-1 bottom-1 right-2 w-[40px] bg-white rounded-r-md" style={{ transform: 'rotateY(90deg) translateZ(-20px)' }}></div>
        <div className="absolute top-1 bottom-1 right-2 w-full bg-white border-l border-gray-200 rounded-r-sm" style={{ transform: 'translateZ(-20px)' }}></div>

        {/* Book Cover (Front) */}
        <div className="absolute inset-0 bg-indigo-600 rounded-r-xl shadow-2xl overflow-hidden flex flex-col justify-between p-6 border-l-4 border-white/10" style={{ transform: 'translateZ(25px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            <div className="space-y-4 z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
                <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">
                    {/* [TRANSLATE] Stylized Text */}
                    {t("FUTURE")}<br/>{t("READER")}
                </h3>
            </div>
            <div className="z-10">
                <div className="h-px w-full bg-white/30 mb-4"></div>
                <p className="text-indigo-100 text-sm font-mono">{t("EDITION")} 2025</p>
                <p className="text-white font-bold text-lg mt-1">Litera.id</p>
            </div>
            
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
        </div>
    </motion.div>
  );
};

// --- SPOTLIGHT CARD (BENTO GRID) ---
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- ICONS ---
const Icons = {
    Library: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Lightning: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Shield: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Device: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function LandingPage() {
  // 3. PANGGIL HOOK DI MAIN COMPONENT
  const { t } = useTranslation();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <PublicLayout>
      <div className="relative bg-white dark:bg-black overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-500">
        
        {/* --- DYNAMIC BACKGROUND --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Floating Orbs */}
            <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            <motion.div style={{ y: y2 }} className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        </div>

        {/* --- SECTION 1: HERO (IMPACT) --- */}
        <section className="relative z-10 min-h-screen flex items-center pt-20">
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 backdrop-blur-md shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        {/* [TRANSLATE] Badge */}
                        <span className="text-xs font-bold tracking-wide uppercase text-indigo-600 dark:text-indigo-300">{t("Future Reading Platform")}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                        {/* [TRANSLATE] Headline */}
                        {t("Knowledge")} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
                            {t("Limitless.")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                        {/* [TRANSLATE] Sub-headline */}
                        {t("Access thousands of digital books, mark progress, and enjoy a reading experience designed for your visual comfort.")}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/books" className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            <span className="relative z-10 flex items-center gap-2">
                                {/* [TRANSLATE] Button 1 */}
                                {t("Start Reading")} 
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </Link>
                        <Link href="/register" className="px-8 py-4 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            {/* [TRANSLATE] Button 2 */}
                            {t("Sign Up Free")}
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {t("User")}
                                </div>
                            ))}
                        </div>
                        {/* [TRANSLATE] Social Proof */}
                        <p>{t("Join 2,000+ other readers.")}</p>
                    </div>
                </motion.div>

                {/* 3D Visual */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex justify-center perspective-1000"
                >
                    <div className="relative">
                        {/* Glow Behind Book */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[150px] opacity-40 animate-pulse"></div>
                        <Book3D />
                    </div>
                </motion.div>

            </div>
        </section>

        {/* --- SECTION 2: BENTO GRID FEATURES --- */}
        <section className="relative z-10 py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">{t("More than just an E-Reader")}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{t("We combine the simplicity of physical books with the sophistication of digital technology.")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Large Card */}
                    <SpotlightCard className="md:col-span-2 rounded-3xl p-8 md:p-12">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <Icons.Library />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4">{t("Pocket Library")}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {t("Carry thousands of books anywhere. Our management system allows you to categorize, search, and filter favorite books in milliseconds.")}
                                </p>
                            </div>
                            {/* Visual Decoration */}
                            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none rounded-r-3xl"></div>
                        </div>
                    </SpotlightCard>

                    {/* Tall Card */}
                    <SpotlightCard className="md:row-span-2 rounded-3xl p-8 md:p-12 bg-gray-900 text-white dark:border-gray-700">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6">
                                <Icons.Lightning />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{t("Instant Access")}</h3>
                            <p className="text-gray-300 leading-relaxed mb-8">
                                {t("No waiting for delivery. Click, open, and start reading instantly. Our caching technology ensures books open lightning fast.")}
                            </p>
                            <div className="mt-auto relative w-full h-40 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                <div className="absolute top-4 left-4 right-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ width: ["0%", "100%"] }} 
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                                <div className="absolute top-10 left-4 w-3/4 h-2 bg-gray-700 rounded-full"></div>
                                <div className="absolute top-16 left-4 w-1/2 h-2 bg-gray-700 rounded-full"></div>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Small Card 1 */}
                    <SpotlightCard className="rounded-3xl p-8">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-4">
                            <Icons.Device />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("Multi-Device")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("Automatic synchronization between Mobile, Tablet, and Desktop.")}</p>
                    </SpotlightCard>

                    {/* Small Card 2 */}
                    <SpotlightCard className="rounded-3xl p-8">
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 mb-4">
                            <Icons.Shield />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t("Focus Mode")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("UI that disappears while you read for maximum focus.")}</p>
                    </SpotlightCard>
                </div>
            </div>
        </section>

        {/* --- SECTION 3: CALL TO ACTION --- */}
        <section className="relative py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-black dark:bg-indigo-950 shadow-2xl px-6 py-20 md:px-20 text-center">
                    
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-50"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-50"></div>

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            {t("Start Your New Chapter Today.")}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            {t("Join the community of smart readers. Free to start, no credit card required.")}
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/register" className="inline-block px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] transition-shadow">
                                {t("Create Free Account")}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </PublicLayout>
  );
}