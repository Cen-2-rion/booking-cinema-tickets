<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Price extends Model
{
    protected $fillable = ['hall_id', 'standard_price', 'vip_price'];

    public function hall(): BelongsTo
    {
        return $this->belongsTo(Hall::class);
    }
}
