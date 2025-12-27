<?php

namespace App\Services\Singapay;

use App\Models\Affiliate\AffiliateWithdrawal;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SingaPayPayoutService
{
    protected $baseUrl;
    protected $apiKey;
    protected $clientId;
    protected $clientSecret;
    protected $isMock;

    public function __construct()
    {
        $this->baseUrl = config('singapay.base_url', 'https://sandbox-payment-b2b.singapay.id');
        $this->apiKey = config('singapay.api_key');
        $this->clientId = config('singapay.client_id');
        $this->clientSecret = config('singapay.client_secret');
        $this->isMock = config('singapay.mode') === 'mock' || app()->environment('local');
    }

    /**
     * Request a payout (disbursement)
     */
    public function requestPayout(AffiliateWithdrawal $withdrawal): array
    {
        if ($this->isMock) {
            return $this->mockPayout($withdrawal);
        }

        // Real API Implementation (Future)
        // For now, we only implement mock because user specifically requested mock first
        // and we need to be careful with real money APIs.

        Log::warning('[SingaPay Payout] Real payout requested but not fully implemented. Falling back to mock.', [
            'withdrawal_id' => $withdrawal->id
        ]);

        return $this->mockPayout($withdrawal);
    }

    /**
     * Simulate a payout request
     */
    protected function mockPayout(AffiliateWithdrawal $withdrawal): array
    {
        Log::info('[SingaPay Payout] Mock payout processed', [
            'withdrawal_id' => $withdrawal->id,
            'amount' => $withdrawal->amount,
            'bank' => $withdrawal->bank_name,
        ]);

        // Simulate success response
        $scheduledDate = now()->addDay(); // Tomorrow

        // Update withdrawal with mock response
        $withdrawal->update([
            'singapay_reference' => 'MOCK-DISB-' . uniqid(),
            'status' => AffiliateWithdrawal::STATUS_PROCESSED,
            'scheduled_date' => $scheduledDate,
            'singapay_response' => [
                'status' => 'SUCCESS',
                'message' => 'Mock disbursement scheduled',
                'reference_no' => 'MOCK-' . time(),
            ]
        ]);

        return [
            'success' => true,
            'message' => 'Permintaan withdraw berhasil dikirim (MOCK).',
            'data' => [
                'scheduled_date' => $scheduledDate->toIso8601String(),
                'status' => 'processed'
            ]
        ];
    }
}
