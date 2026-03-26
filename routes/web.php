<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:moderator,admin'])->prefix('admin')->group(function () {
    Route::inertia('/', 'admin/index')->name('admin.index');
    Route::get('users', [UserController::class, 'index'])->name('admin.users');
});
    
require __DIR__ . '/settings.php';
