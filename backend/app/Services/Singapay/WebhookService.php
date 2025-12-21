<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PaymentTransaction;
use App\Models\Singapay\PdfPurchase;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookService
{
    /**
     * Process payment webhook from SingaPay
     */
    public function processPaymentWebhook(array $payload): array
    {
        try {
            // Validate webhook signature
            if (!$this->validateSignature($payload)) {
                Log::warning('[SingaPay Webhook] Invalid signature', $payload);
                return [
                    'success' => false,
                    'message' => 'Invalid signature',
                ];
            }

            // Extract transaction data
            $transactionCode = $payload['reff_no'] ?? null;
            $status = $payload['status'] ?? 'pending';
            $paidAt = $payload['paid_at'] ?? null;

            if (!$transactionCode) {
                return [
                    'success' => false,
                    'message' => 'Transaction code not found',
                ];
            }

            // Find payment transaction
            $transaction = PaymentTransaction::where('transaction_code', $transactionCode)->first();

            if (!$transaction) {
                Log::warning('[SingaPay Webhook] Transaction not found', [
                    'transaction_code' => $transactionCode,
                ]);
                return [
                    'success' => false,
                    'message' => 'Transaction not found',
                ];
            }

            // Update webhook data
            $transaction->update([
                'webhook_data' => $payload,
            ]);

            // Process based on status
            return match(strtolower($status)) {
                'paid', 'success' => $this->handlePaidTransaction($transaction, $payload, $paidAt),
                'failed', 'expired' => $this->handleFailedTransaction($transaction, $payload),
                default => [
                    'success' => true,
                    'message' => 'Webhook received but not processed',
                ],
            };

        } catch (\Exception $e) {
            Log::error('[SingaPay Webhook] Exception', [
                'message' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return [
                'success' => false,
                'message' => 'Exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle paid transaction
     */
    protected function handlePaidTransaction(PaymentTransaction $transaction, array $payload, ?string $paidAt): array
    {
        DB::beginTransaction();

        try {
            // Check if already processed
            if ($transaction->isPaid()) {
                DB::commit();
                return [
                    'success' => true,
                    'message' => 'Transaction already processed',
                ];
            }

            // Update transaction status
            $transaction->markAsPaid($paidAt ? Carbon::parse($paidAt) : now());

            // Get purchase
            $purchase = $transaction->pdfPurchase;

            if (!$purchase) {
                throw new \Exception('Purchase not found');
            }

            // Activate purchase
            $purchase->activate();

            // Update user access
            $user = $purchase->user;
            if ($user) {
                $this->updateUserAccess($user, $purchase);
            }

            DB::commit();

            Log::info('[SingaPay Webhook] Payment processed successfully', [
                'transaction_id' => $transaction->id,
                'purchase_id' => $purchase->id,
                'user_id' => $user->id ?? null,
            ]);

            return [
                'success' => true,
                'message' => 'Payment processed successfully',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'purchase_id' => $purchase->id,
                    'expires_at' => $purchase->expires_at,
                ],
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('[SingaPay Webhook] Failed to process payment', [
                'transaction_id' => $transaction->id,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to process payment: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle failed transaction
     */
    protected function handleFailedTransaction(PaymentTransaction $transaction, array $payload): array
    {
        try {
            // Update transaction status
            $transaction->markAsFailed();

            // Update purchase status
            $purchase = $transaction->pdfPurchase;
            if ($purchase) {
                $purchase->markAsFailed();
            }

            Log::info('[SingaPay Webhook] Transaction marked as failed', [
                'transaction_id' => $transaction->id,
                'purchase_id' => $purchase->id ?? null,
            ]);

            return [
                'success' => true,
                'message' => 'Transaction marked as failed',
            ];

        } catch (\Exception $e) {
            Log::error('[SingaPay Webhook] Failed to mark transaction as failed', [
                'transaction_id' => $transaction->id,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to process: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Update user PDF access
     */
    protected function updateUserAccess(User $user, PdfPurchase $purchase): void
    {
        $user->update([
            'pdf_access_expires_at' => $purchase->expires_at,
            'pdf_access_package' => $purchase->package_type,
            'pdf_access_active' => true,
        ]);
    }

    /**
     * Validate webhook signature
     */
    protected function validateSignature(array $payload): bool
    {
        // In mock mode, skip signature validation
        if (config('singapay.mode') === 'mock') {
            return true;
        }

        $signature = $payload['signature'] ?? null;
        $webhookSecret = config('singapay.webhook.secret');

        if (!$signature || !$webhookSecret) {
            return false;
        }

        // Remove signature from payload for validation
        $dataToSign = $payload;
        unset($dataToSign['signature']);

        // Generate expected signature
        $expectedSignature = $this->generateSignature($dataToSign, $webhookSecret);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Generate webhook signature
     */
    protected function generateSignature(array $data, string $secret): string
    {
        // Sort data by key
        ksort($data);

        // Create signature string
        $signatureString = '';
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $signatureString .= $key . '=' . $value . '&';
        }
        $signatureString = rtrim($signatureString, '&');

        // Generate HMAC SHA512
        return hash_hmac('sha512', $signatureString, $secret);
    }

    /**
     * Process mock webhook (for testing)
     */
    public function processMockWebhook(PaymentTransaction $transaction): array
    {
        $payload = [
            'reff_no' => $transaction->transaction_code,
            'status' => 'paid',
            'paid_at' => now()->toIso8601String(),
            'amount' => $transaction->amount,
            'payment_method' => $transaction->payment_method,
            'mock_mode' => true,
        ];

        return $this->processPaymentWebhook($payload);
    }
}
