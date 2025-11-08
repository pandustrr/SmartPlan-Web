<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MarketAnalysis;
use Illuminate\Support\Facades\Validator;

class MarketAnalysisController extends Controller
{
    public function index(Request $request)
    {
        $query = MarketAnalysis::query();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('business_background_id')) {
            $query->where('business_background_id', $request->business_background_id);
        }

        $analyses = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $analyses
        ], 200);
    }

    // SHOW
    public function show($id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $analysis
        ], 200);
    }

    // STORE
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'nullable|exists:business_backgrounds,id',
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

        return response()->json([
            'status' => 'success',
            'data' => $analysis
        ], 201);
    }

    // UPDATE (cek ownership via user_id yang dikirim)
    public function update(Request $request, $id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        // Pastikan user yang mengupdate sesuai dengan owner (user_id dikirim dari frontend)
        if (!$request->has('user_id') || $request->user_id != $analysis->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: user_id missing or does not match owner'
            ], 403);
        }

        $validated = $request->validate([
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'market_trends' => 'nullable|string',
            'main_competitors' => 'nullable|string',
            'competitor_strengths' => 'nullable|string',
            'competitor_weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
        ]);

        $analysis->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Market analysis updated successfully',
            'data' => $analysis
        ], 200);
    }

    // DESTROY (cek ownership)
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

        $analysis->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Market analysis deleted successfully'
        ], 200);
    }
}
