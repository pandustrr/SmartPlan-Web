# 🚀 Singapay B2B Integration Template - Ready to Use

**Untuk**: SmartPlan-Web Project  
**Tanggal**: December 3, 2025  
**Tujuan**: Template siap pakai dengan petunjuk customization

---

## 📋 Daftar Isi
1. [Laravel Service Implementation](#laravel-service-implementation)
2. [Environment Configuration](#environment-configuration)
3. [Controller Implementation](#controller-implementation)
4. [Webhook Handler](#webhook-handler)
5. [Database Migration](#database-migration)
6. [Customization Guide](#customization-guide)

---

## Laravel Service Implementation

### Lokasi File: `app/Services/SingapayService.php`

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class SingapayService {
    
    // ============================================
    // [CUSTOMIZATION] Bagian konfigurasi utama
    // Dari environment variables
    // ============================================
    private $apiUrl;
    private $partnerId;
    private $clientId;
    private $clientSecret;
    private $accessToken;
    private $tokenExpiry;
    
    public function __construct() {
        // [CUSTOMIZATION] Pastikan nilai ini tersedia di .env file
        $this->apiUrl = env('SINGAPAY_API_URL', 'https://sandbox-payment-b2b.singapay.id');
        $this->partnerId = env('SINGAPAY_PARTNER_ID');
        $this->clientId = env('SINGAPAY_CLIENT_ID');
        $this->clientSecret = env('SINGAPAY_CLIENT_SECRET');
    }
    
    // ============================================
    // AUTHENTICATION METHODS
    // ============================================
    
    /**
     * Generate signature untuk authentication
     * Formula: CLIENT_ID_CLIENT_SECRET_YYYYMMDD
     * Hash: HMAC SHA512 dengan CLIENT_SECRET
     */
    private function generateSignature() {
        $timestamp = date('Ymd');
        $payloadData = "{$this->clientId}_{$this->clientSecret}_{$timestamp}";
        $signature = hash_hmac('sha512', $payloadData, $this->clientSecret);
        
        Log::debug('Signature Generated', [
            'timestamp' => $timestamp,
            'payload' => $payloadData,
            'signature' => $signature
        ]);
        
        return $signature;
    }
    
    /**
     * Get access token dari Singapay API
     * 
     * Proses:
     * 1. Generate signature
     * 2. Send request ke /api/v1.1/access-token/b2b
     * 3. Simpan token (valid 3600 detik = 1 jam)
     * 4. Cache untuk performa
     */
    public function getAccessToken($forceRefresh = false) {
        try {
            // Cek cache jika token masih valid
            if (!$forceRefresh && $this->accessToken && $this->tokenExpiry > now()) {
                return $this->accessToken;
            }
            
            $signature = $this->generateSignature();
            
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'X-CLIENT-ID' => $this->clientId,
                    'X-Signature' => $signature,
                    'Accept' => 'application/json'
                ])
                ->timeout(30)
                ->retry(3, 1000)
                ->post("{$this->apiUrl}/api/v1.1/access-token/b2b", [
                    'grantType' => 'client_credentials'
                ]);
            
            if ($response->failed()) {
                Log::error('Failed to get Singapay access token', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new Exception('Failed to get access token: ' . $response->body());
            }
            
            $data = $response->json('data');
            $this->accessToken = $data['access_token'];
            $this->tokenExpiry = now()->addSeconds($data['expires_in'] - 60);
            
            Log::info('Singapay access token obtained', [
                'expires_in' => $data['expires_in'],
                'token_type' => $data['token_type']
            ]);
            
            return $this->accessToken;
            
        } catch (Exception $e) {
            Log::error('Exception in getAccessToken', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    // ============================================
    // ACCOUNT MANAGEMENT
    // ============================================
    
    /**
     * Buat account baru
     * 
     * [CUSTOMIZATION] Sesuaikan field dengan data customer:
     * - name: Nama customer
     * - email: Email customer
     * - phone: Nomor telepon
     */
    public function createAccount($name, $email, $phone) {
        try {
            $response = $this->makeRequest('POST', '/api/v1.0/accounts', [
                'name' => $name,
                'email' => $email,
                'phone' => $phone
            ]);
            
            Log::info('Account created', ['account_id' => $response['data']['id']]);
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to create account', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * List semua accounts
     */
    public function listAccounts() {
        try {
            return $this->makeRequest('GET', '/api/v1.0/accounts');
        } catch (Exception $e) {
            Log::error('Failed to list accounts', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Get detail account
     */
    public function getAccount($accountId) {
        try {
            return $this->makeRequest('GET', "/api/v1.0/accounts/{$accountId}");
        } catch (Exception $e) {
            Log::error('Failed to get account', ['account_id' => $accountId, 'error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    // ============================================
    // VIRTUAL ACCOUNT MANAGEMENT
    // ============================================
    
    /**
     * Buat Virtual Account untuk customer
     * 
     * [CUSTOMIZATION] Sesuaikan parameter:
     * - accountId: ID account yang sudah dibuat
     * - bankCode: Pilih dari BRI, BNI, DANAMON, MAYBANK
     * - amount: Nominal pembayaran (10.000 - 100.000.000)
     * - kind: 'permanent' atau 'temporary'
     * - description: Deskripsi VA (opsional)
     */
    public function createVirtualAccount($accountId, $bankCode, $amount, $kind = 'permanent', $description = null) {
        try {
            $payload = [
                'bank_code' => $bankCode,
                'amount' => $amount,
                'kind' => $kind,
                'currency' => 'IDR'
            ];
            
            // Jika temporary, tambahkan expiry dan max usage
            if ($kind === 'temporary') {
                $payload['expired_at'] = now()->addDays(30)->timestamp * 1000;
                $payload['max_usage'] = 10;
            }
            
            if ($description) {
                $payload['name'] = $description;
            }
            
            $response = $this->makeRequest('POST', "/api/v1.0/virtual-accounts/{$accountId}", $payload);
            
            Log::info('Virtual account created', [
                'account_id' => $accountId,
                'va_number' => $response['data']['va_number'],
                'bank' => $bankCode
            ]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to create virtual account', [
                'account_id' => $accountId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    /**
     * List Virtual Accounts untuk account
     */
    public function listVirtualAccounts($accountId) {
        try {
            return $this->makeRequest('GET', "/api/v1.0/virtual-accounts/{$accountId}");
        } catch (Exception $e) {
            Log::error('Failed to list virtual accounts', ['account_id' => $accountId]);
            throw $e;
        }
    }
    
    /**
     * Get detail VA transaction
     */
    public function listVATransactions($accountId) {
        try {
            return $this->makeRequest('GET', "/api/v1.0/va-transactions/{$accountId}");
        } catch (Exception $e) {
            Log::error('Failed to list VA transactions', ['account_id' => $accountId]);
            throw $e;
        }
    }
    
    // ============================================
    // PAYMENT LINK MANAGEMENT
    // ============================================
    
    /**
     * Buat Payment Link untuk invoice
     * 
     * [CUSTOMIZATION] Sesuaikan parameter:
     * - accountId: ID account merchant
     * - referenceNo: Nomor referensi unik (misal: INV-001)
     * - amount: Total pembayaran
     * - expiryMinutes: Berapa menit link berlaku (default: 1440 = 24 jam)
     * - paymentMethods: Metode pembayaran yang diperbolehkan
     */
    public function createPaymentLink(
        $accountId,
        $referenceNo,
        $amount,
        $expiryMinutes = 1440,
        $paymentMethods = ['VA_BRI', 'VA_BNI', 'QRIS']
    ) {
        try {
            $expiryTimestamp = now()->addMinutes($expiryMinutes)->timestamp * 1000;
            
            $payload = [
                'reff_no' => $referenceNo,
                'title' => "Invoice {$referenceNo}",
                'required_customer_detail' => true,
                'max_usage' => 1,
                'expired_at' => $expiryTimestamp,
                'total_amount' => $amount,
                'whitelisted_payment_method' => $paymentMethods
            ];
            
            $response = $this->makeRequest(
                'POST',
                "/api/v1.0/payment-link-manage/{$accountId}",
                $payload
            );
            
            Log::info('Payment link created', [
                'reference' => $referenceNo,
                'amount' => $amount
            ]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to create payment link', [
                'reference' => $referenceNo,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    /**
     * Get Payment Link History
     */
    public function getPaymentLinkHistory($accountId, $historyId = null) {
        try {
            $endpoint = $historyId 
                ? "/api/v1.0/payment-link-histories/{$accountId}/{$historyId}"
                : "/api/v1.0/payment-link-histories/{$accountId}";
            
            return $this->makeRequest('GET', $endpoint);
        } catch (Exception $e) {
            Log::error('Failed to get payment link history', ['account_id' => $accountId]);
            throw $e;
        }
    }
    
    // ============================================
    // BALANCE & INQUIRY
    // ============================================
    
    /**
     * Cek balance merchant
     * 
     * Return:
     * - available_balance: Saldo yang bisa digunakan
     * - pending_balance: Saldo yang menunggu
     * - held_balance: Saldo yang ditahan
     * - balance: Total saldo
     */
    public function getBalance($accountId = null) {
        try {
            $endpoint = $accountId 
                ? "/api/v1.0/balance-inquiry/{$accountId}"
                : '/api/v1.0/balance-inquiry';
            
            return $this->makeRequest('GET', $endpoint);
        } catch (Exception $e) {
            Log::error('Failed to get balance', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    // ============================================
    // DISBURSEMENT / TRANSFER
    // ============================================
    
    /**
     * Cek biaya transfer
     * 
     * [CUSTOMIZATION] Gunakan sebelum transfer untuk tahu fee-nya
     * swiftCode: SWIFT code bank penerima
     */
    public function checkDisbursementFee($accountId, $amount, $swiftCode) {
        try {
            $response = $this->makeRequest(
                'POST',
                "/api/v1.0/disbursement/{$accountId}/check-fee",
                [
                    'amount' => $amount,
                    'bank_swift_code' => $swiftCode
                ]
            );
            
            Log::info('Disbursement fee checked', [
                'amount' => $amount,
                'fee' => $response['data']['transfer_fee']
            ]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to check disbursement fee', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Verifikasi rekening penerima
     * 
     * [CUSTOMIZATION] Selalu lakukan ini sebelum transfer
     * accountNumber: Nomor rekening penerima
     * swiftCode: SWIFT code bank
     */
    public function checkBeneficiary($accountNumber, $swiftCode) {
        try {
            $response = $this->makeRequest(
                'POST',
                '/api/v1.0/disbursement/check-beneficiary',
                [
                    'bank_account_number' => $accountNumber,
                    'bank_swift_code' => $swiftCode
                ]
            );
            
            Log::info('Beneficiary verified', [
                'account_number' => substr($accountNumber, -4),
                'bank_swift_code' => $swiftCode,
                'account_name' => $response['data']['bank_account_name']
            ]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to verify beneficiary', [
                'account_number' => substr($accountNumber, -4),
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    /**
     * Transfer dana ke rekening
     * 
     * [CUSTOMIZATION] Sesuaikan:
     * - accountId: Account merchant yang mengirim
     * - referenceNumber: Nomor unik untuk tracking (misal: DISB-001)
     * - amount: Jumlah transfer
     * - swiftCode: SWIFT code bank penerima
     * - bankAccount: Nomor rekening penerima
     * - notes: Catatan transfer (opsional)
     */
    public function transferFunds(
        $accountId,
        $referenceNumber,
        $amount,
        $swiftCode,
        $bankAccount,
        $notes = 'Fund transfer'
    ) {
        try {
            $timestamp = now()->toIso8601String();
            
            $payload = [
                'reference_number' => $referenceNumber,
                'amount' => $amount,
                'bank_swift_code' => $swiftCode,
                'bank_account_number' => $bankAccount,
                'notes' => $notes
            ];
            
            $response = $this->makeRequestWithSignature(
                'POST',
                "/api/v1.0/disbursements/{$accountId}/transfer",
                $payload,
                $timestamp
            );
            
            Log::info('Fund transfer initiated', [
                'reference' => $referenceNumber,
                'amount' => $amount,
                'bank_account' => substr($bankAccount, -4)
            ]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to transfer funds', [
                'reference' => $referenceNumber,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    // ============================================
    // QRIS MANAGEMENT
    // ============================================
    
    /**
     * Generate QRIS Code
     * 
     * [CUSTOMIZATION] Untuk pembayaran via QR code
     */
    public function generateQRIS($accountId, $amount, $expiryHours = 24) {
        try {
            $expiryDate = now()->addHours($expiryHours)->format('Y-m-d H:i:s');
            
            $response = $this->makeRequest(
                'POST',
                "/api/v1.0/qris-dynamic/{$accountId}/generate-qr",
                [
                    'amount' => $amount,
                    'expired_at' => $expiryDate,
                    'tip_indicator' => 'fixed_amount',
                    'tip_value' => 0
                ]
            );
            
            Log::info('QRIS generated', ['amount' => $amount]);
            
            return $response['data'];
            
        } catch (Exception $e) {
            Log::error('Failed to generate QRIS', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    // ============================================
    // STATEMENT / LAPORAN MUTASI
    // ============================================
    
    /**
     * Get Statement (Laporan Mutasi)
     */
    public function getStatements($accountId) {
        try {
            return $this->makeRequest('GET', "/api/v1.0/statements/{$accountId}");
        } catch (Exception $e) {
            Log::error('Failed to get statements', ['account_id' => $accountId]);
            throw $e;
        }
    }
    
    // ============================================
    // INTERNAL REQUEST METHODS
    // ============================================
    
    /**
     * Standard request untuk API calls
     * Menggunakan Bearer token authentication
     */
    private function makeRequest($method, $endpoint, $data = []) {
        try {
            $token = $this->getAccessToken();
            
            $headers = [
                'X-PARTNER-ID' => $this->partnerId,
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ];
            
            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->retry(3, 1000)
                ->{strtolower($method)}($this->apiUrl . $endpoint, $data);
            
            if ($response->failed()) {
                Log::error("API Error: {$method} {$endpoint}", [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new Exception("API Error: {$response->status()} - {$response->body()}");
            }
            
            return $response->json();
            
        } catch (Exception $e) {
            Log::error("Request failed: {$method} {$endpoint}", ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Request dengan asymmetric signature
     * Untuk disbursement API
     */
    private function makeRequestWithSignature($method, $endpoint, $data, $timestamp) {
        try {
            $token = $this->getAccessToken();
            
            // Generate signature
            $jsonData = json_encode($data);
            $sha256Hash = hash('sha256', $jsonData);
            $signatureData = strtoupper($method) . ":" . $endpoint . ":" . 
                           $token . ":" . $sha256Hash . ":" . $timestamp;
            $signature = base64_encode(
                hash_hmac('sha512', $signatureData, $this->clientSecret, true)
            );
            
            $headers = [
                'X-PARTNER-ID' => $this->partnerId,
                'Authorization' => "Bearer {$token}",
                'X-Signature' => $signature,
                'X-Timestamp' => $timestamp,
                'Accept' => 'application/json'
            ];
            
            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->retry(3, 1000)
                ->{strtolower($method)}($this->apiUrl . $endpoint, $data);
            
            if ($response->failed()) {
                Log::error("Signed API Error: {$method} {$endpoint}", [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new Exception("API Error: {$response->status()} - {$response->body()}");
            }
            
            return $response->json();
            
        } catch (Exception $e) {
            Log::error("Signed request failed: {$method} {$endpoint}", ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
```

---

## Environment Configuration

### Lokasi File: `.env`

```bash
# ============================================
# [CUSTOMIZATION] SINGAPAY CONFIGURATION
# ============================================
# Berganti dengan nilai yang diberikan oleh Singapay

# Environment: sandbox atau production
SINGAPAY_ENV=sandbox

# Base URL API (sandbox atau production)
SINGAPAY_API_URL=https://sandbox-payment-b2b.singapay.id
# SINGAPAY_API_URL=https://payment-b2b.singapay.id (untuk production)

# [CUSTOMIZATION] Partner ID - Dari Dashboard Singapay
SINGAPAY_PARTNER_ID=your_partner_id_here

# [CUSTOMIZATION] Client ID - Dari Dashboard Singapay
SINGAPAY_CLIENT_ID=your_client_id_here

# [CUSTOMIZATION] Client Secret - Dari Dashboard Singapay (RAHASIA! Jangan share!)
SINGAPAY_CLIENT_SECRET=your_client_secret_here

# ============================================
# WEBHOOK CONFIGURATION
# ============================================

# URL webhook yang akan menerima notifikasi dari Singapay
# [CUSTOMIZATION] Sesuaikan dengan domain production
SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay

# ============================================
# PAYMENT CONFIGURATION
# ============================================

# Default bank untuk VA
SINGAPAY_DEFAULT_BANK=BRI
# Pilihan: BRI, BNI, DANAMON, MAYBANK

# Settlement preference
SINGAPAY_SETTLEMENT_SCHEDULE=daily
# Pilihan: daily, weekly, monthly
```

---

## Controller Implementation

### Lokasi File: `app/Http/Controllers/SingapayController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Services\SingapayService;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SingapayController extends Controller {
    
    private $singapay;
    
    public function __construct(SingapayService $singapay) {
        $this->singapay = $singapay;
    }
    
    // ============================================
    // PAYMENT PROCESSING
    // ============================================
    
    /**
     * Create VA dan kirim ke customer
     * 
     * [CUSTOMIZATION] Panggil method ini saat order dibuat
     * untuk generate VA bagi customer
     */
    public function createVAForOrder(Request $request) {
        try {
            $orderId = $request->input('order_id');
            $customerId = $request->input('customer_id');
            $amount = $request->input('amount');
            
            // Get atau create account
            // [CUSTOMIZATION] Sesuaikan logika ini dengan data structure Anda
            $account = $this->getOrCreateAccount($customerId);
            
            // Buat VA
            $va = $this->singapay->createVirtualAccount(
                $account['id'],
                env('SINGAPAY_DEFAULT_BANK', 'BRI'),
                $amount,
                'temporary',
                "Invoice for Order #{$orderId}"
            );
            
            // Simpan VA info ke database
            Transaction::create([
                'order_id' => $orderId,
                'type' => 'va',
                'va_number' => $va['va_number'],
                'bank_code' => $va['bank']['code'],
                'amount' => $amount,
                'status' => 'pending'
            ]);
            
            // Return VA ke customer
            return response()->json([
                'success' => true,
                'data' => [
                    'va_number' => $va['va_number'],
                    'bank_name' => $va['bank']['short_name'],
                    'amount' => $amount,
                    'account_name' => $va['account_name'] ?? 'SmartPlan Account'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to create VA for order', [
                'error' => $e->getMessage(),
                'order_id' => $request->input('order_id')
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create Payment Link untuk invoice
     * 
     * [CUSTOMIZATION] Generate shareable link untuk customer
     */
    public function createPaymentLink(Request $request) {
        try {
            $orderId = $request->input('order_id');
            $amount = $request->input('amount');
            
            $account = $this->getOrCreateAccount($request->input('customer_id'));
            
            $link = $this->singapay->createPaymentLink(
                $account['id'],
                "INV-{$orderId}",
                $amount,
                1440, // 24 jam
                ['VA_BRI', 'VA_BNI', 'QRIS']
            );
            
            return response()->json([
                'success' => true,
                'data' => [
                    'payment_link' => $link['url'] ?? $link['link_url'],
                    'amount' => $amount,
                    'expires_at' => $link['expired_at']
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate QRIS untuk invoice
     * 
     * [CUSTOMIZATION] Tampilkan QR code di invoice
     */
    public function generateQRIS(Request $request) {
        try {
            $orderId = $request->input('order_id');
            $amount = $request->input('amount');
            
            $account = $this->getOrCreateAccount($request->input('customer_id'));
            
            $qris = $this->singapay->generateQRIS($account['id'], $amount, 24);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'qr_data' => $qris['qr_data'],
                    'amount' => $amount,
                    'reference' => $qris['reff_no']
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
    // DISBURSEMENT / TRANSFER
    // ============================================
    
    /**
     * Kirim komisi ke staff
     * 
     * [CUSTOMIZATION] Panggil saat order complete untuk bayar komisi
     */
    public function sendCommission(Request $request) {
        try {
            $staffId = $request->input('staff_id');
            $amount = $request->input('amount');
            
            // Get staff bank info
            // [CUSTOMIZATION] Sesuaikan dengan database Anda
            $staff = \App\Models\Staff::find($staffId);
            
            if (!$staff->bank_account || !$staff->bank_code) {
                return response()->json([
                    'success' => false,
                    'error' => 'Staff bank account not configured'
                ], 400);
            }
            
            // Get merchant account
            $merchantAccount = $this->getMerchantAccount();
            
            // Check fee
            $feeInfo = $this->singapay->checkDisbursementFee(
                $merchantAccount['id'],
                $amount,
                $staff->bank_swift_code
            );
            
            // Verify beneficiary
            $this->singapay->checkBeneficiary(
                $staff->bank_account,
                $staff->bank_swift_code
            );
            
            // Transfer
            $transfer = $this->singapay->transferFunds(
                $merchantAccount['id'],
                "COMM-{$staffId}-" . time(),
                $amount,
                $staff->bank_swift_code,
                $staff->bank_account,
                "Commission for staff {$staff->name}"
            );
            
            // Simpan disbursement record
            Disbursement::create([
                'staff_id' => $staffId,
                'amount' => $amount,
                'fee' => $feeInfo['transfer_fee'],
                'net_amount' => $feeInfo['net_amount'],
                'reference' => $transfer['reference_number'],
                'transaction_id' => $transfer['transaction_id'],
                'status' => $transfer['status']
            ]);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'transaction_id' => $transfer['transaction_id'],
                    'amount' => $amount,
                    'fee' => $feeInfo['transfer_fee'],
                    'net_amount' => $feeInfo['net_amount']
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send commission', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ============================================
    // REPORTING
    // ============================================
    
    /**
     * Get merchant balance
     */
    public function getBalance(Request $request) {
        try {
            $account = $this->getMerchantAccount();
            $balance = $this->singapay->getBalance($account['id']);
            
            return response()->json([
                'success' => true,
                'data' => $balance['data']
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get transaction history
     */
    public function getTransactions(Request $request) {
        try {
            $account = $this->getMerchantAccount();
            $transactions = $this->singapay->getStatements($account['id']);
            
            return response()->json([
                'success' => true,
                'data' => $transactions['data']
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    /**
     * [CUSTOMIZATION] Sesuaikan logika ini dengan data structure Anda
     * Create or get customer account di Singapay
     */
    private function getOrCreateAccount($customerId) {
        // [CUSTOMIZATION] Implementasikan logika untuk:
        // 1. Cek apakah customer sudah punya account di Singapay
        // 2. Jika sudah, return account ID
        // 3. Jika belum, buat account baru
        
        $customerAccount = \App\Models\SingapayAccount::where('customer_id', $customerId)->first();
        
        if ($customerAccount) {
            return ['id' => $customerAccount->singapay_account_id];
        }
        
        // Get customer data
        $customer = \App\Models\Customer::find($customerId);
        
        // Create account
        $account = $this->singapay->createAccount(
            $customer->name,
            $customer->email,
            $customer->phone
        );
        
        // Simpan mapping
        \App\Models\SingapayAccount::create([
            'customer_id' => $customerId,
            'singapay_account_id' => $account['id']
        ]);
        
        return $account;
    }
    
    /**
     * [CUSTOMIZATION] Get merchant's primary account
     */
    private function getMerchantAccount() {
        // [CUSTOMIZATION] Implementasikan logika untuk get merchant account
        // Bisa dari config, database, atau environment variable
        
        return [
            'id' => env('SINGAPAY_MERCHANT_ACCOUNT_ID')
        ];
    }
}
```

---

## Webhook Handler

### Lokasi File: `app/Http/Controllers/WebhookController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;

class WebhookController extends Controller {
    
    /**
     * Handle Virtual Account transaction webhook
     * 
     * Route: POST /api/webhooks/singapay/va
     */
    public function handleVATransaction(Request $request) {
        try {
            // Validasi signature
            if (!$this->validateVASignature($request)) {
                Log::error('Invalid VA webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $data = $request->json('data');
            $transaction = $data['transaction'];
            $customer = $data['customer'];
            $payment = $data['payment'];
            
            Log::info('VA Transaction received', [
                'reff_no' => $transaction['reff_no'],
                'status' => $transaction['status'],
                'amount' => $transaction['amount']['value']
            ]);
            
            // [CUSTOMIZATION] Update database transaction
            $dbTransaction = Transaction::where('va_number', $payment['additional_info']['va_number'])
                ->first();
            
            if ($dbTransaction) {
                $dbTransaction->update([
                    'status' => $transaction['status'],
                    'amount' => $transaction['amount']['value'],
                    'reference_no' => $transaction['reff_no'],
                    'processed_at' => now()
                ]);
                
                // [CUSTOMIZATION] Update order status ke PAID
                if ($transaction['status'] === 'paid') {
                    $order = $dbTransaction->order;
                    $order->update(['status' => 'paid']);
                    
                    // [CUSTOMIZATION] Send confirmation email
                    Mail::send(new PaymentConfirmation($order));
                    
                    // [CUSTOMIZATION] Trigger commission calculation
                    event(new OrderPaid($order));
                }
            }
            
            // Return 200 OK
            return response()->json(['success' => true], 200);
            
        } catch (\Exception $e) {
            Log::error('Failed to handle VA webhook', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Handle QRIS transaction webhook
     * 
     * Route: POST /api/webhooks/singapay/qris
     */
    public function handleQRISTransaction(Request $request) {
        try {
            if (!$this->validateQRISSignature($request)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $data = $request->json('data');
            $transaction = $data['transaction'];
            
            Log::info('QRIS Transaction received', [
                'reff_no' => $transaction['reff_no'],
                'status' => $transaction['status'],
                'amount' => $transaction['amount']['value']
            ]);
            
            // [CUSTOMIZATION] Update database
            $dbTransaction = Transaction::where('reference_no', $transaction['reff_no'])
                ->first();
            
            if ($dbTransaction && $transaction['status'] === 'paid') {
                $dbTransaction->update(['status' => 'paid']);
                $dbTransaction->order->update(['status' => 'paid']);
            }
            
            return response()->json(['success' => true], 200);
            
        } catch (\Exception $e) {
            Log::error('Failed to handle QRIS webhook', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Handle Disbursement transaction webhook
     * 
     * Route: POST /api/webhooks/singapay/disbursement
     */
    public function handleDisbursementTransaction(Request $request) {
        try {
            if (!$this->validateDisbursementSignature($request)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $data = $request->json('data');
            
            Log::info('Disbursement Transaction received', [
                'transaction_id' => $data['transaction_id'],
                'status' => $data['status'],
                'amount' => $data['gross_amount']['value']
            ]);
            
            // [CUSTOMIZATION] Update disbursement record
            $disbursement = \App\Models\Disbursement::where(
                'reference',
                $data['reference_number']
            )->first();
            
            if ($disbursement) {
                $disbursement->update([
                    'status' => $data['status'],
                    'transaction_id' => $data['transaction_id'],
                    'processed_at' => now()
                ]);
                
                // [CUSTOMIZATION] Update staff payment status
                if ($data['status'] === 'success') {
                    $disbursement->staff->update(['last_payment_at' => now()]);
                }
            }
            
            return response()->json(['success' => true], 200);
            
        } catch (\Exception $e) {
            Log::error('Failed to handle disbursement webhook', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // ============================================
    // SIGNATURE VALIDATION
    // ============================================
    
    /**
     * Validasi signature untuk VA & QRIS webhook
     * HMAC SHA256 dengan CLIENT_ID
     */
    private function validateVASignature(Request $request) {
        $signature = $request->header('X-Signature');
        $clientId = env('SINGAPAY_CLIENT_ID');
        $body = $request->getContent();
        
        $sortedBody = json_encode(
            json_decode($body, true),
            JSON_UNESCAPED_SLASHES | JSON_SORT_KEYS
        );
        
        $expectedSignature = hash_hmac('sha256', $sortedBody, $clientId);
        
        return hash_equals($expectedSignature, $signature);
    }
    
    private function validateQRISSignature(Request $request) {
        return $this->validateVASignature($request);
    }
    
    /**
     * Validasi signature untuk Disbursement webhook
     * Asymmetric HMAC SHA512 dengan CLIENT_SECRET
     */
    private function validateDisbursementSignature(Request $request) {
        $signature = $request->header('X-Signature');
        $timestamp = $request->header('X-Timestamp');
        $clientSecret = env('SINGAPAY_CLIENT_SECRET');
        
        $body = $request->getContent();
        $sha256Hash = hash('sha256', $body);
        $data = "POST:/api/v1.0/webhooks/disbursement:" . $timestamp . ":" . $sha256Hash;
        
        $expectedSignature = base64_encode(
            hash_hmac('sha512', $data, $clientSecret, true)
        );
        
        return hash_equals($expectedSignature, $signature);
    }
}
```

### Routes untuk Webhook

```php
// Lokasi: routes/api.php

Route::post('/webhooks/singapay/va', [WebhookController::class, 'handleVATransaction']);
Route::post('/webhooks/singapay/qris', [WebhookController::class, 'handleQRISTransaction']);
Route::post('/webhooks/singapay/disbursement', [WebhookController::class, 'handleDisbursementTransaction']);
```

---

## Database Migration

### Lokasi File: `database/migrations/2025_12_03_create_singapay_tables.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    
    public function up() {
        // Table untuk mapping customer ke singapay account
        Schema::create('singapay_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('singapay_account_id');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->unique(['customer_id', 'singapay_account_id']);
        });
        
        // Table untuk menyimpan VA records
        Schema::create('singapay_virtual_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('singapay_account_id');
            $table->string('va_number')->unique();
            $table->string('bank_code'); // BRI, BNI, DANAMON, MAYBANK
            $table->decimal('amount', 15, 2);
            $table->string('kind'); // permanent, temporary
            $table->timestamp('expired_at')->nullable();
            $table->integer('max_usage')->default(255);
            $table->integer('usage_count')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            
            $table->index(['singapay_account_id', 'status']);
        });
        
        // Table untuk transaksi pembayaran
        Schema::create('singapay_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('type'); // va, qris, payment_link
            $table->string('reference_no')->nullable();
            $table->string('va_number')->nullable();
            $table->string('bank_code')->nullable();
            $table->decimal('amount', 15, 2);
            $table->decimal('fee', 15, 2)->default(0);
            $table->enum('status', ['pending', 'paid', 'failed', 'expired'])->default('pending');
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['order_id', 'status']);
            $table->index(['reference_no']);
        });
        
        // Table untuk disbursement/transfer
        Schema::create('singapay_disbursements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('staff_id')->nullable();
            $table->string('reference')->unique();
            $table->string('transaction_id')->nullable();
            $table->decimal('amount', 15, 2);
            $table->decimal('fee', 15, 2);
            $table->decimal('net_amount', 15, 2);
            $table->string('bank_account_number');
            $table->string('bank_code');
            $table->string('bank_account_name');
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->timestamp('processed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['staff_id', 'status']);
            $table->index(['reference']);
        });
    }
    
    public function down() {
        Schema::dropIfExists('singapay_disbursements');
        Schema::dropIfExists('singapay_transactions');
        Schema::dropIfExists('singapay_virtual_accounts');
        Schema::dropIfExists('singapay_accounts');
    }
};
```

---

## Customization Guide

### 1. **Setup Awal**

**Step 1: Dapatkan Credentials dari Singapay**
```
Hubungi: support@singapay.id
Berikan:
- Nama perusahaan: SmartPlan
- Website: example.com
- Business type: Service Platform
- Expected monthly volume: [amount]

Terima:
✅ Partner ID / API Key
✅ Client ID
✅ Client Secret
✅ Dashboard access
```

**Step 2: Update `.env` file**
```bash
SINGAPAY_PARTNER_ID=paste_partner_id_dari_dashboard
SINGAPAY_CLIENT_ID=paste_client_id_dari_dashboard
SINGAPAY_CLIENT_SECRET=paste_client_secret_dari_dashboard
SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay
```

**Step 3: Run migration**
```bash
php artisan migrate
```

---

### 2. **Integration Points**

#### **Saat Order Dibuat (Payment Receiving)**
```php
// File: app/Models/Order.php atau event
public function createdOrder() {
    // Create VA untuk order ini
    $va = app(SingapayController::class)->createVAForOrder([
        'order_id' => $this->id,
        'customer_id' => $this->customer_id,
        'amount' => $this->total_price
    ]);
    
    // Save VA info
    $this->update(['payment_va' => $va['va_number']]);
}
```

#### **Saat Order Selesai (Disbursement)**
```php
// File: app/Models/Order.php atau event
public function markedAsComplete() {
    // Calculate commission
    $commission = $this->total_price * 0.1; // 10%
    
    // Send commission ke staff
    app(SingapayController::class)->sendCommission([
        'staff_id' => $this->assigned_staff_id,
        'amount' => $commission
    ]);
}
```

#### **Saat Generate Invoice (QRIS)**
```php
// File: app/Models/Invoice.php atau controller
public function generateQRIS() {
    $qris = app(SingapayController::class)->generateQRIS([
        'order_id' => $this->order_id,
        'customer_id' => $this->customer_id,
        'amount' => $this->total
    ]);
    
    $this->update(['qris_code' => $qris['qr_data']]);
}
```

---

### 3. **Database Customizations**

**Tambahkan fields ke table Anda:**

```php
// Table orders - tambahkan payment fields
Schema::table('orders', function (Blueprint $table) {
    $table->string('payment_va')->nullable();
    $table->string('payment_reference')->nullable();
    $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
    $table->decimal('payment_fee', 15, 2)->default(0);
});

// Table staff - tambahkan bank info
Schema::table('staff', function (Blueprint $table) {
    $table->string('bank_code')->nullable(); // BRI, BNI, etc
    $table->string('bank_account')->nullable();
    $table->string('bank_swift_code')->nullable();
});
```

---

### 4. **Testing Checklist**

```php
// Test sequence
[ ] Test authentication token generation
[ ] Test VA creation
[ ] Test payment link creation
[ ] Test QRIS generation
[ ] Test webhook signature validation
[ ] Test VA transaction webhook
[ ] Test QRIS transaction webhook
[ ] Test disbursement transfer
[ ] Test disbursement webhook
[ ] Test error handling
[ ] Test rate limiting
[ ] Load test dengan multiple concurrent requests
```

---

### 5. **Configuration untuk Production**

**Update `.env` ke Production:**
```bash
SINGAPAY_API_URL=https://payment-b2b.singapay.id
SINGAPAY_ENV=production
SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay
```

**Update Dashboard Singapay:**
```
1. Settings → Webhook URLs
2. Change to production webhook URL
3. Test webhook delivery
4. Enable production API
```

---

## Quick Reference

### Common Customization Points

| Area | What to Customize | Where |
|------|------------------|-------|
| **Credentials** | Partner ID, Client ID, Secret | `.env` |
| **Payment Method** | Default bank (BRI/BNI/etc) | `SingapayService.php` |
| **Settlement** | Daily/Weekly/Monthly | Singapay Dashboard |
| **Commission Rate** | Percentage to transfer | `SingapayController.php` |
| **Webhook URLs** | Your webhook endpoints | `WebhookController.php` + Singapay Dashboard |
| **Error Handling** | Custom error messages | `SingapayService.php` |
| **Logging** | Log level & format | `config/logging.php` |
| **Retry Logic** | Retry count & interval | `SingapayService.php` makeRequest() |

---

## Deployment Checklist

```php
[ ] Copy all files ke server
[ ] Update .env dengan production credentials
[ ] Run migrations
[ ] Configure webhook URLs di Singapay dashboard
[ ] Test webhook delivery
[ ] Setup monitoring & alerting
[ ] Configure logging
[ ] Setup backup strategy
[ ] Train team on operations
[ ] Document handover
[ ] Monitor first 24 hours
```

---

**Last Updated**: December 3, 2025  
**Version**: 1.0  
**For**: SmartPlan-Web Project
