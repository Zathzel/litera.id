import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '../../components/Navbar'; // Import Navbar Anda langsung
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- CONFIG WORKER (VITE) ---
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// --- CSS REACT-PDF ---
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- TIPE DATA ---
interface User {
  name: string;
  email?: string;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  file_url: string;
}

interface Note {
  page: number;
  text: string;
  date: string;
}

interface ReadProps {
  book: Book;
  initialLocation?: number;
  auth: { user: User | null }; // Props auth diperlukan untuk Navbar
}

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
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
};

export default function Read({ book, initialLocation, auth }: ReadProps) {
  // --- CORE STATE ---
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(Number(initialLocation) || 1);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  
  // --- UI STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'bookmarks' | 'notes' | 'search'>('info');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- FEATURES STATE ---
  const [readingTime, setReadingTime] = useState(0); // Detik
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  // --- 1. INITIALIZATION & RESIZE ---
  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      // Jika sidebar terbuka di desktop, kurangi area konten
      const sidebarWidth = sidebarOpen && width > 1024 ? 320 : 0;
      const availableWidth = width - sidebarWidth - 60; 
      
      if (availableWidth < 600) setContainerWidth(availableWidth);
      else setContainerWidth(Math.min(900, availableWidth));
    };
    
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, [sidebarOpen]);

  // --- 2. READING TIMER (Statistik) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}j ${mins}m`;
    return `${mins}m ${seconds % 60}d`;
  };

  // --- 3. DATA PERSISTENCE (Local Storage) ---
  useEffect(() => {
    const storedBookmarks = localStorage.getItem(`bookmarks_${book.id}`);
    const storedNotes = localStorage.getItem(`notes_${book.id}`);
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, [book.id]);

  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- 4. LOGIC HANDLERS ---

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const saveProgress = (page: number) => {
    // Kirim ke backend
    axios.post(`/books/${book.id}/progress`, { cfi: page.toString() }).catch(() => {});
  };

  const changePage = (offset: number) => {
    setPageNumber(prev => {
      const newPage = prev + offset;
      if (newPage >= 1 && newPage <= numPages) {
        saveProgress(newPage);
        return newPage;
      }
      return prev;
    });
  };

  const jumpToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
        setPageNumber(page);
        saveProgress(page);
        if (window.innerWidth < 1024) setSidebarOpen(false); // Tutup sidebar di mobile
    }
  }

  const toggleBookmark = () => {
    let newBookmarks;
    if (bookmarks.includes(pageNumber)) {
      newBookmarks = bookmarks.filter(b => b !== pageNumber);
    } else {
      newBookmarks = [...bookmarks, pageNumber].sort((a, b) => a - b);
    }
    setBookmarks(newBookmarks);
    saveToLocal(`bookmarks_${book.id}`, newBookmarks);
  };

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const newNote = { page: pageNumber, text: currentNote, date: new Date().toLocaleDateString() };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    saveToLocal(`notes_${book.id}`, newNotes);
    setCurrentNote("");
  };

  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    saveToLocal(`notes_${book.id}`, newNotes);
  }

  return (
    // HAPUS PUBLIC LAYOUT, GUNAKAN NAVBAR LANGSUNG
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Head title={`Membaca: ${book.title}`} />
      
      {/* === 1. NAVBAR === */}
      {/* Kita pasang Navbar di sini. Dia fixed position, jadi konten di bawah perlu padding-top */}
      <Navbar auth={auth} />

      {/* === 2. MAIN CONTENT AREA === */}
      {/* pt-24 untuk memberi jarak dari Navbar */}
      <div className={`pt-24 pb-24 min-h-screen flex transition-all duration-300 ${sidebarOpen ? 'lg:pr-80' : ''}`}>
         
         <div className="flex-1 flex flex-col items-center relative">
            
            {/* Toolbar Atas (Judul & Zoom) - Floating Glass */}
            {!isFullscreen && (
                <motion.div 
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="sticky top-24 z-30 flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
                >
                    <h1 className="font-bold text-sm truncate max-w-[150px] md:max-w-xs">{book.title}</h1>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="hover:text-indigo-500"><Icons.ZoomOut /></button>
                        <span className="text-xs font-mono font-bold min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="hover:text-indigo-500"><Icons.ZoomIn /></button>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className={`hidden md:block p-1 rounded-md transition ${sidebarOpen ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <Icons.Menu />
                    </button>
                </motion.div>
            )}

            {/* PDF Document Container */}
            <div className={`relative transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900 flex items-center justify-center overflow-auto' : ''}`}>
               
               {isFullscreen && (
                  <button onClick={() => setIsFullscreen(false)} className="fixed top-6 right-6 z-50 text-white bg-black/50 p-3 rounded-full hover:bg-black/80 shadow-lg">
                     <Icons.X />
                  </button>
               )}

               <Document
                  file={book.file_url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                     <div className="flex flex-col items-center justify-center h-96 w-full text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                        <p className="animate-pulse">Memuat Halaman...</p>
                     </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center h-64 w-full max-w-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <p className="text-red-500 font-bold mb-2">Gagal memuat PDF</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cek koneksi internet atau pastikan file PDF valid.</p>
                    </div>
                  }
                  className="shadow-2xl rounded-sm overflow-hidden"
               >
                  <Page 
                     pageNumber={pageNumber} 
                     scale={scale} 
                     width={isFullscreen ? undefined : containerWidth}
                     height={isFullscreen ? window.innerHeight : undefined}
                     className="bg-white"
                     renderTextLayer={true} 
                     renderAnnotationLayer={true}
                  />
               </Document>
            </div>

            {/* Bottom Floating Controls (Navigasi Halaman) */}
            {!isFullscreen && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl border flex items-center gap-6 z-30 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 backdrop-blur-md"
              >
                <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="hover:text-indigo-500 disabled:opacity-30 transition"><Icons.ChevronLeft /></button>
                
                {/* Page Input */}
                <div className="flex items-center gap-2 font-mono text-sm px-2">
                    <input 
                        type="number" 
                        value={pageNumber} 
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= numPages) {
                                setPageNumber(val);
                                saveProgress(val);
                            }
                        }}
                        className="w-10 bg-transparent text-center font-bold border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none p-0"
                    />
                    <span className="text-gray-400">/ {numPages}</span>
                </div>

                <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="hover:text-indigo-500 disabled:opacity-30 transition"><Icons.ChevronRight /></button>
                
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

                {/* Quick Bookmark */}
                <button onClick={toggleBookmark} className={`transition ${bookmarks.includes(pageNumber) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                  <Icons.Bookmark solid={bookmarks.includes(pageNumber)} />
                </button>

                {/* Mobile Menu Trigger */}
                <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-indigo-500">
                    <Icons.Menu />
                </button>
              </motion.div>
            )}
         </div>
      </div>

      {/* === 3. SIDEBAR (FEATURES) === */}
      <AnimatePresence>
        {sidebarOpen && (
           <>
             {/* Backdrop Mobile */}
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSidebarOpen(false)}
               className="fixed inset-0 bg-black/30 z-40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none"
             />

             {/* Sidebar Panel */}
             <motion.div
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 bottom-0 w-80 z-50 shadow-2xl border-l bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex flex-col pt-20" // pt-20 agar tidak tertutup navbar
             >
               {/* Sidebar Header */}
               <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="font-bold text-lg">Menu Baca</h2>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-red-500 transition"><Icons.X /></button>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-gray-200 dark:border-gray-800">
                  {['info', 'bookmarks', 'notes', 'search'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)} 
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === tab ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        {tab === 'bookmarks' ? 'Tanda' : tab === 'notes' ? 'Catatan' : tab === 'search' ? 'Cari' : 'Info'}
                      </button>
                  ))}
               </div>

               {/* Content Scrollable */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* --- TAB: INFO (d) --- */}
                  {activeTab === 'info' && (
                     <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Statistik Sesi Ini</h3>
                           
                           <div className="flex items-center gap-4 mb-4">
                              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                  <Icons.Clock />
                              </div>
                              <div>
                                  <p className="text-2xl font-bold leading-none">{formatTime(readingTime)}</p>
                                  <p className="text-xs text-gray-500 mt-1">Waktu dibaca</p>
                              </div>
                           </div>

                           <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Progress</span>
                                    <span>{Math.round((pageNumber / numPages) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(pageNumber / numPages) * 100}%` }}></div>
                                </div>
                           </div>
                        </div>

                        {/* Book Details */}
                        <div className="space-y-2">
                           <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Tentang Buku</h3>
                           <p className="font-medium">{book.title}</p>
                           <p className="text-sm text-gray-500">Penulis: {book.author || '-'}</p>
                           <p className="text-sm text-gray-500">Total: {numPages} Halaman</p>
                        </div>
                        
                        <button onClick={() => setIsFullscreen(true)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition">
                           Mode Layar Penuh (Zen)
                        </button>
                     </div>
                  )}

                  {/* --- TAB: BOOKMARKS (b) --- */}
                  {activeTab === 'bookmarks' && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Halaman Ditandai</h3>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{bookmarks.length}</span>
                        </div>
                        {bookmarks.length === 0 ? (
                           <div className="text-center py-10 text-gray-400">
                               <Icons.Bookmark />
                               <p className="text-sm mt-2">Belum ada halaman yang ditandai.</p>
                           </div>
                        ) : (
                           <div className="space-y-2">
                               {bookmarks.map(page => (
                                  <button key={page} onClick={() => jumpToPage(page)} className="w-full group flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Halaman {page}</span>
                                     <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition"><Icons.ChevronRight /></span>
                                  </button>
                               ))}
                           </div>
                        )}
                     </div>
                  )}

                  {/* --- TAB: NOTES (c) --- */}
                  {activeTab === 'notes' && (
                     <div className="space-y-6">
                        {/* Input Note */}
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase text-gray-500">Catatan untuk Hal. {pageNumber}</label>
                           <textarea 
                              value={currentNote}
                              onChange={(e) => setCurrentNote(e.target.value)}
                              placeholder="Tulis pemikiran Anda di sini..."
                              className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                              rows={3}
                           />
                           <button 
                                onClick={saveNote} 
                                disabled={!currentNote.trim()}
                                className="w-full py-2 bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                           >
                               Simpan Catatan
                           </button>
                        </div>

                        {/* List Notes */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                           <h3 className="font-bold mb-4">Riwayat Catatan</h3>
                           {notes.length === 0 ? (
                              <div className="text-center py-6 text-gray-400">
                                  <p className="text-sm">Belum ada catatan yang dibuat.</p>
                              </div>
                           ) : (
                              <div className="space-y-4">
                                 {notes.map((note, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 relative group">
                                       <div className="flex justify-between items-start mb-2">
                                          <button onClick={() => jumpToPage(note.page)} className="text-xs font-bold text-yellow-700 dark:text-yellow-500 hover:underline">
                                              Hal. {note.page}
                                          </button>
                                          <span className="text-[10px] text-gray-400">{note.date}</span>
                                       </div>
                                       <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{note.text}</p>
                                       <button 
                                            onClick={() => deleteNote(idx)}
                                            className="absolute bottom-2 right-2 p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-gray-800 rounded-md shadow-sm"
                                       >
                                           <Icons.Trash />
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* --- TAB: SEARCH (e) --- */}
                  {activeTab === 'search' && (
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-500">
                            <Icons.Search />
                        </div>
                        <h3 className="font-bold text-lg">Pencarian Teks</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">
                           Untuk mencari teks di dalam buku ini, silakan gunakan fitur pencarian bawaan browser Anda.
                        </p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                           <span className="font-mono font-bold">CTRL + F</span>
                           <span className="text-xs text-gray-400">atau</span>
                           <span className="font-mono font-bold">CMD + F</span>
                        </div>
                        <p className="text-xs text-gray-400 px-6">
                           Pastikan halaman sudah termuat sepenuhnya agar teks dapat dideteksi.
                        </p>
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