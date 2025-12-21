<?php

namespace App\Services\Singapay;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SingapayApiService
{
    protected $mode;
    protected $baseUrl;
    protected $partnerId;
    protected $clientId;
    protected $clientSecret;
    protected $merchantAccountId;

    public function __construct()
    {
        $this->mode = config('singapay.mode', 'mock');
        $this->partnerId = config('singapay.partner_id');
        $this->clientId = config('singapay.client_id');
        $this->clientSecret = config('singapay.client_secret');
        $this->merchantAccountId = config('singapay.merchant_account_id');

        // Set base URL based on mode
        if ($this->mode === 'production') {
            $this->baseUrl = config('singapay.production_url');
        } else {
            $this->baseUrl = config('singapay.sandbox_url');
        }
    }

    /**
     * Get current mode
     */
    public function getMode(): string
    {
        return $this->mode;
    }

    /**
     * Check if mock mode
     */
    public function isMockMode(): bool
    {
        return $this->mode === 'mock';
    }

    /**
     * Get access token
     */
    public function getAccessToken(): ?string
    {
        if ($this->isMockMode()) {
            return 'mock_token_' . time();
        }

        $cacheKey = config('singapay.cache.prefix') . $this->mode;

        if (config('singapay.cache.enabled')) {
            $token = Cache::get($cacheKey);
            if ($token) {
                return $token;
            }
        }

        // Generate new token
        $token = $this->generateAccessToken();

        if ($token && config('singapay.cache.enabled')) {
            Cache::put($cacheKey, $token, config('singapay.cache.ttl'));
        }

        return $token;
    }

    /**
     * Generate new access token
     */
    protected function generateAccessToken(): ?string
    {
        try {
            $timestamp = now()->format('Ymd');
            $signature = $this->generateSignature($timestamp);

            $response = Http::timeout(config('singapay.timeout'))
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'X-CLIENT-ID' => $this->clientId,
                    'X-SIGNATURE' => $signature,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl . '/api/v1.1/access-token/b2b', [
                    'grantType' => 'client_credentials',
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['data']['accessToken'] ?? null;
            }

            $this->logError('Failed to generate access token', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            $this->logError('Exception generating access token', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Generate HMAC SHA512 signature
     */
    protected function generateSignature(string $timestamp): string
    {
        $payload = $this->clientId . '_' . $this->clientSecret . '_' . $timestamp;
        return hash_hmac('sha512', $payload, $this->clientSecret);
    }

    /**
     * Send API request
     */
    public function sendRequest(string $endpoint, array $data = [], string $method = 'POST'): array
    {
        if ($this->isMockMode()) {
            return $this->getMockResponse($endpoint, $data, $method);
        }

        try {
            $token = $this->getAccessToken();
            if (!$token) {
                return [
                    'success' => false,
                    'message' => 'Failed to get access token',
                ];
            }

            $url = $this->baseUrl . $endpoint;
            $headers = [
                'X-PARTNER-ID' => $this->partnerId,
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ];

            $this->logInfo('Sending request', [
                'method' => $method,
                'url' => $url,
                'data' => $data,
            ]);

            $request = Http::timeout(config('singapay.timeout'))
                ->withHeaders($headers);

            $response = match(strtoupper($method)) {
                'GET' => $request->get($url, $data),
                'POST' => $request->post($url, $data),
                'PUT' => $request->put($url, $data),
                'PATCH' => $request->patch($url, $data),
                'DELETE' => $request->delete($url, $data),
                default => throw new \Exception('Invalid HTTP method'),
            };

            $responseData = $response->json();

            $this->logInfo('Received response', [
                'status' => $response->status(),
                'data' => $responseData,
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $responseData['data'] ?? $responseData,
                    'message' => $responseData['message'] ?? 'Success',
                ];
            }

            return [
                'success' => false,
                'message' => $responseData['message'] ?? 'Request failed',
                'errors' => $responseData['errors'] ?? [],
            ];

        } catch (\Exception $e) {
            $this->logError('Request exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Request exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get mock response for testing
     */
    protected function getMockResponse(string $endpoint, array $data, string $method): array
    {
        $this->logInfo('Mock request', [
            'endpoint' => $endpoint,
            'data' => $data,
            'method' => $method,
        ]);

        // Simulate delay
        if (config('singapay.mock.auto_approve_delay') > 0) {
            sleep(1); // Short delay for realism
        }

        // Generate mock data based on endpoint
        return $this->generateMockData($endpoint, $data);
    }

    /**
     * Generate mock data
     */
    protected function generateMockData(string $endpoint, array $data): array
    {
        // VA Creation
        if (str_contains($endpoint, 'virtual-accounts')) {
            $bankCode = $data['bank_code'] ?? 'BRI';
            return [
                'success' => true,
                'data' => [
                    'id' => rand(1000, 9999),
                    'account_id' => $this->merchantAccountId,
                    'bank_code' => $bankCode,
                    'va_number' => $this->generateMockVANumber($bankCode),
                    'name' => $data['name'] ?? 'SmartPlan User',
                    'amount' => $data['amount'],
                    'kind' => $data['kind'] ?? 'temporary',
                    'status' => 'active',
                    'expired_at' => isset($data['expired_at']) ? $data['expired_at'] : null,
                    'created_at' => now()->toIso8601String(),
                ],
                'message' => 'Virtual Account created successfully (MOCK)',
            ];
        }

        // QRIS Creation
        if (str_contains($endpoint, 'qris')) {
            return [
                'success' => true,
                'data' => [
                    'id' => rand(1000, 9999),
                    'qris_content' => base64_encode('MOCK_QRIS_IMAGE'),
                    'qris_string' => '00020101021226670016COM.NOBUBANK.WWW01189360050300000898740214' . rand(100000000000, 999999999999),
                    'qris_url' => 'https://mock-qris-url.com/qr/' . uniqid(),
                    'amount' => $data['amount'],
                    'expired_at' => isset($data['expired_at']) ? $data['expired_at'] : now()->addHour()->toIso8601String(),
                    'status' => 'active',
                    'created_at' => now()->toIso8601String(),
                ],
                'message' => 'QRIS generated successfully (MOCK)',
            ];
        }

        // Payment Link Creation
        if (str_contains($endpoint, 'payment-link')) {
            return [
                'success' => true,
                'data' => [
                    'id' => rand(1000, 9999),
                    'payment_url' => 'https://mock-payment-link.com/pay/' . uniqid(),
                    'reff_no' => $data['reff_no'] ?? 'REF' . time(),
                    'amount' => $data['amount'],
                    'expired_at' => now()->addDay()->toIso8601String(),
                    'status' => 'active',
                    'created_at' => now()->toIso8601String(),
                ],
                'message' => 'Payment Link created successfully (MOCK)',
            ];
        }

        // Default mock response
        return [
            'success' => true,
            'data' => $data,
            'message' => 'Mock response',
        ];
    }

    /**
     * Generate mock VA number
     */
    protected function generateMockVANumber(string $bankCode): string
    {
        $prefix = match($bankCode) {
            'BRI' => '88810',
            'BNI' => '88820',
            'DANAMON' => '88830',
            'MAYBANK' => '88840',
            default => '88800',
        };

        return $prefix . rand(1000000000, 9999999999);
    }

    /**
     * Log info
     */
    protected function logInfo(string $message, array $context = []): void
    {
        if (config('singapay.logging.enabled')) {
            Log::channel(config('singapay.logging.channel'))
                ->info('[SingaPay] ' . $message, $context);
        }
    }

    /**
     * Log error
     */
    protected function logError(string $message, array $context = []): void
    {
        if (config('singapay.logging.enabled')) {
            Log::channel(config('singapay.logging.channel'))
                ->error('[SingaPay] ' . $message, $context);
        }
    }
}
