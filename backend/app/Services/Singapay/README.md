# 💳 SingaPay Payment Gateway Integration

**Status**: ✅ Complete | **Version**: 1.0.0 | **Mode**: Mock → Sandbox → Production

---

## 📦 Paket yang Tersedia

| Paket | Harga | Durasi | Hemat |
|-------|-------|--------|-------|
| **Bulanan** | Rp 200.000 | 30 hari | - |
| **Tahunan** | Rp 1.680.000 | 365 hari | 30% |

---

## 🎯 Fitur

- ✅ Virtual Account (BRI, BNI, DANAMON, MAYBANK)
- ✅ QRIS (Semua e-wallet & mobile banking)
- ✅ Auto-activation setelah payment
- ✅ Webhook notification
- ✅ Mock mode untuk testing

---

## 🚀 Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Set SINGAPAY_MODE=mock

# 2. Run migrations
php artisan migrate
php artisan db:seed --class=PremiumPdfSeeder

# 3. Start server
php artisan serve

# 4. Test
curl http://localhost:8000/api/payment/packages
```

---

## 📚 Dokumentasi

- **[Implementation Guide](../../DOCS/SINGAPAY_PAYMENT_IMPLEMENTATION.md)** - Dokumentasi lengkap
- **[Quick Start](../../DOCS/SINGAPAY_QUICK_START.md)** - Panduan cepat testing
- **[Files Summary](../../DOCS/SINGAPAY_FILES_SUMMARY.md)** - Summary file yang dibuat

---

## 🗂️ Struktur Folder

```
Singapay/
├── Models/
│   ├── PremiumPdf.php            # Model paket
│   ├── PdfPurchase.php           # Model pembelian
│   └── PaymentTransaction.php    # Model transaksi
│
├── Services/
│   ├── SingapayApiService.php    # API communication
│   ├── VirtualAccountService.php # VA handler
│   ├── QrisService.php           # QRIS handler
│   ├── WebhookService.php        # Webhook processor
│   └── PdfPaymentService.php     # Main orchestrator
│
└── Controllers/
    ├── PdfPaymentController.php  # Payment endpoints
    └── WebhookController.php     # Webhook receivers
```

---

## 🔧 Mode Operasi

### Mock Mode (Development)
```env
SINGAPAY_MODE=mock
```
- Tidak perlu API credentials
- Auto-approve payment
- Testing lokal

### Sandbox Mode (Testing)
```env
SINGAPAY_MODE=sandbox
SINGAPAY_PARTNER_ID=your_sandbox_id
SINGAPAY_CLIENT_ID=your_sandbox_client_id
SINGAPAY_CLIENT_SECRET=your_sandbox_secret
```
- Testing dengan API Sandbox
- Simulasi payment real

### Production Mode (Live)
```env
SINGAPAY_MODE=production
SINGAPAY_PARTNER_ID=your_production_id
SINGAPAY_CLIENT_ID=your_production_client_id
SINGAPAY_CLIENT_SECRET=your_production_secret
```
- Real payment
- Production API

---

## 🧪 Testing

### Test Purchase
```bash
curl -X POST http://localhost:8000/api/payment/purchase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 1,
    "payment_method": "virtual_account",
    "bank_code": "BRI"
  }'
```

### Test Webhook (Mock)
```bash
curl -X POST http://localhost:8000/api/webhook/singapay/test \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_code": "TRX_CODE_HERE"
  }'
```

---

## 📊 Database

- **premium_pdfs** - Paket yang tersedia
- **pdf_purchases** - Pembelian user
- **payment_transactions** - Detail transaksi
- **users** - Extended dengan field access

---

## 🔐 Security

- HMAC SHA512 signature validation
- Environment-based credentials
- Webhook authentication
- Token-based API access

---

## 📞 Support

Check logs:
```bash
tail -f storage/logs/laravel.log | grep SingaPay
```

---

**Dibuat**: 21 Januari 2025 | **Untuk**: SmartPlan Export PDF Pro
