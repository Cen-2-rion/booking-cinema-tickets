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
            'screenings.*.movie_id' => 'required|exists:movies,id',
            'screenings.*.hall_id' => 'required|exists:halls,id',
            'screenings.*.start_time' => 'required|date_format:H:i',
            'screenings.*.end_time' => 'required|date_format:H:i',
        ]);

        // Удаляем старые сеансы и добавляем новые
        Screening::whereIn('hall_id', $request->hall_ids)->delete();

        foreach ($request->screenings ?? [] as $data) {
            Screening::create($data);
        }

        return response()->json(['success' => true]);
    }
}
