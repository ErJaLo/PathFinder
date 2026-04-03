<?php

use App\Http\Controllers\ExperienciaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaisosController;
use App\Http\Controllers\CategoryController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explorar', [ExperienciaController::class, 'index'])->name('explorar.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/experiencies/crear', [ExperienciaController::class, 'create'])->name('experiencies.create');
    Route::post('/experiencies', [ExperienciaController::class, 'store'])->name('experiencies.store');
});

Route::get('/experiencies/{post}', [ExperienciaController::class, 'show'])->name('experiencies.show');


Route::get("/llocs", [PaisosController::class, "llistarPaisos"])->name("llocs");

Route::middleware(['auth', 'role:moderator,admin'])->prefix('admin')->group(function () {
    Route::inertia('/', 'admin/index')->name('admin.index');
    Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
    Route::patch('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('admin.users.toggleActive');
    Route::get("category", [CategoryController::class, "index"])->name("admin.category.index");
});

require __DIR__ . '/settings.php';
