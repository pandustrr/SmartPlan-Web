<?php

namespace App\Http\Controllers\Affiliate;

use App\Http\Controllers\Controller;
use App\Models\Affiliate\AffiliateLink;
use App\Services\AffiliateService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AffiliateTrackController extends Controller
{
    protected $affiliateService;

    public function __construct(AffiliateService $affiliateService)
    {
        $this->affiliateService = $affiliateService;
    }

    /**
     * Get affiliate statistics for authenticated user
     */
    public function getStatistics(Request $request)
    {
        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $stats = $this->affiliateService->getStatistics($affiliateLink);

        return response()->json([
            'success' => true,
            'data' => $stats,
        ], Response::HTTP_OK);
    }

    /**
     * Get affiliate tracks (clicks) for authenticated user
     */
    public function getTracks(Request $request)
    {
        $request->validate([
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'device_type' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $query = $affiliateLink->tracks();

        // Filter by device
        if ($request->has('device_type')) {
            $query->where('device_type', $request->input('device_type'));
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('tracked_at', [
                $request->input('date_from'),
                $request->input('date_to'),
            ]);
        }

        $perPage = $request->input('per_page', 20);
        $tracks = $query->orderBy('tracked_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $tracks->items(),
            'pagination' => [
                'total' => $tracks->total(),
                'per_page' => $tracks->perPage(),
                'current_page' => $tracks->currentPage(),
                'last_page' => $tracks->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Track affiliate click (called from public landing page)
     * This endpoint should be public (no auth required)
     */
    public function track($slug, Request $request)
    {
        // Find affiliate link by slug
        $affiliateLink = AffiliateLink::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Track the click
        $this->affiliateService->trackClick($affiliateLink, $request);

        return response()->json([
            'success' => true,
            'message' => 'Klik tercatat.',
        ], Response::HTTP_OK);
    }

    /**
     * Get device breakdown for affiliate
     */
    public function getDeviceBreakdown(Request $request)
    {
        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $breakdown = $affiliateLink->tracks()
            ->selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->get()
            ->map(function ($item) {
                return [
                    'device' => $item->device_type ?? 'Unknown',
                    'count' => $item->count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $breakdown,
        ], Response::HTTP_OK);
    }

    /**
     * Get monthly clicks breakdown
     */
    public function getMonthlyBreakdown(Request $request)
    {
        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $breakdown = $affiliateLink->tracks()
            ->selectRaw('DATE_FORMAT(tracked_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $breakdown,
        ], Response::HTTP_OK);
    }
}
