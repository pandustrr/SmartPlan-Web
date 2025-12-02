# Singapay B2B Payment Gateway - Complete Integration Guide

**Version**: 1.0  
**Last Updated**: December 1, 2025  
**API Version**: v1.0 (Baseline: 25 Apr 2024)

---

## 📋 Table of Contents

1. [API Information](#api-information)
2. [Authentication & Security](#authentication--security)
3. [Virtual Account Flow](#virtual-account-flow)
4. [Complete API Reference](#complete-api-reference)
5. [Implementation Guide](#implementation-guide)

---

## API Information

### Base URLs

| Environment | URL |
|-------------|-----|
| **Sandbox** | `https://sandbox-payment-b2b.singapay.id` |
| **Production** | `https://payment-b2b.singapay.id` |

### API Version
- **Current**: v1.0
- **Release Date**: 25 Apr 2024
- **Endpoint Base**: `/api/v1.0/`

### Getting Started
This guide is designed for **B2B Merchants** and external parties integrating with Singapay's Payment Gateway API. It provides detailed explanations to seamlessly integrate and utilize the API for enhanced business efficiency.

---

## Authentication & Security

### 1. Get Access Token (v1.1)

**Endpoint**: `POST /api/v1.1/access-token/b2b`

**Authentication**: Basic Auth

**Request Headers**:
```
X-PARTNER-ID: {api_key}
X-CLIENT-ID: {client_id}
X-Signature: {HMAC SHA256 signature}
Accept: application/json
Content-Type: application/json
```

**Request Body**:
```json
{
  "grantType": "client_credentials"
}
```

**Signature Generation**:
```
Payload Data = Client ID + "_" + Client Secret + "_" + Timestamp (YYYYMMDD)
Example: a2fca1f4-92f0-474d-a6d5-d92ca830be79_UAkHVDuPSqHQI17ED9vDXNHq9o6MfcSZ_20250921

Hash: hash_hmac("sha512", Payload Data, Client Secret)
```

**Response (Success)**:
```json
{
  "status": 200,
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9{...}",
    "token_type": "Bearer",
    "expires_in": "3600"
  }
}
```

**Response (Error)**:
```json
{
  "status": 401,
  "success": false,
  "error": {
    "code": 401,
    "message": "Invalid credentials"
  }
}
```

### 2. Credentials Required

Dapatkan dari **Merchant Dashboard**:
- `api_key` (X-PARTNER-ID)
- `client_id` (X-CLIENT-ID)
- `client_secret` (untuk signature generation)

### 3. Standard Request Headers

Semua endpoint (kecuali Get Access Token) memerlukan:
```
X-PARTNER-ID: {api_key}
Accept: application/json
Authorization: Bearer {access_token}
Content-Type: application/json (untuk POST/PUT/PATCH)
```

### 4. Disbursement Requests

Tambahan untuk disbursement:
```
X-Signature: {Asymmetric Signature}
X-Timestamp: 2026-03-25T15:31:37+07:00 (ISO 8601)
```

**Asymmetric Signature**:
```
Data = HTTPMethod + ":" + EndpointUrl + ":" + AccessToken + ":" + 
        Lowercase(HexEncode(SHA-256(minify(RequestBody)))) + ":" + TimeStamp

Signature = base64(HMAC_SHA512(Data, client_secret))
```

---

## Virtual Account Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│          VIRTUAL ACCOUNT TRANSACTION FLOW                   │
└─────────────────────────────────────────────────────────────┘

    1. CREATE ACCOUNT (Sub-Account)
           ↓
    ┌─────────────────────────────┐
    │  Account Creation           │
    │  - Name, Email, Phone       │
    └─────────────────────────────┘
           ↓
    2. CREATE VIRTUAL ACCOUNT
           ↓
    ┌─────────────────────────────┐
    │  VA Generation              │
    │  - Bank: BRI/BNI/DANAMON    │
    │  - Amount: 10K-100M IDR     │
    │  - Kind: Permanent/Temp     │
    │  - Max Usage (if temp)      │
    └─────────────────────────────┘
           ↓
    3. CUSTOMER SENDS PAYMENT
           ↓
    ┌─────────────────────────────┐
    │  Payment Verification       │
    │  - Bank Transfer to VA      │
    │  - Amount Matching          │
    │  - Payment Status Check     │
    └─────────────────────────────┘
           ↓
    4. BALANCE MANAGEMENT
           ↓
    ┌─────────────────────────────┐
    │  Account Balance            │
    │  - Check Balance            │
    │  - Monitor Usage            │
    │  - Track Transactions       │
    └─────────────────────────────┘
           ↓
    5. TRANSACTION REPORTING
           ↓
    ┌─────────────────────────────┐
    │  Report & Reconciliation    │
    │  - List VA Transactions     │
    │  - Get Transaction Details  │
    │  - Settlement Process       │
    └─────────────────────────────┘
```

### Key Components

#### A. Account Creation
- Buat sub-account untuk setiap customer/merchant
- Informasi: name, email, phone
- Status: active/inactive/pending/rejected

#### B. Virtual Account Generation
**Permanent VA**:
- Tidak ada expiry date
- Dapat diubah: amount, name, status
- Ideal untuk recurring payments

**Temporary VA**:
- Ada expiry date
- Max usage limit (1-255)
- Ideal untuk one-time payments

**Supported Banks**:
- BRI (Bank Rakyat Indonesia)
- BNI (Bank Negara Indonesia)
- DANAMON (Bank Danamon)
- MAYBANK (Maybank Indonesia)

#### C. Payment Verification
- Customer melakukan transfer ke nomor VA
- Sistem otomatis verifikasi jumlah
- Status update real-time

#### D. Balance Management
- Monitor saldo akun
- Track VA usage count
- Manage multiple VA per account

#### E. Transaction Reporting
- List semua transaksi VA
- Detail per transaksi
- Fee & margin tracking
- Settlement reconciliation

---

## Complete API Reference

### 1. ACCOUNT MANAGEMENT

#### List Accounts
```
GET /api/v1.0/accounts
Headers: X-PARTNER-ID, Authorization
Response: Array of accounts with pagination
```

#### Create Account
```
POST /api/v1.0/accounts
Body:
{
  "name": "Dhany Ahmad",
  "email": "dhany@gmail.com",
  "phone": "082371268163823"
}
Response: 200 - New account object
```

#### Show Account
```
GET /api/v1.0/accounts/{account_id}
Response: 200 - Account detail
```

#### Update Account Status
```
PATCH /api/v1.0/accounts/update-status/{account_id}
Body:
{
  "status": "active" | "inactive"
}
Response: 200 - Updated account
```

#### Delete Account
```
DELETE /api/v1.0/accounts/{account_id}
Response: 200 - Success message
```

---

### 2. VIRTUAL ACCOUNT MANAGEMENT

#### Create Virtual Account
```
POST /api/v1.0/virtual-accounts/{account_id}
Body:
{
  "bank_code": "BRI",
  "amount": 1000000,
  "name": "Payment for Invoice #123",
  "kind": "temporary" | "permanent",
  "expired_at": 1760643599000,  // Required if temporary
  "max_usage": 255,             // Optional, default 255
  "currency": "IDR"             // Optional, default IDR
}

Validation:
- Amount: Min 10,000, Max 100,000,000
- max_usage: 1-255 (for temporary)
- expired_at: Required for temporary

Response: 200 - VA object with generated number
```

#### List Virtual Accounts
```
GET /api/v1.0/virtual-accounts/{account_id}
Response: 200 - Array of VA with pagination
```

#### Show Virtual Account
```
GET /api/v1.0/virtual-accounts/{account_id}/{virtual_account_id}
Response: 200 - VA detail
```

#### Update Virtual Account
```
PUT /api/v1.0/virtual-accounts/{account_id}/{virtual_account_id}
PATCH /api/v1.0/virtual-accounts/{account_id}/{virtual_account_id}

For Permanent VA - Editable fields:
- amount
- name
- status

For Temporary VA - Editable fields:
- amount
- name
- status
- expired_at
- max_usage

Body:
{
  "amount": 1500000,
  "name": "Updated VA Name",
  "status": "active"
}

Response: 200 - Updated VA
```

#### Delete Virtual Account
```
DELETE /api/v1.0/virtual-accounts/{account_id}/{virtual_account_id}
Note: Cannot delete VA with existing transactions

Response: 200 - Success message
```

---

### 3. VA TRANSACTIONS

#### List VA Transactions
```
GET /api/v1.0/va-transactions/{account_id}
Response: 200 - Array of transactions with pagination

Includes:
- Transaction ID & VA number
- Bank details & SWIFT code
- Amount & fees
- Status: paid/pending/unpaid
- Timestamps (post & processed)
```

#### Get VA Transaction Details
```
GET /api/v1.0/va-transactions/{account_id}/{transaction_id}
Response: 200 - Detailed transaction object
```

---

### 4. PAYMENT LINK MANAGEMENT

#### Create Payment Link
```
POST /api/v1.0/payment-link-manage/{account_id}
Body:
{
  "reff_no": "PL20251027A002",
  "title": "Invoice Payment",
  "required_customer_detail": true,
  "max_usage": 5,
  "expired_at": 1761801600000,  // Millisecond timestamp
  "total_amount": 55000,
  "items": [
    {
      "name": "Item 1",
      "quantity": 2,
      "unit_price": 25000
    }
  ],
  "whitelisted_payment_method": ["VA_BRI", "QRIS", "INDOMARET"]
}

Response: 200 - Payment link with unique URL
```

#### List Payment Links
```
GET /api/v1.0/payment-link-manage/{account_id}
Response: 200 - Array of payment links with pagination
```

#### Show Payment Link
```
GET /api/v1.0/payment-link-manage/{account_id}/{payment_link_id}
Response: 200 - Payment link detail
```

#### Update Payment Link
```
PUT /api/v1.0/payment-link-manage/{account_id}/{payment_link_id}
Body:
{
  "required_customer_detail": true,
  "max_usage": 20,
  "expired_at": 1740960000000,
  "status": "open" | "closed",
  "whitelisted_payment_method": ["VA_BRI", "QRIS"]
}

Response: 200 - Updated payment link
```

#### Delete Payment Link
```
DELETE /api/v1.0/payment-link-manage/{account_id}/{payment_link_id}
Response: 200 - Success message
```

#### Get Available Payment Methods
```
GET /api/v1.0/payment-link-manage/payment-methods
Response: 200 - List of available payment methods with codes
```

---

### 5. PAYMENT LINK HISTORY

#### List Payment Link History
```
GET /api/v1.0/payment-link-histories/{account_id}
Response: 200 - Array of transactions with full details

Includes:
- Transaction reference & payment method
- Amount, fees, balance after
- Customer information
- Payment link details
```

#### Show Payment Link History Detail
```
GET /api/v1.0/payment-link-histories/{account_id}/{history_id}
Response: 200 - Detailed transaction
```

---

### 6. DISBURSEMENT (PENCAIRAN DANA)

#### Check Disbursement Fee
```
POST /api/v1.0/disbursement/{account_id}/check-fee
Headers: Include X-PARTNER-ID, Authorization
Body:
{
  "amount": 50000,
  "bank_swift_code": "BRINIDJA"
}

Response: 200
{
  "gross_amount": "50000",
  "transfer_fee": "3000.00",
  "net_amount": "47000",
  "currency": "IDR",
  "beneficiary": {
    "full_name": "Bank Rakyat Indonesia",
    "short_name": "BRI"
  }
}
```

#### Check Beneficiary
```
POST /api/v1.0/disbursement/check-beneficiary
Headers: Include X-PARTNER-ID, Authorization
Body:
{
  "bank_account_number": "521398319083210",
  "bank_swift_code": "BRINIDJA"
}

Response: 200
{
  "status": "valid",
  "bank_name": "Bank BRI",
  "bank_number_code": "002",
  "bank_swift_code": "BRINIDJA",
  "bank_account_number": "521398319083210",
  "bank_account_name": "Darsirah Vero Sirait"
}
```

#### Transfer Funds
```
POST /api/v1.0/disbursements/{account_id}/transfer
Headers: Include X-PARTNER-ID, Authorization, X-Signature, X-Timestamp
Body:
{
  "reference_number": "123456789123",
  "amount": 50000,
  "bank_swift_code": "BRINIDJA",
  "bank_account_number": "521398319083210",
  "notes": "bayar cicilan"
}

Response Status:
- 200: Success
- 202: Pending
- 500: Failed

Errors:
- 4039914: Insufficient Balance
- 4049911: Invalid Account
- 4099901/4099902: Duplicate reference_number
- 4229901: Validation error
```

#### List Disbursements
```
GET /api/v1.0/disbursement/{account_id}
Response: 200 - Array of disbursements with pagination
```

#### Show Disbursement Detail
```
GET /api/v1.0/disbursement/{account_id}/{transaction_id}
Response: 200 - Detailed disbursement transaction
```

---

### 7. QRIS (QR Code Indonesian Standard)

#### Generate QRIS
```
POST /api/v1.0/qris-dynamic/{account_id}/generate-qr
Body:
{
  "amount": 50000,
  "expired_at": "2025-08-30 12:00:00",  // Y-m-d H:i:s format
  "tip_indicator": "fixed_amount" | "percentage",
  "tip_value": 2000
}

Response: 200
{
  "id": 2,
  "reff_no": "6601K5WZZ71ZQ3KQJZZRV811XXHE",
  "status": "open",
  "type": "mpm-dynamic",
  "amount": 50000,
  "tip_amount": 2000,
  "total_amount": 52000,
  "qr_data": "000201010212...",
  "expired_at": "2025-12-30 12:00:00",
  "created_at": "2025-09-24 11:33:38"
}
```

#### List QRIS
```
GET /api/v1.0/qris-dynamic/{account_id}
Response: 200 - Array of QRIS with pagination
```

#### Show QRIS Detail
```
GET /api/v1.0/qris-dynamic/{account_id}/show/{qris_id}
Response: 200 - QRIS detail
```

#### Delete QRIS
```
DELETE /api/v1.0/qris-dynamic/{id}/delete
Response: 200 - Success message
```

---

### 8. CLWD (Cardless Withdrawal)

#### Create Cardless Withdrawal
```
POST /api/v1.0/cardless-withdrawals/{account_id}
Body:
{
  "withdraw_amount": 1000000,
  "payment_vendor_code": "CLWD_ALTO"
}

Response: 200 - Array of withdrawal records
```

#### List Cardless Withdrawals
```
GET /api/v1.0/cardless-withdrawals/{account_id}
Response: 200 - Array of CLWD with pagination
```

#### Show Cardless Withdrawal Detail
```
GET /api/v1.0/cardless-withdrawals/{account_id}/show/{id}
Response: 200 - CLWD detail
```

#### Cancel Cardless Withdrawal
```
PATCH /api/v1.0/cardless-withdrawals/{account_id}/cancel/{id}
Response: 200 - Cancelled withdrawal
```

#### Delete Cardless Withdrawal
```
DELETE /api/v1.0/cardless-withdrawals/{account_id}/delete/{id}
Response: 200 - Success message
```

---

### 9. STATEMENT (LAPORAN MUTASI)

#### List Statements
```
GET /api/v1.0/statements/{account_id}
Response: 200 - Array of balance mutations with pagination

Includes:
- Transaction ID & type (credit/debit)
- Transaction kind (disbursement, settlement, etc.)
- Balance after each transaction
- Debit & credit amounts
- Processed timestamp
```

#### Show Statement Detail
```
GET /api/v1.0/statements/{account_id}/{statement_id}
Response: 200 - Detailed statement/mutation record
```

---

### 10. BALANCE INQUIRY

#### Check Merchant Balance
```
GET /api/v1.0/balance-inquiry
Headers: X-PARTNER-ID, Authorization
Response: 200

Balance Types:
- pending_balance: Funds tidak bisa digunakan (menunggu)
- held_balance: Funds yang ditahan
- available_balance: Saldo yang bisa digunakan
- balance: Total balance (available + pending + held)

Example Response:
{
  "status": 200,
  "success": true,
  "data": {
    "pending_balance": { "value": "0.00", "currency": "IDR" },
    "held_balance": { "value": "0.00", "currency": "IDR" },
    "available_balance": { "value": "7500.00", "currency": "IDR" },
    "balance": { "value": "7500.00", "currency": "IDR" }
  }
}
```

#### Check Account Balance
```
GET /api/v1.0/balance-inquiry/{account_id}
Response: 200 - Balance details + account_id

Returns same structure as merchant balance check
but includes specific account_id
```

---

## Webhooks

### Overview
Webhooks provide real-time notifications untuk:
- Virtual Account transactions
- QRIS transactions
- Disbursement transactions
- Other important events

### Webhook Retry Mechanism

**Automatic Retries**:
Sistem otomatis mencoba mengirim ulang webhook jika gagal.

| HTTP Status | Retry Attempts | Interval | Handler |
|---|---|---|---|
| 500 | 1 | 1 menit | handleFailedHttpResponse() |
| 503 | 4 | 1 menit | handleFailedHttpResponse() |
| 400/404 | 2 | 1 menit | handleFailedHttpResponse() |
| 307/308 (Redirect) | 5 | 1 menit | retryRedirect() |
| 301/302/303 (Redirect) | 0 | N/A | handleFailedHttpResponse() |
| cURL Exception/Timeout | 1 | 1 menit | catch(Exception) |
| Other | 5 | 1 menit | handleFailedHttpResponse() |

**Failure Notification**:
- Log di database
- Email notification ke merchant
- Accessible via callback menu di merchant dashboard

**Best Practices**:
- Return HTTP 200-299 dari webhook endpoint
- Maintain server availability
- Avoid redirects (301-308) pada webhook URL
- Retry counts stored dengan 15-minute TTL cache

---

### Virtual Account Transaction Webhook

**Event**: Ketika customer mengirim pembayaran ke VA

**Validation**: HMAC-SHA256 signature pada `X-Signature` header menggunakan sorted JSON body dan client_id

**Request Structure**:
```json
{
  "status": 200,
  "success": true,
  "data": {
    "transaction": {
      "reff_no": "3211120250926133543246",
      "type": "va",
      "status": "paid",
      "amount": {
        "value": "100000.00",
        "currency": "IDR"
      },
      "post_timestamp": "26 Sep 2025 13:35:45",
      "processed_timestamp": "26 Sep 2025 13:35:45"
    },
    "customer": {
      "id": "01K5G4FZZ18DMK0M5QTR8Y9QY9",
      "name": "Bryant Hao",
      "email": "Qc@singa.id",
      "phone": "08119397090"
    },
    "payment": {
      "method": "va",
      "additional_info": {
        "va_number": "7872955146576837",
        "bank": {
          "short_name": "Maybank",
          "number": "016",
          "swift_code": "IBBKIDJA",
          "bank_code": "MAYBANK"
        },
        "fees": {
          "name": "VA Maybank",
          "amount": "1500.00",
          "currency": "IDR"
        }
      }
    }
  }
}
```

**Headers**:
- X-PARTNER-ID: api_key
- Content-Type: application/json
- X-Signature: HMAC-SHA256 signature

---

### QRIS Transaction Webhook

**Event**: Ketika customer membayar via QRIS

**Request Structure**:
```json
{
  "status": 200,
  "success": true,
  "data": {
    "transaction": {
      "reff_no": "6601K62BH34X445J046C4W5249E6",
      "type": "qris",
      "status": "paid",
      "amount": {
        "value": 1000123,
        "currency": "IDR"
      },
      "tip": {
        "value": 0,
        "currency": "IDR"
      },
      "total_amount": {
        "value": 1000123,
        "currency": "IDR"
      },
      "post_timestamp": "26 Sep 2025 13:31:59",
      "processed_timestamp": "26 Sep 2025 13:31:59"
    },
    "customer": {
      "id": "01K2KVRQQP45234X9T3YWG1FKT",
      "name": "Moh. Zulkifli Katili",
      "email": "tes@gmail.com",
      "phone": "08123993201"
    },
    "payment": {
      "method": "qris",
      "additional_info": {
        "qr_string": "00020101021226570015ID.SINGAPAY.WWW..."
      }
    }
  }
}
```

---

### Disbursement Transaction Webhook

**Event**: Ketika disbursement transaction completed (success/failed)

**Validation**: X-Signature dan X-Timestamp headers untuk asymmetric signature

**Request Structure**:
```json
{
  "status": 200,
  "success": true,
  "data": {
    "transaction_id": "1512220251105174015668",
    "reference_number": "123456789123",
    "status": "success",
    "bank": {
      "code": "BRI",
      "account_name": "Yayasan Wahyudin Tbk",
      "account_number": "521398319083210"
    },
    "gross_amount": {
      "currency": "IDR",
      "value": "50000"
    },
    "fee": {
      "name": "Transfer Fee",
      "value": "3000",
      "currency": "IDR"
    },
    "net_amount": {
      "currency": "IDR",
      "value": "47000"
    },
    "post_timestamp": "1762339215000",
    "processed_timestamp": "1762339215672",
    "balance_after": {
      "value": "777000",
      "currency": "IDR"
    },
    "notes": "bayar pajak"
  }
}
```

**Error Codes**:
- 5049900: Request Timeout
- 4039914: Insufficient Balance
- 4049911: Invalid Account
- 4039915: Transaction Not Permitted
- 4039923: Account Limit Exceed

**Headers**:
- X-PARTNER-ID: api_key
- Authorization: Bearer token
- X-Signature: Asymmetric signature
- X-Timestamp: ISO 8601 format

---

### Webhook Implementation Example

```php
// Laravel Webhook Handler
class SingapayWebhookController extends Controller {
    
    public function handleVATransaction(Request $request) {
        // Validate signature
        $signature = $request->header('X-Signature');
        $clientId = env('SINGAPAY_CLIENT_ID');
        $body = $request->getContent();
        
        $sortedBody = json_encode(json_decode($body, true), JSON_UNESCAPED_SLASHES | JSON_SORT_KEYS);
        $expectedSignature = hash_hmac('sha256', $sortedBody, $clientId);
        
        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        
        // Process transaction
        $data = $request->json('data');
        
        // Update order/transaction status
        Transaction::where('reff_no', $data['transaction']['reff_no'])
            ->update([
                'status' => $data['transaction']['status'],
                'amount' => $data['transaction']['amount']['value'],
                'payment_method' => $data['payment']['method'],
                'customer_name' => $data['customer']['name'],
                'customer_email' => $data['customer']['email']
            ]);
        
        // Send confirmation email
        Mail::send(new PaymentConfirmation($data));
        
        return response()->json(['success' => true], 200);
    }
    
    public function handleDisbursementTransaction(Request $request) {
        // Validate asymmetric signature
        $signature = $request->header('X-Signature');
        $timestamp = $request->header('X-Timestamp');
        $clientSecret = env('SINGAPAY_CLIENT_SECRET');
        
        $body = $request->getContent();
        $sha256Hash = hash('sha256', $body);
        $data = "POST:/api/v1.0/webhooks/disbursement:" . $timestamp . ":" . $sha256Hash;
        
        $expectedSignature = base64_encode(
            hash_hmac('sha512', $data, $clientSecret, true)
        );
        
        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        
        // Process disbursement
        $disbursement = $request->json('data');
        
        Disbursement::where('reference_number', $disbursement['reference_number'])
            ->update([
                'status' => $disbursement['status'],
                'transaction_id' => $disbursement['transaction_id'],
                'processed_timestamp' => $disbursement['processed_timestamp']
            ]);
        
        return response()->json(['success' => true], 200);
    }
}
```

---

## Implementation Guide

### Phase 1: Setup & Authentication

```php
// Laravel Example
class SingapayService {
    private $apiUrl;
    private $partnerId;
    private $clientId;
    private $clientSecret;
    private $accessToken;
    
    public function __construct() {
        $this->apiUrl = env('SINGAPAY_API_URL', 'https://sandbox-payment-b2b.singapay.id');
        $this->partnerId = env('SINGAPAY_PARTNER_ID');
        $this->clientId = env('SINGAPAY_CLIENT_ID');
        $this->clientSecret = env('SINGAPAY_CLIENT_SECRET');
    }
    
    public function getAccessToken() {
        $timestamp = date('Ymd');
        $payloadData = "{$this->clientId}_{$this->clientSecret}_{$timestamp}";
        $signature = hash_hmac('sha512', $payloadData, $this->clientSecret);
        
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->withHeaders([
                'X-PARTNER-ID' => $this->partnerId,
                'X-CLIENT-ID' => $this->clientId,
                'X-Signature' => $signature,
                'Accept' => 'application/json'
            ])
            ->post("{$this->apiUrl}/api/v1.1/access-token/b2b", [
                'grantType' => 'client_credentials'
            ]);
        
        if ($response->successful()) {
            $this->accessToken = $response->json('data.access_token');
            return $this->accessToken;
        }
        
        throw new Exception('Failed to get access token');
    }
}
```

### Phase 2: Account & VA Management

```php
// Create Account
public function createAccount($name, $email, $phone) {
    return $this->makeRequest('POST', '/api/v1.0/accounts', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone
    ]);
}

// Create Virtual Account
public function createVirtualAccount($accountId, $bankCode, $amount, $kind = 'permanent') {
    $payload = [
        'bank_code' => $bankCode,
        'amount' => $amount,
        'kind' => $kind,
        'currency' => 'IDR'
    ];
    
    if ($kind === 'temporary') {
        $payload['expired_at'] = now()->addDays(30)->timestamp * 1000;
        $payload['max_usage'] = 10;
    }
    
    return $this->makeRequest('POST', "/api/v1.0/virtual-accounts/{$accountId}", $payload);
}

// List VA Transactions
public function listVATransactions($accountId) {
    return $this->makeRequest('GET', "/api/v1.0/va-transactions/{$accountId}");
}
```

### Phase 3: Payment Processing

```php
// Create Payment Link
public function createPaymentLink($accountId, $data) {
    return $this->makeRequest('POST', "/api/v1.0/payment-link-manage/{$accountId}", [
        'reff_no' => $data['reference'],
        'title' => $data['title'],
        'required_customer_detail' => true,
        'max_usage' => 1,
        'expired_at' => $data['expiry_timestamp'],
        'total_amount' => $data['amount'],
        'items' => $data['items'] ?? null,
        'whitelisted_payment_method' => $data['payment_methods'] ?? null
    ]);
}

// Monitor Payment Status
public function getPaymentLinkHistory($accountId, $historyId = null) {
    if ($historyId) {
        return $this->makeRequest('GET', "/api/v1.0/payment-link-histories/{$accountId}/{$historyId}");
    }
    return $this->makeRequest('GET', "/api/v1.0/payment-link-histories/{$accountId}");
}
```

### Phase 4: Fund Disbursement

```php
// Check Transfer Fee
public function checkDisbursementFee($accountId, $amount, $bankSwiftCode) {
    return $this->makeRequest('POST', "/api/v1.0/disbursement/{$accountId}/check-fee", [
        'amount' => $amount,
        'bank_swift_code' => $bankSwiftCode
    ]);
}

// Check Beneficiary
public function checkBeneficiary($accountNumber, $swiftCode) {
    return $this->makeRequest('POST', '/api/v1.0/disbursement/check-beneficiary', [
        'bank_account_number' => $accountNumber,
        'bank_swift_code' => $swiftCode
    ]);
}

// Perform Transfer
public function transferFunds($accountId, $referenceNumber, $amount, $swiftCode, $bankAccount) {
    $timestamp = now()->toIso8601String();
    
    return $this->makeRequestWithSignature(
        'POST',
        "/api/v1.0/disbursements/{$accountId}/transfer",
        [
            'reference_number' => $referenceNumber,
            'amount' => $amount,
            'bank_swift_code' => $swiftCode,
            'bank_account_number' => $bankAccount,
            'notes' => 'Funds transfer'
        ],
        $timestamp
    );
}
```

### Phase 5: Helper Functions

```php
private function makeRequest($method, $endpoint, $data = []) {
    if (!$this->accessToken) {
        $this->getAccessToken();
    }
    
    $response = Http::withHeaders([
        'X-PARTNER-ID' => $this->partnerId,
        'Authorization' => "Bearer {$this->accessToken}",
        'Accept' => 'application/json'
    ])->$method($this->apiUrl . $endpoint, $data);
    
    if ($response->failed()) {
        throw new Exception("Singapay API Error: " . $response->body());
    }
    
    return $response->json();
}

private function makeRequestWithSignature($method, $endpoint, $data, $timestamp) {
    $jsonData = json_encode($data);
    $sha256Hash = hash('sha256', $jsonData);
    $signatureData = strtoupper($method) . ":" . $endpoint . ":" . 
                     $this->accessToken . ":" . $sha256Hash . ":" . $timestamp;
    $signature = base64_encode(hash_hmac('sha512', $signatureData, $this->clientSecret, true));
    
    return Http::withHeaders([
        'X-PARTNER-ID' => $this->partnerId,
        'Authorization' => "Bearer {$this->accessToken}",
        'X-Signature' => $signature,
        'X-Timestamp' => $timestamp,
        'Accept' => 'application/json'
    ])->$method($this->apiUrl . $endpoint, $data);
}
```

---

## Supported Banks

### Virtual Account Banks
- **BRI** (002) - Bank Rakyat Indonesia - BRINIDJA
- **BNI** (009) - Bank Negara Indonesia - BNINIDJA
- **DANAMON (011) - Bank Danamon - BDINIDJA
- **MAYBANK** (016) - Maybank Indonesia - IBBKIDJA

### Disbursement Banks (60+ banks supported)
Including: BCA, Mandiri, BTN, Permata, CIMB Niaga, DBS, Panin, Syariah banks, dan banyak lagi.

---

## Error Handling

### Common Error Codes

| Code | Message | Action |
|------|---------|--------|
| 401 | Unauthorized/Invalid credentials | Check API keys and signature |
| 403 | Forbidden/Insufficient Balance | Verify account balance |
| 404 | Not Found/Invalid Account | Verify account/transaction ID |
| 409 | Conflict/Duplicate reference | Use unique reference numbers |
| 422 | Validation error | Check request parameters |
| 500 | Server Error | Retry or contact support |

---

## Best Practices

1. **Token Management**: Cache access token dan refresh sebelum expire
2. **Idempotency**: Gunakan unique reference numbers untuk menghindari duplikasi
3. **Error Handling**: Implementasikan retry logic dengan exponential backoff
4. **Signature Verification**: Always validate signatures untuk disbursement requests
5. **Security**: Store credentials di environment variables, jangan hardcode
6. **Monitoring**: Log semua transactions dan monitor untuk anomalies
7. **Reconciliation**: Daily reconciliation antara payment records dan transaction status

---

## Testing Checklist

- [ ] Authentication & token generation
- [ ] Account creation & management
- [ ] Virtual Account creation & list
- [ ] Payment Link generation & status tracking
- [ ] VA Transaction monitoring
- [ ] Disbursement fee calculation
- [ ] Beneficiary verification
- [ ] Fund transfer
- [ ] Error handling & edge cases
- [ ] Signature validation (disbursement)

---

## Resources

- **Documentation**: https://docs-payment-b2b.singapay.id
- **API Sandbox**: https://sandbox-payment-b2b.singapay.id
- **API Production**: https://payment-b2b.singapay.id
- **Support**: [Contact Singapay support]

---

**Last Updated**: December 1, 2025  
**Compiled for**: SmartPlan-Web Project
