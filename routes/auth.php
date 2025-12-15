<?php

use Illuminate\Support\Facades\Route;

// Guest routes (login, register, forgot password)
Route::middleware('guest')->group(function () {
    Route::get('login', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'store']);

    Route::get('register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [\Laravel\Fortify\Http\Controllers\RegisteredUserController::class, 'store']);

    Route::get('forgot-password', [\Laravel\Fortify\Http\Controllers\PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [\Laravel\Fortify\Http\Controllers\PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [\Laravel\Fortify\Http\Controllers\NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [\Laravel\Fortify\Http\Controllers\NewPasswordController::class, 'store'])->name('password.update');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [\Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
