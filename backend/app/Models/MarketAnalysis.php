<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MarketAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_background_id',
        'target_market',
        'market_size',
        'market_trends',
        'main_competitors',
        'competitor_strengths',
        'competitor_weaknesses',
        'competitive_advantage',
    ];

    // Relasi
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(\App\Models\BusinessBackground::class);
    }
}
