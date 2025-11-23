<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessPlan\BusinessController;
use App\Http\Controllers\BusinessPlan\MarketAnalysisController;
use App\Http\Controllers\BusinessPlan\ProductServiceController;
use App\Http\Controllers\BusinessPlan\MarketingStrategyController;
use App\Http\Controllers\BusinessPlan\OperationalPlanController;
use App\Http\Controllers\BusinessPlan\TeamStructureController;
use App\Http\Controllers\BusinessPlan\FinancialPlanController;
use App\Http\Controllers\BusinessPlan\PdfBusinessPlanController;
use App\Http\Controllers\UserController;

// =====================================
// CORS preflight untuk semua route
// =====================================
Route::options('{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept, Origin')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// =====================================
// Auth routes (PUBLIC)
// =====================================
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/verify-otp', 'verifyOtp');
    Route::post('/resend-otp', 'resendOtp');
    Route::post('/login', 'login');
    Route::post('/forgot-password', 'forgotPassword');
    Route::post('/verify-reset-otp', 'verifyResetOtp');
    Route::post('/reset-password', 'resetPassword');
});

// =====================================
// Protected routes (ALL AUTHENTICATED)
// =====================================
Route::middleware(['auth:sanctum', 'cors'])->group(function () {

    // User session
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Business Background
    Route::prefix('business-background')->group(function () {
        Route::post('/', [BusinessController::class, 'store']);
        Route::get('/', [BusinessController::class, 'index']);
        Route::get('/{id}', [BusinessController::class, 'show']);
        Route::put('/{id}', [BusinessController::class, 'update']);
        Route::delete('/{id}', [BusinessController::class, 'destroy']);
    });

    // Market Analysis
    Route::prefix('market-analysis')->group(function () {
        Route::get('/', [MarketAnalysisController::class, 'index']);
        Route::get('/{id}', [MarketAnalysisController::class, 'show']);
        Route::post('/', [MarketAnalysisController::class, 'store']);
        Route::put('/{id}', [MarketAnalysisController::class, 'update']);
        Route::delete('/{id}', [MarketAnalysisController::class, 'destroy']);
        Route::post('/calculate-market-size', [MarketAnalysisController::class, 'calculateMarketSize']);
    });

    // Product Service
    Route::prefix('product-service')->group(function () {
        Route::get('/', [ProductServiceController::class, 'index']);
        Route::get('/{id}', [ProductServiceController::class, 'show']);
        Route::post('/', [ProductServiceController::class, 'store']);
        Route::post('/{id}', [ProductServiceController::class, 'update']);
        Route::put('/{id}', [ProductServiceController::class, 'update']);
        Route::delete('/{id}', [ProductServiceController::class, 'destroy']);
        Route::post('/{id}/generate-bmc-alignment', [ProductServiceController::class, 'generateBmcAlignment']);
        Route::get('/statistics/overview', [ProductServiceController::class, 'getStatistics']);
    });

    // Marketing Strategy
    Route::prefix('marketing-strategy')->group(function () {
        Route::get('/', [MarketingStrategyController::class, 'index']);
        Route::post('/', [MarketingStrategyController::class, 'store']);
        Route::get('/{id}', [MarketingStrategyController::class, 'show']);
        Route::put('/{id}', [MarketingStrategyController::class, 'update']);
        Route::delete('/{id}', [MarketingStrategyController::class, 'destroy']);
    });

    // Operational Plan
    Route::prefix('operational-plan')->group(function () {
        Route::get('/', [OperationalPlanController::class, 'index']);
        Route::post('/', [OperationalPlanController::class, 'store']);
        Route::get('/{id}', [OperationalPlanController::class, 'show']);
        Route::put('/{id}', [OperationalPlanController::class, 'update']);
        Route::delete('/{id}', [OperationalPlanController::class, 'destroy']);
        Route::post('/{id}/generate-workflow-diagram', [OperationalPlanController::class, 'generateWorkflowDiagram']);
        Route::post('/{id}/upload-workflow-image', [OperationalPlanController::class, 'uploadWorkflowImage']);
        Route::get('/statistics/overview', [OperationalPlanController::class, 'getStatistics']);
    });

    // Team Structure
    Route::prefix('team-structure')->group(function () {
        Route::get('/', [TeamStructureController::class, 'index']);
        Route::get('/{id}', [TeamStructureController::class, 'show']);
        Route::post('/', [TeamStructureController::class, 'store']);
        Route::put('/{id}', [TeamStructureController::class, 'update']);
        Route::delete('/{id}', [TeamStructureController::class, 'destroy']);
        Route::post('/{id}/upload-photo', [TeamStructureController::class, 'uploadPhoto']);
    });

    // Financial Plan
    Route::prefix('financial-plans')->group(function () {
        Route::get('/', [FinancialPlanController::class, 'index']);
        Route::post('/', [FinancialPlanController::class, 'store']);
        Route::get('/{id}', [FinancialPlanController::class, 'show']);
        Route::put('/{id}', [FinancialPlanController::class, 'update']);
        Route::delete('/{id}', [FinancialPlanController::class, 'destroy']);

        Route::get('/summary/financial', [FinancialPlanController::class, 'getFinancialSummary']);
        Route::get('/dashboard/charts', [FinancialPlanController::class, 'getDashboardCharts']);

        Route::get('/{id}/cash-flow', [FinancialPlanController::class, 'getCashFlowSimulation']);
        Route::get('/{id}/feasibility', [FinancialPlanController::class, 'getFeasibilityAnalysis']);
        Route::get('/{id}/forecast', [FinancialPlanController::class, 'getFinancialForecast']);
        Route::get('/{id}/sensitivity', [FinancialPlanController::class, 'getSensitivityAnalysis']);

        Route::get('/{id}/report', [FinancialPlanController::class, 'generateReport']);
        Route::get('/{id}/charts', [FinancialPlanController::class, 'getChartData']);
    });

    // PDF Business Plan
    Route::prefix('pdf-business-plan')->group(function () {
        Route::post('/generate', [PdfBusinessPlanController::class, 'generatePdf']);
        Route::post('/executive-summary', [PdfBusinessPlanController::class, 'generateExecutiveSummary']);
        Route::get('/statistics', [PdfBusinessPlanController::class, 'getPdfStatistics']);
    });
});

// =====================================
// User (public admin panel endpoints)
// =====================================
Route::prefix('user')->group(function () {
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::put('/{id}/password', [UserController::class, 'updatePassword']);
    Route::put('/{id}/status', [UserController::class, 'updateStatus']);
});
