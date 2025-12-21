<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PaymentTransaction;
use App\Models\Singapay\PdfPurchase;
use Carbon\Carbon;

class VirtualAccountService
{
    protected $apiService;

    public function __construct(SingapayApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    /**
     * Create Virtual Account for payment
     */
    public function createVirtualAccount(PdfPurchase $purchase, string $bankCode): array
    {
        try {
            $expiryHours = config('singapay.virtual_account.expiry_hours', 24);
            $expiredAt = Carbon::now()->addHours($expiryHours);

            $data = [
                'account_id' => config('singapay.merchant_account_id'),
                'bank_code' => strtoupper($bankCode),
                'name' => $purchase->user->name ?? 'SmartPlan User',
                'amount' => $purchase->amount_paid,
                'kind' => config('singapay.virtual_account.kind', 'temporary'),
                'max_usage' => config('singapay.virtual_account.max_usage', 1),
                'reff_no' => $purchase->transaction_code,
                'expired_at' => $expiredAt->toIso8601String(),
            ];

            // Send request to SingaPay API
            $response = $this->apiService->sendRequest(
                '/api/v1.1/virtual-accounts',
                $data,
                'POST'
            );

            if (!$response['success']) {
                return [
                    'success' => false,
                    'message' => $response['message'] ?? 'Failed to create Virtual Account',
                ];
            }

            $vaData = $response['data'];

            // Create payment transaction record
            $transaction = PaymentTransaction::create([
                'pdf_purchase_id' => $purchase->id,
                'transaction_code' => $purchase->transaction_code,
                'reference_no' => PaymentTransaction::generateReferenceNo(),
                'payment_method' => 'virtual_account',
                'bank_code' => $bankCode,
                'va_number' => $vaData['va_number'],
                'amount' => $purchase->amount_paid,
                'currency' => 'IDR',
                'status' => 'pending',
                'mode' => $this->apiService->getMode(),
                'expired_at' => $expiredAt,
                'singapay_request' => $data,
                'singapay_response' => $vaData,
            ]);

            return [
                'success' => true,
                'message' => 'Virtual Account created successfully',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'bank_code' => $bankCode,
                    'bank_name' => $this->getBankName($bankCode),
                    'va_number' => $vaData['va_number'],
                    'amount' => $purchase->amount_paid,
                    'formatted_amount' => $transaction->formatted_amount,
                    'expired_at' => $expiredAt->toIso8601String(),
                    'expired_at_formatted' => $expiredAt->format('d M Y H:i'),
                    'payment_instructions' => $this->getPaymentInstructions($bankCode, $vaData['va_number']),
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
     * Check Virtual Account payment status
     */
    public function checkPaymentStatus(PaymentTransaction $transaction): array
    {
        if ($this->apiService->isMockMode()) {
            return $this->checkMockPaymentStatus($transaction);
        }

        try {
            $response = $this->apiService->sendRequest(
                '/api/v1.1/virtual-accounts/' . $transaction->reference_no,
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
     * Get bank name
     */
    protected function getBankName(string $bankCode): string
    {
        $banks = [
            'BRI' => 'Bank Rakyat Indonesia',
            'BNI' => 'Bank Negara Indonesia',
            'DANAMON' => 'Bank Danamon',
            'MAYBANK' => 'Maybank Indonesia',
        ];

        return $banks[strtoupper($bankCode)] ?? $bankCode;
    }

    /**
     * Get payment instructions
     */
    protected function getPaymentInstructions(string $bankCode, string $vaNumber): array
    {
        $bankName = $this->getBankName($bankCode);

        $instructions = [
            'BRI' => [
                'ATM' => [
                    'Masukkan kartu ATM dan PIN Anda',
                    'Pilih menu Transaksi Lain',
                    'Pilih menu Pembayaran',
                    'Pilih menu Lainnya',
                    'Pilih menu BRIVA',
                    'Masukkan nomor Virtual Account: ' . $vaNumber,
                    'Periksa informasi pembayaran',
                    'Ikuti instruksi untuk menyelesaikan pembayaran',
                ],
                'Mobile Banking' => [
                    'Login ke aplikasi BRI Mobile',
                    'Pilih menu Pembayaran',
                    'Pilih menu BRIVA',
                    'Masukkan nomor Virtual Account: ' . $vaNumber,
                    'Masukkan nominal pembayaran',
                    'Masukkan PIN',
                    'Pembayaran selesai',
                ],
            ],
            'BNI' => [
                'ATM' => [
                    'Masukkan kartu ATM dan PIN Anda',
                    'Pilih menu Lainnya',
                    'Pilih menu Transfer',
                    'Pilih menu Rekening Tabungan',
                    'Masukkan nomor Virtual Account: ' . $vaNumber,
                    'Masukkan nominal pembayaran',
                    'Konfirmasi pembayaran',
                ],
                'Mobile Banking' => [
                    'Login ke aplikasi BNI Mobile Banking',
                    'Pilih menu Transfer',
                    'Pilih menu Virtual Account Billing',
                    'Masukkan nomor Virtual Account: ' . $vaNumber,
                    'Masukkan nominal pembayaran',
                    'Konfirmasi dengan PIN',
                ],
            ],
        ];

        return $instructions[strtoupper($bankCode)] ?? [
            'ATM/Mobile Banking' => [
                'Pilih menu Pembayaran atau Transfer',
                'Masukkan nomor Virtual Account: ' . $vaNumber,
                'Periksa detail pembayaran',
                'Konfirmasi pembayaran',
            ],
        ];
    }

    /**
     * Get supported banks
     */
    public function getSupportedBanks(): array
    {
        $banks = config('singapay.virtual_account.banks', ['BRI', 'BNI', 'DANAMON', 'MAYBANK']);

        return collect($banks)->map(fn($code) => [
            'code' => $code,
            'name' => $this->getBankName($code),
        ])->toArray();
    }
}
