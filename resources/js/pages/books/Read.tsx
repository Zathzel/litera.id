import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ReactReader } from 'react-reader'; 
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

// --- ICONS ---
const Icons = {
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ZoomIn: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
  ZoomOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7M5 12h14" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Bookmark: ({ solid }: { solid?: boolean }) => <svg className="w-5 h-5" fill={solid ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  // Icon Theme Background (Kotak/Layar)
  BgLight: () => <div className="w-5 h-5 rounded border border-gray-400 bg-gray-100"></div>,
  BgSepia: () => <div className="w-5 h-5 rounded border border-[#d4c5a0] bg-[#f4ecd8]"></div>,
  BgDark: () => <div className="w-5 h-5 rounded border border-gray-600 bg-gray-900"></div>,
};

export default function Read({ book, initialLocation, auth }: ReadProps) {
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
  const [activeTab, setActiveTab] = useState<'info' | 'bookmarks' | 'notes'>('info');
  const [showUI, setShowUI] = useState(true);
  
  // Theme state sekarang hanya mempengaruhi BACKGROUND APLIKASI
  // Nilai: 'light' (Gray), 'dark' (Black), 'sepia' (Creamy)
  const [bgTheme, setBgTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- FEATURES STATE ---
  const [readingTime, setReadingTime] = useState(0); 
  const [bookmarks, setBookmarks] = useState<(number | string)[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

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

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}j ${mins}m` : `${mins}m ${seconds % 60}d`;
  };

  // --- 3. EPUB FONT SIZE ---
  useEffect(() => {
    if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${epubFontSize}%`);
    }
  }, [epubFontSize]);

  // --- 4. DATA PERSISTENCE ---
  useEffect(() => {
    const b = localStorage.getItem(`bookmarks_${book.id}`);
    const n = localStorage.getItem(`notes_${book.id}`);
    if (b) setBookmarks(JSON.parse(b));
    if (n) setNotes(JSON.parse(n));
  }, [book.id]);

  const saveToLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
  const getCurrentLocation = () => isEpub ? epubLocation : pageNumber;
  const saveProgress = (loc: string | number) => axios.post(`/books/${book.id}/progress`, { cfi: loc.toString() }).catch(() => {});

  // --- 5. PAGE ACTIONS ---
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

  // --- BACKGROUND CLASS LOGIC ---
  // Ini hanya mengubah warna "Meja" di belakang kertas.
  // Kertas tetap putih.
  const getBgClass = () => {
      switch (bgTheme) {
          case 'sepia': return 'bg-[#e8dec0]'; // Warna meja kayu/krem
          case 'dark': return 'bg-[#1a1a1a]';  // Warna meja gelap
          default: return 'bg-gray-100';       // Warna meja standar
      }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
      <Head title={`Reading: ${book.title}`} />

      {/* === TOP BAR (Floating) === */}
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
                 <span className="text-sm font-medium hidden sm:inline">Kembali</span>
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

      {/* === MAIN READER AREA === */}
      <main className={`flex flex-col items-center justify-center min-h-screen w-full transition-all duration-300 ${sidebarOpen ? 'lg:pr-80' : ''}`}>
        
        <div className="relative w-full h-[calc(100vh)] flex items-center justify-center p-4 sm:p-8">
            
            {/* EPUB RENDERER */}
            {isEpub && (
                <div className="w-full max-w-4xl h-[85vh] shadow-2xl rounded-sm overflow-hidden bg-white relative ring-1 ring-black/5">
                    <ReactReader
                        url={book.file_url}
                        location={epubLocation}
                        locationChanged={onEpubLocationChanged}
                        getRendition={(rendition) => {
                            renditionRef.current = rendition;
                            // KITA PAKSA THEME LIGHT AGAR BUKU TETAP PUTIH
                            // Meskipun background app gelap/sepia.
                            rendition.themes.register('light', { body: { color: '#000', background: '#fff' } });
                            rendition.themes.select('light');
                            rendition.themes.fontSize(`${epubFontSize}%`);
                        }}
                        epubOptions={{ flow: 'paginated', width: '100%', height: '100%' }}
                    />
                </div>
            )}

            {/* PDF RENDERER */}
            {!isEpub && (
                <div className="shadow-2xl rounded-sm overflow-hidden transition-all duration-300 ring-1 ring-black/5">
                    <Document
                        file={book.file_url}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                            <div className="flex flex-col items-center text-gray-400">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white mb-4"></div>
                                <span>Memuat Dokumen...</span>
                            </div>
                        }
                        className="flex justify-center"
                    >
                        {/* BUG FIX: 
                            Tidak ada class filter (opacity/sepia) di sini. 
                            Halaman PDF akan selalu tampil original (background putih, teks hitam/warna asli).
                        */}
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            width={containerWidth}
                            className="bg-white" 
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                </div>
            )}
        </div>

      </main>

      {/* === BOTTOM CONTROLS (Floating) === */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
                
                {/* Navigation */}
                {!isEpub && (
                    <>
                        <button onClick={() => changePdfPage(-1)} disabled={pageNumber <= 1} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"><Icons.ChevronLeft /></button>
                        <span className="font-mono text-sm min-w-[80px] text-center font-bold">{pageNumber} / {numPages}</span>
                        <button onClick={() => changePdfPage(1)} disabled={pageNumber >= numPages} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"><Icons.ChevronRight /></button>
                        <div className="w-px h-6 bg-white/20 mx-2"></div>
                    </>
                )}

                {/* Theme Toggles (Hanya Ubah Background App) */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                    <button onClick={() => setBgTheme('light')} className={`p-1.5 rounded-md transition ${bgTheme === 'light' ? 'bg-white text-black' : 'hover:bg-white/10'}`} title="Background Terang"><Icons.BgLight /></button>
                    <button onClick={() => setBgTheme('sepia')} className={`p-1.5 rounded-md transition ${bgTheme === 'sepia' ? 'bg-[#f6eec9] text-[#5f4b32]' : 'hover:bg-white/10'}`} title="Background Sepia"><Icons.BgSepia /></button>
                    <button onClick={() => setBgTheme('dark')} className={`p-1.5 rounded-md transition ${bgTheme === 'dark' ? 'bg-gray-800 text-white' : 'hover:bg-white/10'}`} title="Background Gelap"><Icons.BgDark /></button>
                </div>

                <div className="w-px h-6 bg-white/20 mx-2"></div>

                {/* Tools */}
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
                    className="fixed top-0 right-0 bottom-0 w-80 z-50 shadow-2xl border-l flex flex-col bg-white text-gray-900 border-gray-200"
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                        <h2 className="font-bold text-lg flex items-center gap-2"><Icons.Menu /> Menu Baca</h2>
                        <button onClick={() => setSidebarOpen(false)} className="hover:text-red-500 transition"><Icons.X /></button>
                    </div>

                    {/* Sidebar Tabs */}
                    <div className="flex border-b border-gray-200">
                        {['info', 'bookmarks', 'notes'].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition ${activeTab === tab ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Sidebar Content: Info */}
                        {activeTab === 'info' && (
                            <div className="text-center space-y-4">
                                <div className="w-24 h-32 bg-gray-200 mx-auto rounded shadow-lg flex items-center justify-center overflow-hidden text-4xl">
                                    📖
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{book.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{book.author || 'Unknown Author'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <p className="text-xs font-bold uppercase text-gray-500 mb-1">Total Waktu Baca</p>
                                    <p className="text-2xl font-mono font-bold text-indigo-600">{formatTime(readingTime)}</p>
                                </div>
                            </div>
                        )}

                        {/* Sidebar Content: Bookmarks */}
                        {activeTab === 'bookmarks' && (
                            <div className="space-y-3">
                                {bookmarks.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm mt-10">Belum ada halaman yang ditandai.</p>
                                ) : bookmarks.map((loc, i) => (
                                    <button key={i} onClick={() => { if(!isEpub) setPageNumber(Number(loc)); else setEpubLocation(loc); }} className="w-full flex justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-sm font-medium border border-gray-100">
                                        <span>{isEpub ? `Lokasi #${i+1}` : `Halaman ${loc}`}</span>
                                        <Icons.ChevronRight />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Sidebar Content: Notes */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <textarea 
                                        value={currentNote} 
                                        onChange={e => setCurrentNote(e.target.value)} 
                                        placeholder="Tulis catatan..." 
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition text-sm resize-none"
                                        rows={3}
                                    />
                                    <button onClick={saveNote} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition">Simpan Catatan</button>
                                </div>
                                <div className="space-y-3">
                                    {notes.map((note, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-yellow-50 border border-yellow-100 relative group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold uppercase bg-yellow-100 px-1.5 rounded text-yellow-700">Hal. {note.page}</span>
                                                <span className="text-[10px] text-gray-400">{note.date}</span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-gray-700">{note.text}</p>
                                            <button onClick={() => { const n = notes.filter((_, idx) => idx !== i); setNotes(n); saveToLocal(`notes_${book.id}`, n); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 p-1 rounded transition"><Icons.Trash /></button>
                                        </div>
                                    ))}
                                </div>
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