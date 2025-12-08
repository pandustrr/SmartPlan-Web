# 🚀 Singapay B2B PDF Export Pro - QUICK START GUIDE

## Dalam 5 Menit

### 1. Dapatkan Kredensial Singapay
```
Hubungi: Singapay B2B Sales
Dapatkan:
- Partner ID
- Client ID
- Client Secret
- Webhook Secret
- Merchant Account ID
- Sandbox URL (jika beda dari default)
```

### 2. Update .env
```bash
SINGAPAY_ENV=sandbox
SINGAPAY_PARTNER_ID=xxx_dari_singapay
SINGAPAY_CLIENT_ID=xxx_dari_singapay
SINGAPAY_CLIENT_SECRET=xxx_dari_singapay
SINGAPAY_WEBHOOK_SECRET=xxx_dari_singapay
SINGAPAY_MERCHANT_ACCOUNT_ID=xxx_dari_singapay
SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay/payment-settlement
```

### 3. Run Migrations
```bash
php artisan migrate
```

### 4. Add Routes (routes/api.php)
```php
use App\Http\Controllers\PDFExportProController;
use App\Http\Controllers\SingapayWebhookController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('pdf-export')->group(function () {
        Route::post('/create-request', [PDFExportProController::class, 'createExportRequest']);
        Route::post('/payment-options', [PDFExportProController::class, 'generatePaymentOptions']);
        Route::get('/payment-status/{export_request_id}', [PDFExportProController::class, 'checkPaymentStatus']);
        Route::get('/download/{export_request_id}', [PDFExportProController::class, 'downloadPDF']);
        Route::get('/history', [PDFExportProController::class, 'getExportHistory']);
    });
    Route::get('/pdf-export/pricing', [PDFExportProController::class, 'getPackagePricing']);
});

Route::post('/webhooks/singapay/payment-settlement', [SingapayWebhookController::class, 'handlePaymentSettlement'])->withoutMiddleware('verify_csrf_token');
```

### 5. Register Webhook (Singapay Dashboard)
```
URL: https://yourdomain.com/api/webhooks/singapay/payment-settlement
Secret: Copy dari SINGAPAY_WEBHOOK_SECRET
Events: Settlement Success, Failed, VA Filled, QRIS Paid, Payment Link Paid
```

### ✅ DONE! Ready to test!

---

## API Usage Examples

### Create Export & Get Virtual Account
```bash
curl -X POST http://localhost:8000/api/pdf-export/create-request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "business_plan",
    "business_id": 1,
    "package": "professional"
  }'

# Response:
{
  "status": "success",
  "data": {
    "export_request_id": 1,
    "va_number": "198271982719827",
    "bank": "BRI",
    "amount": 50000,
    "instructions": "Transfer ke 198271982719827 sebesar Rp 50.000"
  }
}
```

### Check Payment Status
```bash
curl -X GET http://localhost:8000/api/pdf-export/payment-status/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "status": "success",
  "data": {
    "payment_status": "completed",
    "amount": 50000,
    "paid_at": "2024-01-15T10:00:00",
    "pdf_download_url": "https://yourdomain.com/api/pdf-export/download-file/1"
  }
}
```

### Get Pricing
```bash
curl -X GET http://localhost:8000/api/pdf-export/pricing

# Response:
{
  "status": "success",
  "data": {
    "professional": {
      "name": "Professional",
      "price": 50000,
      "features": ["No watermark", "Premium formatting", ...]
    }
  }
}
```

---

## Payment Flow Diagram

```
User
  ↓
[1] Frontend: POST /pdf-export/create-request
  ↓
Backend: Create PDFExportRequest, Generate VA via Singapay
  ↓
[2] Frontend: Show VA Number to User
  ↓
User: Transfer money to VA
  ↓
[3] Singapay: Detects payment settlement
  ↓
Singapay: POST /webhooks/singapay/payment-settlement
  ↓
Backend: Validate signature, Update export status → COMPLETED
  ↓
[4] Frontend: GET /pdf-export/payment-status/{id} (polling atau webhook)
  ↓
Frontend: Show "Payment Complete" → Download link
  ↓
[5] User: Click download → GET /pdf-export/download/{id}
  ↓
Backend: Return PDF file
  ↓
User: Download PDF
```

---

## Database Overview

### pdf_export_requests table
- Stores export requests with payment details
- Tracks Virtual Account, QRIS, Payment Link info
- Status: pending_payment → completed/failed
- Includes PDF storage paths

### singapay_payments table
- Tracks all payment transactions
- Stores webhook responses
- Payment status history
- Reference tracking

---

## File Structure

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── PDFExportProController.php      # Main export controller
│   │   └── SingapayWebhookController.php   # Webhook handler
│   └── Models/
│       ├── PDFExportRequest.php            # Export model
│       └── SingapayPayment.php             # Payment model
├── config/
│   └── singapay.php                        # Configuration
├── database/
│   └── migrations/
│       ├── create_pdf_export_requests_table.php
│       └── create_singapay_payments_table.php
└── routes/
    └── api.php                             # Add routes here

DOCS/
├── SINGAPAY_PDF_EXPORT_PRO_ROUTES.md
├── SINGAPAY_PDF_EXPORT_ROUTES_CONFIG.php
├── SINGAPAY_PDF_EXPORT_IMPLEMENTATION_CHECKLIST.md
└── SINGAPAY_PDF_EXPORT_QUICK_START.md     # This file
```

---

## Environment Variables Reference

### Required (Replace with Singapay credentials)
- `SINGAPAY_PARTNER_ID` - Partner ID from Singapay
- `SINGAPAY_CLIENT_ID` - OAuth Client ID
- `SINGAPAY_CLIENT_SECRET` - OAuth Client Secret
- `SINGAPAY_WEBHOOK_SECRET` - Webhook validation secret
- `SINGAPAY_MERCHANT_ACCOUNT_ID` - For VA generation

### URLs
- `SINGAPAY_SANDBOX_URL` - Sandbox API endpoint
- `SINGAPAY_PRODUCTION_URL` - Production API endpoint
- `SINGAPAY_WEBHOOK_URL` - Your webhook endpoint

### Environment
- `SINGAPAY_ENV` - Set to 'sandbox' or 'production'

---

## Testing Checklist

### ✅ Sandbox Testing
- [ ] Create export request
- [ ] Virtual Account generated
- [ ] Can see VA number
- [ ] Simulate payment (Singapay sandbox)
- [ ] Webhook received & processed
- [ ] Export status updated to COMPLETED
- [ ] PDF download available

### ✅ Production Ready
- [ ] All credentials configured
- [ ] HTTPS enabled
- [ ] Webhook registered in Singapay
- [ ] Email notifications setup
- [ ] Payment monitoring in place
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] Backup strategy ready

---

## Troubleshooting

### Payment not updating
```bash
# Check webhook logs
tail -f storage/logs/laravel-*.log | grep webhook

# Verify endpoint is accessible
curl -X POST https://yourdomain.com/api/webhooks/singapay/payment-settlement \
  -H "X-Singapay-Signature: test" \
  -d '{"test":"data"}'

# Should return valid response (not 404)
```

### Virtual Account not created
```bash
# Check Singapay credentials
php artisan tinker
> config('services.singapay')

# Check service logs
tail -f storage/logs/laravel-*.log | grep singapay
```

### Webhook signature invalid
```bash
# Verify webhook secret matches
# In .env: SINGAPAY_WEBHOOK_SECRET
# In Singapay dashboard: webhook secret

# They must be identical!
```

---

## Support & Resources

### Documentation Files
1. `SINGAPAY_PDF_EXPORT_PRO_ROUTES.md` - Complete API reference
2. `SINGAPAY_PDF_EXPORT_IMPLEMENTATION_CHECKLIST.md` - Full implementation guide
3. `SingapayPDFExportService.php` - Service implementation details

### Singapay Resources
- [Singapay B2B Documentation](https://docs.singapay.id)
- [Payment Methods](https://docs.singapay.id/payment-methods)
- [Webhook Guide](https://docs.singapay.id/webhooks)
- [API Reference](https://docs.singapay.id/api)

### Error Codes
- `401` - Invalid credentials
- `403` - Unauthorized access
- `404` - Resource not found
- `422` - Invalid input data
- `500` - Server error

---

## Next Steps

1. ✅ Get Singapay credentials
2. ✅ Update .env file
3. ✅ Run migrations
4. ✅ Add routes
5. ✅ Register webhook in Singapay
6. ✅ Test payment flow
7. ⏳ Implement frontend UI
8. ⏳ Setup email notifications
9. ⏳ Configure monitoring & alerts
10. ⏳ Go to production!

---

## Quick Reference Commands

```bash
# Check configuration
php artisan tinker
> config('services.singapay')

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear

# View logs
tail -f storage/logs/laravel-*.log

# Test API
curl -X GET http://localhost:8000/api/pdf-export/pricing

# Database check
php artisan tinker
> PDFExportRequest::count()
> SingapayPayment::count()
```

---

**Created**: 2024
**Version**: 1.0
**Status**: Ready to Deploy ✅

For detailed information, refer to other documentation files.
