<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessPlan\BusinessController;
use App\Http\Controllers\BusinessPlan\MarketAnalysisController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/resend-verification', [AuthController::class, 'resendVerificationEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::get('/test-email/{email?}', function ($email = null) {
    $testEmail = $email ?: 'pandusatria2807@gmail.com';

    try {
        Mail::raw('Test email from PlanWeb - Email Verification System', function ($message) use ($testEmail) {
            $message->to($testEmail)
                ->subject('Test Email Verification - PlanWeb');
        });

        return response()->json([
            'success' => true,
            'message' => 'Email sent successfully to: ' . $testEmail
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
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
});
