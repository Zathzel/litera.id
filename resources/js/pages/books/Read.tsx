import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ReactReader } from 'react-reader'; 
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// --- CONFIG WORKER ---
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- TYPES ---
interface User { name: string; email?: string; }
interface Book { id: number; title: string; author?: string; file_url: string; }
interface Note { page: number | string; text: string; date: string; }
interface ReadProps { book: Book; initialLocation?: number | string; auth: { user: User | null }; }

// --- ICONS (TETAP SAMA) ---
const Icons = {
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ZoomIn: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
  ZoomOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7M5 12h14" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Bookmark: ({ solid }: { solid?: boolean }) => <svg className="w-5 h-5" fill={solid ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Translate: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
  BgLight: () => <div className="w-5 h-5 rounded border border-gray-400 bg-gray-100"></div>,
  BgSepia: () => <div className="w-5 h-5 rounded border border-[#d4c5a0] bg-[#f4ecd8]"></div>,
  BgDark: () => <div className="w-5 h-5 rounded border border-gray-600 bg-gray-900"></div>,
};

export default function Read({ book, initialLocation, auth }: ReadProps) {
  // 2. PANGGIL HOOK
  const { t } = useTranslation();
  
  const isEpub = book.file_url.toLowerCase().endsWith('.epub');

  // --- CORE STATE ---
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(!isEpub ? Number(initialLocation) || 1 : 1);
  const [epubLocation, setEpubLocation] = useState<string | number>(isEpub ? (initialLocation || 0) : 0);
  const [scale, setScale] = useState(1.0);
  const [epubFontSize, setEpubFontSize] = useState(100);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const renditionRef = useRef<any>(null); 

  // --- UI & THEME STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'bookmarks' | 'notes' | 'translate'>('info');
  const [showUI, setShowUI] = useState(true);
  const [bgTheme, setBgTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- FEATURES STATE ---
  const [readingTime, setReadingTime] = useState(0); 
  const [bookmarks, setBookmarks] = useState<(number | string)[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  // --- TRANSLATION STATE ---
  const [selectedText, setSelectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState("id");

  // --- 1. HANDLE RESIZE & UI ---
  const resetUITimer = useCallback(() => {
    setShowUI(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => {
      if (!sidebarOpen) setShowUI(false);
    }, 3000); 
  }, [sidebarOpen]);

  useEffect(() => {
    const handleActivity = () => resetUITimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('resize', handleResize);
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    };
  }, [resetUITimer]);

  const handleResize = () => {
    const width = window.innerWidth;
    const sidebarW = sidebarOpen && width > 1024 ? 320 : 0;
    const available = width - sidebarW - 40;
    setContainerWidth(Math.min(900, available));
  };

  // --- 2. TIMER & UTILS ---
  useEffect(() => {
    const timer = setInterval(() => setReadingTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // [TRANSLATE] Format Time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    // h = hours, m = minutes, s = seconds (ambil dari JSON)
    return hrs > 0 
        ? `${hrs}${t("h")} ${mins}${t("m")}` 
        : `${mins}${t("m")} ${seconds % 60}${t("s")}`;
  };

  // --- 3. THEME HANDLER ---
  useEffect(() => {
    const root = document.documentElement;
    if (bgTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    
    // PERBAIKAN: JANGAN UBAH WARNA/THEME EPUB SAAT GANTI MODE
    // Hanya update font size agar isi buku tetap nyaman dibaca (Putih/Default)
    if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${epubFontSize}%`);
        
        // Opsional: Paksa tema 'light' jika ingin konsisten putih
        // renditionRef.current.themes.select('light'); 
    }
  }, [bgTheme, epubFontSize]);

  // --- 4. TRANSLATION LOGIC ---
  const handleTranslate = async (text: string) => {
      if (!text || text.trim().length === 0) return;
      
      setSidebarOpen(true);
      setActiveTab('translate');
      setIsTranslating(true);
      setSelectedText(text);
      setTranslatedText("");

      try {
          const response = await axios.get(`https://api.mymemory.translated.net/get`, {
              params: {
                  q: text,
                  langpair: `en|${targetLang}`,
              }
          });

          if (response.data && response.data.responseData) {
              setTranslatedText(response.data.responseData.translatedText);
          } else {
              setTranslatedText(t("Failed to translate."));
          }
      } catch (error) {
          console.error("Translation error:", error);
          setTranslatedText(t("Connection error."));
      } finally {
          setIsTranslating(false);
      }
  };

  useEffect(() => {
      const handleSelection = () => {
          const selection = window.getSelection();
          if (selection && selection.toString().trim().length > 0) {
              handleTranslate(selection.toString());
          }
      };

      if (!isEpub) {
          document.addEventListener('mouseup', handleSelection);
          return () => document.removeEventListener('mouseup', handleSelection);
      }
  }, [isEpub, targetLang]);

  // --- 5. DATA PERSISTENCE & ACTIONS ---
  useEffect(() => {
    const b = localStorage.getItem(`bookmarks_${book.id}`);
    const n = localStorage.getItem(`notes_${book.id}`);
    if (b) setBookmarks(JSON.parse(b));
    if (n) setNotes(JSON.parse(n));
  }, [book.id]);

  const saveToLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
  const getCurrentLocation = () => isEpub ? epubLocation : pageNumber;
  const saveProgress = (loc: string | number) => axios.post(`/books/${book.id}/progress`, { cfi: loc.toString() }).catch(() => {});

  const changePdfPage = (offset: number) => {
    setPageNumber(prev => {
      const next = prev + offset;
      if (next >= 1 && next <= numPages) {
        saveProgress(next);
        return next;
      }
      return prev;
    });
  };

  const onEpubLocationChanged = (loc: string | number) => {
    setEpubLocation(loc);
    saveProgress(loc);
  };

  const handleZoom = (dir: 'in' | 'out') => {
    if (isEpub) setEpubFontSize(p => dir === 'in' ? Math.min(p + 10, 200) : Math.max(p - 10, 50));
    else setScale(p => dir === 'in' ? Math.min(p + 0.5, 2.5) : Math.max(p - 0.1, 0.5));
  };

  const toggleBookmark = () => {
    const curr = getCurrentLocation();
    const next = bookmarks.includes(curr) ? bookmarks.filter(b => b !== curr) : [...bookmarks, curr];
    setBookmarks(next);
    saveToLocal(`bookmarks_${book.id}`, next);
  };

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const next = [...notes, { page: getCurrentLocation(), text: currentNote, date: new Date().toLocaleDateString() }];
    setNotes(next);
    saveToLocal(`notes_${book.id}`, next);
    setCurrentNote("");
  };

  const getBgClass = () => {
      switch (bgTheme) {
          case 'sepia': return 'bg-[#e8dec0]'; 
          case 'dark': return 'bg-[#1a1a1a]';  
          default: return 'bg-gray-100';       
      }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
      <Head title={`${t("Reading")}: ${book.title}`} />

      {/* === TOP BAR === */}
      <AnimatePresence>
        {showUI && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
          >
            <div className="pointer-events-auto">
               <Link 
                 href="/books" 
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition border border-white/10 shadow-lg"
               >
                 <Icons.ArrowLeft />
                 {/* [TRANSLATE] */}
                 <span className="text-sm font-medium hidden sm:inline">{t("Back")}</span>
               </Link>
            </div>

            <div className="pointer-events-auto flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-mono shadow-lg">
                  <Icons.Clock />
                  <span>{formatTime(readingTime)}</span>
               </div>
               <button 
                 onClick={() => setSidebarOpen(true)} 
                 className="p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition border border-white/10 relative shadow-lg"
               >
                 <Icons.Menu />
                 {(notes.length > 0 || bookmarks.length > 0) && <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>}
               </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* === MAIN READER === */}
      <main className={`flex flex-col items-center justify-center min-h-screen w-full transition-all duration-300 ${sidebarOpen ? 'lg:pr-80' : ''}`}>
        <div className="relative w-full h-[calc(100vh)] flex items-center justify-center p-4 sm:p-8">
            
            {isEpub && (
                <div className="w-full max-w-4xl h-[85vh] shadow-2xl rounded-sm overflow-hidden bg-white relative ring-1 ring-black/5">
                    <ReactReader
                        url={book.file_url}
                        location={epubLocation}
                        locationChanged={onEpubLocationChanged}
                        getRendition={(rendition) => {
                            renditionRef.current = rendition;
                            
                            // PERBAIKAN: Set Default Theme 'Light' sekali saja saat init
                            // agar background putih dan teks hitam (standar buku)
                            rendition.themes.register('light', { body: { color: '#000', background: '#fff' } });
                            rendition.themes.select('light');
                            rendition.themes.fontSize(`${epubFontSize}%`);
                            
                            rendition.on('selected', (cfiRange: any, contents: any) => {
                                const selection = contents.window.getSelection();
                                handleTranslate(selection.toString());
                                contents.window.getSelection().removeAllRanges(); 
                            });
                        }}
                        epubOptions={{ flow: 'paginated', width: '100%', height: '100%' }}
                    />
                </div>
            )}

            {!isEpub && (
                <div className="shadow-2xl rounded-sm overflow-hidden transition-all duration-300 ring-1 ring-black/5">
                    <Document
                        file={book.file_url}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                            <div className="flex flex-col items-center text-gray-400">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white mb-4"></div>
                                {/* [TRANSLATE] */}
                                <span>{t("Loading Document...")}</span>
                            </div>
                        }
                        className="flex justify-center"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            width={containerWidth}
                            className="bg-white" 
                            renderTextLayer={true} 
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>
            )}
        </div>
      </main>

      {/* === BOTTOM CONTROLS === */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
                
                {!isEpub && (
                    <>
                        <button onClick={() => changePdfPage(-1)} disabled={pageNumber <= 1} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"><Icons.ChevronLeft /></button>
                        <span className="font-mono text-sm min-w-[80px] text-center font-bold">{pageNumber} / {numPages}</span>
                        <button onClick={() => changePdfPage(1)} disabled={pageNumber >= numPages} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"><Icons.ChevronRight /></button>
                        <div className="w-px h-6 bg-white/20 mx-2"></div>
                    </>
                )}

                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                    <button onClick={() => setBgTheme('light')} className={`p-1.5 rounded-md transition ${bgTheme === 'light' ? 'bg-white text-black' : 'hover:bg-white/10'}`}><Icons.BgLight /></button>
                    <button onClick={() => setBgTheme('sepia')} className={`p-1.5 rounded-md transition ${bgTheme === 'sepia' ? 'bg-[#f4ecd8] text-[#5f4b32]' : 'hover:bg-white/10'}`}><Icons.BgSepia /></button>
                    <button onClick={() => setBgTheme('dark')} className={`p-1.5 rounded-md transition ${bgTheme === 'dark' ? 'bg-gray-800 text-white' : 'hover:bg-white/10'}`}><Icons.BgDark /></button>
                </div>

                <div className="w-px h-6 bg-white/20 mx-2"></div>

                <button onClick={() => handleZoom('out')} className="p-2 hover:bg-white/20 rounded-full transition"><Icons.ZoomOut /></button>
                <button onClick={() => handleZoom('in')} className="p-2 hover:bg-white/20 rounded-full transition"><Icons.ZoomIn /></button>
                <button onClick={toggleBookmark} className={`p-2 hover:bg-white/20 rounded-full transition ${bookmarks.includes(getCurrentLocation()) ? 'text-yellow-400' : ''}`}>
                    <Icons.Bookmark solid={bookmarks.includes(getCurrentLocation())} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SIDEBAR === */}
      <AnimatePresence>
        {sidebarOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />
                <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={`fixed top-0 right-0 bottom-0 w-80 z-50 shadow-2xl border-l flex flex-col ${
                        bgTheme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 
                        bgTheme === 'sepia' ? 'bg-[#f4ecd8] border-[#e0d6b9] text-[#433422]' : 
                        'bg-white border-gray-200 text-gray-900'
                    }`}
                >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-inherit">
                        {/* [TRANSLATE] */}
                        <h2 className="font-bold text-lg flex items-center gap-2"><Icons.Menu /> {t("Reading Menu")}</h2>
                        <button onClick={() => setSidebarOpen(false)} className="hover:text-red-500 transition"><Icons.X /></button>
                    </div>

                    <div className="flex border-b border-inherit overflow-x-auto">
                        {['info', 'bookmarks', 'notes', 'translate'].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 min-w-[70px] py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition ${activeTab === tab ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                {/* [TRANSLATE] Capitalize Key for Translation */}
                                {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* TAB: INFO */}
                        {activeTab === 'info' && (
                            <div className="text-center space-y-4">
                                <div className="w-24 h-32 bg-gray-200 mx-auto rounded shadow-lg flex items-center justify-center overflow-hidden text-4xl">📖</div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                                    <p className="text-sm opacity-70 mt-1">{book.author || t("Unknown Author")}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    {/* [TRANSLATE] */}
                                    <p className="text-xs font-bold uppercase opacity-60 mb-1">{t("Total Reading Time")}</p>
                                    <p className="text-2xl font-mono font-bold text-indigo-500">{formatTime(readingTime)}</p>
                                </div>
                            </div>
                        )}

                        {/* TAB: TRANSLATE */}
                        {activeTab === 'translate' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    {/* [TRANSLATE] */}
                                    <h3 className="font-bold text-sm">{t("Translator")}</h3>
                                    <select 
                                        value={targetLang} 
                                        onChange={(e) => setTargetLang(e.target.value)}
                                        className="text-xs p-1 rounded bg-transparent border border-inherit focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="id">Indonesia</option>
                                        <option value="en">English</option>
                                        <option value="ja">Japan</option>
                                        <option value="es">Spain</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    {/* [TRANSLATE] */}
                                    <label className="text-xs font-bold uppercase opacity-60">{t("Original Text")}</label>
                                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit text-sm italic min-h-[60px]">
                                        {/* [TRANSLATE] */}
                                        {selectedText || t("Select text in the book to translate...")}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <Icons.ArrowLeft />
                                </div>

                                <div className="space-y-2">
                                    {/* [TRANSLATE] */}
                                    <label className="text-xs font-bold uppercase opacity-60">{t("Translation")}</label>
                                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-sm font-medium min-h-[60px]">
                                        {isTranslating ? (
                                            <span className="flex items-center gap-2 animate-pulse">
                                                {/* [TRANSLATE] */}
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div> {t("Translating...")}
                                            </span>
                                        ) : (
                                            /* [TRANSLATE] */
                                            translatedText || t("Translation result will appear here.")
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] opacity-50 text-center">Powered by MyMemory API (Demo)</p>
                            </div>
                        )}

                        {/* TAB: BOOKMARKS */}
                        {activeTab === 'bookmarks' && (
                            <div className="space-y-3">
                                {bookmarks.map((loc, i) => (
                                    <button key={i} onClick={() => { if(!isEpub) setPageNumber(Number(loc)); else setEpubLocation(loc); }} className="w-full flex justify-between p-3 rounded-lg bg-black/5 hover:bg-black/10 transition text-sm font-medium">
                                        {/* [TRANSLATE] */}
                                        <span>{isEpub ? `${t("Location")} #${i+1}` : `${t("Page")} ${loc}`}</span>
                                        <Icons.ChevronRight />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* TAB: NOTES */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <textarea 
                                        value={currentNote} 
                                        onChange={e => setCurrentNote(e.target.value)} 
                                        // [TRANSLATE]
                                        placeholder={t("Write a note...")} 
                                        className="w-full p-3 rounded-xl bg-transparent border border-inherit focus:ring-2 focus:ring-indigo-500 transition text-sm resize-none"
                                        rows={3}
                                    />
                                    {/* [TRANSLATE] */}
                                    <button onClick={saveNote} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition">{t("Save Note")}</button>
                                </div>
                                {notes.map((note, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-yellow-100/50 border border-yellow-500/20 relative group">
                                        <p className="text-sm leading-relaxed opacity-90">{note.text}</p>
                                        <button onClick={() => { const n = notes.filter((_, idx) => idx !== i); setNotes(n); saveToLocal(`notes_${book.id}`, n); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 p-1"><Icons.Trash /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

    </div>
  );
}