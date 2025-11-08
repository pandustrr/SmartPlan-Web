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

    // Relasi - pastikan nama model dan foreign key benar
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class, 'business_background_id', 'id');
    }
}
