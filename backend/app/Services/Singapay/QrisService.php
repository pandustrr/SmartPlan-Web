<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PaymentTransaction;
use App\Models\Singapay\PdfPurchase;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class QrisService
{
    protected $apiService;

    public function __construct(SingapayApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Generate QRIS for payment
     * 🔧 FIXED: Type casting untuk expiry calculation
     */
    public function generateQris(PdfPurchase $purchase): array
    {
        try {
            // 🔧 CRITICAL FIX: Cast to integer
            $expiryHours = (int) config('singapay.qris.expiry_hours', 1);

            Log::info('[QRIS Service] Config values', [
                'expiry_hours_raw' => config('singapay.qris.expiry_hours'),
                'expiry_hours_casted' => $expiryHours,
                'type' => gettype($expiryHours),
            ]);

            $expiredAt = Carbon::now()->addHours($expiryHours);
            $accountId = $this->apiService->getMerchantAccountId();

            // Prepare QRIS data sesuai dokumentasi Singapay
            $data = [
                'amount' => $purchase->amount_paid,
                'expired_at' => $expiredAt->format('Y-m-d H:i:s'), // Format: Y-m-d H:i:s
            ];

            // Optional: Add tip
            if (config('singapay.qris.enable_tip', false)) {
                $data['tip_indicator'] = 'fixed_amount';
                $data['tip_value'] = 0;
            }

            Log::info('[QRIS Service] Generating QRIS', [
                'purchase_id' => $purchase->id,
                'amount' => $purchase->amount_paid,
                'account_id' => $accountId,
                'expired_at' => $expiredAt->toDateTimeString(),
            ]);

            // Send request to SingaPay API
            $response = $this->apiService->sendRequest(
                "/api/v1.0/qris-dynamic/{$accountId}/generate-qr",
                $data,
                'POST'
            );

            if (!$response['success']) {
                Log::error('[QRIS Service] Failed to generate QRIS', [
                    'response' => $response,
                    'purchase_id' => $purchase->id,
                ]);

                return [
                    'success' => false,
                    'message' => $response['message'] ?? 'Failed to generate QRIS',
                    'error_code' => $response['error_code'] ?? null,
                ];
            }

            $qrisData = $response['data'];

            Log::info('[QRIS Service] QRIS generated successfully', [
                'qris_id' => $qrisData['id'] ?? null,
                'reff_no' => $qrisData['reff_no'] ?? null,
                'purchase_id' => $purchase->id,
            ]);

            // Create payment transaction record
            $transaction = PaymentTransaction::create([
                'pdf_purchase_id' => $purchase->id,
                'transaction_code' => $purchase->transaction_code,
                'reference_no' => $qrisData['reff_no'] ?? PaymentTransaction::generateReferenceNo(),
                'payment_method' => 'qris',
                'qris_content' => $qrisData['qr_data'] ?? $qrisData['qris_content'] ?? null,
                'qris_url' => $qrisData['qris_url'] ?? null,
                'amount' => $purchase->amount_paid,
                'currency' => 'IDR',
                'status' => 'pending',
                'mode' => $this->apiService->getMode(),
                'expired_at' => $expiredAt,
                'singapay_request' => $data,
                'singapay_response' => $qrisData,
            ]);

            return [
                'success' => true,
                'message' => 'QRIS generated successfully',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'qris_content' => $qrisData['qr_data'] ?? $qrisData['qris_content'] ?? null,
                    'qris_string' => $qrisData['qr_string'] ?? $qrisData['qris_string'] ?? null,
                    'qris_url' => $qrisData['qris_url'] ?? null,
                    'amount' => $purchase->amount_paid,
                    'formatted_amount' => $transaction->formatted_amount,
                    'expired_at' => $expiredAt->toIso8601String(),
                    'expired_at_formatted' => $expiredAt->format('d M Y H:i'),
                    'payment_instructions' => $this->getPaymentInstructions(),
                ],
            ];

        } catch (\Exception $e) {
            Log::error('[QRIS Service] Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'purchase_id' => $purchase->id,
            ]);

            return [
                'success' => false,
                'message' => 'Exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check QRIS payment status
     */
    public function checkPaymentStatus(PaymentTransaction $transaction): array
    {
        if ($this->apiService->isMockMode()) {
            return $this->checkMockPaymentStatus($transaction);
        }

        try {
            $accountId = $this->apiService->getMerchantAccountId();
            $qrisId = $transaction->singapay_response['id'] ?? null;

            if (!$qrisId) {
                Log::warning('[QRIS Service] QRIS ID not found in transaction', [
                    'transaction_id' => $transaction->id,
                ]);
                return [
                    'success' => false,
                    'message' => 'QRIS ID not found',
                ];
            }

            Log::info('[QRIS Service] Checking payment status', [
                'transaction_id' => $transaction->id,
                'qris_id' => $qrisId,
            ]);

            $response = $this->apiService->sendRequest(
                "/api/v1.0/qris-dynamic/{$accountId}/show/{$qrisId}",
                [],
                'GET'
            );

            if (!$response['success']) {
                return [
                    'success' => false,
                    'message' => $response['message'] ?? 'Failed to check payment status',
                ];
            }

            $qrisData = $response['data'];
            $status = $qrisData['status'] ?? 'pending';

            // Map QRIS status to transaction status
            $transactionStatus = match($status) {
                'paid', 'success' => 'paid',
                'open', 'active' => 'pending',
                'closed', 'expired' => 'expired',
                default => 'pending',
            };

            return [
                'success' => true,
                'status' => $transactionStatus,
                'paid' => $transactionStatus === 'paid',
                'data' => $qrisData,
            ];

        } catch (\Exception $e) {
            Log::error('[QRIS Service] Check status exception', [
                'message' => $e->getMessage(),
                'transaction_id' => $transaction->id,
            ]);

            return [
                'success' => false,
                'message' => 'Exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check mock payment status (simulate auto-approval)
     */
    protected function checkMockPaymentStatus(PaymentTransaction $transaction): array
    {
        $autoApprove = (int) config('singapay.mock.auto_approve_delay', 0);

        if ($autoApprove > 0) {
            $createdTime = $transaction->created_at->timestamp;
            $currentTime = now()->timestamp;
            $elapsed = $currentTime - $createdTime;

            if ($elapsed >= $autoApprove) {
                $successRate = (int) config('singapay.mock.success_rate', 100);
                $isPaid = rand(1, 100) <= $successRate;

                Log::info('[QRIS Service] Mock auto-approval', [
                    'transaction_id' => $transaction->id,
                    'elapsed' => $elapsed,
                    'paid' => $isPaid,
                ]);

                return [
                    'success' => true,
                    'status' => $isPaid ? 'paid' : 'failed',
                    'paid' => $isPaid,
                    'data' => [
                        'status' => $isPaid ? 'paid' : 'failed',
                        'paid_at' => $isPaid ? now()->toIso8601String() : null,
                        'mock_mode' => true,
                        'elapsed_seconds' => $elapsed,
                    ],
                ];
            }
        }

        return [
            'success' => true,
            'status' => 'pending',
            'paid' => false,
            'data' => [
                'status' => 'pending',
                'mock_mode' => true,
            ],
        ];
    }

    /**
     * Get payment instructions
     */
    protected function getPaymentInstructions(): array
    {
        return [
            'steps' => [
                'Buka aplikasi e-wallet atau mobile banking Anda (GoPay, OVO, DANA, dll)',
                'Pilih menu Scan QR atau Bayar dengan QRIS',
                'Scan kode QR yang ditampilkan',
                'Periksa detail pembayaran',
                'Konfirmasi pembayaran dengan PIN Anda',
                'Simpan bukti pembayaran',
            ],
            'supported_apps' => [
                'GoPay',
                'OVO',
                'DANA',
                'ShopeePay',
                'LinkAja',
                'Bank Digital (Blu, Jago, dll)',
                'Mobile Banking (BCA, Mandiri, BRI, BNI, dll)',
            ],
            'notes' => [
                'QRIS dapat dibayar melalui berbagai aplikasi e-wallet dan mobile banking',
                'Pastikan saldo Anda mencukupi',
                'Pembayaran akan otomatis terkonfirmasi setelah berhasil',
                'Kode QR akan kedaluwarsa sesuai waktu yang ditentukan',
            ],
        ];
    }

    /**
     * Generate QRIS image URL (if needed for display)
     */
    public function getQrisImageUrl(string $qrisContent): string
    {
        // If qrisContent is base64, return data URL
        if (base64_decode($qrisContent, true) !== false) {
            return 'data:image/png;base64,' . $qrisContent;
        }

        // If it's already a URL, return as is
        if (filter_var($qrisContent, FILTER_VALIDATE_URL)) {
            return $qrisContent;
        }

        // Generate using external QR code service as fallback
        return 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($qrisContent);
    }
}
