<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessPlan\BusinessController;
use App\Http\Controllers\BusinessPlan\ExecutiveSummaryController;
use App\Http\Controllers\BusinessPlan\FinancialPlanController;
use App\Http\Controllers\BusinessPlan\MarketAnalysisController;
use App\Http\Controllers\BusinessPlan\MarketingStrategyController;
use App\Http\Controllers\BusinessPlan\ProductServiceController;
use App\Http\Controllers\BusinessPlan\OperationalPlanController;
use App\Http\Controllers\BusinessPlan\TeamStructureController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-reset-otp', [AuthController::class, 'verifyResetOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Operational Plan Routes
Route::middleware('auth:sanctum')->group(function () {
    // Route::apiResource('operational-plans', OperationalPlanController::class);
    Route::get('business-backgrounds', [BusinessController::class, 'index']);
});


// Business Background
Route::prefix('business-background')->group(function () {
    Route::post('/', [BusinessController::class, 'store']);     // Create
    Route::get('/', [BusinessController::class, 'index']);      // Read all
    Route::get('/{id}', [BusinessController::class, 'show']);   // Read single
    Route::put('/{id}', [BusinessController::class, 'update']); // Update
    Route::delete('/{id}', [BusinessController::class, 'destroy']); // Delete
});

// Market Analysis
Route::prefix('market-analysis')->group(function () {
    Route::get('/', [MarketAnalysisController::class, 'index']); // optional: ?user_id=1 or ?business_background_id=2
    Route::get('/{id}', [MarketAnalysisController::class, 'show']);
    Route::post('/', [MarketAnalysisController::class, 'store']);
    Route::put('/{id}', [MarketAnalysisController::class, 'update']);
    Route::delete('/{id}', [MarketAnalysisController::class, 'destroy']);

    // REVISI: Route baru untuk kalkulasi market size
    Route::post('/calculate-market-size', [MarketAnalysisController::class, 'calculateMarketSize']);
});

// Product Service Routes
Route::prefix('product-service')->group(function () {
    Route::get('/', [ProductServiceController::class, 'index']);
    Route::get('/{id}', [ProductServiceController::class, 'show']);
    Route::post('/', [ProductServiceController::class, 'store']);
    Route::post('/{id}', [ProductServiceController::class, 'update']); // POST untuk FormData
    Route::put('/{id}', [ProductServiceController::class, 'update']); // PUT untuk JSON
    Route::delete('/{id}', [ProductServiceController::class, 'destroy']);
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
});

// Team Structure
Route::prefix('team-structure')->group(function () {
    Route::get('/', [TeamStructureController::class, 'index']);
    Route::get('/{id}', [TeamStructureController::class, 'show']);
    Route::post('/', [TeamStructureController::class, 'store']);
    Route::put('/{id}', [TeamStructureController::class, 'update']);
    Route::delete('/{id}', [TeamStructureController::class, 'destroy']);
});

// Financial Plan
Route::prefix('financial-plans')->group(function () {
    Route::get('/', [FinancialPlanController::class, 'index']);
    Route::post('/', [FinancialPlanController::class, 'store']);
    Route::get('/{id}', [FinancialPlanController::class, 'show']);
    Route::put('/{id}', [FinancialPlanController::class, 'update']);
    Route::delete('/{id}', [FinancialPlanController::class, 'destroy']);
});

// Route::get('/executive-summary', [ExecutiveSummaryController::class, 'index']);
Route::get('/executive-summary/{userId}', [ExecutiveSummaryController::class, 'index']);



Route::get('/test-wa', function () {
    $response = Http::withHeaders([
        'Authorization' => env('FONNTE_API_KEY'),
    ])->post(env('FONNTE_API_URL'), [
        'target' => '6281237867242', // ganti ke nomor kamu
        'message' => 'Halo Pandu! Tes kirim pesan dari Laravel 🚀',
    ]);

    return response()->json($response->json()); // <- penting! biar tampil hasilnya
});

// Route::get('/test-email/{email?}', function ($email = null) {
//     $testEmail = $email ?: 'pandusatria2807@gmail.com';

//     try {
//         Mail::raw('Test email from PlanWeb - Email Verification System', function ($message) use ($testEmail) {
//             $message->to($testEmail)
//                 ->subject('Test Email Verification - PlanWeb');
//         });

//         return response()->json([
//             'success' => true,
//             'message' => 'Email sent successfully to: ' . $testEmail
//         ]);
//     } catch (\Exception $e) {
//         return response()->json([
//             'success' => false,
//             'message' => $e->getMessage()
//         ]);
//     }
// });