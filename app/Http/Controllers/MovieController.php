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
            'duration' => 'required|integer|min:1',
            'poster_url' => 'nullable|string',
        ]);

        Movie::create($validated);

        return redirect()->route('admin.index')->with('success', 'Фильм добавлен!');
    }

    public function update(Request $request, Movie $movie)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1',
            'poster_url' => 'nullable|string',
        ]);

        $movie->update($validated);

        return redirect()->route('admin.index')->with('success', 'Фильм обновлен!');
    }

    public function destroy(Movie $movie)
    {
        $movie->delete();

        return redirect()->route('admin.index')->with('success', 'Фильм удален!');
    }
}
