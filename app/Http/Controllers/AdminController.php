<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Price;
use App\Models\Movie;
use App\Models\Screening;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $halls = Hall::with(['screenings.movie'])->get();
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
            'is_active' => $newStatus,
        ]);
    }

    public function getAllData()
    {
        $halls = Hall::with('seats')->get();
        $prices = Price::all();
        $movies = Movie::all();

        $screenings = Screening::with('movie')->get()->map(fn($s) => [
            'id' => $s->id,
            'hall_id' => $s->hall_id,
            'movie_id' => $s->movie_id,
            'start_time' => $s->start_time->format('H:i'),
            'end_time' => $s->end_time->format('H:i'),
            'title' => $s->movie->title,
        ]);

        return response()->json([
            'halls' => $halls,
            'prices' => $prices,
            'movies' => $movies,
            'screenings' => $screenings,
        ]);
    }
}
