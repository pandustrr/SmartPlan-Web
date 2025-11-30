<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateTrack extends Model
{
    protected $fillable = [
        'affiliate_link_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'os',
        'referrer',
        'tracked_at',
    ];

    protected $casts = [
        'tracked_at' => 'datetime',
    ];

    /**
     * Get the affiliate link that owns this track
     */
    public function affiliateLink(): BelongsTo
    {
        return $this->belongsTo(AffiliateLink::class);
    }
}
