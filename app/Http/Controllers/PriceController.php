<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;

class PriceController extends Controller
{
    public function update(Request $request, Hall $hall)
    {
        $validated = $request->validate([
            'standart_price' => 'required|integer|min:0',
            'vip_price' => 'required|integer|min:0',
        ]);

        $price = $hall->price()->updateOrCreate(
            ['hall_id' => $hall->id],
            $validated
        );

        return response()->json($price);
    }
}
