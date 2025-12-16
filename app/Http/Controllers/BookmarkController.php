<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Bookmark;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user(); 

        // Ambil data buku yang dibookmark
        $bookIds = Bookmark::where('user_id', $user->id)->pluck('book_id');
        
        $bookmarkedBooks = Book::whereIn('id', $bookIds)
            ->with('category')
            ->latest()
            ->get();

        // --- LOGIKA PEMILIHAN VIEW ---
        
        // 1. Cek apakah request datang dari URL dashboard
        if ($request->is('dashboard/*')) {
            // Render tampilan Dashboard (Card Grid)
            return Inertia::render('dashboard/Bookmark', [
                'bookmarks' => $bookmarkedBooks, 
            ]);
        }

        // 2. Jika bukan dashboard (dari Navbar Home)
        // Render tampilan Public (List/Grid Public)
        // Pastikan props key-nya sesuai dengan yang diminta 'books/Bookmarks.tsx'
        // (Biasanya 'books' atau 'bookmarks', sesuaikan di sini)
        return Inertia::render('books/Bookmarks', [
            'books' => $bookmarkedBooks, 
        ]);
    }

    public function toggleBookmark(Book $book)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $bookmark = Bookmark::where('user_id', $user->id)
                            ->where('book_id', $book->id)
                            ->first();

        if ($bookmark) {
            $bookmark->delete();
        } else {
            Bookmark::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
            ]);
        }

        return back();
    }
}