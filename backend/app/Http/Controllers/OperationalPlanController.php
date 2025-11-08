<?php

namespace App\Http\Controllers;

use App\Models\OperationalPlan;
use App\Models\BusinessBackground;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OperationalPlanController extends Controller
{
    public function index(Request $request)
    {
        $operationalPlans = OperationalPlan::with('businessBackground')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $operationalPlans
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'business_location' => 'required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'required|in:owned,rented,virtual,leased,other',
            'location_size' => 'nullable|numeric|min:0',
            'rent_cost' => 'nullable|numeric|min:0',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'required|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $operationalPlan = OperationalPlan::create([
            'user_id' => $request->user()->id,
            'business_background_id' => $request->business_background_id,
            'business_location' => $request->business_location,
            'location_description' => $request->location_description,
            'location_type' => $request->location_type,
            'location_size' => $request->location_size,
            'rent_cost' => $request->rent_cost,
            'employees' => $request->employees,
            'operational_hours' => $request->operational_hours,
            'suppliers' => $request->suppliers,
            'daily_workflow' => $request->daily_workflow,
            'equipment_needs' => $request->equipment_needs,
            'technology_stack' => $request->technology_stack,
            'status' => 'draft'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rencana operasional berhasil dibuat',
            'data' => $operationalPlan->load('businessBackground')
        ]);
    }

    public function show(OperationalPlan $operationalPlan)
    {
        if ($operationalPlan->user_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $operationalPlan->load('businessBackground')
        ]);
    }

    public function update(Request $request, OperationalPlan $operationalPlan)
    {
        if ($operationalPlan->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'business_location' => 'sometimes|required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'sometimes|required|in:owned,rented,virtual,leased,other',
            'location_size' => 'nullable|numeric|min:0',
            'rent_cost' => 'nullable|numeric|min:0',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'sometimes|required|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
            'status' => 'sometimes|in:draft,completed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $operationalPlan->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Rencana operasional berhasil diperbarui',
            'data' => $operationalPlan->load('businessBackground')
        ]);
    }

    public function destroy(OperationalPlan $operationalPlan)
    {
        if ($operationalPlan->user_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $operationalPlan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rencana operasional berhasil dihapus'
        ]);
    }
}
