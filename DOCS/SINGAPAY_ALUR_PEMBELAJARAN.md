# 🎯 Singapay B2B Payment Gateway - Alur Pembelajaran Mudah

**Dibuat untuk**: SmartPlan-Web Project  
**Tanggal**: December 1, 2025  
**Tujuan**: Memahami alur pembayaran & implementasi Singapay dengan mudah

---

## 📍 Daftar Isi
1. [Konsep Dasar](#konsep-dasar)
2. [Alur Autentikasi (Login)](#alur-autentikasi-login)
3. [Alur Pembayaran Virtual Account](#alur-pembayaran-virtual-account)
4. [Alur Pembayaran QRIS](#alur-pembayaran-qris)
5. [Alur Disbursement (Pencairan Dana)](#alur-disbursement-pencairan-dana)
6. [Alur Webhook (Notifikasi Real-time)](#alur-webhook-notifikasi-real-time)
7. [Dashboard Merchant](#dashboard-merchant)
8. [Error Handling & Troubleshooting](#error-handling--troubleshooting)

---

## 🎓 Konsep Dasar

### Apa itu Singapay B2B?
Payment Gateway yang memungkinkan bisnis Anda menerima pembayaran dari pelanggan melalui berbagai metode:
- **Virtual Account (VA)** - Transfer bank langsung
- **QRIS** - QR Code pembayaran
- **E-wallet** - Dompet digital
- **Retail** - Indomaret, Alfamart
- **Disbursement** - Pencairan dana ke rekening bank

### Komponen Utama
```
┌─────────────────────────────────────────────────────────┐
│ 1. MERCHANT (Bisnis Anda) - SmartPlan-Web               │
│    - Terima pembayaran dari pelanggan                   │
│    - Kirim dana ke vendor/staff                         │
├─────────────────────────────────────────────────────────┤
│ 2. SINGAPAY API (Payment Gateway)                       │
│    - Proses pembayaran                                  │
│    - Kelola rekening/VA                                 │
│    - Kirim notifikasi                                   │
├─────────────────────────────────────────────────────────┤
│ 3. CUSTOMER (Pelanggan Anda)                            │
│    - Transfer ke VA yang disediakan                     │
│    - Scan QRIS                                          │
│    - E-wallet payment                                   │
├─────────────────────────────────────────────────────────┤
│ 4. BANK (BRI, BNI, Danamon, Maybank)                    │
│    - Proses transfer                                    │
│    - Verifikasi rekening                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Alur Autentikasi (Login)

### Step 1: Persiapan Kredensial
```
Dapatkan dari Merchant Dashboard Singapay:
├─ X-PARTNER-ID (API Key) - ID unik merchant
├─ X-CLIENT-ID (Client ID) - Identitas aplikasi
├─ X-CLIENT-SECRET (Client Secret) - Kunci rahasia
└─ Timestamp (YYYYMMDD) - Tanggal saat ini
```

### Step 2: Generate Signature
```
1. Gabungkan: CLIENT_ID + "_" + CLIENT_SECRET + "_" + YYYYMMDD
   Contoh: a2fca1f4-92f0-474d-a6d5-d92ca830be79_UAkHVDuPSqHQI17ED9vDXNHq9o6MfcSZ_20250921

2. Hash dengan HMAC SHA512 menggunakan CLIENT_SECRET
   Hash: hash_hmac("sha512", payload, client_secret)

3. Hasil signature siap digunakan
```

### Step 3: Request Access Token
```
POST /api/v1.1/access-token/b2b
Headers:
  X-PARTNER-ID: api_key
  X-CLIENT-ID: client_id
  X-Signature: {hasil hash di step 2}
  Content-Type: application/json

Body:
{
  "grantType": "client_credentials"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_in": 3600 (1 jam)
}
```

### Step 4: Gunakan Token untuk API Calls
```
Setiap request ke API gunakan:
Authorization: Bearer {access_token}

Token berlaku selama 3600 detik (1 jam)
Setelah expired, repeat Step 2-3 untuk dapat token baru
```

**Flowchart Autentikasi**:
```
START
  ↓
Siapkan: CLIENT_ID, CLIENT_SECRET, TIMESTAMP
  ↓
Generate Signature (HMAC SHA512)
  ↓
POST ke /api/v1.1/access-token/b2b
  ↓
Dapatkan access_token (valid 1 jam)
  ↓
Gunakan di setiap API call (Authorization: Bearer)
  ↓
END
```

---

## 💰 Alur Pembayaran Virtual Account

### Skenario
Pelanggan ingin membayar invoice Anda Rp 100.000 via transfer bank.

### Step 1: Buat Virtual Account (VA)
```
POST /api/v1.0/accounts/{account_id}/virtual-accounts
Headers:
  Authorization: Bearer {access_token}
  X-PARTNER-ID: api_key

Body:
{
  "customer_id": "CUST001",
  "customer_name": "Budi Santoso",
  "customer_email": "budi@email.com",
  "customer_phone": "08123456789",
  "payment_type": "permanent",  // atau temporary
  "bank_code": "BRI",  // BRI, BNI, Danamon, Maybank
  "description": "Invoice #001"
}

Response:
{
  "va_number": "7872955146576837",
  "bank": "BRI",
  "amount": "100000",
  "customer_name": "Budi Santoso"
}
```

### Step 2: Share VA ke Pelanggan
```
Kirim ke customer:
┌────────────────────────────┐
│ SILAKAN TRANSFER KE        │
│ Bank BRI - Virtual Account │
│ Nomor: 7872955146576837    │
│ A/N: Budi Santoso          │
│ Jumlah: Rp 100.000         │
└────────────────────────────┘

Atau tampilkan sebagai Invoice di aplikasi SmartPlan
```

### Step 3: Customer Transfer
```
Customer membuka aplikasi bank BRI mereka
  ↓
Pilih Transfer ke Bank Lain
  ↓
Masukkan:
  - Nomor VA: 7872955146576837
  - Jumlah: Rp 100.000
  - Keterangan: Invoice #001
  ↓
Konfirmasi & Transfer
  ↓
Bank BRI memproses transfer
```

### Step 4: Sistem Singapay Verifikasi
```
Singapay menerima transfer dari bank BRI
  ↓
Verifikasi nomor VA & jumlah
  ↓
Update status pembayaran
  ↓
Kirim webhook notifikasi ke aplikasi Anda
```

### Step 5: Aplikasi Anda Terima Notifikasi (Webhook)
```
POST {webhook_url} (dari notifikasi Singapay)

Body:
{
  "transaction": {
    "reff_no": "3211120250926133543246",
    "type": "va",
    "status": "paid",
    "amount": "100000"
  },
  "customer": {
    "name": "Budi Santoso",
    "email": "budi@email.com"
  },
  "payment": {
    "method": "va",
    "va_number": "7872955146576837"
  }
}
```

### Step 6: Update Invoice Status
```
Aplikasi SmartPlan:
  ↓
Validasi signature webhook
  ↓
Update invoice status: PAID
  ↓
Kirim email confirmation ke customer
  ↓
Update dashboard merchant
  ↓
Return 200 OK ke Singapay
```

**Flowchart VA Payment**:
```
CUSTOMER INGIN BAYAR
        ↓
   Buat VA
        ↓
  Share ke Customer
        ↓
   Customer Transfer
        ↓
Singapay Terima Transfer
        ↓
Kirim Webhook Notifikasi
        ↓
Update Invoice Status PAID
        ↓
SELESAI ✓
```

---

## 📱 Alur Pembayaran QRIS

### Skenario
Pelanggan ingin membayar invoice Rp 50.000 via QR Code (QRIS).

### Step 1: Generate QRIS Code
```
POST /api/v1.0/accounts/{account_id}/qris/generate

Body:
{
  "customer_id": "CUST001",
  "customer_name": "Budi Santoso",
  "amount": "50000",
  "description": "Invoice #001"
}

Response:
{
  "qr_string": "00020101021226570015ID.SINGAPAY.WWW...",
  "qr_image_url": "https://qr-server/qr123.png",
  "reference_id": "QRIS001"
}
```

### Step 2: Tampilkan QR Code ke Customer
```
Di aplikasi atau invoice:
┌──────────────────┐
│  SCAN KODE QR    │
│  ┌────────────┐  │
│  │            │  │
│  │   QR CODE  │  │
│  │            │  │
│  └────────────┘  │
│ Jumlah: Rp 50.000│
└──────────────────┘
```

### Step 3: Customer Scan & Bayar
```
Customer buka aplikasi mobile banking/e-wallet
  ↓
Scan QR Code
  ↓
Aplikasi terbuka dengan nominal Rp 50.000
  ↓
Confirm pembayaran
  ↓
Dana transfer langsung ke rekening Anda
```

### Step 4: Webhook Notifikasi
```
Singapay kirim webhook:
{
  "transaction": {
    "type": "qris",
    "status": "paid",
    "amount": "50000",
    "tip": "0"
  },
  "payment": {
    "method": "qris",
    "qr_string": "00020101021226570015ID.SINGAPAY.WWW..."
  }
}
```

### Step 5: Update Status
```
Aplikasi update invoice status: PAID
Send confirmation email
Display success message to customer
```

**Flowchart QRIS Payment**:
```
GENERATE QR CODE
        ↓
  TAMPILKAN KE CUSTOMER
        ↓
  CUSTOMER SCAN QR
        ↓
  CUSTOMER BAYAR
        ↓
WEBHOOK NOTIFICATION
        ↓
UPDATE STATUS PAID
        ↓
SELESAI ✓
```

---

## 🏦 Alur Disbursement (Pencairan Dana)

### Skenario
Anda ingin mengirim komisi Rp 50.000 ke rekening staff (A/N: Ahmad Wijaya, BRI 1234567890).

### Step 1: Cek Balance
```
GET /api/v1.0/balance-inquiry

Response:
{
  "available_balance": "1000000",  // Dana yang bisa digunakan
  "pending_balance": "100000",      // Menunggu proses
  "held_balance": "50000"           // Ditahan
}

Cek: apakah available_balance >= 50.000? YA ✓
```

### Step 2: Cek Biaya Disbursement
```
POST /api/v1.0/disbursement/check-fee

Body:
{
  "account_number": "1234567890",
  "bank_code": "BRI",
  "amount": "50000"
}

Response:
{
  "amount": "50000",
  "fee": "3000",
  "net_amount": "47000"
}

Total yang dibutuhkan: 50.000 + 3.000 = 53.000
Cek: available_balance (1.000.000) >= 53.000? YA ✓
```

### Step 3: Verifikasi Rekening
```
POST /api/v1.0/disbursement/check-beneficiary

Body:
{
  "account_number": "1234567890",
  "bank_code": "BRI"
}

Response:
{
  "account_number": "1234567890",
  "account_name": "Ahmad Wijaya",
  "status": "verified",
  "bank": {
    "code": "BRI",
    "name": "Bank Rakyat Indonesia",
    "swift_code": "BRINIDJA"
  }
}

Status: VERIFIED ✓ - Aman untuk transfer
```

### Step 4: Transfer Dana
```
POST /api/v1.0/disbursement/transfer

Headers:
  Authorization: Bearer {access_token}
  X-Signature: {asymmetric signature}
  X-Timestamp: 2025-12-01T10:30:00Z

Body:
{
  "reference_number": "DISB001",
  "account_number": "1234567890",
  "bank_code": "BRI",
  "amount": "50000",
  "notes": "Komisi November"
}

Response:
{
  "transaction_id": "1512220251105174015668",
  "status": "success",
  "amount": "50000",
  "fee": "3000",
  "net_amount": "47000"
}
```

### Step 5: Cek Status & Notifikasi
```
GET /api/v1.0/disbursement/status/{transaction_id}

Response:
{
  "status": "success",
  "transaction_id": "1512220251105174015668",
  "reference_number": "DISB001",
  "processed_timestamp": "1762339215672"
}

Atau terima webhook notifikasi:
{
  "status": "success",
  "account_name": "Ahmad Wijaya",
  "net_amount": "47000",
  "balance_after": "999947000"
}

Update database:
- Status: COMPLETED
- Recipient: Ahmad Wijaya
- Amount: Rp 50.000
- Fee: Rp 3.000
```

**Flowchart Disbursement**:
```
TENTUKAN PENERIMA & JUMLAH
        ↓
CEK BALANCE (available >= amount?)
        ↓
CEK BIAYA TRANSFER
        ↓
VERIFIKASI REKENING PENERIMA
        ↓
TRANSFER DANA
        ↓
TERIMA WEBHOOK NOTIFIKASI
        ↓
UPDATE STATUS & BALANCE
        ↓
SELESAI ✓
```

---

## 🔔 Alur Webhook (Notifikasi Real-time)

### Konsep
Webhook adalah notifikasi otomatis dari Singapay ke server Anda ketika terjadi event pembayaran.

### Flow
```
Customer Bayar
  ↓
Singapay menerima transfer
  ↓
Singapay generate webhook message
  ↓
Singapay POST ke webhook URL Anda
  ↓
Server Anda terima notifikasi
  ↓
Server validate signature
  ↓
Update database
  ↓
Return 200 OK
  ↓
Jika error: Singapay akan retry (automatic)
```

### Jenis-jenis Event

#### 1. Virtual Account Transaction
```json
Event: Ketika ada pembayaran via VA
{
  "type": "va",
  "reff_no": "3211120250926133543246",
  "status": "paid",
  "amount": "100000",
  "va_number": "7872955146576837",
  "bank": "BRI"
}
```

#### 2. QRIS Transaction
```json
Event: Ketika ada pembayaran via QRIS
{
  "type": "qris",
  "reff_no": "6601K62BH34X445J046C4W5249E6",
  "status": "paid",
  "amount": "50000",
  "qr_string": "00020101021226570015ID.SINGAPAY.WWW..."
}
```

#### 3. Disbursement Transaction
```json
Event: Ketika transfer dana selesai
{
  "type": "disbursement",
  "transaction_id": "1512220251105174015668",
  "status": "success",
  "amount": "50000",
  "fee": "3000",
  "net_amount": "47000"
}
```

### Validasi Signature Webhook

**Untuk VA & QRIS** (HMAC SHA256):
```php
// 1. Ambil signature dari header
$signature = $_SERVER['HTTP_X_SIGNATURE'];

// 2. Ambil raw body
$body = file_get_contents('php://input');

// 3. Sort JSON keys
$sortedBody = json_encode(json_decode($body, true), JSON_SORT_KEYS);

// 4. Generate signature dengan CLIENT_ID
$expectedSignature = hash_hmac('sha256', $sortedBody, CLIENT_ID);

// 5. Compare
if (hash_equals($expectedSignature, $signature)) {
    // Valid ✓
} else {
    // Invalid ✗
    http_response_code(401);
    exit;
}
```

**Untuk Disbursement** (Asymmetric SHA512):
```php
// 1. Ambil headers
$signature = $_SERVER['HTTP_X_SIGNATURE'];
$timestamp = $_SERVER['HTTP_X_TIMESTAMP'];

// 2. Ambil raw body
$body = file_get_contents('php://input');

// 3. Generate signature data
$sha256Hash = hash('sha256', $body);
$data = "POST:/api/v1.0/webhooks/disbursement:" . $timestamp . ":" . $sha256Hash;

// 4. Generate expected signature
$expectedSignature = base64_encode(
    hash_hmac('sha512', $data, CLIENT_SECRET, true)
);

// 5. Compare
if (hash_equals($expectedSignature, $signature)) {
    // Valid ✓
} else {
    // Invalid ✗
}
```

### Retry Mechanism
Jika webhook Anda return error (tidak 200), Singapay otomatis retry:

| HTTP Status | Retry | Interval |
|---|---|---|
| 200-299 | Tidak | - |
| 500 | 1x | 1 menit |
| 503 | 4x | 1 menit |
| 400/404 | 2x | 1 menit |
| 307/308 | 5x | 1 menit |
| Timeout | 1x | 1 menit |
| Lainnya | 5x | 1 menit |

**Contoh**: Jika return 503, Singapay akan retry hingga 4 kali dengan jeda 1 menit.

---

## 📊 Dashboard Merchant

### Apa yang Bisa Dilihat?

#### 1. Balance Summary
```
Total Balance: Rp 10.000.000
├─ Available: Rp 8.000.000 (bisa digunakan)
├─ Pending: Rp 1.500.000 (menunggu proses)
└─ Held: Rp 500.000 (ditahan)
```

#### 2. Transaction History
```
| Tanggal | Jenis | Ref # | Amount | Status |
|---|---|---|---|---|
| 01-12 | VA | SINPAY001 | +100.000 | PAID |
| 01-12 | QRIS | SINPAY002 | +50.000 | PAID |
| 01-12 | Disbursement | DISB001 | -50.000 | SUCCESS |
| 30-11 | VA | SINPAY003 | +200.000 | PENDING |
```

#### 3. Merchant Settings
```
- Webhook URL Configuration
- Bank Account Management
- Virtual Account Settings
- API Keys & Credentials
- Transaction Reports
```

---

## ⚠️ Error Handling & Troubleshooting

### Common Errors

#### 1. Authentication Error (401)
```
Error: "Invalid credentials"
Penyebab:
- X-Signature tidak sesuai
- Timestamp expired (> 24 jam)
- CLIENT_ID atau CLIENT_SECRET salah

Solusi:
- Regenerate signature
- Update X-PARTNER-ID, X-CLIENT-ID
- Cek tanggal server vs Singapay server
```

#### 2. Insufficient Balance (409)
```
Error: "Insufficient balance for transaction"
Penyebab:
- available_balance < amount + fee

Solusi:
- Cek balance dengan GET /balance-inquiry
- Tunggu pending transactions selesai
- Hubungi support untuk increase limit
```

#### 3. Invalid Account (400)
```
Error: "Beneficiary account is invalid"
Penyebab:
- Nomor rekening salah format
- Rekening tidak terdaftar
- Bank code tidak valid

Solusi:
- Gunakan check-beneficiary endpoint
- Verifikasi nomor rekening
- Pilih bank code yang benar (BRI, BNI, dll)
```

#### 4. Webhook Signature Invalid
```
Error: "X-Signature tidak match"
Penyebab:
- Body sudah dimodifikasi
- Signature method salah
- CLIENT_ID/SECRET salah

Solusi:
- Gunakan raw body, jangan parse dulu
- Cek JSON sorting (use JSON_SORT_KEYS)
- Verifikasi CLIENT_ID & CLIENT_SECRET
```

### Debugging Tips

#### 1. Log Semua Request & Response
```php
// Sebelum kirim request
Log::info('Singapay Request', [
    'method' => 'POST',
    'url' => $url,
    'headers' => $headers,
    'body' => $body
]);

// Setelah dapat response
Log::info('Singapay Response', [
    'status' => $response->status(),
    'body' => $response->json()
]);
```

#### 2. Test Signature Generation
```php
// Test signature untuk authentication
$timestamp = date('Ymd');
$payload = $clientId . "_" . $clientSecret . "_" . $timestamp;
$signature = hash_hmac('sha512', $payload, $clientSecret);

Log::info('Signature Test', [
    'payload' => $payload,
    'signature' => $signature,
    'expected' => 'paste dari dashboard'
]);
```

#### 3. Webhook Testing Tools
```
- Postman: import webhook examples
- RequestBin: capture webhook requests
- Webhook.site: generate temporary webhook URL
- Local tunneling: ngrok untuk test locally
```

---

## 📚 Ringkasan Learning Path

### Level 1: Beginner
- ✅ Pahami konsep dasar (merchant, customer, bank)
- ✅ Setup credentials (API Key, Client ID, Secret)
- ✅ Generate access token
- ✅ Read dokumentasi lengkap

### Level 2: Intermediate
- ✅ Implementasi VA payment flow
- ✅ Implementasi QRIS payment flow
- ✅ Terima & validasi webhook
- ✅ Update transaction status di database

### Level 3: Advanced
- ✅ Implementasi disbursement/transfer
- ✅ Error handling & retry logic
- ✅ Balance management
- ✅ Reporting & analytics
- ✅ Performance optimization

### Level 4: Production
- ✅ Security hardening
- ✅ Load testing
- ✅ Monitoring & alerting
- ✅ Disaster recovery
- ✅ Documentation & runbooks

---

## 🎯 Next Steps untuk SmartPlan-Web

### Phase 1: Setup (Week 1)
- [ ] Get Singapay credentials dari dashboard
- [ ] Setup Laravel Singapay Service class
- [ ] Implement access token generation
- [ ] Test credentials dengan sandbox environment

### Phase 2: Payment Receiving (Week 2-3)
- [ ] Implement VA payment flow
- [ ] Implement QRIS payment flow
- [ ] Create webhook endpoint
- [ ] Test with sandbox transactions

### Phase 3: Disbursement (Week 4)
- [ ] Implement disbursement flow
- [ ] Add recipient management
- [ ] Implement balance checking
- [ ] Add transaction history

### Phase 4: Production (Week 5)
- [ ] Switch to production credentials
- [ ] Deploy to production server
- [ ] Setup monitoring & alerting
- [ ] Document & train team

---

## 📞 Quick Reference

### Important URLs
```
Sandbox Dashboard: https://sandbox-payment-b2b.singapay.id
Production Dashboard: https://payment-b2b.singapay.id
API Sandbox: https://sandbox-payment-b2b.singapay.id/api/v1.0
API Production: https://payment-b2b.singapay.id/api/v1.0
```

### Important Endpoints
```
Authentication
  POST /api/v1.1/access-token/b2b

Virtual Accounts
  POST /api/v1.0/accounts/{account_id}/virtual-accounts
  GET /api/v1.0/accounts/{account_id}/virtual-accounts

Payment Links
  POST /api/v1.0/payment-links
  GET /api/v1.0/payment-links/{payment_link_id}

Balance Inquiry
  GET /api/v1.0/balance-inquiry

Disbursement
  POST /api/v1.0/disbursement/check-fee
  POST /api/v1.0/disbursement/check-beneficiary
  POST /api/v1.0/disbursement/transfer
```

### Banks Supported
```
Virtual Accounts: BRI, BNI, Danamon, Maybank
Disbursement: 60+ banks including BRI, BNI, Mandiri, BCA, CIMB, etc.
```

---

## 📖 Resource Links

**Dokumentasi Lengkap**: Lihat `SINGAPAY_B2B_PAYMENT_GATEWAY_GUIDE.md`

**API Reference**: Dari file tersebuttertera semua endpoint dengan contoh request/response

**Status Codes**: Tersedia di implementation guide

---

**Last Updated**: December 1, 2025  
**Version**: 1.0  
**untuk**: SmartPlan-Web Project
