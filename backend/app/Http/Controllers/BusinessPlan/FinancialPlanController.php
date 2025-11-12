<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use App\Models\FinancialPlan;
use Illuminate\Http\Request;

class FinancialPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = FinancialPlan::with('businessBackground');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('business_background_id')) {
            $query->where('business_background_id', $request->business_background_id);
        }

        $data = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'capital_source' => 'required|in:Pribadi,Pinjaman,Investor',
            'initial_capex' => 'required|numeric|min:0',
            'monthly_operational_cost' => 'required|numeric|min:0',
            'estimated_monthly_income' => 'required|numeric|min:0',
        ]);

        $plan = FinancialPlan::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $plan
        ], 201);
    }

    public function show($id)
    {
        $plan = FinancialPlan::with('businessBackground')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $plan
        ]);
    }

    public function update(Request $request, $id)
    {
        $plan = FinancialPlan::findOrFail($id);

        $validated = $request->validate([
            'capital_source' => 'nullable|in:Pribadi,Pinjaman,Investor',
            'initial_capex' => 'nullable|numeric|min:0',
            'monthly_operational_cost' => 'nullable|numeric|min:0',
            'estimated_monthly_income' => 'nullable|numeric|min:0',
        ]);

        $plan->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $plan
        ]);
    }

    public function destroy($id)
    {
        $plan = FinancialPlan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Rencana keuangan berhasil dihapus'
        ]);
    }
}
