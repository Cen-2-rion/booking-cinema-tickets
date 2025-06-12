<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $halls = Hall::with(['seats', 'screenings.movie', 'price'])->get();
        $movies = Movie::all();

        return view('admin.index', compact('halls', 'movies'));
    }
}
