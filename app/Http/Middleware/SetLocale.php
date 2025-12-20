<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = config('app.locale'); // Default app

        // 1. Prioritas Pertama: Session (Data paling "fresh")
        if ($request->session()->has('locale')) {
            $locale = $request->session()->get('locale');
        } 
        // 2. Prioritas Kedua: Database User (Jika user login & session kosong)
        elseif (Auth::check() && Auth::user()->locale) {
            $locale = Auth::user()->locale;
            // Sinkronisasi session agar request berikutnya lebih cepat
            session()->put('locale', $locale);
        }

        // Set locale aplikasi
        App::setLocale($locale);

        return $next($request);
    }
}