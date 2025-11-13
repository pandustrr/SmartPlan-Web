<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessBackground;
use App\Models\MarketingStrategy;
use App\Models\FinancialPlan;

class ExecutiveSummaryController extends Controller
{
    public function index($userId)
    {
        // Ambil semua data berdasarkan user_id yang dikirim dari frontend
        $backgrounds = BusinessBackground::where('user_id', $userId)->get();
        $strategies = MarketingStrategy::with('businessBackground')
            ->where('user_id', $userId)
            ->get();
        $finances = FinancialPlan::with('businessBackground')
            ->where('user_id', $userId)
            ->get();

        // Buat ringkasan otomatis
        $summary = [
            'business_overview' => $backgrounds->map(fn($b) => [
                'name' => $b->name,
                'category' => $b->category,
                'description' => $b->description,
                'vision' => $b->vision,
                'mission' => $b->mission,
            ]),
            'marketing_summary' => $strategies->map(fn($s) => [
                'promotion_strategy' => $s->promotion_strategy,
                'media_used' => $s->media_used,
                'pricing_strategy' => $s->pricing_strategy,
                'monthly_target' => $s->monthly_target,
            ]),
            'financial_summary' => $finances->map(fn($f) => [
                'capital_source' => $f->capital_source,
                'initial_capex' => $f->initial_capex,
                'operational_cost' => $f->operational_cost,
                'estimated_income' => $f->estimated_income,
                'profit_loss' => $f->estimated_income - $f->operational_cost,
            ]),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $summary
        ]);
    }
}
