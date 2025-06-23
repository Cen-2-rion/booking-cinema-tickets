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

        // Назначение имени по умолчанию
        if (!isset($validated['name'])) {
            $validated['name'] = 'Новый зал';
        }

        // Создаём зал с начальной конфигурацией
        $hall = Hall::create([
            'name' => $validated['name'],
            'rows' => $validated['rows'] ?? 5,
            'seats_per_row' => $validated['seats_per_row'] ?? 5,
            'is_active' => false,
        ]);

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

        return redirect()->route('admin.index')->with('success', 'Зал создан!');
    }

    public function show(Hall $hall)
    {
        $seats = $hall->seats()->get();
        $groupedSeats = [];

        foreach ($seats as $seat) {
            $row = $seat->row_number;

            // Если такого ряда ещё нет — создаём
            if (!isset($groupedSeats[$row])) {
                $groupedSeats[$row] = [];
            }

            // Добавляем кресло в нужный ряд
            $groupedSeats[$row][] = [
                'id' => $seat->id,
                'type' => $seat->type,
            ];
        }

        $seatsArray = array_values($groupedSeats);

        return [
            'rows' => $hall->rows,
            'seats_per_row' => $hall->seats_per_row,
            'seats' => $seatsArray
        ];
    }

    public function update(Request $request, Hall $hall)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rows' => 'required|integer|min:1|max:20',
            'seats_per_row' => 'required|integer|min:1|max:20',
            'is_active' => 'boolean'
        ]);

        $hall->update($validated);

        return redirect()->route('admin.index')->with('success', 'Зал обновлен!');
    }

    public function destroy(Hall $hall)
    {
        $hall->delete();

        return redirect()->route('admin.index')->with('success', 'Зал удален!');
    }
}
