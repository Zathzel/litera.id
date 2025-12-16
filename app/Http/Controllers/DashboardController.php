<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import Auth untuk cek user login
use Inertia\Inertia;

// Import Model
use App\Models\Book;
use App\Models\Category;
use App\Models\User;            // Import User (untuk Admin)
use App\Models\Bookmark;        // Import Bookmark (untuk User Biasa)
use App\Models\ReadingProgress; // Import Progress (untuk User Biasa)

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = [];

        // --- CEK ROLE ---
        if ($user->role === 'admin') {
            
            // 1. STATISTIK KHUSUS ADMIN
            $stats = [
                'totalBooks'      => Book::count(),
                'totalCategories' => Category::count(),
                'totalUsers'      => User::count(),
            ];

        } else {
            
            // 2. STATISTIK KHUSUS USER (READER)
            
            // Hitung jumlah bookmark milik user ini
            // Pastikan menggunakan query where 'user_id'
            $myBookmarks = Bookmark::where('user_id', $user->id)->count();

            // Hitung jumlah buku yang pernah dibuka/dibaca (ada di tabel reading_progress)
            $booksRead = ReadingProgress::where('user_id', $user->id)->count();

            $stats = [
                'myBookmarks' => $myBookmarks,
                'booksRead'   => $booksRead,
            ];
        }

        // Mengirim data ke Frontend (Dashboard/Index.tsx)
        return Inertia::render('dashboard/Index', [
            'stats' => $stats,
        ]);
    }
}