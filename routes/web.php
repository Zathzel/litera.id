<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookmarkController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// --- PUBLIC PAGES ---

// 1. List Semua Buku
Route::get('/books', [BookController::class, 'index'])->name('books.index');

// 2. Halaman Detail Buku
Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');

// 3. Halaman Reader (Mode Baca PDF)
Route::get('/books/{book}/read', [BookController::class, 'read'])->name('books.read');

// 4. List Kategori
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');


// --- DASHBOARD & AUTHENTICATED FEATURES ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Resource Routes
    Route::resource('dashboard/books', BookController::class);
    Route::resource('dashboard/categories', CategoryController::class);

    // --- FITUR BACA, BOOKMARK, & RATING ---

    // 1. API Save Progress
    Route::post('/books/{book}/progress', [BookController::class, 'saveProgress'])->name('books.saveProgress');

    // 2. Halaman Daftar Bookmark User
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');

    // 3. API Toggle Bookmark (Tambah/Hapus)
    Route::post('/books/{book}/bookmark', [BookmarkController::class, 'toggleBookmark'])->name('books.toggleBookmark');

    // 4. API Rate Book (BARU: Tambahkan ini)
    Route::post('/books/{book}/rate', [BookController::class, 'rate'])->name('books.rate');
});

require __DIR__.'/settings.php';