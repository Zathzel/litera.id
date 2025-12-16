<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\ReadingProgress;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Query builder untuk buku + relasi bookmark + rata-rata rating
     */
    private function getBookQuery()
    {
        // withAvg akan membuat field baru bernama 'ratings_avg_rating' di hasil query
        $query = Book::with('category')->withAvg('ratings', 'rating');

        // Jika user login, eager-load relasi bookmark oleh user ini
        if (Auth::check()) {
            $query->with([
                'usersBookmarked' => function ($q) {
                    $q->where('user_id', Auth::id());
                }
            ]);
        }

        return $query;
    }

    public function index()
    {
        $booksQuery = $this->getBookQuery();

        // Jika dari dashboard
        if (request()->is('dashboard/*')) {
            return Inertia::render('dashboard/books/Index', [
                'books' => $booksQuery->paginate(10),
            ]);
        }

        // Halaman publik
        return Inertia::render('books/Index', [
            'books' => $booksQuery->get(),
            'categories' => Category::all(),
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/books/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        // --- UPDATED: Validasi menambahkan 'epub' ---
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            // Menambahkan 'epub' ke dalam mimes
            'file' => 'required|file|mimes:pdf,epub|max:51200', 
            'cover' => 'nullable|image|max:2048',
        ]);

        $filePath = $request->file('file')->store('books', 'public');
        $coverPath = $request->hasFile('cover')
            ? $request->file('cover')->store('covers', 'public')
            : null;

        Book::create([
            'title' => $data['title'],
            'author' => $data['author'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'],
            'file_path' => $filePath,
            'cover_path' => $coverPath,
        ]);

        return redirect()->route('books.index');
    }

    /**
     * HALAMAN DETAIL BUKU
     * Diakses sebelum masuk ke mode baca
     */
    public function show(Book $book)
    {
        // Ambil detail buku lengkap + status bookmark + rata-rata rating
        $bookDetail = $this->getBookQuery()->findOrFail($book->id);
        
        // Ambil rating user saat ini (jika ada) untuk ditampilkan di frontend
        $userRating = Auth::check() 
            ? Rating::where('user_id', Auth::id())->where('book_id', $book->id)->value('rating') 
            : null;

        // Ambil buku terkait (kategori sama, beda ID)
        $relatedBooks = Book::where('category_id', $book->category_id)
            ->where('id', '!=', $book->id)
            ->withAvg('ratings', 'rating')
            ->limit(10)
            ->get(['id', 'title', 'author', 'cover_path']);

        return Inertia::render('books/Show', [
            'book'          => $bookDetail,
            'relatedBooks'  => $relatedBooks,
            'userRating'    => $userRating,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function edit(Book $book)
    {
        return Inertia::render('dashboard/books/Edit', [
            'book' => $book,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Book $book)
    {
        // --- UPDATED: Validasi menambahkan 'epub' ---
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            // Menambahkan 'epub' ke dalam mimes
            'file' => 'nullable|file|mimes:pdf,epub|max:51200',
            'cover' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('file')) {
            // Hapus file lama
            Storage::disk('public')->delete($book->file_path);
            // Simpan file baru (bisa PDF atau EPUB)
            $book->file_path = $request->file('file')->store('books', 'public');
        }

        if ($request->hasFile('cover')) {
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            $book->cover_path = $request->file('cover')->store('covers', 'public');
        }

        $book->update([
            'title' => $data['title'],
            'author' => $data['author'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'],
            'file_path' => $book->file_path,
            'cover_path' => $book->cover_path,
        ]);

        return redirect()->route('books.index');
    }

    public function destroy(Book $book)
    {
        Storage::disk('public')->delete($book->file_path);
        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $book->delete();
        return redirect()->route('books.index');
    }

    /**
     * FITUR READER (PDF & EPUB)
     */
    public function read(Book $book)
    {
        // Default location (Halaman 1 untuk PDF, atau awal chapter untuk EPUB)
        $initialLocation = 1;

        if (Auth::check()) {
            $progress = ReadingProgress::where('user_id', Auth::id())
                ->where('book_id', $book->id)
                ->first();

            if ($progress && $progress->cfi) {
                // CFI disimpan sebagai string di DB, frontend akan handle konversinya
                $initialLocation = $progress->cfi;
            }
        }

        return Inertia::render('books/Read', [
            'book' => $book,
            'initialLocation' => $initialLocation,
        ]);
    }

    /**
     * API SIMPAN PROGRES MEMBACA
     */
    public function saveProgress(Request $request, $bookId)
    {
        $request->validate([
            // CFI bisa berupa angka (halaman PDF) atau string (lokasi EPUB)
            'cfi' => 'required', 
        ]);

        ReadingProgress::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'book_id' => $bookId,
            ],
            [
                // Pastikan disimpan sebagai string agar fleksibel
                'cfi' => (string) $request->cfi, 
            ]
        );

        return response()->json(['status' => 'success']);
    }

    /**
     * FITUR BERI RATING
     */
    public function rate(Request $request, Book $book)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Rating::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'book_id' => $book->id
            ],
            [
                'rating' => $request->rating
            ]
        );

        return back();
    }
}