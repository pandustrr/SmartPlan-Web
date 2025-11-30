<?php

namespace App\Models\Affiliate;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AffiliateLink extends Model
{
    protected $fillable = [
        'user_id',
        'slug',
        'original_slug',
        'is_custom',
        'change_count',
        'max_changes',
        'is_active',
    ];

    protected $casts = [
        'is_custom' => 'boolean',
        'is_active' => 'boolean',
        'change_count' => 'integer',
        'max_changes' => 'integer',
    ];

    /**
     * Get the user that owns the affiliate link
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all tracks for this affiliate link
     */
    public function tracks(): HasMany
    {
        return $this->hasMany(AffiliateTrack::class);
    }

    /**
     * Get all leads for this affiliate link
     */
    public function leads(): HasMany
    {
        return $this->hasMany(AffiliateLead::class);
    }

    /**
     * Generate the full affiliate URL
     */
    public function getFullUrlAttribute(): string
    {
        // Use frontend URL for shareable affiliate link
        $frontendUrl = config('app.frontend_url') ?? 'http://localhost:5173';
        return "{$frontendUrl}/affiliate/{$this->slug}";
    }

    /**
     * Get total clicks for this affiliate link
     */
    public function getTotalClicksAttribute(): int
    {
        return $this->tracks()->count();
    }

    /**
     * Get total leads for this affiliate link
     */
    public function getTotalLeadsAttribute(): int
    {
        return $this->leads()->count();
    }

    /**
     * Calculate conversion rate
     */
    public function getConversionRateAttribute(): float
    {
        $clicks = $this->total_clicks;
        if ($clicks === 0) {
            return 0;
        }
        return round(($this->total_leads / $clicks) * 100, 2);
    }
}
