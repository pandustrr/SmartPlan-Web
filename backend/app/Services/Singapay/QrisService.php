<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PaymentTransaction;
use App\Models\Singapay\PdfPurchase;
use Carbon\Carbon;

class QrisService
{
    protected $apiService;

    public function __construct(SingapayApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Generate QRIS for payment
     */
    public function generateQris(PdfPurchase $purchase): array
    {
        try {
            $expiryHours = config('singapay.qris.expiry_hours', 1);
            $expiredAt = Carbon::now()->addHours($expiryHours);

            $data = [
                'account_id' => config('singapay.merchant_account_id'),
                'amount' => $purchase->amount_paid,
                'reff_no' => $purchase->transaction_code,
                'expired_at' => $expiredAt->toIso8601String(),
                'description' => 'SmartPlan Export PDF Pro - ' . ucfirst($purchase->package_type),
            ];

            // Send request to SingaPay API
            $response = $this->apiService->sendRequest(
                '/api/v1.1/qris',
                $data,
                'POST'
            );

            if (!$response['success']) {
                return [
                    'success' => false,
                    'message' => $response['message'] ?? 'Failed to generate QRIS',
                ];
            }

            $qrisData = $response['data'];

            // Create payment transaction record
            $transaction = PaymentTransaction::create([
                'pdf_purchase_id' => $purchase->id,
                'transaction_code' => $purchase->transaction_code,
                'reference_no' => PaymentTransaction::generateReferenceNo(),
                'payment_method' => 'qris',
                'qris_content' => $qrisData['qris_content'] ?? null,
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
                    'qris_content' => $qrisData['qris_content'] ?? null,
                    'qris_string' => $qrisData['qris_string'] ?? null,
                    'qris_url' => $qrisData['qris_url'] ?? null,
                    'amount' => $purchase->amount_paid,
                    'formatted_amount' => $transaction->formatted_amount,
                    'expired_at' => $expiredAt->toIso8601String(),
                    'expired_at_formatted' => $expiredAt->format('d M Y H:i'),
                    'payment_instructions' => $this->getPaymentInstructions(),
                ],
            ];

        } catch (\Exception $e) {
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
            $response = $this->apiService->sendRequest(
                '/api/v1.1/qris/' . $transaction->reference_no,
                [],
                'GET'
            );

            if (!$response['success']) {
                return [
                    'success' => false,
                    'message' => $response['message'] ?? 'Failed to check payment status',
                ];
            }

            $status = $response['data']['status'] ?? 'pending';

            return [
                'success' => true,
                'status' => $status,
                'paid' => $status === 'paid',
                'data' => $response['data'],
            ];

        } catch (\Exception $e) {
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
        $autoApprove = config('singapay.mock.auto_approve_delay', 0);

        if ($autoApprove > 0) {
            $createdTime = $transaction->created_at->timestamp;
            $currentTime = now()->timestamp;
            $elapsed = $currentTime - $createdTime;

            if ($elapsed >= $autoApprove) {
                // Auto approve after delay
                $successRate = config('singapay.mock.success_rate', 100);
                $isPaid = rand(1, 100) <= $successRate;

                return [
                    'success' => true,
                    'status' => $isPaid ? 'paid' : 'failed',
                    'paid' => $isPaid,
                    'data' => [
                        'status' => $isPaid ? 'paid' : 'failed',
                        'paid_at' => $isPaid ? now()->toIso8601String() : null,
                        'mock_mode' => true,
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

        // Generate using external QR code service
        return 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($qrisContent);
    }
}
