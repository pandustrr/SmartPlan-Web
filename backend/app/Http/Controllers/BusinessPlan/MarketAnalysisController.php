<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MarketAnalysis;
use App\Models\BusinessBackground;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MarketAnalysisController extends Controller
{
    public function index(Request $request)
    {
        try {
            Log::info('Fetching market analyses with business background', [
                'user_id' => $request->user_id,
                'request_all' => $request->all()
            ]);

            // Gunakan eager loading dengan cara yang lebih eksplisit
            $query = MarketAnalysis::with(['businessBackground']);

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $analyses = $query->get();

            // DEBUG: Manual load business background jika eager loading gagal
            foreach ($analyses as $analysis) {
                if (!$analysis->relationLoaded('businessBackground')) {
                    Log::warning('Business background not loaded for analysis: ' . $analysis->id);
                    $analysis->load('businessBackground');
                }

                // Debug setiap analysis
                Log::info('Analysis debug', [
                    'id' => $analysis->id,
                    'business_background_id' => $analysis->business_background_id,
                    'has_business_background' => !is_null($analysis->businessBackground),
                    'business_background_data' => $analysis->businessBackground ? [
                        'id' => $analysis->businessBackground->id,
                        'name' => $analysis->businessBackground->name,
                        'category' => $analysis->businessBackground->category
                    ] : null
                ]);
            }

            Log::info('Final analyses data', [
                'total' => $analyses->count(),
                'with_business_background' => $analyses->where('businessBackground', '!=', null)->count()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $analyses
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching market analyses: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch market analyses: ' . $e->getMessage()
            ], 500);
        }
    }

    // SHOW
    public function show($id)
    {
        try {
            $analysis = MarketAnalysis::with(['businessBackground'])->find($id);

            if (!$analysis) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Market analysis not found'
                ], 404);
            }

            // Manual load jika masih gagal
            if (!$analysis->relationLoaded('businessBackground')) {
                $analysis->load('businessBackground');
            }

            return response()->json([
                'status' => 'success',
                'data' => $analysis
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching market analysis: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch market analysis'
            ], 500);
        }
    }

    // STORE
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'market_trends' => 'nullable|string',
            'main_competitors' => 'nullable|string',
            'competitor_strengths' => 'nullable|string',
            'competitor_weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $analysis = MarketAnalysis::create([
                'user_id' => $request->user_id,
                'business_background_id' => $request->business_background_id,
                'target_market' => $request->target_market,
                'market_size' => $request->market_size,
                'market_trends' => $request->market_trends,
                'main_competitors' => $request->main_competitors,
                'competitor_strengths' => $request->competitor_strengths,
                'competitor_weaknesses' => $request->competitor_weaknesses,
                'competitive_advantage' => $request->competitive_advantage,
            ]);

            // Load business background dengan fresh query
            $analysis->load('businessBackground');

            Log::info('Market analysis created successfully', [
                'id' => $analysis->id,
                'business_background_id' => $analysis->business_background_id,
                'business_background_name' => $analysis->businessBackground ? $analysis->businessBackground->name : 'NOT FOUND'
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $analysis
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating market analysis: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create market analysis'
            ], 500);
        }
    }

    // UPDATE - tetap sama
    public function update(Request $request, $id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        if (!$request->has('user_id') || $request->user_id != $analysis->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: user_id missing or does not match owner'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'market_trends' => 'nullable|string',
            'main_competitors' => 'nullable|string',
            'competitor_strengths' => 'nullable|string',
            'competitor_weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $analysis->update([
                'business_background_id' => $request->business_background_id,
                'target_market' => $request->target_market,
                'market_size' => $request->market_size,
                'market_trends' => $request->market_trends,
                'main_competitors' => $request->main_competitors,
                'competitor_strengths' => $request->competitor_strengths,
                'competitor_weaknesses' => $request->competitor_weaknesses,
                'competitive_advantage' => $request->competitive_advantage,
            ]);

            $analysis->load('businessBackground');

            return response()->json([
                'status' => 'success',
                'message' => 'Market analysis updated successfully',
                'data' => $analysis
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating market analysis: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update market analysis'
            ], 500);
        }
    }

    // DESTROY - tetap sama
    public function destroy(Request $request, $id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        if (!$request->has('user_id') || $request->user_id != $analysis->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: user_id missing or does not match owner'
            ], 403);
        }

        try {
            $analysis->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Market analysis deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting market analysis: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete market analysis'
            ], 500);
        }
    }
}
