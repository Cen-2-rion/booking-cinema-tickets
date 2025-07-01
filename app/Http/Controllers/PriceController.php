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

        $hall->price()->updateOrCreate(
            ['hall_id' => $hall->id],
            ['standart_price' => $validated['standart_price'], 'vip_price' => $validated['vip_price']]
        );

        return response()->json(['success' => true]);
    }

    public function show(Hall $hall)
    {
        $price = $hall->price;

        return response()->json([
            'standart_price' => $price->standart_price ?? 350,
            'vip_price' => $price->vip_price ?? 650,
        ]);
    }
}
