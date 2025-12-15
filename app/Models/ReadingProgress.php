<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadingProgress extends Model
{
    // 1. Paksa nama tabel agar sesuai dengan migrasi
    protected $table = 'reading_progresses';

    // 2. Definisikan kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'book_id',
        'cfi',
        'percentage'
    ];
}