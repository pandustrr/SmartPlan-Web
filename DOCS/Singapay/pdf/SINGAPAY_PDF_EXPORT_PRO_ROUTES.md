# Singapay B2B Payment Gateway - PDF Export Pro Routes

## Overview
Backend API routes untuk Singapay B2B Payment Gateway integration dengan PDF Export feature.

## Configuration
Tambahkan ke `config/services.php`:

```php
'singapay' => [
    'partner_id' => env('SINGAPAY_PARTNER_ID', '#SINGAPAY_PARTNER_ID#'),
    'client_id' => env('SINGAPAY_CLIENT_ID', '#SINGAPAY_CLIENT_ID#'),
    'client_secret' => env('SINGAPAY_CLIENT_SECRET', '#SINGAPAY_CLIENT_SECRET#'),
    'sandbox_url' => env('SINGAPAY_SANDBOX_URL', '#SINGAPAY_SANDBOX_URL#'),
    'production_url' => env('SINGAPAY_PRODUCTION_URL', '#SINGAPAY_PRODUCTION_URL#'),
    'webhook_secret' => env('SINGAPAY_WEBHOOK_SECRET', '#SINGAPAY_WEBHOOK_SECRET#'),
    'environment' => env('SINGAPAY_ENV', 'sandbox'), // sandbox atau production
    'merchant_account_id' => env('SINGAPAY_MERCHANT_ACCOUNT_ID', 'default_account'),
],
```

## Environment Variables (.env)
```
SINGAPAY_PARTNER_ID=#SINGAPAY_PARTNER_ID#
SINGAPAY_CLIENT_ID=#SINGAPAY_CLIENT_ID#
SINGAPAY_CLIENT_SECRET=#SINGAPAY_CLIENT_SECRET#
SINGAPAY_SANDBOX_URL=#SINGAPAY_SANDBOX_URL#
SINGAPAY_PRODUCTION_URL=#SINGAPAY_PRODUCTION_URL#
SINGAPAY_WEBHOOK_SECRET=#SINGAPAY_WEBHOOK_SECRET#
SINGAPAY_ENV=sandbox
SINGAPAY_MERCHANT_ACCOUNT_ID=default_account
```

---

## API Endpoints

### 1. Create Export Request & Generate Virtual Account
**POST** `/api/pdf-export/create-request`

**Description**: Membuat export request dan generate Virtual Account untuk pembayaran.

**Request Body**:
```json
{
  "export_type": "business_plan|financial_plan|forecast",
  "business_id": 1,
  "package": "professional|business",
  "year": 2024,
  "month": 1
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "export_request_id": 1,
    "va_number": "198271982719827",
    "bank": "BRI",
    "amount": 50000,
    "expires_at": "2024-01-18T10:00:00.000000Z",
    "reference_id": 1,
    "instructions": "Silakan transfer ke nomor Virtual Account: 198271982719827 sebesar Rp 50.000"
  }
}
```

**Response (Error)**:
```json
{
  "status": "error",
  "message": "Gagal membuat request export: ..."
}
```

**Customization Points**:
- `[CUSTOMIZATION_VA]` - Customize bank selection
- `[CUSTOMIZATION_PRICING]` - Sesuaikan harga per package
- `[CUSTOMIZATION_SINGAPAY_ACCOUNT]` - Account ID dari Singapay

---

### 2. Generate Payment Options (QRIS / Payment Link)
**POST** `/api/pdf-export/payment-options`

**Description**: Generate alternatif pembayaran selain Virtual Account (QRIS atau Payment Link).

**Request Body**:
```json
{
  "export_request_id": 1,
  "payment_method": "qris|payment_link"
}
```

**Response (QRIS)**:
```json
{
  "status": "success",
  "data": {
    "qr_data": "base64_encoded_qr_image",
    "qr_string": "00020101021203031300006050",
    "payment_method": "qris",
    "amount": 50000
  }
}
```

**Response (Payment Link)**:
```json
{
  "status": "success",
  "data": {
    "link": "https://payment-singapay.com/pay/...",
    "payment_method": "payment_link",
    "amount": 50000,
    "expires_at": "2024-01-18T10:00:00"
  }
}
```

**Customization Points**:
- `[CUSTOMIZATION_QRIS]` - QRIS generation settings
- `[CUSTOMIZATION_LINK]` - Payment link customization

---

### 3. Check Payment Status
**GET** `/api/pdf-export/payment-status/{export_request_id}`

**Description**: Check status pembayaran dari export request.

**Response (Pending)**:
```json
{
  "status": "success",
  "data": {
    "export_request_id": 1,
    "payment_status": "pending_payment",
    "amount": 50000,
    "va_number": "198271982719827",
    "paid_at": null,
    "pdf_download_url": null
  }
}
```

**Response (Completed)**:
```json
{
  "status": "success",
  "data": {
    "export_request_id": 1,
    "payment_status": "completed",
    "amount": 50000,
    "va_number": "198271982719827",
    "paid_at": "2024-01-15T10:00:00",
    "pdf_download_url": "https://smartplan.com/api/pdf-export/download/1"
  }
}
```

---

### 4. Download PDF (After Payment)
**GET** `/api/pdf-export/download/{export_request_id}`

**Description**: Download PDF file setelah pembayaran berhasil.

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "filename": "business_plan_2024_01.pdf",
    "download_url": "https://smartplan.com/api/pdf-export/download-file/1"
  }
}
```

**Response (Payment Not Completed)**:
```json
{
  "status": "error",
  "message": "Payment belum selesai atau PDF belum ready"
}
```

**Response (File Not Found)**:
```json
{
  "status": "error",
  "message": "PDF file not found"
}
```

---

### 5. Get Package Pricing & Features
**GET** `/api/pdf-export/pricing`

**Description**: Dapatkan informasi pricing dan features untuk setiap package.

**Response**:
```json
{
  "status": "success",
  "data": {
    "free": {
      "name": "Standard (Free)",
      "price": 0,
      "features": [
        "Basic PDF export",
        "Watermark included",
        "Standard formatting"
      ],
      "download_available": true,
      "watermark": true
    },
    "professional": {
      "name": "Professional",
      "price": 50000,
      "features": [
        "Professional PDF export",
        "No watermark",
        "Premium formatting",
        "Advanced charts",
        "Custom branding"
      ],
      "download_available": true,
      "watermark": false
    },
    "business": {
      "name": "Business",
      "price": 100000,
      "features": [
        "All Professional features",
        "Priority support",
        "Multiple exports",
        "Team collaboration",
        "API access",
        "Custom integration"
      ],
      "download_available": true,
      "watermark": false
    }
  }
}
```

**Customization Points**:
- `[CUSTOMIZATION_PRICING]` - Customize packages dan pricing

---

### 6. Get Export History
**GET** `/api/pdf-export/history`

**Query Parameters**:
- `page` (optional): Halaman nomor, default 1
- `per_page` (optional): Item per halaman, default 10

**Description**: Dapatkan history export requests untuk user yang login.

**Response**:
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "export_type": "business_plan",
        "business_id": 1,
        "package": "professional",
        "amount": 50000,
        "status": "completed",
        "payment_method": "virtual_account",
        "payment_va_number": "198271982719827",
        "payment_expires_at": "2024-01-18T10:00:00",
        "paid_at": "2024-01-15T10:00:00",
        "created_at": "2024-01-15T09:00:00"
      }
    ],
    "total": 10,
    "per_page": 10
  }
}
```

---

### 7. Singapay Webhook Handler
**POST** `/webhooks/singapay/payment-settlement`

**Description**: Webhook endpoint untuk Singapay notification tentang payment settlement.

**Webhook Request Format** (dari Singapay):
```json
{
  "id": "transaction_id_from_singapay",
  "reference_id": "export_request_id",
  "status": "SETTLEMENT",
  "amount": 50000,
  "payment_method": "virtual_account",
  "bank_code": "BRI",
  "va_number": "198271982719827",
  "settled_at": "2024-01-15T10:00:00Z"
}
```

**Request Headers**:
```
X-Singapay-Signature: hmac_sha256_signature
```

**Response**:
```json
{
  "status": "success",
  "message": "Webhook processed"
}
```

**Signature Validation**:
```
Expected Signature = HMAC-SHA256(request_body, webhook_secret)
```

**Customization Points**:
- `[CUSTOMIZATION_WEBHOOK_SECRET]` - Webhook secret dari Singapay
- `[CUSTOMIZATION_WEBHOOK_STATUS]` - Status mapping customization
- `[CUSTOMIZATION_SIGNATURE_VALIDATION]` - Signature validation logic
- `[CUSTOMIZATION_PDF_GENERATION]` - Auto-generate PDF setelah payment
- `[CUSTOMIZATION_EMAIL]` - Email notification logic

---

### 8. Manual Payment Status Check (Polling)
**GET** `/api/pdf-export/payment-status-manual`

**Query Parameters**:
- `export_request_id` (required): ID dari export request

**Description**: Manual polling endpoint untuk check payment status (fallback ke webhook).

**Response**:
```json
{
  "status": "success",
  "data": {
    "export_request_id": 1,
    "status": "completed",
    "payment_status": "settled",
    "paid_at": "2024-01-15T10:00:00"
  }
}
```

**Customization Points**:
- `[CUSTOMIZATION_POLLING]` - API polling implementation

---

## Database Schema

### pdf_export_requests table
```sql
CREATE TABLE pdf_export_requests (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  export_type ENUM('business_plan', 'financial_plan', 'forecast'),
  business_id BIGINT NOT NULL,
  package ENUM('professional', 'business'),
  amount INT DEFAULT 0,
  year INT,
  month INT,
  status ENUM('pending_payment', 'completed', 'failed', 'expired'),
  payment_method ENUM('virtual_account', 'qris', 'payment_link'),
  payment_va_number VARCHAR(255),
  payment_va_bank VARCHAR(50),
  payment_qris_data LONGTEXT,
  payment_link VARCHAR(255),
  singapay_reference_id VARCHAR(255),
  payment_expires_at TIMESTAMP,
  paid_at TIMESTAMP,
  pdf_path VARCHAR(255),
  pdf_filename VARCHAR(255),
  pdf_download_url VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### singapay_payments table
```sql
CREATE TABLE singapay_payments (
  id BIGINT PRIMARY KEY,
  export_request_id BIGINT NOT NULL,
  reference_id VARCHAR(255) UNIQUE,
  singapay_transaction_id VARCHAR(255) UNIQUE,
  amount INT,
  payment_method ENUM('virtual_account', 'qris', 'payment_link'),
  bank_code VARCHAR(50),
  va_number VARCHAR(255),
  status ENUM('pending', 'settled', 'failed', 'cancelled'),
  response_data JSON,
  webhook_data JSON,
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

---

## Customization Hashtags Summary

| Hashtag | Purpose | Default Value |
|---------|---------|----------------|
| `#SINGAPAY_PARTNER_ID#` | Merchant Partner ID | From env |
| `#SINGAPAY_CLIENT_ID#` | OAuth Client ID | From env |
| `#SINGAPAY_CLIENT_SECRET#` | Client Secret | From env |
| `#SINGAPAY_SANDBOX_URL#` | Sandbox Base URL | https://sandbox-payment-b2b.singapay.id |
| `#SINGAPAY_PRODUCTION_URL#` | Production Base URL | https://payment-b2b.singapay.id |
| `#SINGAPAY_WEBHOOK_URL#` | Webhook Endpoint | /webhooks/singapay/payment-settlement |
| `[CUSTOMIZATION_VA]` | VA Bank Selection | BRI as default |
| `[CUSTOMIZATION_PRICING]` | Package Pricing | 50k Pro, 100k Business |
| `[CUSTOMIZATION_SINGAPAY_ACCOUNT]` | Account ID | From env |
| `[CUSTOMIZATION_QRIS]` | QRIS Generation | Via SingapayService |
| `[CUSTOMIZATION_LINK]` | Payment Link | Via SingapayService |
| `[CUSTOMIZATION_WEBHOOK_SECRET]` | Webhook Validation | From env |
| `[CUSTOMIZATION_WEBHOOK_STATUS]` | Status Mapping | Defined in controller |
| `[CUSTOMIZATION_SIGNATURE_VALIDATION]` | Signature Check | HMAC SHA256 |
| `[CUSTOMIZATION_PDF_GENERATION]` | PDF Auto-Generate | Queue job (commented) |
| `[CUSTOMIZATION_EMAIL]` | Email Notifications | Mail class (commented) |
| `[CUSTOMIZATION_POLLING]` | Polling Logic | API check method |

---

## Error Handling

### Common Error Responses

**Unauthorized**:
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```
HTTP Status: 403

**Invalid Input**:
```json
{
  "status": "error",
  "message": "The given data was invalid",
  "errors": {
    "export_type": ["The export_type field is required"]
  }
}
```
HTTP Status: 422

**Export Request Not Found**:
```json
{
  "status": "error",
  "message": "Export request not found"
}
```
HTTP Status: 404

**Server Error**:
```json
{
  "status": "error",
  "message": "Internal server error"
}
```
HTTP Status: 500

---

## Implementation Checklist

- [ ] Add routes ke `routes/api.php`
- [ ] Configure `config/services.php` dengan Singapay credentials
- [ ] Set environment variables di `.env`
- [ ] Run migrations: `php artisan migrate`
- [ ] Test semua endpoints
- [ ] Configure webhook di Singapay dashboard
- [ ] Setup email notifications
- [ ] Implement PDF generation queue
- [ ] Test webhook signature validation
- [ ] Add rate limiting untuk payment endpoints

---

## Testing

### cURL Examples

**Create Export Request**:
```bash
curl -X POST http://localhost:8000/api/pdf-export/create-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "export_type": "business_plan",
    "business_id": 1,
    "package": "professional"
  }'
```

**Check Payment Status**:
```bash
curl -X GET http://localhost:8000/api/pdf-export/payment-status/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Pricing**:
```bash
curl -X GET http://localhost:8000/api/pdf-export/pricing
```

---

## Security Considerations

1. **Webhook Signature**: Always validate webhook signature sebelum process
2. **Amount Validation**: Verify amount dari webhook cocok dengan database
3. **User Ownership**: Pastikan user hanya bisa access export request milik mereka
4. **Rate Limiting**: Implement rate limiting untuk prevent abuse
5. **HTTPS Only**: Ensure all komunikasi dengan Singapay via HTTPS
6. **Secret Management**: Keep credentials di env variables, jangan hardcode

---

## Next Steps

1. Update routes di `routes/api.php`
2. Configure Singapay credentials
3. Run migrations
4. Test endpoints
5. Configure webhook di Singapay dashboard
6. Implement frontend payment UI
