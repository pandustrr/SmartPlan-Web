<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateLead extends Model
{
    protected $fillable = [
        'affiliate_link_id',
        'name',
        'email',
        'whatsapp',
        'interest',
        'notes',
        'device_type',
        'ip_address',
        'user_agent',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    const STATUS_NEW = 'baru';
    const STATUS_CONTACTED = 'dihubungi';
    const STATUS_CLOSING = 'closing';

    /**
     * Get the affiliate link that owns this lead
     */
    public function affiliateLink(): BelongsTo
    {
        return $this->belongsTo(AffiliateLink::class);
    }

    /**
     * Get the user who owns this lead (through affiliate link)
     */
    public function getAffiliateUserAttribute()
    {
        return $this->affiliateLink->user;
    }

    /**
     * Scope: Filter leads by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Filter leads by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('submitted_at', [$startDate, $endDate]);
    }
}
