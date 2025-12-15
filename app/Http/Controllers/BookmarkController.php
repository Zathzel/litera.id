<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Bookmark;
use App\Models\User; // Pastikan import Model User
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    /**
     * HAPUS __construct() karena middleware sudah diatur di routes/web.php
     * Ini akan menghilangkan error 'Undefined method middleware'
     */

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user(); 
        // Komentar @var di atas memberitahu editor bahwa $user adalah Model User kita,
        // sehingga error 'Undefined method bookmarks' akan hilang.
        
        // Ambil buku yang dibookmark oleh user, termasuk kategori buku.
        $bookmarkedBooks = $user->bookmarks()->with('category')->get();

        return Inertia::render('books/Bookmarks', [
            'books' => $bookmarkedBooks,
        ]);
    }

    public function toggleBookmark(Book $book)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cari apakah bookmark sudah ada
        $bookmark = Bookmark::where('user_id', $user->id)
                            ->where('book_id', $book->id)
                            ->first();

        if ($bookmark) {
            // Jika sudah ada, hapus (unbookmark)
            $bookmark->delete();
            $status = 'removed';
            $message = 'Bookmark dihapus';
        } else {
            // Jika belum ada, buat (bookmark)
            Bookmark::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
            ]);
            $status = 'added';
            $message = 'Bookmark ditambahkan';
        }

        return response()->json([
            'status' => $status,
            'message' => $message,
            'is_bookmarked' => $status === 'added'
        ]);
    }
}