<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ClientController;

// Аутентификация
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Админка
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/halls', [HallController::class, 'store']);
    Route::delete('/halls/{hall}', [HallController::class, 'destroy']);
    Route::resource('halls', HallController::class)->except(['show', 'edit', 'update']);
});

// Клиентская часть
Route::get('/', [ClientController::class, 'index'])->name('client.index');
Route::get('/hall/{screening}', [ClientController::class, 'showHall'])->name('client.hall');
Route::post('/process-payment', [ClientController::class, 'processPayment'])->name('client.payment.process');
Route::get('/payment', [ClientController::class, 'showPayment'])->name('client.payment.view');
Route::get('/ticket', [ClientController::class, 'generateTicket'])->name('client.ticket');
