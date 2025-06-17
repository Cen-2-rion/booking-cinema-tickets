<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;

class PriceController extends Controller
{
    public function update(Request $request, Hall $hall)
    {
        $validated = $request->validate([
            'standard_price' => 'required|numeric|min:0',
            'vip_price' => 'required|numeric|min:0',
        ]);

        $hall->price()->updateOrCreate(
            ['hall_id' => $hall->id],
            $validated
        );

        return back()->with('success', 'Цены обновлены!');
    }
}
