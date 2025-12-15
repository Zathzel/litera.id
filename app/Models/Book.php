<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany; // Import Baru
use Illuminate\Support\Facades\Auth;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'description',
        'category_id',
        'file_path',
        'cover_path',
    ];

    // Menambahkan 'is_bookmarked' agar otomatis muncul di JSON response
    protected $appends = ['file_url', 'cover_url', 'is_bookmarked'];

    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    public function getCoverUrlAttribute()
    {
        return $this->cover_path
            ? asset('storage/' . $this->cover_path)
            : null;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi One-to-Many ke Ratings
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Relasi Many-to-Many ke User (Bookmark)
     */
    public function usersBookmarked(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'bookmarks', 'book_id', 'user_id')->withTimestamps();
    }

    /**
     * Accessor: Cek status bookmark user yang sedang login
     */
    public function getIsBookmarkedAttribute(): bool
    {
        // Jika user tidak login, pasti false
        if (!Auth::check()) {
            return false;
        }

        // Jika relasi sudah di-eager load dari Controller (Optimasi Query)
        if ($this->relationLoaded('usersBookmarked')) {
            return $this->usersBookmarked->contains('id', Auth::id());
        }

        // Fallback: Cek langsung ke database jika relasi belum dimuat
        return $this->usersBookmarked()->where('user_id', Auth::id())->exists();
    }
}