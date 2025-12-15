<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
// Import Model yang ingin dihitung
use App\Models\Book;
use App\Models\Category;

class DashboardController extends Controller
{
    public function index()
    {
        // Mengambil total data dari database
        $totalBooks = Book::count();
        $totalCategories = Category::count();

        // Mengirim data ke Frontend (Dashboard/Index.tsx)
        return Inertia::render('dashboard/Index', [
            'stats' => [
                'totalBooks' => $totalBooks,
                'totalCategories' => $totalCategories,
            ],
        ]);
    }
}