# 🧪 Quick Start - Testing SingaPay Payment di Local (Frontend + Backend)

## ✅ Prerequisites

- Backend Laravel sudah running di `http://localhost:8000`
- Frontend React sudah running di `http://localhost:5173`
- Database sudah di-migrate
- User sudah bisa login

---

## 🚀 Setup Backend (5 menit)

```bash
cd backend

# Copy environment example
cp .env.example .env

# Edit .env - set mode mock untuk testing
SINGAPAY_MODE=mock
```

### 2️⃣ Run Migration & Seeder (1 menit)

```bash
# Run migrations
php artisan migrate

# Seed packages
php artisan db:seed --class=PremiumPdfSeeder
```

### 3️⃣ Start Server

```bash
php artisan serve
```

### 4️⃣ Test Endpoints

#### A. Get Packages

```bash
curl http://localhost:8000/api/payment/packages
```

Expected response:
```json
{
  "success": true,
  "packages": [
    {
      "id": 1,
      "package_type": "monthly",
      "name": "Paket Bulanan Export PDF Pro",
      "price": 200000,
      "formatted_price": "Rp 200.000",
      "duration_days": 30
    },
    {
      "id": 2,
      "package_type": "yearly",
      "name": "Paket Tahunan Export PDF Pro",
      "price": 1680000,
      "formatted_price": "Rp 1.680.000",
      "duration_days": 365
    }
  ]
}
```

#### B. Create Purchase (perlu authentication)

```bash
# Login dulu untuk dapatkan token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "08123456789",
    "password": "password123"
  }'

# Simpan token dari response

# Create purchase dengan VA
curl -X POST http://localhost:8000/api/payment/purchase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 1,
    "payment_method": "virtual_account",
    "bank_code": "BRI"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "purchase": {
    "id": 1,
    "transaction_code": "TRX20250121123456ABC",
    "package_type": "monthly",
    "amount": 200000,
    "status": "pending"
  },
  "payment": {
    "transaction_id": 1,
    "bank_code": "BRI",
    "bank_name": "Bank Rakyat Indonesia",
    "va_number": "88810123456789",
    "amount": 200000,
    "formatted_amount": "Rp 200.000",
    "expired_at": "2025-01-22T12:34:56",
    "payment_instructions": {...}
  }
}
```

#### C. Simulate Payment (Mock Webhook)

```bash
# Tunggu beberapa detik, lalu trigger webhook
curl -X POST http://localhost:8000/api/webhook/singapay/test \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_code": "TRX20250121123456ABC"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "transaction_id": 1,
    "purchase_id": 1,
    "expires_at": "2025-02-20T12:34:56"
  }
}
```

#### D. Check Payment Status

```bash
curl http://localhost:8000/api/payment/status/TRX20250121123456ABC \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "status": "paid",
  "paid": true,
  "paid_at": "2025-01-21T12:45:00",
  "expires_at": "2025-02-20T12:45:00"
}
```

#### E. Check Access

```bash
curl http://localhost:8000/api/payment/check-access \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "has_access": true,
  "access_info": {
    "package": "monthly",
    "expires_at": "2025-02-20T12:45:00",
    "expires_at_formatted": "20 Feb 2025"
  }
}
```

---

## ✅ Checklist Testing

- [ ] Packages dapat ditampilkan
- [ ] Purchase VA berhasil dibuat
- [ ] VA number di-generate
- [ ] Mock webhook berhasil
- [ ] Status berubah jadi "paid"
- [ ] User access aktif
- [ ] Expires date ter-set dengan benar

---

## 📱 Testing dengan QRIS

```bash
curl -X POST http://localhost:8000/api/payment/purchase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 1,
    "payment_method": "qris"
  }'
```

Response akan include:
- `qris_content`: Base64 encoded QR image
- `qris_url`: URL to QR image
- `qris_string`: QRIS string untuk scan

---

## 🔧 Troubleshooting

### Error: Table not found
```bash
php artisan migrate:fresh --seed
```

### Error: Package not found
```bash
php artisan db:seed --class=PremiumPdfSeeder
```

### Token expired
```bash
# Login ulang untuk dapatkan token baru
curl -X POST http://localhost:8000/api/login ...
```

### Webhook tidak berhasil
Check log:
```bash
tail -f storage/logs/laravel.log
```

---

## 🎯 Next: Sandbox Mode

Setelah mock mode berhasil, switch ke sandbox:

1. Daftar akun sandbox di SingaPay
2. Dapatkan credentials (partner_id, client_id, dll)
3. Update `.env`:
   ```env
   SINGAPAY_MODE=sandbox
   SINGAPAY_PARTNER_ID=your_real_sandbox_id
   SINGAPAY_CLIENT_ID=your_real_sandbox_client_id
   SINGAPAY_CLIENT_SECRET=your_real_sandbox_secret
   ```
4. Test dengan API sandbox SingaPay

---

## 📚 Full Documentation

Lihat dokumentasi lengkap: `DOCS/SINGAPAY_PAYMENT_IMPLEMENTATION.md`

---

**Happy Testing! 🎉**
