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
     * Get merchant account ID
     */
    public function getMerchantAccountId(): string
    {
        return $this->merchantAccountId;
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
                $this->logInfo('Using cached access token');
                return $token;
            }
        }

        // Generate new token
        $token = $this->generateAccessToken();

        if ($token && config('singapay.cache.enabled')) {
            // Cache for 50 minutes (token expires in 1 hour)
            $ttl = config('singapay.cache.ttl', 3000);
            Cache::put($cacheKey, $token, $ttl);
            $this->logInfo('Access token cached', ['ttl' => $ttl]);
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
            $signature = $this->generateAccessTokenSignature($timestamp);

            $this->logInfo('Generating new access token', [
                'endpoint' => '/api/v1.1/access-token/b2b',
                'timestamp' => $timestamp,
            ]);

            $response = Http::timeout(config('singapay.timeout', 30))
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
                $token = $data['data']['access_token'] ?? $data['data']['accessToken'] ?? null;

                if ($token) {
                    $this->logInfo('Access token generated successfully');
                    return $token;
                }
            }

            $this->logError('Failed to generate access token', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            $this->logError('Exception generating access token', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * Generate HMAC SHA512 signature for access token
     */
    protected function generateAccessTokenSignature(string $timestamp): string
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
                    'error_code' => 'AUTH_TOKEN_FAILED',
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
                'endpoint' => $endpoint,
                'data' => $data,
            ]);

            $request = Http::timeout(config('singapay.timeout', 30))
                ->withHeaders($headers);

            $response = match(strtoupper($method)) {
                'GET' => $request->get($url, $data),
                'POST' => $request->post($url, $data),
                'PUT' => $request->put($url, $data),
                'PATCH' => $request->patch($url, $data),
                'DELETE' => $request->delete($url, $data),
                default => throw new \Exception('Invalid HTTP method: ' . $method),
            };

            $responseData = $response->json();

            $this->logInfo('Received response', [
                'status' => $response->status(),
                'success' => $response->successful(),
                'data' => $responseData,
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $responseData['data'] ?? $responseData,
                    'message' => $responseData['message'] ?? 'Success',
                    'status_code' => $response->status(),
                ];
            }

            // Handle error responses
            return [
                'success' => false,
                'message' => $responseData['message'] ?? $responseData['error']['message'] ?? 'Request failed',
                'errors' => $responseData['errors'] ?? [],
                'error_code' => $responseData['error']['code'] ?? $response->status(),
                'status_code' => $response->status(),
            ];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            $this->logError('Connection timeout', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Connection timeout. Please check your internet connection.',
                'error_code' => 'CONNECTION_TIMEOUT',
            ];

        } catch (\Exception $e) {
            $this->logError('Request exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Request exception: ' . $e->getMessage(),
                'error_code' => 'EXCEPTION',
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

        // Simulate realistic delay
        $delay = config('singapay.mock.response_delay', 1);
        if ($delay > 0) {
            sleep($delay);
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
                    'expired_at' => $data['expired_at'] ?? now()->addDay()->toIso8601String(),
                    'created_at' => now()->toIso8601String(),
                    'max_usage' => $data['max_usage'] ?? 1,
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
                    'qris_content' => $this->generateMockQRISImage(),
                    'qris_string' => '00020101021226670016COM.SINGAPAY.WWW01189360050300000898740214' . rand(100000000000, 999999999999),
                    'qris_url' => 'https://mock-qris-url.com/qr/' . uniqid(),
                    'amount' => $data['amount'],
                    'tip_amount' => 0,
                    'total_amount' => $data['amount'],
                    'expired_at' => $data['expired_at'] ?? now()->addHour()->toIso8601String(),
                    'status' => 'active',
                    'created_at' => now()->toIso8601String(),
                ],
                'message' => 'QRIS generated successfully (MOCK)',
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
        $prefix = match(strtoupper($bankCode)) {
            'BRI' => '88810',
            'BNI' => '88820',
            'DANAMON' => '88830',
            'MAYBANK' => '88840',
            default => '88800',
        };

        return $prefix . rand(10000000, 99999999);
    }

    /**
     * Generate mock QRIS image (simple base64 placeholder)
     */
    protected function generateMockQRISImage(): string
    {
        // Generate a simple 1x1 transparent PNG as base64
        $transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        return $transparentPng;
    }

    /**
     * Clear cached token (useful for testing)
     */
    public function clearTokenCache(): void
    {
        $cacheKey = config('singapay.cache.prefix') . $this->mode;
        Cache::forget($cacheKey);
        $this->logInfo('Token cache cleared');
    }

    /**
     * Log info
     */
    protected function logInfo(string $message, array $context = []): void
    {
        if (config('singapay.logging.enabled')) {
            Log::channel(config('singapay.logging.channel', 'daily'))
                ->info('[SingaPay API] ' . $message, $context);
        }
    }

    /**
     * Log error
     */
    protected function logError(string $message, array $context = []): void
    {
        if (config('singapay.logging.enabled')) {
            Log::channel(config('singapay.logging.channel', 'daily'))
                ->error('[SingaPay API] ' . $message, $context);
        }
    }
}
