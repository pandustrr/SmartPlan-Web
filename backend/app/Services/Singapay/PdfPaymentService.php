<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PremiumPdf;
use App\Models\Singapay\PdfPurchase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PdfPaymentService
{
    protected $apiService;
    protected $vaService;
    protected $qrisService;

    public function __construct(
        SingapayApiService $apiService,
        VirtualAccountService $vaService,
        QrisService $qrisService
    ) {
        $this->apiService = $apiService;
        $this->vaService = $vaService;
        $this->qrisService = $qrisService;
    }

    /**
     * Get available packages
     * 🔧 IMPROVED: Better data formatting
     */
    public function getAvailablePackages(): array
    {
        $packages = PremiumPdf::active()->ordered()->get();

        return [
            'success' => true,
            'packages' => $packages->map(function($package) {
                return [
                    'id' => $package->id,
                    'package_type' => $package->package_type,
                    'name' => $package->name,
                    'description' => $package->description,
                    'price' => $package->price,
                    'formatted_price' => $package->formatted_price,
                    'duration_days' => (int) $package->duration_days, // 🔧 Ensure integer
                    'duration_text' => $package->duration_text,
                    'features' => $package->features ?? [],
                ];
            })->toArray(),
        ];
    }

    /**
     * Check user Pro access status from database
     */
    public function checkAccess(User $user): array
    {
        $hasAccess = $user->pdf_access_active
            && $user->pdf_access_expires_at
            && $user->pdf_access_expires_at->isFuture();

        $remainingDays = null;
        if ($hasAccess && $user->pdf_access_expires_at) {
            $remainingDays = now()->diffInDays($user->pdf_access_expires_at, false);
            $remainingDays = max(0, (int)$remainingDays);
        }

        return [
            'success' => true,
            'has_access' => $hasAccess,
            'package' => $hasAccess ? $user->pdf_access_package : null,
            'expires_at' => $hasAccess ? $user->pdf_access_expires_at : null,
            'remaining_days' => $remainingDays,
        ];
    }

    /**
     * Create purchase and initiate payment
     * 🔧 IMPROVED: Better validation and error handling
     */
    public function createPurchase(User $user, int $packageId, string $paymentMethod, ?string $bankCode = null): array
    {
        DB::beginTransaction();

        try {
            // Get package with validation
            $package = PremiumPdf::active()->find($packageId);

            if (!$package) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'Package not found or inactive',
                ];
            }

            // Validate duration_days
            $durationDays = (int) $package->duration_days;
            if ($durationDays <= 0) {
                DB::rollBack();
                Log::error('[PDF Payment] Invalid duration_days', [
                    'package_id' => $packageId,
                    'duration_days' => $package->duration_days,
                ]);
                return [
                    'success' => false,
                    'message' => 'Invalid package configuration',
                ];
            }

            // Check if user already has active subscription
            $activePurchase = $user->pdfPurchases()
                ->active()
                ->first();

            if ($activePurchase) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'You already have an active subscription',
                    'current_subscription' => [
                        'package_type' => $activePurchase->package_type,
                        'expires_at' => $activePurchase->expires_at,
                        'remaining_days' => $activePurchase->remaining_days,
                    ],
                ];
            }

            // Validate payment method
            if ($paymentMethod === 'virtual_account' && !$bankCode) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'Bank code is required for Virtual Account payment',
                ];
            }

            // Create purchase record
            $purchase = PdfPurchase::create([
                'user_id' => $user->id,
                'premium_pdf_id' => $package->id,
                'transaction_code' => PdfPurchase::generateTransactionCode(),
                'package_type' => $package->package_type,
                'amount_paid' => $package->price,
                'payment_method' => $paymentMethod,
                'status' => 'pending',
            ]);

            Log::info('[PDF Payment] Purchase created', [
                'purchase_id' => $purchase->id,
                'user_id' => $user->id,
                'package_id' => $packageId,
                'duration_days' => $durationDays,
            ]);

            // Process based on payment method
            $paymentResult = match($paymentMethod) {
                'virtual_account' => $this->processVirtualAccount($purchase, $bankCode),
                'qris' => $this->processQris($purchase),
                default => [
                    'success' => false,
                    'message' => 'Invalid payment method',
                ],
            };

            if (!$paymentResult['success']) {
                DB::rollBack();
                return $paymentResult;
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Purchase created successfully',
                'purchase' => [
                    'id' => $purchase->id,
                    'transaction_code' => $purchase->transaction_code,
                    'package_type' => $purchase->package_type,
                    'amount' => $purchase->amount_paid,
                    'status' => $purchase->status,
                ],
                'payment' => $paymentResult['data'] ?? [],
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('[PDF Payment] Failed to create purchase', [
                'user_id' => $user->id,
                'package_id' => $packageId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create purchase: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Process Virtual Account payment
     */
    protected function processVirtualAccount(PdfPurchase $purchase, ?string $bankCode): array
    {
        if (!$bankCode) {
            return [
                'success' => false,
                'message' => 'Bank code is required for Virtual Account payment',
            ];
        }

        return $this->vaService->createVirtualAccount($purchase, $bankCode);
    }

    /**
     * Process QRIS payment
     */
    protected function processQris(PdfPurchase $purchase): array
    {
        return $this->qrisService->generateQris($purchase);
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(string $transactionCode): array
    {
        try {
            $purchase = PdfPurchase::where('transaction_code', $transactionCode)
                ->with(['paymentTransaction', 'premiumPdf'])
                ->first();

            if (!$purchase) {
                return [
                    'success' => false,
                    'message' => 'Purchase not found',
                ];
            }

            $transaction = $purchase->paymentTransaction;

            if (!$transaction) {
                return [
                    'success' => false,
                    'message' => 'Payment transaction not found',
                ];
            }

            // Check if already paid
            if ($transaction->isPaid()) {
                return [
                    'success' => true,
                    'status' => 'paid',
                    'paid' => true,
                    'paid_at' => $transaction->paid_at,
                    'expires_at' => $purchase->expires_at,
                ];
            }

            // Check with payment gateway
            $result = match($transaction->payment_method) {
                'virtual_account' => $this->vaService->checkPaymentStatus($transaction),
                'qris' => $this->qrisService->checkPaymentStatus($transaction),
                default => ['success' => false, 'message' => 'Invalid payment method'],
            };

            return [
                'success' => $result['success'],
                'status' => $result['status'] ?? 'unknown',
                'paid' => $result['paid'] ?? false,
                'message' => $result['message'] ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('[PDF Payment] Failed to check status', [
                'transaction_code' => $transactionCode,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to check status: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get user subscription info
     */
    public function getUserSubscription(User $user): array
    {
        $activePurchase = $user->pdfPurchases()
            ->active()
            ->with('premiumPdf')
            ->first();

        if (!$activePurchase) {
            return [
                'success' => true,
                'has_subscription' => false,
                'message' => 'No active subscription',
            ];
        }

        return [
            'success' => true,
            'has_subscription' => true,
            'subscription' => [
                'id' => $activePurchase->id,
                'package_type' => $activePurchase->package_type,
                'package_name' => $activePurchase->premiumPdf->name ?? null,
                'started_at' => $activePurchase->started_at,
                'expires_at' => $activePurchase->expires_at,
                'remaining_days' => $activePurchase->remaining_days,
                'is_active' => $activePurchase->isActive(),
            ],
        ];
    }

    /**
     * Cancel purchase
     */
    public function cancelPurchase(User $user, string $transactionCode): array
    {
        try {
            $purchase = $user->pdfPurchases()
                ->where('transaction_code', $transactionCode)
                ->where('status', 'pending')
                ->first();

            if (!$purchase) {
                return [
                    'success' => false,
                    'message' => 'Purchase not found or cannot be cancelled',
                ];
            }

            $purchase->markAsFailed();

            return [
                'success' => true,
                'message' => 'Purchase cancelled successfully',
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to cancel purchase: ' . $e->getMessage(),
            ];
        }
    }
}
