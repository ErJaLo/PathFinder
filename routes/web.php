<?php

use App\Http\Controllers\ExperienciaController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explorar', [ExperienciaController::class, 'index'])->name('explorar.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/experiencies/meves', [ExperienciaController::class, 'meves'])->name('experiencies.meves');
    Route::get('/experiencies/{post}/editar', [ExperienciaController::class, 'edit'])->name('experiencies.edit');
    Route::put('/experiencies/{post}', [ExperienciaController::class, 'update'])->name('experiencies.update');
    Route::delete('/experiencies/{post}', [ExperienciaController::class, 'destroy'])->name('experiencies.destroy');
    Route::get('/experiencies/crear', [ExperienciaController::class, 'create'])->name('experiencies.create');
    Route::post('/experiencies', [ExperienciaController::class, 'store'])->name('experiencies.store');
});

Route::get('/experiencies/{post}', [ExperienciaController::class, 'show'])->name('experiencies.show');

Route::middleware(['auth', 'role:moderator,admin'])->prefix('admin')->group(function () {
    Route::inertia('/', 'admin/index')->name('admin.index');
});

require __DIR__ . '/settings.php';
