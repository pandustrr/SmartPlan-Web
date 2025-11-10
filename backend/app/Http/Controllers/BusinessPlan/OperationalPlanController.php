<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use App\Models\OperationalPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OperationalPlanController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = OperationalPlan::with(['user', 'businessBackground']);

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->business_background_id) {
                $query->where('business_background_id', $request->business_background_id);
            }

            $data = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching operational plans: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $plan = OperationalPlan::with(['user', 'businessBackground'])->find($id);

            if (!$plan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Operational plan not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching operational plan: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data.'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'business_location' => 'required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'required|string|max:50',
            'location_size' => 'nullable|numeric|min:0',
            'rent_cost' => 'nullable|numeric|min:0',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'required|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
            'status' => 'nullable|in:draft,completed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $plan = OperationalPlan::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Rencana operasional berhasil dibuat.',
                'data' => $plan
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating operational plan: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $plan = OperationalPlan::find($id);

        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operational plan not found'
            ], 404);
        }

        // Cek apakah user_id cocok dengan pemilik data
        if ($request->user_id != $plan->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'business_location' => 'sometimes|required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'sometimes|required|string|max:50',
            'location_size' => 'nullable|numeric|min:0',
            'rent_cost' => 'nullable|numeric|min:0',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'sometimes|required|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
            'status' => 'nullable|in:draft,completed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $plan->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Rencana operasional berhasil diperbarui.',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating operational plan: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data.'
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $plan = OperationalPlan::find($id);

        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operational plan not found'
            ], 404);
        }

        if ($request->user_id != $plan->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot delete this data'
            ], 403);
        }

        try {
            $plan->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Rencana operasional berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting operational plan: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghapus data.'
            ], 500);
        }
    }
}
