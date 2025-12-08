# 📋 PDF Export Pro + Singapay Payment Gateway Integration

**Untuk**: SmartPlan-Web Project  
**Tanggal**: December 3, 2025  
**Status**: Ready untuk implementasi (menunggu PDF Export Pro selesai)

---

## 📋 Daftar Isi
1. [Integration Flow](#integration-flow)
2. [Component Structure](#component-structure)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Database Schema](#database-schema)
6. [Testing & Deployment](#testing--deployment)

---

## 🔄 Integration Flow

### Alur Keseluruhan

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER DASHBOARD                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Business Plan / Financial Plan                           │  │
│  │                                                            │  │
│  │ [View] [Edit] [PDF EXPORT PRO] ← CLICK HERE              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│               PDF EXPORT PRO MODAL/PAGE                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Export Format:                                            │  │
│  │  ○ Standard (FREE)                                        │  │
│  │  ○ Professional (PAID) ← SELECT THIS                      │  │
│  │  ○ Business (PAID)                                        │  │
│  │                                                            │  │
│  │ Price: Rp 50.000                                          │  │
│  │                                                            │  │
│  │ [Cancel] [Next →]                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PAYMENT GATEWAY SELECTION                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pilih Metode Pembayaran:                                 │  │
│  │                                                            │  │
│  │  [🏦 Virtual Account] [📱 QRIS] [🔗 Payment Link]        │  │
│  │                                                            │  │
│  │ Total: Rp 50.000                                          │  │
│  │                                                            │  │
│  │ [Back] [Bayar Sekarang]                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              SINGAPAY PAYMENT PROCESSING                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Virtual Account / QRIS Payment                           │  │
│  │                                                            │  │
│  │ VA Number: 787295514657XXX                               │  │
│  │ Bank: BRI                                                 │  │
│  │ Amount: Rp 50.000                                         │  │
│  │                                                            │  │
│  │ [Transfer Now]                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              WEBHOOK NOTIFICATION (Background)                  │
│                                                                   │
│  Singapay → Backend                                              │
│  Webhook: /api/webhooks/singapay/va                             │
│  Status: PAID                                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND PROCESSING                                  │
│                                                                   │
│  1. Validate webhook signature                                   │
│  2. Update export_request status → PAID                          │
│  3. Queue PDF generation job                                     │
│  4. Send success email                                           │
│  5. Update user dashboard                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (Real-time Update)                         │
│                                                                   │
│  WebSocket / Polling                                             │
│  Payment Status: ✓ PAID                                          │
│  Generating PDF...                                               │
│  PDF Ready! [Download]                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

```
1. USER CLICKS "PDF EXPORT PRO"
   ↓
2. OPEN EXPORT FORMAT SELECTOR
   - Show pricing
   - Show features
   ↓
3. USER SELECTS PAID FORMAT
   ↓
4. SHOW PAYMENT METHODS
   - Virtual Account
   - QRIS
   - Payment Link
   ↓
5. USER SELECTS PAYMENT METHOD & PROCEED
   ↓
6. GENERATE ORDER IN BACKEND
   - Create export_request record
   - Generate VA / QRIS / Payment Link
   - Set status: PENDING
   ↓
7. SHOW PAYMENT UI TO USER
   - Display VA number / QR Code / Payment Link
   - Start polling for payment status
   ↓
8. USER MAKES PAYMENT
   ↓
9. SINGAPAY SENDS WEBHOOK
   - Validate signature
   - Update export_request: PAID
   - Trigger PDF generation job
   ↓
10. BACKEND GENERATES PDF
    - Process & render PDF
    - Store in storage
    - Send download link
    ↓
11. FRONTEND RECEIVES UPDATE
    - Show "PDF Ready" message
    - Provide download button
    - Send email to user
    ↓
12. USER DOWNLOADS PDF
    - Direct download
    - Or via email link
```

---

## 🏗️ Component Structure

### Frontend Architecture

```
src/pages/
├── BusinessPlan/
│   └── BusinessPlanDetail.jsx
│       ├── [View / Edit buttons]
│       └── [PDF EXPORT PRO button] ← TRIGGER POINT
│
└── PDFExport/
    ├── PDFExportModal.jsx
    │   ├── ExportFormatSelector.jsx
    │   │   ├── Standard (Free)
    │   │   ├── Professional (Paid - Rp 50K)
    │   │   └── Business (Paid - Rp 100K)
    │   │
    │   └── PaymentGateway.jsx
    │       ├── PaymentMethodSelector.jsx
    │       │   ├── VAPayment.jsx
    │       │   ├── QRISPayment.jsx
    │       │   └── PaymentLinkForm.jsx
    │       │
    │       └── PaymentStatusMonitor.jsx
    │           ├── Polling / WebSocket
    │           ├── StatusDisplay
    │           └── DownloadButton

src/services/
├── pdfExportService.js
└── singapayService.js

src/hooks/
├── usePaymentStatus.js
└── usePDFExport.js

src/store/
└── exportSlice.js
```

### Backend Architecture

```
app/Http/Controllers/
├── PDFExportController.php
│   ├── requestExport()
│   ├── getExportStatus()
│   └── downloadPDF()
│
└── WebhookController.php
    └── handlePaymentWebhook()

app/Services/
├── PDFExportService.php
│   ├── generatePDF()
│   └── storePDF()
│
└── SingapayService.php
    ├── createVA()
    ├── generateQRIS()
    └── checkPaymentStatus()

app/Jobs/
├── GeneratePDFJob.php
│   └── Queue for PDF generation
│
└── SendExportEmailJob.php
    └── Send download link email

app/Models/
├── ExportRequest.php
├── PDFFile.php
└── PaymentTransaction.php

database/migrations/
├── create_export_requests_table.php
└── create_pdf_files_table.php
```

---

## 💻 Backend Implementation

### 1. Database Migration

**Lokasi**: `database/migrations/2025_12_03_create_export_requests_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up() {
        // ============================================
        // [CUSTOMIZATION] Export Requests Table
        // ============================================
        Schema::create('export_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('business_plan_id')->nullable();
            $table->unsignedBigInteger('financial_plan_id')->nullable();
            
            // Export Details
            $table->string('export_type'); // business_plan, financial_plan, etc
            $table->string('format'); // standard, professional, business
            $table->decimal('price', 10, 2);
            
            // Payment Info
            $table->string('payment_method')->nullable(); // va, qris, payment_link
            $table->string('reference_number')->unique();
            $table->string('transaction_id')->nullable();
            $table->string('va_number')->nullable();
            $table->string('qris_code')->nullable();
            $table->string('payment_link_url')->nullable();
            
            // Status
            $table->enum('payment_status', [
                'pending',      // Waiting for payment
                'paid',         // Payment confirmed
                'failed',       // Payment failed
                'expired'       // Payment expired
            ])->default('pending');
            
            $table->enum('export_status', [
                'pending',      // Waiting to generate
                'generating',   // Currently generating PDF
                'completed',    // PDF generated and ready
                'failed'        // Generation failed
            ])->default('pending');
            
            // PDF Info
            $table->string('pdf_filename')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('pdf_url')->nullable();
            $table->decimal('file_size', 10, 2)->nullable(); // in KB
            
            // Timestamps
            $table->timestamp('payment_confirmed_at')->nullable();
            $table->timestamp('pdf_generated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'payment_status']);
            $table->index(['reference_number']);
            $table->index(['transaction_id']);
        });
        
        // ============================================
        // PDF Files Table (untuk tracking file)
        // ============================================
        Schema::create('pdf_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('export_request_id');
            $table->string('filename');
            $table->string('path');
            $table->string('url')->nullable();
            $table->decimal('file_size', 10, 2); // in KB
            $table->string('mime_type');
            $table->timestamps();
            
            $table->foreign('export_request_id')
                ->references('id')
                ->on('export_requests')
                ->onDelete('cascade');
        });
    }
    
    public function down() {
        Schema::dropIfExists('pdf_files');
        Schema::dropIfExists('export_requests');
    }
};
```

---

### 2. Models

**Lokasi**: `app/Models/ExportRequest.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ExportRequest extends Model {
    
    protected $fillable = [
        'user_id',
        'business_plan_id',
        'financial_plan_id',
        'export_type',
        'format',
        'price',
        'payment_method',
        'reference_number',
        'transaction_id',
        'va_number',
        'qris_code',
        'payment_link_url',
        'payment_status',
        'export_status',
        'pdf_filename',
        'pdf_path',
        'pdf_url',
        'file_size',
        'payment_confirmed_at',
        'pdf_generated_at',
        'expires_at'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'file_size' => 'decimal:2',
        'payment_confirmed_at' => 'datetime',
        'pdf_generated_at' => 'datetime',
        'expires_at' => 'datetime'
    ];
    
    // ============================================
    // Relationships
    // ============================================
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    
    public function businessPlan(): BelongsTo {
        return $this->belongsTo(BusinessBackground::class, 'business_plan_id');
    }
    
    public function financialPlan(): BelongsTo {
        return $this->belongsTo(FinancialPlan::class, 'financial_plan_id');
    }
    
    public function pdfFile(): HasOne {
        return $this->hasOne(PDFFile::class);
    }
    
    // ============================================
    // Scopes
    // ============================================
    
    public function scopePaid($query) {
        return $query->where('payment_status', 'paid');
    }
    
    public function scopePending($query) {
        return $query->where('payment_status', 'pending');
    }
    
    public function scopeCompleted($query) {
        return $query->where('export_status', 'completed');
    }
    
    // ============================================
    // Accessors
    // ============================================
    
    public function getIsExpiredAttribute() {
        return $this->expires_at && $this->expires_at < now();
    }
    
    public function getIsPaidAttribute() {
        return $this->payment_status === 'paid';
    }
    
    public function getIsCompletedAttribute() {
        return $this->export_status === 'completed';
    }
}
```

---

### 3. Controller

**Lokasi**: `app/Http/Controllers/PDFExportController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\ExportRequest;
use App\Services\SingapayService;
use App\Services\PDFExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PDFExportController extends Controller {
    
    private $singapay;
    private $pdfExport;
    
    public function __construct(
        SingapayService $singapay,
        PDFExportService $pdfExport
    ) {
        $this->singapay = $singapay;
        $this->pdfExport = $pdfExport;
        $this->middleware('auth');
    }
    
    // ============================================
    // [CUSTOMIZATION] Request PDF Export
    // ============================================
    /**
     * User clicks "PDF Export Pro"
     * 
     * Flow:
     * 1. Create export request
     * 2. Generate payment (VA/QRIS/Link)
     * 3. Return payment details
     */
    public function requestExport(Request $request) {
        try {
            $validated = $request->validate([
                'export_type' => 'required|in:business_plan,financial_plan',
                'plan_id' => 'required|integer',
                'format' => 'required|in:standard,professional,business',
                'payment_method' => 'required|in:va,qris,payment_link'
            ]);
            
            // Get format pricing
            // [CUSTOMIZATION] Sesuaikan pricing
            $pricing = [
                'standard' => 0,
                'professional' => 50000,
                'business' => 100000
            ];
            
            $price = $pricing[$validated['format']];
            
            // For free format, skip payment
            if ($price == 0) {
                return $this->generateFreePDF($validated);
            }
            
            // Create export request
            $exportRequest = ExportRequest::create([
                'user_id' => auth()->id(),
                'export_type' => $validated['export_type'],
                'business_plan_id' => $validated['export_type'] === 'business_plan' 
                    ? $validated['plan_id'] 
                    : null,
                'financial_plan_id' => $validated['export_type'] === 'financial_plan' 
                    ? $validated['plan_id'] 
                    : null,
                'format' => $validated['format'],
                'price' => $price,
                'reference_number' => 'EXP-' . auth()->id() . '-' . time(),
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'export_status' => 'pending'
            ]);
            
            // Generate payment based on method
            $paymentDetails = match($validated['payment_method']) {
                'va' => $this->generateVA($exportRequest),
                'qris' => $this->generateQRIS($exportRequest),
                'payment_link' => $this->generatePaymentLink($exportRequest),
            };
            
            // Merge payment details
            $exportRequest->update($paymentDetails);
            
            // [CUSTOMIZATION] Set expiry time (24 jam)
            $exportRequest->update([
                'expires_at' => now()->addHours(24)
            ]);
            
            Log::info('PDF export requested', [
                'user_id' => auth()->id(),
                'reference' => $exportRequest->reference_number,
                'format' => $validated['format'],
                'price' => $price
            ]);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'export_id' => $exportRequest->id,
                    'reference_number' => $exportRequest->reference_number,
                    'payment_method' => $validated['payment_method'],
                    'price' => $price,
                    'payment_details' => $paymentDetails
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to request PDF export', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate Virtual Account
     */
    private function generateVA($exportRequest) {
        try {
            $va = $this->singapay->createVirtualAccount(
                accountId: env('SINGAPAY_MERCHANT_ACCOUNT_ID'),
                bankCode: 'BRI',
                amount: $exportRequest->price,
                kind: 'temporary',
                description: "PDF Export - {$exportRequest->reference_number}"
            );
            
            return [
                'va_number' => $va['va_number'],
                'payment_method' => 'va'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to generate VA', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Generate QRIS
     */
    private function generateQRIS($exportRequest) {
        try {
            $qris = $this->singapay->generateQRIS(
                accountId: env('SINGAPAY_MERCHANT_ACCOUNT_ID'),
                amount: $exportRequest->price,
                expiryHours: 24
            );
            
            return [
                'qris_code' => $qris['qr_data'],
                'payment_method' => 'qris'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to generate QRIS', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Generate Payment Link
     */
    private function generatePaymentLink($exportRequest) {
        try {
            $link = $this->singapay->createPaymentLink(
                accountId: env('SINGAPAY_MERCHANT_ACCOUNT_ID'),
                referenceNo: $exportRequest->reference_number,
                amount: $exportRequest->price,
                expiryMinutes: 1440 // 24 hours
            );
            
            return [
                'payment_link_url' => $link['payment_link'],
                'payment_method' => 'payment_link'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to generate payment link', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Generate free PDF (standard format)
     */
    private function generateFreePDF($validated) {
        try {
            // Create export request
            $exportRequest = ExportRequest::create([
                'user_id' => auth()->id(),
                'export_type' => $validated['export_type'],
                'business_plan_id' => $validated['export_type'] === 'business_plan' 
                    ? $validated['plan_id'] 
                    : null,
                'financial_plan_id' => $validated['export_type'] === 'financial_plan' 
                    ? $validated['plan_id'] 
                    : null,
                'format' => $validated['format'],
                'price' => 0,
                'reference_number' => 'EXP-' . auth()->id() . '-' . time(),
                'payment_status' => 'paid', // Auto paid (free)
                'export_status' => 'pending',
                'payment_confirmed_at' => now()
            ]);
            
            // Dispatch PDF generation job
            \App\Jobs\GeneratePDFJob::dispatch($exportRequest);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'export_id' => $exportRequest->id,
                    'message' => 'PDF sedang diproses'
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ============================================
    // Get Export Status
    // ============================================
    public function getExportStatus($exportId) {
        try {
            $exportRequest = ExportRequest::findOrFail($exportId);
            
            // Verify ownership
            if ($exportRequest->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized'
                ], 403);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'payment_status' => $exportRequest->payment_status,
                    'export_status' => $exportRequest->export_status,
                    'pdf_url' => $exportRequest->pdf_url,
                    'is_ready' => $exportRequest->export_status === 'completed',
                    'is_expired' => $exportRequest->is_expired
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ============================================
    // Download PDF
    // ============================================
    public function downloadPDF($exportId) {
        try {
            $exportRequest = ExportRequest::findOrFail($exportId);
            
            // Verify ownership
            if ($exportRequest->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized'
                ], 403);
            }
            
            // Check if ready
            if ($exportRequest->export_status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'error' => 'PDF belum siap'
                ], 400);
            }
            
            // Download file
            return response()->download(
                storage_path("app/{$exportRequest->pdf_path}"),
                $exportRequest->pdf_filename
            );
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

---

### 4. Webhook Handler

**Lokasi**: `app/Http/Controllers/WebhookController.php` (Update)

```php
/**
 * Handle payment webhook untuk PDF Export
 */
public function handlePDFExportPayment(Request $request) {
    try {
        // Validate signature
        if (!$this->validateVASignature($request)) {
            Log::error('Invalid webhook signature for PDF export');
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        
        $data = $request->json('data');
        $transaction = $data['transaction'];
        
        Log::info('PDF Export payment received', [
            'reff_no' => $transaction['reff_no'],
            'status' => $transaction['status']
        ]);
        
        // Find export request by reference
        $exportRequest = ExportRequest::where(
            'reference_number',
            $transaction['reff_no']
        )->first();
        
        if (!$exportRequest) {
            Log::warning('Export request not found', [
                'reference' => $transaction['reff_no']
            ]);
            return response()->json(['error' => 'Export request not found'], 404);
        }
        
        // Update payment status
        if ($transaction['status'] === 'paid') {
            $exportRequest->update([
                'payment_status' => 'paid',
                'transaction_id' => $transaction['reff_no'],
                'payment_confirmed_at' => now()
            ]);
            
            // Dispatch PDF generation job
            \App\Jobs\GeneratePDFJob::dispatch($exportRequest);
            
            Log::info('PDF export payment confirmed and queued', [
                'export_id' => $exportRequest->id
            ]);
        } else if ($transaction['status'] === 'failed') {
            $exportRequest->update([
                'payment_status' => 'failed'
            ]);
        }
        
        return response()->json(['success' => true], 200);
        
    } catch (\Exception $e) {
        Log::error('Failed to handle PDF export payment', ['error' => $e->getMessage()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
```

---

### 5. Queue Job untuk PDF Generation

**Lokasi**: `app/Jobs/GeneratePDFJob.php`

```php
<?php

namespace App\Jobs;

use App\Models\ExportRequest;
use App\Services\PDFExportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GeneratePDFJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    private $exportRequest;
    
    public function __construct(ExportRequest $exportRequest) {
        $this->exportRequest = $exportRequest;
    }
    
    // ============================================
    // [CUSTOMIZATION] Generate PDF
    // ============================================
    public function handle(PDFExportService $pdfService) {
        try {
            Log::info('Starting PDF generation', [
                'export_id' => $this->exportRequest->id
            ]);
            
            // Update status
            $this->exportRequest->update([
                'export_status' => 'generating'
            ]);
            
            // Get the data to export
            $data = $this->getDataToExport();
            
            // Generate PDF (implementasi dari teman)
            // [CUSTOMIZATION] Panggil PDF export pro dari teman
            $pdf = $pdfService->generatePDF(
                data: $data,
                format: $this->exportRequest->format,
                filename: "export-{$this->exportRequest->id}.pdf"
            );
            
            // Store PDF
            $filePath = $pdfService->storePDF(
                pdf: $pdf,
                exportRequest: $this->exportRequest
            );
            
            // Update export request with PDF info
            $this->exportRequest->update([
                'export_status' => 'completed',
                'pdf_filename' => basename($filePath),
                'pdf_path' => $filePath,
                'pdf_url' => url("storage/{$filePath}"),
                'file_size' => filesize(storage_path("app/{$filePath}")) / 1024, // KB
                'pdf_generated_at' => now()
            ]);
            
            // Send email with download link
            \App\Jobs\SendExportEmailJob::dispatch($this->exportRequest);
            
            Log::info('PDF generation completed', [
                'export_id' => $this->exportRequest->id,
                'pdf_path' => $filePath
            ]);
            
        } catch (\Exception $e) {
            Log::error('PDF generation failed', [
                'export_id' => $this->exportRequest->id,
                'error' => $e->getMessage()
            ]);
            
            $this->exportRequest->update([
                'export_status' => 'failed'
            ]);
            
            throw $e;
        }
    }
    
    /**
     * [CUSTOMIZATION] Get data based on export type
     */
    private function getDataToExport() {
        return match($this->exportRequest->export_type) {
            'business_plan' => $this->exportRequest->businessPlan,
            'financial_plan' => $this->exportRequest->financialPlan,
            default => null
        };
    }
}
```

---

### 6. Email Job

**Lokasi**: `app/Jobs/SendExportEmailJob.php`

```php
<?php

namespace App\Jobs;

use App\Models\ExportRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendExportEmailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    private $exportRequest;
    
    public function __construct(ExportRequest $exportRequest) {
        $this->exportRequest = $exportRequest;
    }
    
    public function handle() {
        // [CUSTOMIZATION] Send email with PDF download link
        $user = $this->exportRequest->user;
        
        Mail::to($user->email)->send(
            new \App\Mail\PDFExportReady($this->exportRequest)
        );
    }
}
```

---

## 🎨 Frontend Implementation

### Main Component

**Lokasi**: `src/pages/PDFExport/PDFExportFlow.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import ExportFormatSelector from './ExportFormatSelector';
import PaymentGateway from './PaymentGateway';
import PaymentStatusMonitor from './PaymentStatusMonitor';
import PDFDownloadReady from './PDFDownloadReady';
import { singapayService } from '../../services/singapayService';
import './PDFExportFlow.css';

export const PDFExportFlow = ({ planId, exportType, onClose }) => {
  const [step, setStep] = useState('format'); // format, payment, waiting, complete
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [exportRequest, setExportRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // [CUSTOMIZATION] Step 1: Format Selection
  // ============================================
  const handleFormatSelected = (format) => {
    setSelectedFormat(format);
    setStep('payment');
  };

  // ============================================
  // [CUSTOMIZATION] Step 2: Payment Method Selection
  // ============================================
  const handlePaymentMethodSelected = (method) => {
    setSelectedPaymentMethod(method);
  };

  // ============================================
  // [CUSTOMIZATION] Step 3: Initiate Payment
  // ============================================
  const handlePaymentInitiate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if free format
      if (selectedFormat.price === 0) {
        // Skip payment, generate PDF directly
        const response = await fetch('/api/pdf-export/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            export_type: exportType,
            plan_id: planId,
            format: selectedFormat.id,
            payment_method: 'free'
          })
        });

        const data = await response.json();
        setExportRequest(data.data);
        setStep('generating');
      } else {
        // Request payment
        const response = await fetch('/api/pdf-export/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            export_type: exportType,
            plan_id: planId,
            format: selectedFormat.id,
            payment_method: selectedPaymentMethod
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setExportRequest(data.data);
        setStep('payment_waiting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // [CUSTOMIZATION] Step 4: Monitor Payment Status
  // ============================================
  const handlePaymentConfirmed = () => {
    setStep('generating');
  };

  // ============================================
  // [CUSTOMIZATION] Step 5: PDF Ready
  // ============================================
  const handlePDFReady = () => {
    setStep('complete');
  };

  // ============================================
  // Render berdasarkan step
  // ============================================
  return (
    <div className="pdf-export-flow">
      <div className="flow-header">
        <h2>PDF Export Pro</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${['format', 'payment', 'payment_waiting', 'generating', 'complete'].includes(step) ? 'active' : ''}`}>
          1. Format
        </div>
        <div className={`step ${['payment', 'payment_waiting', 'generating', 'complete'].includes(step) ? 'active' : ''}`}>
          2. Pembayaran
        </div>
        <div className={`step ${['payment_waiting', 'generating', 'complete'].includes(step) ? 'active' : ''}`}>
          3. Proses
        </div>
        <div className={`step ${step === 'complete' ? 'active' : ''}`}>
          4. Download
        </div>
      </div>

      {/* Content */}
      <div className="flow-content">
        {/* Step 1: Format Selection */}
        {step === 'format' && (
          <ExportFormatSelector
            onFormatSelected={handleFormatSelected}
            onPaymentInitiate={handlePaymentInitiate}
            selectedFormat={selectedFormat}
            selectedPaymentMethod={selectedPaymentMethod}
            loading={loading}
          />
        )}

        {/* Step 2: Payment Method Selection */}
        {step === 'payment' && (
          <PaymentGateway
            format={selectedFormat}
            onMethodSelected={handlePaymentMethodSelected}
            onPaymentInitiate={handlePaymentInitiate}
            selectedMethod={selectedPaymentMethod}
            loading={loading}
          />
        )}

        {/* Step 3: Payment Waiting */}
        {step === 'payment_waiting' && (
          <PaymentStatusMonitor
            exportRequest={exportRequest}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {/* Step 4: Generating */}
        {step === 'generating' && (
          <div className="generating-status">
            <div className="spinner"></div>
            <h3>Sedang Memproses PDF</h3>
            <p>Mohon tunggu, PDF Anda sedang dihasilkan...</p>
            <PaymentStatusMonitor
              exportRequest={exportRequest}
              onPDFReady={handlePDFReady}
              monitorExport={true}
            />
          </div>
        )}

        {/* Step 5: PDF Ready */}
        {step === 'complete' && (
          <PDFDownloadReady
            exportRequest={exportRequest}
            onClose={onClose}
          />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Tutup</button>
        </div>
      )}
    </div>
  );
};

export default PDFExportFlow;
```

---

### Payment Status Monitor

**Lokasi**: `src/components/PDFExport/PaymentStatusMonitor.jsx`

```jsx
import React, { useEffect, useState, useRef } from 'react';

export const PaymentStatusMonitor = ({ 
  exportRequest, 
  onPaymentConfirmed, 
  onPDFReady,
  monitorExport = false 
}) => {
  const [status, setStatus] = useState({
    payment: 'pending',
    export: 'pending'
  });
  const pollingInterval = useRef(null);

  useEffect(() => {
    // Start polling untuk monitor status
    // [CUSTOMIZATION] Adjust polling interval sesuai kebutuhan
    pollingInterval.current = setInterval(() => {
      checkStatus();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollingInterval.current);
  }, [exportRequest]);

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `/api/pdf-export/${exportRequest.export_id}/status`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      const data = await response.json();
      
      setStatus({
        payment: data.data.payment_status,
        export: data.data.export_status
      });

      // Payment confirmed
      if (data.data.payment_status === 'paid' && onPaymentConfirmed) {
        onPaymentConfirmed();
      }

      // PDF ready
      if (data.data.is_ready && onPDFReady) {
        clearInterval(pollingInterval.current);
        onPDFReady();
      }

      // Expired
      if (data.data.is_expired) {
        clearInterval(pollingInterval.current);
        // Show expiry message
      }

    } catch (err) {
      console.error('Failed to check status:', err);
    }
  };

  return (
    <div className="payment-status-monitor">
      {/* Payment Status */}
      <div className="status-item">
        <div className="status-label">📊 Status Pembayaran</div>
        <div className={`status-value ${status.payment}`}>
          {status.payment === 'pending' && '⏳ Menunggu Pembayaran...'}
          {status.payment === 'paid' && '✓ Pembayaran Berhasil'}
          {status.payment === 'failed' && '✗ Pembayaran Gagal'}
        </div>
      </div>

      {/* Export Status */}
      {monitorExport && (
        <div className="status-item">
          <div className="status-label">📄 Status Export</div>
          <div className={`status-value ${status.export}`}>
            {status.export === 'pending' && '⏳ Menunggu...'}
            {status.export === 'generating' && '⚙️ Sedang Memproses...'}
            {status.export === 'completed' && '✓ PDF Siap!'}
            {status.export === 'failed' && '✗ Proses Gagal'}
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <p className="auto-refresh">Auto-refresh setiap 3 detik</p>
    </div>
  );
};

export default PaymentStatusMonitor;
```

---

## 📊 Database Schema Summary

```
┌─────────────────────────┐
│  export_requests        │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK)            │
│ business_plan_id (FK)   │
│ financial_plan_id (FK)  │
│ export_type             │
│ format                  │
│ price                   │
│ payment_method          │
│ reference_number (UQ)   │
│ transaction_id          │
│ va_number               │
│ qris_code               │
│ payment_link_url        │
│ payment_status          │
│ export_status           │
│ pdf_filename            │
│ pdf_path                │
│ pdf_url                 │
│ file_size               │
│ payment_confirmed_at    │
│ pdf_generated_at        │
│ expires_at              │
│ created_at / updated_at │
└─────────────────────────┘
        ↓ (1:1)
┌─────────────────────────┐
│  pdf_files              │
├─────────────────────────┤
│ id (PK)                 │
│ export_request_id (FK)  │
│ filename                │
│ path                    │
│ url                     │
│ file_size               │
│ mime_type               │
│ created_at / updated_at │
└─────────────────────────┘
```

---

## 📋 API Routes

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    // PDF Export
    Route::post('/pdf-export/request', [PDFExportController::class, 'requestExport']);
    Route::get('/pdf-export/{exportId}/status', [PDFExportController::class, 'getExportStatus']);
    Route::get('/pdf-export/{exportId}/download', [PDFExportController::class, 'downloadPDF']);
});

// Webhooks (public, but validated)
Route::post('/webhooks/pdf-export-payment', [WebhookController::class, 'handlePDFExportPayment']);
```

---

## 🧪 Testing & Deployment

### Testing Checklist

```
[ ] Test format selection flow
[ ] Test payment method selection
[ ] Test VA payment initiation
[ ] Test QRIS code generation
[ ] Test payment link generation
[ ] Test webhook signature validation
[ ] Test payment status polling
[ ] Test PDF generation queue job
[ ] Test email notification
[ ] Test PDF download
[ ] Test payment expiry (24 hours)
[ ] Test free format (skip payment)
[ ] Test error handling
[ ] Load test with concurrent requests
```

### Deployment Steps

```bash
# 1. Run migrations
php artisan migrate

# 2. Setup queue worker
php artisan queue:work

# 3. Update .env with Singapay credentials
SINGAPAY_MERCHANT_ACCOUNT_ID=your_account_id

# 4. Configure webhook URL di Singapay dashboard
https://yourdomain.com/api/webhooks/pdf-export-payment

# 5. Test webhook delivery
# Use Singapay sandbox for testing

# 6. Deploy to production
# Update API URLs in frontend .env
```

---

## 📝 Status Transitions

### Payment Status Flow
```
pending → paid → [generate PDF]
       ↓
     failed
       ↓
     expired (after 24 hours)
```

### Export Status Flow
```
pending → generating → completed
       ↓
     failed
```

---

## 🔐 Security Checklist

```
[ ] Validate all user inputs
[ ] Verify webhook signatures
[ ] Authenticate all endpoints
[ ] Authorize user (check ownership)
[ ] Rate limit API endpoints
[ ] Encrypt sensitive data in transit
[ ] Store PDF files outside public directory
[ ] Implement CSRF protection
[ ] Log all transactions
[ ] Monitor for fraud patterns
```

---

**Last Updated**: December 3, 2025  
**Version**: 1.0  
**Status**: ⏳ Waiting for PDF Export Pro implementation from team
