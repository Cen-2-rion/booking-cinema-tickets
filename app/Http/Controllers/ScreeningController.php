<?php

namespace App\Http\Controllers;

use App\Models\Screening;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'hall_ids' => 'required|array',
            'hall_ids.*' => 'required|exists:halls,id',
            'screenings' => 'nullable|array',
            'screenings.*.hall_id' => 'required|exists:halls,id',
            'screenings.*.movie_id' => 'required|exists:movies,id',
            'screenings.*.start_time' => 'required|date_format:H:i',
            'screenings.*.end_time' => 'required|date_format:H:i',
        ]);

        // Удаляем старые сеансы и добавляем новые
        Screening::whereIn('hall_id', $request->hall_ids)->delete();

        $created = [];
        foreach ($request->screenings ?? [] as $data) {
            $screening = Screening::create($data);
            $created[] = [
                'id' => $screening->id,
                'hall_id' => $screening->hall_id,
                'movie_id' => $screening->movie_id,
                'start_time' => $screening->start_time->format('H:i'),
                'end_time' => $screening->end_time->format('H:i'),
                'title' => $screening->movie->title,
            ];
        }

        return response()->json($created);
    }

    public function getScreeningData(Screening $screening)
    {
        $screening->load(['hall.seats', 'tickets']);

        return response()->json([
            'hall' => $screening->hall,
            'booked_seats' => $screening->tickets->map(fn($t) => [
                'seat_id' => $t->seat_id,
            ]),
        ]);
    }
}
