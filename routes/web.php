<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ScreeningController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Аутентификация
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/api/all-data', [AdminController::class, 'getAllData']);

// Административная часть
Route::middleware('auth')->prefix('admin')->group(function () {

    // Дашборд администратора
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');

    // Залы
    Route::resource('halls', HallController::class)->only(['store', 'destroy']);
    Route::put('/halls/{hall}', [HallController::class, 'update']);

    // Цены
    Route::put('/prices/{hall}', [PriceController::class, 'update']);

    // Фильмы
    Route::resource('movies', MovieController::class)->only(['store', 'destroy']);

    // Сеансы
    Route::put('/screenings', [ScreeningController::class, 'update']);

    // Открытие продаж
    Route::post('/open-sales', [AdminController::class, 'openSales']);
});

// Клиентская часть
Route::prefix('client')->group(function () {

    // Главная страница со списком фильмов
    Route::get('/', [ClientController::class, 'index']);

    // Просмотр зала и выбор мест для конкретного сеанса
    Route::get('/hall/{screening}', [ClientController::class, 'showHall']);

    // Сохранение выбранных мест в сессии
    Route::post('/process-payment', [ClientController::class, 'processPayment']);

    // Отображение формы оплаты
    Route::get('/payment', [ClientController::class, 'showPayment']);

    // Генерация билета после оплаты
    Route::get('/ticket', [ClientController::class, 'generateTicket']);
});
