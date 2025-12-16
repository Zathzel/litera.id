<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth; // <--- 1. Pastikan Import Facade Auth

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        $users = $query->latest()->paginate(10);

        return Inertia::render('dashboard/users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function destroy(User $user)
    {
        // 2. Ganti auth()->id() menjadi Auth::id()
        // Ini lebih mudah dikenali oleh editor/Intelephense
        if (Auth::id() === $user->id) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        $user->delete();

        return back();
    }
}