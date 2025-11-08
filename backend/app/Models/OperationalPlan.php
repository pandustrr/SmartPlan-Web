<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OperationalPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_background_id',
        'business_location',
        'location_description',
        'location_type',
        'location_size',
        'rent_cost',
        'employees',
        'operational_hours',
        'suppliers',
        'daily_workflow',
        'equipment_needs',
        'technology_stack',
        'status'
    ];

    protected $casts = [
        'employees' => 'array',
        'operational_hours' => 'array',
        'suppliers' => 'array',
        'rent_cost' => 'decimal:2',
        'location_size' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class);
    }
}
