<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Hall extends Model
{
    protected $fillable = ['name', 'rows', 'seats_per_row', 'is_active'];

    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }

    public function price(): HasOne
    {
        return $this->hasOne(Price::class);
    }
}
