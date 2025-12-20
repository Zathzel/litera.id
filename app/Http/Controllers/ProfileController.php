<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Tampilkan halaman edit profile user.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('dashboard/Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update informasi profile user (Nama & Email).
     */
    public function update(Request $request): RedirectResponse
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        // Update data user
        $request->user()->fill($validated);

        // Jika email berubah, reset verifikasi email
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Redirect kembali ke halaman profile dengan notifikasi sukses
        return Redirect::route('profile.edit');
    }

    /**
     * Delete akun user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update Bahasa / Locale User (METHOD BARU)
     */
    public function updateLocale(Request $request): RedirectResponse
    {
        // 1. Validasi input (hanya terima 'id' atau 'en')
        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:id,en'],
        ]);

        // 2. Update kolom 'locale' di tabel users
        // Pastikan Anda sudah membuat migration untuk kolom 'locale'
        $request->user()->fill($validated);
        $request->user()->save();

        // 3. Simpan ke session agar middleware langsung mendeteksi perubahan
        // tanpa perlu user logout-login
        session()->put('locale', $validated['locale']);

        // 4. Redirect kembali (frontend akan melakukan reload)
        return Redirect::back();
    }
}