<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    protected $fillable = ['title', 'description', 'duration', 'poster_url'];

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }
}
