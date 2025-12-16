<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user login DAN memiliki role 'admin'
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        // --- PERBAIKAN DI SINI ---
        
        // JANGAN return JSON untuk web route, user akan melihat teks mentah.
        // Gunakan abort(403) agar tampil halaman error "Forbidden".
        abort(403, 'ANDA TIDAK MEMILIKI AKSES SEBAGAI ADMIN.');

        // OPSI ALTERNATIF (Jika ingin redirect saja):
        // return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses admin.');
    }
}