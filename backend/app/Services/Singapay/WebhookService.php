<?php

namespace App\Services\Singapay;

use App\Models\Singapay\PaymentTransaction;
use App\Models\Singapay\PdfPurchase;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class WebhookService
{
    /**
     * Process payment webhook from SingaPay
     */
    public function processPaymentWebhook(array $payload, Request $request): array
    {
        try {
            // Validate webhook signature
            if (!$this->validateWebhookSignature($request)) {
                Log::warning('[SingaPay Webhook] Invalid signature', [
                    'payload' => $payload,
                    'headers' => $request->headers->all(),
                ]);
                return [
                    'success' => false,
                    'message' => 'Invalid signature',
                ];
            }

            // Extract transaction data from nested structure
            $transactionData = $payload['data']['transaction'] ?? null;
            if (!$transactionData) {
                Log::error('[SingaPay Webhook] Transaction data not found', $payload);
                return [
                    'success' => false,
                    'message' => 'Transaction data not found in payload',
                ];
            }

            $transactionCode = $transactionData['reff_no'] ?? null;
            $status = $transactionData['status'] ?? 'pending';
            $paidAt = $transactionData['processed_timestamp'] ?? $transactionData['post_timestamp'] ?? null;

            if (!$transactionCode) {
                return [
                    'success' => false,
                    'message' => 'Transaction code not found',
                ];
            }

            // Find payment transaction
            $transaction = PaymentTransaction::where('transaction_code', $transactionCode)
                ->orWhere('reference_no', $transactionCode)
                ->first();

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
            return match (strtolower($status)) {
                'paid', 'success' => $this->handlePaidTransaction($transaction, $payload, $paidAt),
                'failed', 'expired' => $this->handleFailedTransaction($transaction, $payload),
                default => [
                    'success' => true,
                    'message' => 'Webhook received but not processed (status: ' . $status . ')',
                ],
            };
        } catch (\Exception $e) {
            Log::error('[SingaPay Webhook] Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
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
                Log::info('[SingaPay Webhook] Transaction already processed', [
                    'transaction_id' => $transaction->id,
                ]);
                return [
                    'success' => true,
                    'message' => 'Transaction already processed',
                ];
            }

            // Parse paid_at timestamp
            $paidAtTimestamp = null;
            if ($paidAt) {
                // Handle different timestamp formats
                if (is_numeric($paidAt)) {
                    // Unix timestamp in milliseconds
                    $paidAtTimestamp = Carbon::createFromTimestampMs($paidAt);
                } else {
                    // Date string format
                    $paidAtTimestamp = Carbon::parse($paidAt);
                }
            }

            // Update transaction status
            $transaction->markAsPaid($paidAtTimestamp ?? now(), $payload);

            // Get purchase
            $purchase = $transaction->pdfPurchase;

            if (!$purchase) {
                throw new \Exception('Purchase not found for transaction ' . $transaction->id);
            }

            // Activate purchase
            $purchase->activate();

            // Update user access
            $user = $purchase->user;
            if ($user) {
                $this->updateUserAccess($user, $purchase);
            }

            // Calculate affiliate commission (if applicable)
            $affiliateCommissionService = app(\App\Services\AffiliateCommissionService::class);
            $commission = $affiliateCommissionService->calculateCommission($purchase);

            if ($commission) {
                Log::info('[SingaPay Webhook] Affiliate commission created', [
                    'commission_id' => $commission->id,
                    'commission_amount' => $commission->commission_amount,
                ]);
            }

            DB::commit();

            Log::info('[SingaPay Webhook] Payment processed successfully', [
                'transaction_id' => $transaction->id,
                'purchase_id' => $purchase->id,
                'user_id' => $user->id ?? null,
                'package_type' => $purchase->package_type,
                'expires_at' => $purchase->expires_at,
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
                'trace' => $e->getTraceAsString(),
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

        Log::info('[SingaPay Webhook] User access updated', [
            'user_id' => $user->id,
            'package' => $purchase->package_type,
            'expires_at' => $purchase->expires_at,
        ]);
    }

    /**
     * Validate webhook signature (VA & QRIS)
     * Sesuai dokumentasi: HMAC-SHA256 dengan sorted JSON body dan client_id sebagai secret
     */
    protected function validateWebhookSignature(Request $request): bool
    {
        // In mock mode, skip signature validation
        if (config('singapay.mode') === 'mock') {
            Log::info('[SingaPay Webhook] Skipping signature validation (mock mode)');
            return true;
        }

        $signature = $request->header('X-Signature');
        $clientId = config('singapay.client_id');

        if (!$signature || !$clientId) {
            Log::error('[SingaPay Webhook] Missing signature or client_id', [
                'has_signature' => !empty($signature),
                'has_client_id' => !empty($clientId),
            ]);
            return false;
        }

        try {
            // Get raw body
            $body = $request->getContent();
            $data = json_decode($body, true);

            if (!$data) {
                Log::error('[SingaPay Webhook] Invalid JSON body');
                return false;
            }

            // Sort JSON by key recursively
            $sortedData = $this->sortArrayRecursive($data);

            // Encode with exact format: no slashes escaped, consistent spacing
            $sortedBody = json_encode($sortedData, JSON_UNESCAPED_SLASHES);

            // Generate expected signature using client_id as secret
            $expectedSignature = hash_hmac('sha256', $sortedBody, $clientId);

            Log::info('[SingaPay Webhook] Signature validation', [
                'received_signature' => $signature,
                'expected_signature' => $expectedSignature,
                'sorted_body_length' => strlen($sortedBody),
            ]);

            return hash_equals($expectedSignature, $signature);
        } catch (\Exception $e) {
            Log::error('[SingaPay Webhook] Signature validation error', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Sort array recursively by key
     */
    protected function sortArrayRecursive(array $array): array
    {
        ksort($array);

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key] = $this->sortArrayRecursive($value);
            }
        }

        return $array;
    }

    /**
     * Process mock webhook (for testing)
     */
    public function processMockWebhook(PaymentTransaction $transaction): array
    {
        $payload = [
            'status' => 200,
            'success' => true,
            'data' => [
                'transaction' => [
                    'reff_no' => $transaction->transaction_code,
                    'type' => $transaction->payment_method === 'virtual_account' ? 'va' : 'qris',
                    'status' => 'paid',
                    'amount' => [
                        'value' => number_format($transaction->amount, 2, '.', ''),
                        'currency' => 'IDR',
                    ],
                    'post_timestamp' => now()->format('d M Y H:i:s'),
                    'processed_timestamp' => now()->format('d M Y H:i:s'),
                ],
                'customer' => [
                    'id' => $transaction->pdfPurchase->user_id,
                    'name' => $transaction->pdfPurchase->user->name ?? 'Test User',
                    'email' => $transaction->pdfPurchase->user->email ?? 'test@example.com',
                    'phone' => '081234567890',
                ],
                'payment' => [
                    'method' => $transaction->payment_method === 'virtual_account' ? 'va' : 'qris',
                    'additional_info' => $transaction->payment_method === 'virtual_account' ? [
                        'va_number' => $transaction->va_number,
                        'bank' => [
                            'short_name' => $transaction->bank_code,
                            'bank_code' => $transaction->bank_code,
                        ],
                    ] : [
                        'qr_string' => $transaction->qris_content,
                    ],
                ],
            ],
        ];

        // Create mock request
        $mockRequest = Request::create('/webhook/test', 'POST', [], [], [], [], json_encode($payload));
        $mockRequest->headers->set('X-Signature', 'mock_signature');
        $mockRequest->headers->set('Content-Type', 'application/json');

        return $this->processPaymentWebhook($payload, $mockRequest);
    }

    /**
     * Process disbursement webhook from SingaPay
     * Updates withdrawal status when SingaPay sends notification
     */
    public function processDisbursementWebhook(array $payload): array
    {
        try {
            // Extract data from payload
            $data = $payload['data'] ?? null;
            if (!$data) {
                return [
                    'success' => false,
                    'message' => 'Invalid payload structure',
                ];
            }

            $referenceNumber = $data['reference_number'] ?? null;
            $status = $data['status'] ?? null; // 'success' or 'failed'
            $transactionId = $data['transaction_id'] ?? null;

            if (!$referenceNumber) {
                Log::warning('[Webhook] Disbursement reference number missing', $payload);
                return [
                    'success' => false,
                    'message' => 'Reference number missing',
                ];
            }

            // Find withdrawal by reference number
            $withdrawal = \App\Models\Affiliate\AffiliateWithdrawal::where('singapay_reference', $referenceNumber)
                ->orWhere('singapay_reference', 'LIKE', "%{$referenceNumber}%")
                ->first();

            if (!$withdrawal) {
                Log::warning('[Webhook] Withdrawal not found', [
                    'reference_number' => $referenceNumber,
                ]);
                return [
                    'success' => false,
                    'message' => 'Withdrawal not found',
                ];
            }

            // Update withdrawal status based on SingaPay response
            $newStatus = match (strtolower($status)) {
                'success' => \App\Models\Affiliate\AffiliateWithdrawal::STATUS_PROCESSED,
                'failed' => \App\Models\Affiliate\AffiliateWithdrawal::STATUS_FAILED,
                default => $withdrawal->status, // Keep current status if unknown
            };

            $withdrawal->update([
                'status' => $newStatus,
                'singapay_response' => array_merge(
                    $withdrawal->singapay_response ?? [],
                    ['webhook_received' => now()->toIso8601String(), 'webhook_data' => $data]
                ),
            ]);

            Log::info('[Webhook] Disbursement status updated', [
                'withdrawal_id' => $withdrawal->id,
                'status' => $newStatus,
                'reference_number' => $referenceNumber,
            ]);

            return [
                'success' => true,
                'message' => 'Withdrawal status updated',
            ];
        } catch (\Exception $e) {
            Log::error('[Webhook] Disbursement processing failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Processing failed: ' . $e->getMessage(),
            ];
        }
    }
}
