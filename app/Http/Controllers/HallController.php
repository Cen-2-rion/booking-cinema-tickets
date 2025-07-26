<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rows' => 'required|integer|min:1|max:20',
            'seats_per_row' => 'required|integer|min:1|max:20',
        ]);

        // Создаём зал с начальной конфигурацией
        $hall = Hall::create([
            'name' => $validated['name'],
            'rows' => $validated['rows'],
            'seats_per_row' => $validated['seats_per_row'],
            'is_active' => false,
        ]);

        for ($row = 1; $row <= $hall->rows; $row++) {
            for ($seat = 1; $seat <= $hall->seats_per_row; $seat++) {
                $hall->seats()->create([
                    'row_number' => $row,
                    'seat_number' => $seat,
                    'type' => 'standart',
                ]);
            }
        }

        return response()->json($hall);
    }

    public function update(Request $request, Hall $hall)
    {
        $validated = $request->validate([
            'rows' => 'required|integer|min:1|max:20',
            'seats_per_row' => 'required|integer|min:1|max:20',
            'seats' => 'required|array',
        ]);

        $hall->update([
            'rows' => $validated['rows'],
            'seats_per_row' => $validated['seats_per_row'],
        ]);

        // Удаляем старые места
        $hall->seats()->delete();

        // Создаём новые
        foreach ($validated['seats'] as $seat) {
            $hall->seats()->create($seat);
        }

        return response()->json($hall);
    }

    public function destroy(Hall $hall)
    {
        $hall->delete();

        return response()->json(['success' => true]);
    }
}
