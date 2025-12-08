<?php

/**
 * SINGAPAY PDF EXPORT PRO ROUTES CONFIGURATION
 * 
 * Tambahkan routes ini ke file routes/api.php
 * 
 * Format: Route::method('/path', [ControllerName::class, 'method'])->middleware(['auth:sanctum']);
 */

// [CUSTOMIZATION_ROUTES] - Add these routes to routes/api.php

// Protected routes (require authentication)
// Route::middleware(['auth:sanctum'])->group(function () {
//     // PDF Export Management
//     Route::prefix('pdf-export')->group(function () {
        
//         // Create export request & generate Virtual Account
//         Route::post('/create-request', [
//             'PDFExportProController',
//             'createExportRequest'
//         ])->name('pdf-export.create-request');

//         // Generate alternative payment options (QRIS, Payment Link)
//         Route::post('/payment-options', [
//             'PDFExportProController',
//             'generatePaymentOptions'
//         ])->name('pdf-export.payment-options');

//         // Check payment status
//         Route::get('/payment-status/{export_request_id}', [
//             'PDFExportProController',
//             'checkPaymentStatus'
//         ])->name('pdf-export.payment-status');

//         // Manual payment status check (polling)
//         Route::get('/payment-status-manual', [
//             'SingapayWebhookController',
//             'checkPaymentStatusManual'
//         ])->name('pdf-export.payment-status-manual');

//         // Download PDF (setelah payment)
//         Route::get('/download/{export_request_id}', [
//             'PDFExportProController',
//             'downloadPDF'
//         ])->name('pdf-export.download');

//         // Get export history
//         Route::get('/history', [
//             'PDFExportProController',
//             'getExportHistory'
//         ])->name('pdf-export.history');
//     });
// });

// // Public routes (no authentication required)
// Route::prefix('pdf-export')->group(function () {
    
//     // Get package pricing & features
//     Route::get('/pricing', [
//         'PDFExportProController',
//         'getPackagePricing'
//     ])->name('pdf-export.pricing');
// });

// // Webhook routes (no CSRF, no auth required)
// Route::prefix('webhooks')->group(function () {
    
//     // Singapay payment settlement webhook
//     // [CUSTOMIZATION_WEBHOOK] - Configure this endpoint in Singapay dashboard
//     Route::post('/singapay/payment-settlement', [
//         'SingapayWebhookController',
//         'handlePaymentSettlement'
//     ])->withoutMiddleware('verify_csrf_token')
//       ->name('webhook.singapay.payment-settlement');
// });

/**
 * COMPLETE routes/api.php EXAMPLE
 * 
 * Letakkan di akhir file routes/api.php:
 */

/*
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

Route::middleware(['auth:sanctum'])->group(function () {
    // ... existing routes ...
    
    // PDF Export Pro Routes
    Route::prefix('pdf-export')->group(function () {
        Route::post('/create-request', [PDFExportProController::class, 'createExportRequest'])->name('pdf-export.create-request');
        Route::post('/payment-options', [PDFExportProController::class, 'generatePaymentOptions'])->name('pdf-export.payment-options');
        Route::get('/payment-status/{export_request_id}', [PDFExportProController::class, 'checkPaymentStatus'])->name('pdf-export.payment-status');
        Route::get('/payment-status-manual', [SingapayWebhookController::class, 'checkPaymentStatusManual'])->name('pdf-export.payment-status-manual');
        Route::get('/download/{export_request_id}', [PDFExportProController::class, 'downloadPDF'])->name('pdf-export.download');
        Route::get('/history', [PDFExportProController::class, 'getExportHistory'])->name('pdf-export.history');
    });
    
    Route::get('/pdf-export/pricing', [PDFExportProController::class, 'getPackagePricing'])->name('pdf-export.pricing')->withoutMiddleware('auth:sanctum');
});

// Webhooks
Route::post('/webhooks/singapay/payment-settlement', [SingapayWebhookController::class, 'handlePaymentSettlement'])->withoutMiddleware('verify_csrf_token')->name('webhook.singapay.payment-settlement');
*/

/**
 * CUSTOMIZATION NOTES
 * 
 * [CUSTOMIZATION_ROUTES] - Adjust routes berdasarkan project structure:
 *   - Change controller namespace jika berbeda
 *   - Adjust prefix jika perlu
 *   - Add additional middleware (rate limiting, etc)
 * 
 * [CUSTOMIZATION_WEBHOOK] - Webhook configuration:
 *   - Set this URL di Singapay dashboard
 *   - Format: https://yourdomain.com/api/webhooks/singapay/payment-settlement
 *   - Make sure domain publicly accessible
 * 
 * ENDPOINT SUMMARY:
 * 
 * POST   /api/pdf-export/create-request              (Create export & VA)
 * POST   /api/pdf-export/payment-options             (Generate QRIS/Link)
 * GET    /api/pdf-export/payment-status/{id}         (Check status)
 * GET    /api/pdf-export/payment-status-manual       (Polling check)
 * GET    /api/pdf-export/download/{id}               (Download PDF)
 * GET    /api/pdf-export/history                     (Export history)
 * GET    /api/pdf-export/pricing                     (Get pricing)
 * POST   /api/webhooks/singapay/payment-settlement   (Webhook)
 */
