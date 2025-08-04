<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
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
        $movies = Movie::all();

        $screenings = [];
        foreach ($halls as $hall) {
            foreach ($hall->screenings as $screening) {
                $screenings[] = [
                    'id' => $screening->id,
                    'hall_id' => $hall->id,
                    'movie_id' => $screening->movie_id,
                    'start_time' => $screening->start_time->format('H:i'),
                    'end_time' => $screening->end_time->format('H:i'),
                    'title' => $screening->movie->title,
                ];
            }
        }

        $prices = [];
        foreach ($halls as $hall) {
            if ($hall->price) {
                $prices[] = [
                    'hall_id' => $hall->id,
                    'standart_price' => $hall->price->standart_price,
                    'vip_price' => $hall->price->vip_price,
                ];
            }
        }

        return response()->json([
            'halls' => $halls,
            'movies' => $movies,
            'screenings' => $screenings,
            'prices' => $prices,
        ]);
    }
}
