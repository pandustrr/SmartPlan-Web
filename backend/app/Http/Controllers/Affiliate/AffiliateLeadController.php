<?php

namespace App\Http\Controllers\Affiliate;

use App\Http\Controllers\Controller;
use App\Models\Affiliate\AffiliateLink;
use App\Models\Affiliate\AffiliateLead;
use App\Models\BusinessBackground;
use App\Models\ProductService;
use App\Models\TeamStructure;
use App\Services\AffiliateService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AffiliateLeadController extends Controller
{
    protected $affiliateService;

    public function __construct(AffiliateService $affiliateService)
    {
        $this->affiliateService = $affiliateService;
    }

    /**
     * Get landing page data (public - no auth)
     */
    public function getLandingPage($slug)
    {
        // Find affiliate link by slug
        $affiliateLink = AffiliateLink::where('slug', $slug)
            ->where('is_active', true)
            ->with('user')
            ->firstOrFail();

        $user = $affiliateLink->user;

        // Get business background data
        $businessBackground = BusinessBackground::where('user_id', $user->id)->first();

        // Get products/services
        $products = ProductService::where('user_id', $user->id)
            ->select('id', 'name', 'description', 'type', 'price', 'image_path')
            ->limit(6)
            ->get()
            ->map(function($product) {
                $imageUrl = null;
                if ($product->image_path) {
                    if (filter_var($product->image_path, FILTER_VALIDATE_URL)) {
                        $imageUrl = $product->image_path;
                    } else {
                        $imageUrl = asset('storage/' . $product->image_path);
                    }
                }
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'type' => $product->type,
                    'price' => $product->price,
                    'image_url' => $imageUrl,
                ];
            })
            ->toArray();

        // Get team members
        $teamMembers = TeamStructure::where('user_id', $user->id)
            ->select('id', 'member_name', 'position', 'photo', 'experience')
            ->limit(5)
            ->get()
            ->map(function($member) {
                $photoUrl = null;
                if ($member->photo) {
                    if (filter_var($member->photo, FILTER_VALIDATE_URL)) {
                        $photoUrl = $member->photo;
                    } else {
                        $photoUrl = asset('storage/' . $member->photo);
                    }
                }
                return [
                    'id' => $member->id,
                    'name' => $member->member_name,
                    'position' => $member->position,
                    'photo_url' => $photoUrl,
                    'experience' => $member->experience,
                ];
            })
            ->toArray();

        // Count team
        $teamCount = TeamStructure::where('user_id', $user->id)->count();

        // Prepare logo URL
        $logoPath = $businessBackground?->logo ?? $user->business_logo ?? null;
        $logoUrl = null;
        if ($logoPath) {
            // Check if logo is already a full URL
            if (filter_var($logoPath, FILTER_VALIDATE_URL)) {
                $logoUrl = $logoPath;
            } else {
                // Convert relative path to full URL
                $logoUrl = asset('storage/' . $logoPath);
            }
        }

        // Prepare response data
        return response()->json([
            'success' => true,
            'data' => [
                'business_name' => $businessBackground?->name ?? $user->business_name ?? $user->name,
                'tagline' => $user->business_tagline ?? 'Solusi bisnis terpercaya',
                'description' => $businessBackground?->description ?? $user->business_description ?? 'Kami menyediakan solusi terbaik untuk kebutuhan bisnis Anda',
                'category' => $businessBackground?->category ?? 'Umum',
                'logo_url' => $logoUrl,
                'vision' => $businessBackground?->vision ?? null,
                'mission' => $businessBackground?->mission ?? null,
                'values' => $businessBackground?->values ? json_decode($businessBackground->values, true) : [],
                'email' => $user->email,
                'phone' => $user->phone,
                'whatsapp' => $user->whatsapp ?? null,
                'location' => $businessBackground?->location ?? null,
                'products' => $products,
                'team_members' => $teamMembers,
                'team_count' => $teamCount,
                'contact' => $businessBackground?->contact ? json_decode($businessBackground->contact, true) : [],
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get leads for authenticated user
     */
    public function getMyLeads(Request $request)
    {
        $request->validate([
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'status' => 'nullable|string|in:baru,dihubungi,closing',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $query = $affiliateLink->leads();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('submitted_at', [
                $request->input('date_from'),
                $request->input('date_to'),
            ]);
        }

        $perPage = $request->input('per_page', 20);
        $leads = $query->orderBy('submitted_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $leads->items(),
            'pagination' => [
                'total' => $leads->total(),
                'per_page' => $leads->perPage(),
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Submit lead from landing page (public endpoint)
     */
    public function submit($slug, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'interest' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Find affiliate link by slug
        $affiliateLink = AffiliateLink::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Create lead
        $lead = $this->affiliateService->createLead(
            $affiliateLink,
            $request->only('name', 'email', 'whatsapp', 'interest', 'notes'),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'Lead berhasil disimpan. Kami akan segera menghubungi Anda!',
            'data' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'submitted_at' => $lead->submitted_at,
            ],
        ], Response::HTTP_CREATED);
    }

    /**
     * Get single lead detail
     */
    public function show(Request $request, AffiliateLead $lead)
    {
        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        if ($lead->affiliate_link_id !== $affiliateLink->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'whatsapp' => $lead->whatsapp,
                'interest' => $lead->interest,
                'notes' => $lead->notes,
                'device_type' => $lead->device_type,
                'ip_address' => $lead->ip_address,
                'status' => $lead->status,
                'submitted_at' => $lead->submitted_at,
                'created_at' => $lead->created_at,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Update lead status
     */
    public function updateStatus(Request $request, AffiliateLead $lead)
    {
        $request->validate([
            'status' => 'required|string|in:baru,dihubungi,closing',
        ]);

        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        if ($lead->affiliate_link_id !== $affiliateLink->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }

        $lead->update([
            'status' => $request->input('status'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status lead berhasil diperbarui.',
            'data' => [
                'id' => $lead->id,
                'status' => $lead->status,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get lead statistics
     */
    public function getStatistics(Request $request)
    {
        $user = $request->user();
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->firstOrFail();

        $totalLeads = $affiliateLink->leads()->count();
        $newLeads = $affiliateLink->leads()->where('status', AffiliateLead::STATUS_NEW)->count();
        $contactedLeads = $affiliateLink->leads()->where('status', AffiliateLead::STATUS_CONTACTED)->count();
        $closingLeads = $affiliateLink->leads()->where('status', AffiliateLead::STATUS_CLOSING)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_leads' => $totalLeads,
                'status_breakdown' => [
                    'baru' => $newLeads,
                    'dihubungi' => $contactedLeads,
                    'closing' => $closingLeads,
                ],
            ],
        ], Response::HTTP_OK);
    }
}
