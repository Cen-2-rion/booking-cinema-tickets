<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $halls = Hall::with(['seats', 'screenings.movie', 'price'])->get();
        $movies = Movie::all();

        return view('admin.index', compact('halls', 'movies'));
    }

    public function openSales()
    {
        // Проверяем активность залов, если хоть один активен - меняем статус
        $anyActive = Hall::where('is_active', true)->exists();
        $newStatus = !$anyActive;

        // Обновляем все залы одним запросом
        Hall::query()->update(['is_active' => $newStatus]);

        return response()->json([
            'success' => true,
            'is_active' => $newStatus
        ]);
    }
}
