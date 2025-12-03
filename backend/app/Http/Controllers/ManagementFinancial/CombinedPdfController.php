<?php

namespace App\Http\Controllers\ManagementFinancial;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\BusinessBackground;
use App\Models\MarketAnalysis;
use App\Models\ProductService;
use App\Models\MarketingStrategy;
use App\Models\OperationalPlan;
use App\Models\TeamStructure;
use App\Models\FinancialPlan;
use App\Models\ManagementFinancial\FinancialCategory;
use App\Models\ManagementFinancial\FinancialSimulation;
use App\Models\ManagementFinancial\FinancialProjection;
use App\Models\Forecast\ForecastData;
use App\Models\Forecast\ForecastResult;
use App\Models\Forecast\ForecastInsight;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class CombinedPdfController extends Controller
{
    /**
     * Generate Combined PDF (Business Plan + Financial Report)
     */
    public function generateCombinedPdf(Request $request)
    {
        try {
            Log::info('Combined PDF Generation Started', [
                'user_id' => $request->user_id,
                'business_background_id' => $request->business_background_id,
                'period_type' => $request->period_type,
                'period_value' => $request->period_value,
                'mode' => $request->mode
            ]);

            // Validasi input
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'business_background_id' => 'required|exists:business_backgrounds,id',
                'period_type' => 'required|in:year,month',
                'period_value' => 'required',
                'mode' => 'required|in:free,pro'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = $request->user_id;
            $businessBackgroundId = $request->business_background_id;
            $periodType = $request->period_type;
            $periodValue = $request->period_value;
            $mode = $request->mode;

            // 1. Get Business Plan Data (similar to PdfBusinessPlanController)
            Log::info('📊 Step 1: Fetching Business Plan Data...');
            $businessPlanData = $this->getBusinessPlanData($userId, $businessBackgroundId);

            if (!$businessPlanData['business_background']) {
                Log::error('❌ Business background not found', [
                    'user_id' => $userId,
                    'business_background_id' => $businessBackgroundId
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background not found'
                ], 404);
            }

            Log::info('✅ Business Plan Data Retrieved', [
                'business_name' => $businessPlanData['business_background']->name,
                'business_id' => $businessPlanData['business_background']->id,
                'category' => $businessPlanData['business_background']->category,
                'market_analysis' => $businessPlanData['market_analysis'] ? 'YES' : 'NO',
                'products_services_count' => $businessPlanData['products_services']->count(),
                'marketing_strategies_count' => $businessPlanData['marketing_strategies']->count(),
                'operational_plans_count' => $businessPlanData['operational_plans']->count(),
                'team_structures_count' => $businessPlanData['team_structures']->count(),
                'financial_plans_count' => $businessPlanData['financial_plans']->count(),
            ]);

            // Log detail market analysis
            if ($businessPlanData['market_analysis']) {
                Log::info('📈 Market Analysis Details', [
                    'has_target_market' => !empty($businessPlanData['market_analysis']->target_market),
                    'has_swot' => !empty($businessPlanData['market_analysis']->strengths),
                    'competitors_count' => $businessPlanData['market_analysis']->competitors->count()
                ]);
            }

            // 2. Get Financial Report Data (similar to PdfFinancialReportController)
            Log::info('💰 Step 2: Fetching Financial Data...');
            $financialData = $this->getFinancialData($userId, $businessBackgroundId, $periodType, $periodValue);

            Log::info('✅ Financial Data Retrieved', [
                'period_type' => $periodType,
                'period_value' => $periodValue,
                'categories_count' => isset($financialData['categories']) ? count($financialData['categories']) : 0,
                'simulations_count' => isset($financialData['simulations']) ? count($financialData['simulations']) : 0,
                'projections_count' => isset($financialData['projections']) ? count($financialData['projections']) : 0,
                'has_summary' => isset($financialData['summary'])
            ]);

            // 3. Generate summaries
            Log::info('📝 Step 3: Generating Executive Summaries...');
            $businessExecutiveSummary = $this->createBusinessExecutiveSummary($businessPlanData);
            $financialExecutiveSummary = $this->createFinancialExecutiveSummary($financialData);

            Log::info('✅ Executive Summaries Generated', [
                'business_summary_length' => strlen($businessExecutiveSummary),
                'has_financial_summary' => !empty($financialExecutiveSummary)
            ]);

            // 4. Generate Business Plan Workflows
            Log::info('🔄 Step 4: Generating Workflow Diagrams...');
            $workflows = $this->generateWorkflowDiagrams($businessPlanData['operational_plans']);

            Log::info('✅ Workflow Diagrams Generated', [
                'workflows_count' => count($workflows)
            ]);

            // 5. Generate Business Plan Charts (6 charts untuk Financial Plans)
            Log::info('📊 Step 5: Generating Business Plan Charts...');
            $businessPlanCharts = [];
            if ($businessPlanData['financial_plans']->count() > 0) {
                $businessPlanCharts = $this->generateBusinessPlanCharts($businessPlanData['financial_plans']);
            }

            Log::info('✅ Business Plan Charts Generated', [
                'charts_count' => count($businessPlanCharts),
                'chart_keys' => array_keys($businessPlanCharts)
            ]);

            // 6. Generate Financial Report Charts (4 charts)
            Log::info('📊 Step 6: Generating Financial Report Charts...');
            $financialCharts = $this->generateCharts($financialData, $periodType);

            Log::info('✅ Financial Report Charts Generated', [
                'charts_count' => count($financialCharts),
                'chart_keys' => array_keys($financialCharts)
            ]);

            // 7. Get Forecast Data
            Log::info('📈 Step 7: Fetching Forecast Data...');
            $forecastData = $this->getForecastData($userId, $periodType, $periodValue);

            $hasForecast = !empty($forecastData['forecast_data']);
            $forecastExecutiveSummary = $hasForecast ? $this->generateForecastExecutiveSummary($forecastData) : null;
            $forecastStatistics = $hasForecast ? $this->calculateForecastStatistics($forecastData) : null;

            Log::info('✅ Forecast Data Retrieved', [
                'has_forecast' => $hasForecast,
                'forecast_results_count' => $hasForecast ? count($forecastData['results']) : 0,
                'forecast_insights_count' => $hasForecast ? count($forecastData['insights']) : 0
            ]);

            // 8. Generate Combined PDF
            Log::info('📄 Step 8: Generating PDF Document...');

            // Log all data being passed to view
            Log::info('🔍 Data being passed to PDF view:', [
                'business_background_exists' => isset($businessPlanData['business_background']),
                'market_analysis_exists' => isset($businessPlanData['market_analysis']),
                'products_services_count' => $businessPlanData['products_services']->count(),
                'marketing_strategies_count' => $businessPlanData['marketing_strategies']->count(),
                'operational_plans_count' => $businessPlanData['operational_plans']->count(),
                'team_structures_count' => $businessPlanData['team_structures']->count(),
                'financial_plans_count' => $businessPlanData['financial_plans']->count(),
                'workflows_count' => count($workflows),
                'businessPlanCharts_count' => count($businessPlanCharts),
                'financial_data_keys' => array_keys($financialData),
                'executiveSummary_length' => strlen($businessExecutiveSummary),
                'financial_summary_type' => gettype($financialExecutiveSummary),
                'financialCharts_count' => count($financialCharts),
                'mode' => $mode,
                'period_type' => $periodType,
                'period_label' => $this->getPeriodLabel($periodType, $periodValue)
            ]);

            $pdf = PDF::loadView('pdf.combined-report', [
                'data' => $businessPlanData,  // Business plan data
                'financial_data' => $financialData,  // Financial data
                'executiveSummary' => $businessExecutiveSummary,  // Business executive summary
                'financial_summary' => $financialExecutiveSummary,  // Financial summary
                'charts' => $businessPlanCharts,  // Business Plan charts (6 charts) - untuk Section 8
                'financialCharts' => $financialCharts,  // Financial Report charts (4 charts) - untuk BAGIAN 2
                'workflows' => $workflows,  // Workflow diagrams for operational plans - untuk Section 6
                // Forecast data - untuk BAGIAN 3
                'forecast_data' => $forecastData['forecast_data'] ?? null,
                'forecast_results' => $forecastData['results'] ?? [],
                'forecast_insights' => $forecastData['insights'] ?? [],
                'forecast_summary' => $forecastExecutiveSummary,
                'forecast_statistics' => $forecastStatistics,
                'has_forecast' => $hasForecast,
                // Common data
                'mode' => $mode,
                'period_type' => $periodType,
                'period_label' => $this->getPeriodLabel($periodType, $periodValue),
                'generated_at' => now()->format('d F Y H:i:s')
            ]);

            // Konfigurasi PDF (Landscape untuk tabel lebar)
            $pdf->setPaper('A4', 'landscape');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'Arial',
                'enable_php' => false
            ]);

            // Generate filename
            $businessName = Str::slug($businessPlanData['business_background']->name);
            $filename = "laporan-lengkap-{$businessName}-{$periodValue}.pdf";

            Log::info('Combined PDF Generated Successfully', [
                'filename' => $filename,
                'user_id' => $userId
            ]);

            // Return PDF sebagai download
            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('Combined PDF Generation Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Business Plan Data
     */
    private function getBusinessPlanData($userId, $businessBackgroundId)
    {
        Log::info('🔍 getBusinessPlanData - Start fetching...', [
            'user_id' => $userId,
            'business_background_id' => $businessBackgroundId
        ]);

        $businessBackground = BusinessBackground::with('user')
            ->where('user_id', $userId)
            ->where('id', $businessBackgroundId)
            ->first();

        if (!$businessBackground) {
            Log::warning('⚠️ Business Background NOT FOUND');
            return ['business_background' => null];
        }

        Log::info('✅ Business Background Found', [
            'name' => $businessBackground->name,
            'category' => $businessBackground->category,
            'has_description' => !empty($businessBackground->description),
            'has_vision' => !empty($businessBackground->vision),
            'has_mission' => !empty($businessBackground->mission)
        ]);

        $marketAnalysis = MarketAnalysis::with(['businessBackground', 'competitors'])
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->first();

        Log::info('📊 Market Analysis', [
            'found' => $marketAnalysis ? 'YES' : 'NO',
            'competitors_count' => $marketAnalysis ? $marketAnalysis->competitors->count() : 0
        ]);

        $products = ProductService::with(['businessBackground', 'user'])
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->get();

        Log::info('📦 Products & Services', ['count' => $products->count()]);

        $marketing = MarketingStrategy::with('businessBackground')
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->get();

        Log::info('📢 Marketing Strategies', ['count' => $marketing->count()]);

        $operational = OperationalPlan::with(['businessBackground', 'user'])
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->get();

        Log::info('⚙️ Operational Plans', ['count' => $operational->count()]);

        $team = TeamStructure::with(['businessBackground', 'user', 'operationalPlan'])
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->orderBy('sort_order')
            ->get();

        Log::info('👥 Team Structures', ['count' => $team->count()]);

        $financialPlans = FinancialPlan::with(['businessBackground', 'user'])
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->get();

        Log::info('💼 Financial Plans', ['count' => $financialPlans->count()]);

        return [
            'business_background' => $businessBackground,
            'market_analysis' => $marketAnalysis,
            'products_services' => $products,
            'marketing_strategies' => $marketing,
            'operational_plans' => $operational,
            'team_structures' => $team,
            'financial_plans' => $financialPlans
        ];
    }

    /**
     * Get Financial Data
     */
    private function getFinancialData($userId, $businessBackgroundId, $periodType, $periodValue)
    {
        Log::info('🔍 getFinancialData - Start fetching...', [
            'user_id' => $userId,
            'business_background_id' => $businessBackgroundId,
            'period_type' => $periodType,
            'period_value' => $periodValue
        ]);

        $periodData = $this->parsePeriod($periodType, $periodValue);

        Log::info('📅 Period Parsed', [
            'year' => $periodData['year'],
            'month' => $periodData['month'] ?? 'N/A'
        ]);

        $businessBackground = BusinessBackground::where('id', $businessBackgroundId)
            ->where('user_id', $userId)
            ->first();

        Log::info('🏢 Business Background for Financial', [
            'found' => $businessBackground ? 'YES' : 'NO',
            'name' => $businessBackground->name ?? 'N/A'
        ]);

        $categories = FinancialCategory::where('user_id', $userId)
            ->where('status', 'actual')
            ->get();

        Log::info('📁 Financial Categories', ['count' => $categories->count()]);

        $simulationsQuery = FinancialSimulation::with('category')
            ->where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->where('status', 'completed');

        if ($periodType === 'year') {
            $simulationsQuery->where('year', $periodData['year']);
        } else {
            $simulationsQuery->where('year', $periodData['year'])
                ->where('month', $periodData['month']);
        }

        $simulations = $simulationsQuery->orderBy('simulation_date', 'asc')->get();

        Log::info('💰 Financial Simulations (Period)', [
            'count' => $simulations->count(),
            'total_income' => $simulations->where('transaction_type', 'income')->sum('amount'),
            'total_expense' => $simulations->where('transaction_type', 'expense')->sum('amount')
        ]);

        $allSimulations = FinancialSimulation::where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->where('status', 'completed')
            ->get();

        Log::info('💰 Financial Simulations (All)', ['count' => $allSimulations->count()]);

        $summary = $this->calculateSummary($simulations, $allSimulations, $businessBackground);
        Log::info('📊 Summary Calculated', [
            'has_summary' => !empty($summary),
            'summary_keys' => array_keys($summary)
        ]);

        $categorySummary = $this->getCategorySummary($simulations, $categories);
        Log::info('📁 Category Summary', [
            'top_income_count' => isset($categorySummary['top_income']) ? count($categorySummary['top_income']) : 0,
            'top_expense_count' => isset($categorySummary['top_expense']) ? count($categorySummary['top_expense']) : 0
        ]);

        $monthlySummary = [];
        if ($periodType === 'year') {
            $monthlySummary = $this->getMonthlySummary($simulations, $periodData['year']);
            Log::info('📅 Monthly Summary', ['months_count' => count($monthlySummary)]);
        }

        $projections = FinancialProjection::where('user_id', $userId)
            ->where('business_background_id', $businessBackgroundId)
            ->whereIn('scenario_type', ['optimistic', 'realistic', 'pessimistic'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('scenario_type')
            ->map(function ($group) {
                return $group->first();
            })
            ->values();

        Log::info('📈 Financial Projections', [
            'count' => $projections->count(),
            'scenarios' => $projections->pluck('scenario_type')->toArray()
        ]);

        $financialData = [
            'business_background' => $businessBackground,
            'categories' => $categories,
            'simulations' => $simulations,
            'summary' => $summary,
            'category_summary' => $categorySummary,
            'monthly_summary' => $monthlySummary,
            'projections' => $projections,
            'period' => $periodData
        ];

        Log::info('✅ getFinancialData - Complete', [
            'data_keys' => array_keys($financialData)
        ]);

        return $financialData;
    }

    /**
     * Calculate summary statistics
     */
    private function calculateSummary($simulations, $allSimulations, $businessBackground)
    {
        $totalIncome = $simulations->where('type', 'income')->sum('amount');
        $totalExpense = $simulations->where('type', 'expense')->sum('amount');
        $netProfit = $totalIncome - $totalExpense;

        $accumulatedIncome = $allSimulations->where('type', 'income')->sum('amount');
        $accumulatedExpense = $allSimulations->where('type', 'expense')->sum('amount');

        $initialCapital = 0;
        if ($businessBackground) {
            $projection = FinancialProjection::where('business_background_id', $businessBackground->id)
                ->orderByRaw("CASE WHEN scenario_type = 'realistic' THEN 1 WHEN scenario_type = 'optimistic' THEN 2 ELSE 3 END")
                ->orderBy('created_at', 'desc')
                ->first();

            $initialCapital = $projection ? $projection->initial_investment : $businessBackground->initial_capital;
        }

        $currentCashBalance = $initialCapital + $accumulatedIncome - $accumulatedExpense;

        return [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'net_profit' => $netProfit,
            'transaction_count' => $simulations->count(),
            'income_count' => $simulations->where('type', 'income')->count(),
            'expense_count' => $simulations->where('type', 'expense')->count(),
            'current_cash_balance' => $currentCashBalance,
            'accumulated_income' => $accumulatedIncome,
            'accumulated_expense' => $accumulatedExpense,
            'initial_capital' => $initialCapital
        ];
    }

    /**
     * Get summary per category
     */
    private function getCategorySummary($simulations, $categories)
    {
        $summary = [];

        foreach ($categories as $category) {
            $categorySimulations = $simulations->where('financial_category_id', $category->id);
            $total = $categorySimulations->sum('amount');
            $count = $categorySimulations->count();

            if ($count > 0) {
                $summary[] = [
                    'category' => $category,
                    'total' => $total,
                    'count' => $count,
                    'average' => $total / $count,
                    'type' => $category->type
                ];
            }
        }

        usort($summary, function ($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        return [
            'all' => $summary,
            'income' => array_filter($summary, fn($s) => $s['type'] === 'income'),
            'expense' => array_filter($summary, fn($s) => $s['type'] === 'expense'),
            'top_income' => array_slice(array_filter($summary, fn($s) => $s['type'] === 'income'), 0, 5),
            'top_expense' => array_slice(array_filter($summary, fn($s) => $s['type'] === 'expense'), 0, 5)
        ];
    }

    /**
     * Get monthly summary
     */
    private function getMonthlySummary($simulations, $year)
    {
        $summary = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthSimulations = $simulations->filter(function ($sim) use ($month) {
                return Carbon::parse($sim->simulation_date)->month == $month;
            });

            $income = $monthSimulations->where('type', 'income')->sum('amount');
            $expense = $monthSimulations->where('type', 'expense')->sum('amount');

            $summary[] = [
                'month' => $month,
                'month_name' => Carbon::create($year, $month, 1)->isoFormat('MMMM'),
                'income' => $income,
                'expense' => $expense,
                'net_profit' => $income - $expense,
                'transaction_count' => $monthSimulations->count()
            ];
        }

        return $summary;
    }

    /**
     * Generate charts for Financial Report
     */
    private function generateCharts($data, $periodType)
    {
        $charts = [];

        try {
            // Income vs Expense Chart
            $incomeVsExpenseUrl = $this->generateIncomeVsExpenseChart($data);
            if ($incomeVsExpenseUrl) {
                $charts['income_vs_expense'] = $incomeVsExpenseUrl;
            }

            // Monthly Trend Chart
            if ($periodType === 'year' && !empty($data['monthly_summary'])) {
                $monthlyTrendUrl = $this->generateMonthlyTrendChart($data['monthly_summary']);
                if ($monthlyTrendUrl) {
                    $charts['monthly_trend'] = $monthlyTrendUrl;
                }
            }

            // Category Pie Charts
            if (!empty($data['category_summary']['top_income'])) {
                $categoryIncomeUrl = $this->generateCategoryPieChart($data['category_summary']['top_income'], 'income');
                if ($categoryIncomeUrl) {
                    $charts['category_income_pie'] = $categoryIncomeUrl;
                }
            }

            if (!empty($data['category_summary']['top_expense'])) {
                $categoryExpenseUrl = $this->generateCategoryPieChart($data['category_summary']['top_expense'], 'expense');
                if ($categoryExpenseUrl) {
                    $charts['category_expense_pie'] = $categoryExpenseUrl;
                }
            }
        } catch (\Exception $e) {
            Log::error('Chart generation error: ' . $e->getMessage());
        }

        return $charts;
    }

    /**
     * Generate Income vs Expense bar chart
     */
    private function generateIncomeVsExpenseChart($data)
    {
        $summary = $data['summary'];

        $chartConfig = [
            'type' => 'bar',
            'data' => [
                'labels' => ['Pendapatan', 'Pengeluaran', 'Laba/Rugi'],
                'datasets' => [[
                    'label' => 'Ringkasan Keuangan',
                    'data' => [
                        $summary['total_income'],
                        $summary['total_expense'],
                        $summary['net_profit']
                    ],
                    'backgroundColor' => ['#10b981', '#ef4444', '#3b82f6']
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Perbandingan Pendapatan vs Pengeluaran'
                    ]
                ],
                'scales' => [
                    'y' => [
                        'beginAtZero' => true
                    ]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate Monthly Trend line chart
     */
    private function generateMonthlyTrendChart($monthlySummary)
    {
        $labels = array_map(fn($m) => $m['month_name'], $monthlySummary);
        $incomeData = array_map(fn($m) => $m['income'], $monthlySummary);
        $expenseData = array_map(fn($m) => $m['expense'], $monthlySummary);

        $chartConfig = [
            'type' => 'line',
            'data' => [
                'labels' => $labels,
                'datasets' => [
                    [
                        'label' => 'Pendapatan',
                        'data' => $incomeData,
                        'borderColor' => '#10b981',
                        'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                        'fill' => true
                    ],
                    [
                        'label' => 'Pengeluaran',
                        'data' => $expenseData,
                        'borderColor' => '#ef4444',
                        'backgroundColor' => 'rgba(239, 68, 68, 0.1)',
                        'fill' => true
                    ]
                ]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Tren Bulanan'
                    ]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate Category Pie chart
     */
    private function generateCategoryPieChart($categories, $type = 'income')
    {
        $labels = [];
        $data = [];
        $colors = $type === 'income'
            ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
            : ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

        foreach ($categories as $index => $cat) {
            $labels[] = $cat['category']->name;
            $data[] = $cat['total'];
        }

        $chartConfig = [
            'type' => 'pie',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'data' => $data,
                    'backgroundColor' => $colors
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => $type === 'income' ? 'Distribusi Pendapatan' : 'Distribusi Pengeluaran'
                    ]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 600, 400);
    }

    /**
     * Generate QuickChart URL
     */
    private function getQuickChartUrl($config, $width = 800, $height = 400)
    {
        try {
            $baseUrl = 'https://quickchart.io/chart';
            $params = [
                'c' => json_encode($config),
                'width' => $width,
                'height' => $height,
                'backgroundColor' => 'white',
                'devicePixelRatio' => 2.0
            ];

            $fullUrl = $baseUrl . '?' . http_build_query($params);
            return $fullUrl;
        } catch (\Exception $e) {
            Log::error('QuickChart URL generation error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Parse period value
     */
    private function parsePeriod($periodType, $periodValue)
    {
        if ($periodType === 'year') {
            return [
                'year' => (int) $periodValue,
                'month' => null
            ];
        } else {
            $parts = explode('-', $periodValue);
            return [
                'year' => (int) $parts[0],
                'month' => (int) $parts[1]
            ];
        }
    }

    /**
     * Get period label
     */
    private function getPeriodLabel($periodType, $periodValue)
    {
        if ($periodType === 'year') {
            return "Tahun " . $periodValue;
        } else {
            $date = Carbon::createFromFormat('Y-m', $periodValue);
            return $date->isoFormat('MMMM YYYY');
        }
    }

    /**
     * Create Business Executive Summary
     */
    private function createBusinessExecutiveSummary($businessData)
    {
        $business = $businessData['business_background'];
        $marketAnalysis = $businessData['market_analysis'];
        $financialPlan = $businessData['financial_plans']->first();

        $summary = "{$business->name} adalah bisnis dalam kategori {$business->category} ";
        $summary .= "yang berfokus pada {$business->description}. ";

        if ($marketAnalysis && $marketAnalysis->target_market) {
            $summary .= "Menargetkan pasar: " . $marketAnalysis->target_market . ". ";
        }

        if ($financialPlan) {
            $summary .= "Proyeksi pendapatan bulanan: Rp " .
                number_format($financialPlan->total_monthly_income ?? 0, 0, ',', '.') . ". ";
        }

        return $summary;
    }

    /**
     * Create Financial Executive Summary
     */
    private function createFinancialExecutiveSummary($data)
    {
        $summary = $data['summary'];
        $categorySummary = $data['category_summary'];
        $monthlySummary = $data['monthly_summary'] ?? [];
        $periodInfo = $data['period'] ?? [];

        $profitStatus = $summary['net_profit'] >= 0 ? 'profit' : 'loss';
        $profitPercentage = $summary['total_income'] > 0
            ? ($summary['net_profit'] / $summary['total_income']) * 100
            : 0;

        $topIncomeCategory = !empty($categorySummary['top_income'])
            ? $categorySummary['top_income'][0]['category']->name
            : '-';

        $topExpenseCategory = !empty($categorySummary['top_expense'])
            ? $categorySummary['top_expense'][0]['category']->name
            : '-';

        // Generate executive summary text
        $executiveSummaryText = $this->generateFinancialSummaryText($summary, $categorySummary, $periodInfo);

        // Return struktur lengkap untuk template
        return [
            // Original fields untuk backward compatibility
            'profit_status' => $profitStatus,
            'profit_percentage' => round($profitPercentage, 2),
            'top_income_category' => $topIncomeCategory,
            'top_expense_category' => $topExpenseCategory,
            'cash_health' => $summary['current_cash_balance'] > 0 ? 'healthy' : 'critical',

            // Fields lengkap untuk template BAGIAN 2
            'executive_summary' => $executiveSummaryText,
            'summary_cards' => [
                'total_income' => $summary['total_income'],
                'total_expense' => $summary['total_expense'],
                'net_profit' => $summary['net_profit'],
                'cash_balance' => $summary['current_cash_balance'],
                'income_count' => $summary['income_count'],
                'expense_count' => $summary['expense_count'],
                'transaction_count' => $summary['transaction_count']
            ],
            'category_summary' => $categorySummary,
            'monthly_summary' => $monthlySummary,
            'year' => $periodInfo['year'] ?? date('Y'),
            'month' => $periodInfo['month'] ?? null
        ];
    }

    /**
     * Generate executive summary text untuk financial report
     */
    private function generateFinancialSummaryText($summary, $categorySummary, $periodInfo)
    {
        $year = $periodInfo['year'] ?? date('Y');
        $businessName = "bisnis";

        $profitStatus = $summary['net_profit'] >= 0 ? 'mengalami keuntungan' : 'mengalami kerugian';
        $profitAmount = number_format(abs($summary['net_profit']), 0, ',', '.');

        $topIncome = !empty($categorySummary['top_income'])
            ? $categorySummary['top_income'][0]['category']->name
            : 'tidak ada';

        $topExpense = !empty($categorySummary['top_expense'])
            ? $categorySummary['top_expense'][0]['category']->name
            : 'tidak ada';

        return "Ringkasan keuangan untuk periode {$year} menunjukkan bahwa {$businessName} {$profitStatus} sebesar Rp {$profitAmount}. "
            . "Total pendapatan mencapai Rp " . number_format($summary['total_income'], 0, ',', '.') . " "
            . "dengan total pengeluaran sebesar Rp " . number_format($summary['total_expense'], 0, ',', '.') . ". "
            . "Kategori pendapatan tertinggi berasal dari {$topIncome}, "
            . "sedangkan pengeluaran terbesar untuk {$topExpense}. "
            . "Saldo kas saat ini adalah Rp " . number_format($summary['current_cash_balance'], 0, ',', '.') . ".";
    }

    /**
     * Generate Business Plan Charts (6 charts untuk Financial Plan section)
     */
    private function generateBusinessPlanCharts($financialPlans)
    {
        $charts = [];

        // Ambil financial plan pertama saja untuk combined PDF
        $plan = $financialPlans->first();

        if (!$plan) {
            return $charts;
        }

        try {
            // 1. Chart Sumber Modal → key: 'capital_structure'
            if ($plan->capital_sources && count($plan->capital_sources) > 0) {
                $charts['capital_structure'] = $this->generateCapitalSourcesChart($plan);
            }

            // 2. Chart Proyeksi Penjualan → key: 'revenue_streams'
            // Field yang benar adalah 'sales_projections' (plural)
            if ($plan->sales_projections && count($plan->sales_projections) > 0) {
                $charts['revenue_streams'] = $this->generateSalesProjectionChart($plan);
            }

            // 3. Chart Breakdown Biaya Operasional → key: 'expense_breakdown'
            // Field yang benar adalah 'monthly_opex'
            if ($plan->monthly_opex && count($plan->monthly_opex) > 0) {
                $charts['expense_breakdown'] = $this->generateOperationalCostsChart($plan);
            }

            // 4. Chart Ringkasan Laba Rugi Bulanan → key: 'profit_loss'
            // Generate dari data yang ada (tidak ada field monthly_profit_loss)
            $charts['profit_loss'] = $this->generateMonthlyProfitLossChart($plan);

            // 5. Chart Analisis Kelayakan → key: 'feasibility'
            $charts['feasibility'] = $this->generateFeasibilityChart($plan);

            // 6. Chart Proyeksi Keuangan Masa Depan → key: 'forecast'
            // Generate dari cash_flow_simulation atau proyeksi tahunan
            $charts['forecast'] = $this->generateFutureProjectionChart($plan);
        } catch (\Exception $e) {
            Log::error('Business Plan Chart Generation Error: ' . $e->getMessage(), [
                'financial_plan_id' => $plan->id,
                'trace' => $e->getTraceAsString()
            ]);
        }

        return $charts;
    }    /**
     * Generate Capital Sources Chart
     */
    private function generateCapitalSourcesChart($plan)
    {
        $sources = is_string($plan->capital_sources)
            ? json_decode($plan->capital_sources, true)
            : $plan->capital_sources;

        if (empty($sources)) return null;

        $labels = [];
        $data = [];
        foreach ($sources as $source) {
            $labels[] = $source['source'] ?? 'Unknown';
            $data[] = $source['amount'] ?? 0;
        }

        $chartConfig = [
            'type' => 'pie',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'data' => $data,
                    'backgroundColor' => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Sumber Modal'
                    ]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 600, 400);
    }

    /**
     * Generate Sales Projection Chart
     */
    private function generateSalesProjectionChart($plan)
    {
        // Field yang benar adalah sales_projections (plural)
        $projections = $plan->sales_projections;

        if (empty($projections)) return null;

        $labels = [];
        $data = [];
        foreach ($projections as $item) {
            $labels[] = $item['product'] ?? 'Unknown';
            $data[] = $item['monthly_income'] ?? 0;
        }        $chartConfig = [
            'type' => 'line',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'label' => 'Proyeksi Penjualan',
                    'data' => $data,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                    'tension' => 0.4
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Proyeksi Penjualan'
                    ]
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate Operational Costs Chart
     */
    private function generateOperationalCostsChart($plan)
    {
        // Field yang benar adalah monthly_opex
        $opexItems = $plan->monthly_opex;

        if (empty($opexItems)) return null;

        $labels = [];
        $data = [];
        foreach ($opexItems as $item) {
            $labels[] = $item['category'] ?? 'Unknown';
            $data[] = $item['amount'] ?? 0;
        }        $chartConfig = [
            'type' => 'bar',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'label' => 'Biaya Operasional',
                    'data' => $data,
                    'backgroundColor' => '#ef4444'
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Breakdown Biaya Operasional'
                    ]
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate Monthly Profit Loss Chart
     */
    private function generateMonthlyProfitLossChart($plan)
    {
        // Generate dari data yang ada (12 bulan proyeksi)
        $labels = [];
        $revenue = [];
        $expense = [];
        $profit = [];

        $monthlyRevenue = $plan->total_monthly_income ?? 0;
        $monthlyExpense = $plan->total_monthly_opex ?? 0;
        $monthlyProfit = $plan->net_profit ?? 0;

        for ($i = 1; $i <= 12; $i++) {
            $labels[] = 'Bulan ' . $i;
            $revenue[] = $monthlyRevenue;
            $expense[] = $monthlyExpense;
            $profit[] = $monthlyProfit;
        }        $chartConfig = [
            'type' => 'line',
            'data' => [
                'labels' => $labels,
                'datasets' => [
                    [
                        'label' => 'Pendapatan',
                        'data' => $revenue,
                        'borderColor' => '#10b981',
                        'backgroundColor' => 'transparent'
                    ],
                    [
                        'label' => 'Pengeluaran',
                        'data' => $expense,
                        'borderColor' => '#ef4444',
                        'backgroundColor' => 'transparent'
                    ],
                    [
                        'label' => 'Laba/Rugi',
                        'data' => $profit,
                        'borderColor' => '#3b82f6',
                        'backgroundColor' => 'transparent'
                    ]
                ]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Ringkasan Laba Rugi Bulanan'
                    ]
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate Feasibility Chart
     */
    private function generateFeasibilityChart($plan)
    {
        $chartConfig = [
            'type' => 'bar',
            'data' => [
                'labels' => ['ROI', 'Payback Period', 'Break Even Point'],
                'datasets' => [[
                    'label' => 'Analisis Kelayakan',
                    'data' => [
                        $plan->roi_percentage ?? 0,
                        $plan->payback_period_months ?? 0,
                        $plan->break_even_point ?? 0
                    ],
                    'backgroundColor' => ['#10b981', '#3b82f6', '#f59e0b']
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Analisis Kelayakan'
                    ]
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 600, 400);
    }

    /**
     * Generate Future Projection Chart
     */
    private function generateFutureProjectionChart($plan)
    {
        // Generate proyeksi 5 tahun dari data yang ada
        $labels = [];
        $data = [];

        $yearlyIncome = $plan->total_yearly_income ?? 0;
        $currentYear = date('Y');

        // Asumsi growth rate 10% per tahun
        $growthRate = 1.10;

        for ($i = 0; $i < 5; $i++) {
            $labels[] = 'Tahun ' . ($currentYear + $i);
            $data[] = $yearlyIncome * pow($growthRate, $i);
        }        $chartConfig = [
            'type' => 'line',
            'data' => [
                'labels' => $labels,
                'datasets' => [[
                    'label' => 'Proyeksi Pendapatan',
                    'data' => $data,
                    'borderColor' => '#8b5cf6',
                    'backgroundColor' => 'rgba(139, 92, 246, 0.1)',
                    'fill' => true,
                    'tension' => 0.4
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Proyeksi Keuangan Masa Depan (5 Tahun)'
                    ]
                ],
                'scales' => [
                    'y' => ['beginAtZero' => true]
                ]
            ]
        ];

        return $this->getQuickChartUrl($chartConfig, 800, 400);
    }

    /**
     * Generate workflow diagrams for operational plans
     */
    private function generateWorkflowDiagrams($operationalPlans)
    {
        $workflows = [];

        foreach ($operationalPlans as $plan) {
            if ($plan->workflow_diagram) {
                try {
                    // Untuk sementara return null, nanti bisa integrasikan dengan WorkflowDiagramService
                    // $diagram = is_string($plan->workflow_diagram)
                    //     ? json_decode($plan->workflow_diagram, true)
                    //     : $plan->workflow_diagram;
                    // $workflows[$plan->id] = $diagram;
                } catch (\Exception $e) {
                    Log::error('Workflow generation error: ' . $e->getMessage());
                }
            }
        }

        return $workflows;
    }

    /**
     * Get Forecast Data based on user and period
     */
    private function getForecastData($userId, $periodType, $periodValue)
    {
        try {
            $periodInfo = $this->parsePeriod($periodType, $periodValue);
            $year = $periodInfo['year'];
            $month = $periodInfo['month'];

            // Fetch ForecastData untuk user dan periode tertentu
            $forecastDataQuery = ForecastData::where('user_id', $userId)
                ->where('year', $year);

            if ($month) {
                $forecastDataQuery->where('month', $month);
            }

            $forecastData = $forecastDataQuery->with(['forecastResults', 'insights'])
                ->latest()
                ->first();

            if (!$forecastData) {
                Log::info('⚠️ No forecast data found for period', [
                    'user_id' => $userId,
                    'year' => $year,
                    'month' => $month
                ]);

                return [
                    'forecast_data' => null,
                    'results' => [],
                    'insights' => []
                ];
            }

            // Get forecast results (hasil prediksi bulanan)
            $results = $forecastData->forecastResults()
                ->orderBy('month', 'asc')
                ->get()
                ->toArray();

            // Get forecast insights
            $insights = $forecastData->insights()
                ->orderBy('severity', 'desc') // Critical first
                ->get()
                ->toArray();

            Log::info('✅ Forecast data found', [
                'forecast_data_id' => $forecastData->id,
                'year' => $forecastData->year,
                'month' => $forecastData->month,
                'results_count' => count($results),
                'insights_count' => count($insights)
            ]);

            return [
                'forecast_data' => $forecastData,
                'results' => $results,
                'insights' => $insights
            ];

        } catch (\Exception $e) {
            Log::error('Forecast data fetch error: ' . $e->getMessage(), [
                'user_id' => $userId,
                'period_type' => $periodType,
                'period_value' => $periodValue,
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'forecast_data' => null,
                'results' => [],
                'insights' => []
            ];
        }
    }

    /**
     * Generate executive summary untuk forecast
     */
    private function generateForecastExecutiveSummary($forecastData)
    {
        if (empty($forecastData['forecast_data']) || empty($forecastData['results'])) {
            return 'Data forecast tidak tersedia untuk periode ini.';
        }

        $data = $forecastData['forecast_data'];
        $results = $forecastData['results'];

        $stats = $this->calculateForecastStatistics($forecastData);

        $year = $data->year;
        $monthText = $data->month ? "bulan {$data->month} tahun {$year}" : "tahun {$year}";

        $totalIncome = number_format($stats['total_income'], 0, ',', '.');
        $totalExpense = number_format($stats['total_expense'], 0, ',', '.');
        $totalProfit = number_format(abs($stats['total_profit']), 0, ',', '.');
        $profitStatus = $stats['total_profit'] >= 0 ? 'keuntungan' : 'kerugian';

        $avgMargin = number_format($stats['avg_margin'], 2);
        $avgConfidence = number_format($stats['avg_confidence'], 2);
        $growthRate = number_format($stats['growth_rate'], 2);

        $highestIncomeMonth = $stats['highest_income_month'];
        $highestProfitMonth = $stats['highest_profit_month'];

        $summary = "Laporan proyeksi keuangan untuk {$monthText} menunjukkan prediksi total pendapatan sebesar Rp {$totalIncome} dengan total pengeluaran Rp {$totalExpense}, menghasilkan proyeksi {$profitStatus} sebesar Rp {$totalProfit}.\n\n";

        $summary .= "Margin keuntungan rata-rata diproyeksikan sebesar {$avgMargin}% dengan tingkat kepercayaan prediksi rata-rata {$avgConfidence}%. ";
        $summary .= "Tingkat pertumbuhan diperkirakan mencapai {$growthRate}%.\n\n";

        $summary .= "Pendapatan tertinggi diprediksi terjadi pada bulan {$highestIncomeMonth}, ";
        $summary .= "sedangkan laba tertinggi diperkirakan pada bulan {$highestProfitMonth}. ";

        $summary .= "Proyeksi ini dibuat menggunakan metode " . (strtoupper($results[0]['method'] ?? 'ARIMA')) . " dengan mempertimbangkan data historis dan tren pasar.";

        return $summary;
    }

    /**
     * Calculate statistics dari forecast results
     */
    private function calculateForecastStatistics($forecastData)
    {
        if (empty($forecastData['results'])) {
            return [
                'total_income' => 0,
                'total_expense' => 0,
                'total_profit' => 0,
                'avg_margin' => 0,
                'avg_confidence' => 0,
                'growth_rate' => 0,
                'highest_income_month' => '-',
                'highest_income_value' => 0,
                'highest_profit_month' => '-',
                'highest_profit_value' => 0
            ];
        }

        $results = $forecastData['results'];

        $totalIncome = 0;
        $totalExpense = 0;
        $totalProfit = 0;
        $totalMargin = 0;
        $totalConfidence = 0;
        $count = count($results);

        $highestIncome = ['month' => null, 'value' => 0];
        $highestProfit = ['month' => null, 'value' => PHP_FLOAT_MIN];

        foreach ($results as $result) {
            $income = floatval($result['forecast_income'] ?? 0);
            $expense = floatval($result['forecast_expense'] ?? 0);
            $profit = floatval($result['forecast_profit'] ?? 0);
            $margin = floatval($result['forecast_margin'] ?? 0);
            $confidence = floatval($result['confidence_level'] ?? 0);

            $totalIncome += $income;
            $totalExpense += $expense;
            $totalProfit += $profit;
            $totalMargin += $margin;
            $totalConfidence += $confidence;

            // Track highest income
            if ($income > $highestIncome['value']) {
                $highestIncome = [
                    'month' => $result['month'] ?? '-',
                    'value' => $income
                ];
            }

            // Track highest profit
            if ($profit > $highestProfit['value']) {
                $highestProfit = [
                    'month' => $result['month'] ?? '-',
                    'value' => $profit
                ];
            }
        }

        // Calculate growth rate (simple: compare last vs first month)
        $growthRate = 0;
        if ($count >= 2) {
            $firstProfit = floatval($results[0]['forecast_profit'] ?? 0);
            $lastProfit = floatval($results[$count - 1]['forecast_profit'] ?? 0);

            if ($firstProfit != 0) {
                $growthRate = (($lastProfit - $firstProfit) / abs($firstProfit)) * 100;
            }
        }

        return [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'total_profit' => $totalProfit,
            'avg_margin' => $count > 0 ? ($totalMargin / $count) : 0,
            'avg_confidence' => $count > 0 ? ($totalConfidence / $count) : 0,
            'growth_rate' => $growthRate,
            'highest_income_month' => $highestIncome['month'] ?? '-',
            'highest_income_value' => $highestIncome['value'],
            'highest_profit_month' => $highestProfit['month'] ?? '-',
            'highest_profit_value' => $highestProfit['value']
        ];
    }
}
