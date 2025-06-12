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

        $hall = Hall::create($validated);

        // Создание мест
        for ($row = 1; $row <= $hall->rows; $row++) {
            for ($seat = 1; $seat <= $hall->seats_per_row; $seat++) {
                $hall->seats()->create([
                    'row_number' => $row,
                    'seat_number' => $seat,
                    'type' => 'standard',
                ]);
            }
        }

        return redirect()->route('admin.index');
    }

    public function destroy(Hall $hall)
    {
        $hall->delete();
        return redirect()->route('admin.index');
    }
}
