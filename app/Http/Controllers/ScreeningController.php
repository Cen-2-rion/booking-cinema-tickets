<?php

namespace App\Http\Controllers;

use App\Models\Screening;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    public function index()
    {
        // Загружаем все сеансы вместе с фильмами, группируем по залу
        $screenings = Screening::with('movie')->get()->groupBy('hall_id');
        $data = [];

        foreach ($screenings as $hallId => $items) {
            $data[$hallId] = $items->map(function ($screening) {
                return [
                    'movie_id' => $screening->movie_id,
                    'hall_id' => $screening->hall_id,
                    'start_time' => $screening->start_time->format('H:i'),
                    'end_time' => $screening->end_time->format('H:i'),
                    'title' => $screening->movie->title,
                ];
            });
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'hall_ids' => 'required|array',
            'hall_ids.*' => 'required|exists:halls,id',
            'screenings' => 'nullable|array',
            'screenings.*.movie_id' => 'required|exists:movies,id',
            'screenings.*.hall_id' => 'required|exists:halls,id',
            'screenings.*.start_time' => 'required|date_format:H:i',
            'screenings.*.end_time' => 'required|date_format:H:i',
        ]);

        // Удаляем старые сеансы
        Screening::whereIn('hall_id', $request->hall_ids)->delete();

        // Добавляем новые
        foreach ($request->screenings as $data) {
            Screening::create($data);
        }

        return response()->json(['success' => true]);
    }
}
