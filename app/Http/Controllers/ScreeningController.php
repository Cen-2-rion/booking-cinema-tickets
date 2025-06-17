<?php

namespace App\Http\Controllers;

use App\Models\Screening;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ScreeningController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,id',
            'hall_id' => 'required|exists:halls,id',
            'start_time' => [
                'required',
                'date',
                Rule::unique('screenings')->where(function ($query) use ($request) {
                    return $query->where('hall_id', $request->hall_id);
                }),
            ],
        ]);

        Screening::create($validated);

        return redirect()->route('admin.index')->with('success', 'Сеанс создан!');
    }

    public function destroy(Screening $screening)
    {
        $screening->delete();

        return redirect()->route('admin.index')->with('success', 'Сеанс удален!');
    }
}
