<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1|max:360',
            'country' => 'required|string|max:255',
            'poster' => 'required|image|mimes:jpeg,jpg,png|max:2048', // ограничиваем размер до 2Mb
        ]);

        // Сохраняем постер
        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = '/storage/' . $path;
        }

        $movie = Movie::create($validated);

        return response()->json($movie);
    }

    public function destroy(Movie $movie)
    {
        $movie->delete();

        return response()->json(['success' => true]);
    }
}
