<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            // Kunci asing ke tabel users
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Kunci asing ke tabel books
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Memastikan user hanya bisa membookmark satu buku satu kali
            $table->unique(['user_id', 'book_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};