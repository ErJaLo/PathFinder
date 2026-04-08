<?php

use App\Http\Controllers\ExperienciaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaisosController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AdminStatsController;
use App\Http\Controllers\ReportsController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explorar', [ExperienciaController::class, 'index'])->name('explorar.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/settings/experiences', [ExperienciaController::class, 'meves'])->name('experiencies.meves');
    Route::get('/experiencies/{post}/editar', [ExperienciaController::class, 'edit'])->name('experiencies.edit');
    Route::put('/experiencies/{post}', [ExperienciaController::class, 'update'])->name('experiencies.update');
    Route::delete('/experiencies/{post}', [ExperienciaController::class, 'destroy'])->name('experiencies.destroy');
    Route::get('/experiencies/crear', [ExperienciaController::class, 'create'])->name('experiencies.create');
    Route::post('/experiencies', [ExperienciaController::class, 'store'])->name('experiencies.store');
});

Route::get('/experiencies/{post}', [ExperienciaController::class, 'show'])->name('experiencies.show');


Route::get("/llocs", [PaisosController::class, "llistarPaisos"])->name("llocs");

Route::middleware(['auth', 'role:moderator,admin'])->prefix('admin')->group(function () {
    Route::inertia('/', 'admin/index')->name('admin.index');
    Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('users/getUsers/{x?}/{y?}', [UserController::class, 'getUsers'])
        ->whereNumber('x')
        ->whereNumber('y')
        ->name('admin.users.getUsers');
    Route::patch('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('admin.users.toggleActive');
    Route::get("category", [CategoryController::class, "index"])->name("admin.category.index");
    Route::delete("category/{category}", [CategoryController::class, "destroy"])->name("admin.category.destroy");
    Route::post("category", [CategoryController::class, "store"])->name('admin.categories.store');
    Route::get("category/{category}/edit", [CategoryController::class, "edit"])->name("admin.category.edit");
    Route::put("category/{category}", [CategoryController::class, "update"])->name("admin.category.update");

    Route::get("summary-stats", [AdminStatsController::class, 'summaryStats'])->name("admin.summaryStats");

    Route::get("reports", [ReportsController::class, "index"])->name("reports");
});

require __DIR__ . '/settings.php';
