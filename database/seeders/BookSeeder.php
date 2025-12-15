<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $tech = Category::where('name', 'Teknologi')->first();
        $fiksi = Category::where('name', 'Fiksi')->first();

        Book::create([
            'title' => 'Belajar Laravel dari Nol',
            'author' => 'John Doe',
            'category_id' => $tech->id,
            'file_path' => 'books/laravel.pdf',
            'cover_path' => 'covers/laravel.jpg',
        ]);

        Book::create([
            'title' => 'Petualangan Bintang',
            'author' => 'Ayu R',
            'category_id' => $fiksi->id,
            'file_path' => 'books/novel.epub',
            'cover_path' => 'covers/novel.jpg',
        ]);
    }
}
