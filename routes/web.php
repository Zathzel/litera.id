<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

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
Route::get('/books', [BookController::class, 'index'])->name('books.index');
Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');
Route::get('/books/{book}/read', [BookController::class, 'read'])->name('books.read');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');


// --- AREA TERAUTENTIKASI (Harus Login) ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. Bookmark Versi Public (Navbar Home)
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('public.bookmarks');

    // 2. Action Buttons (API)
    Route::post('/books/{book}/bookmark', [BookmarkController::class, 'toggleBookmark'])->name('books.toggleBookmark');
    Route::post('/books/{book}/progress', [BookController::class, 'saveProgress'])->name('books.saveProgress');
    Route::post('/books/{book}/rate', [BookController::class, 'rate'])->name('books.rate');

    // 3. Profile & Settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    
    // --- ROUTE BARU: UPDATE BAHASA ---
    Route::patch('/profile/locale', [ProfileController::class, 'updateLocale'])->name('profile.locale.update');

    // --- DASHBOARD AREA ---
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        
        // A. DASHBOARD UMUM (Bisa diakses Admin & Reader)
        Route::get('/', [DashboardController::class, 'index'])->name('index'); 
        Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks');

        // B. ADMIN ONLY AREA (Dibungkus Middleware 'admin')
        Route::middleware(['admin'])->group(function () {
            
            // Manajemen Data
            Route::resource('books', BookController::class);
            Route::resource('categories', CategoryController::class);
            
            // Manajemen User
            Route::resource('users', UserController::class)->only(['index', 'destroy']);
        });
    });
});

require __DIR__.'/settings.php';