# Payment Return URL Implementation

## Overview
Implementasi return URL untuk redirect user kembali ke website Grapadi Strategix setelah pembayaran berhasil melalui Singapay (QRIS atau Virtual Account).

## Flow Pembayaran

```
1. User pilih paket di /pricing
   ↓
2. Klik "Beli Sekarang" → Redirect ke Payment Link Singapay
   ↓
3. User bayar via QRIS/VA di Singapay
   ↓
4. Setelah payment sukses → Singapay redirect ke:
   https://grapadistrategix.com/payment/success?transaction_code=PDF-xxxxx
   ↓
5. Frontend cek status payment via API
   ↓
6. Tampilkan status:
   - ✅ Success → Auto redirect ke dashboard (5 detik)
   - ⏳ Pending → Tunggu konfirmasi
   - ❌ Failed → Tombol coba lagi
```

## Perubahan yang Dibuat

### 1. Backend - PdfPaymentService.php
**File**: `backend/app/Services/Singapay/PdfPaymentService.php`

**Perubahan**:
- Tambahkan parameter `return_url` ke payment link creation
- URL format: `{FRONTEND_URL}/payment/success?transaction_code={transaction_code}`
- Menggunakan config `app.frontend_url` dari `.env`

```php
// Generate return URL untuk redirect setelah pembayaran sukses
$frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
$returnUrl = $frontendUrl . '/payment/success?transaction_code=' . $purchase->transaction_code;

$paymentLinkData = [
    // ... data lainnya
    'return_url' => $returnUrl, // URL redirect setelah payment sukses
];
```

### 2. Frontend - PaymentSuccess.jsx
**File**: `frontend/src/pages/PaymentSuccess.jsx`

**Fitur**:
- Auto-check payment status setiap 3 detik untuk pending payments
- Countdown 5 detik untuk auto-redirect ke dashboard setelah sukses
- Tampilan responsive untuk mobile & desktop
- Dark mode support
- Status indicators:
  - ✅ **Success**: Hijau dengan checkmark, auto redirect
  - ⏳ **Pending**: Kuning dengan clock icon, polling status
  - ❌ **Failed**: Merah dengan X icon, tombol coba lagi
  - 🔄 **Checking**: Loading spinner

**Props**:
- `isDarkMode`: Boolean untuk dark mode support

### 3. Frontend - App.jsx
**File**: `frontend/src/App.jsx`

**Perubahan**:
- Import `PaymentSuccess` component
- Tambahkan route `/payment/success` (public route, bisa diakses authenticated/non-authenticated)

```jsx
<Route path="/payment/success" element={<PaymentSuccess isDarkMode={isDarkMode} />} />
```

## Environment Variables

### Development (Local)
Pastikan `.env` backend memiliki:

```env
# Frontend URL untuk return URL (Local Development)
FRONTEND_URL=http://localhost:5173
# atau
APP_FRONTEND_URL=http://localhost:5173
```

### Production (Hosting)
Untuk deployment di subdirectory seperti `https://grapadikonsultan.co.id/grapadistrategix/`:

```env
# Frontend URL untuk return URL (Production)
FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix
# atau
APP_FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix

# Pastikan TIDAK ada trailing slash (/)
# ❌ SALAH: https://grapadikonsultan.co.id/grapadistrategix/
# ✅ BENAR: https://grapadikonsultan.co.id/grapadistrategix
```

**Contoh Return URL yang akan digenerate:**
```
https://grapadikonsultan.co.id/grapadistrategix/payment/success?transaction_code=PDF-1234567890
```

## API Endpoint yang Digunakan

**Payment Status Check**:
```
GET /api/singapay/payment/status/{transaction_code}
```

**Response Success**:
```json
{
  "success": true,
  "status": "paid",
  "paid": true,
  "paid_at": "2026-01-02T10:30:00.000000Z",
  "expires_at": "2027-01-02T10:30:00.000000Z"
}
```

**Response Pending**:
```json
{
  "success": true,
  "status": "pending",
  "paid": false
}
```

## Testing Flow

### Local Development
1. Set `FRONTEND_URL=http://localhost:5173` di `.env`
2. User beli paket → Redirect ke Singapay mock
3. Setelah "payment" → Redirect ke `http://localhost:5173/payment/success?transaction_code=PDF-xxxxx`
4. Frontend polling status hingga paid
5. Auto redirect ke dashboard

### Production
1. Set `FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix` di `.env` backend
2. Restart backend service (php artisan config:cache)
3. Singapay real payment link
4. User bayar via QRIS/VA
5. Singapay webhook update status → Backend
6. Singapay redirect user → Frontend success page (`/grapadistrategix/payment/success`)
7. Frontend confirm status → Redirect dashboard

## Catatan Penting

### Webhook vs Return URL
- **Webhook**: Backend mendapat notifikasi real-time dari Singapay (untuk update database)
- **Return URL**: User di-redirect kembali ke website (untuk user experience)

Keduanya bekerja **independent**:
- Webhook bisa sampai **sebelum** user di-redirect (fast payment)
- Return URL bisa sampai **sebelum** webhook (slow network)
- Frontend **harus** polling status untuk memastikan data terkini

### Handling Edge Cases
1. **User tutup browser sebelum redirect**: Status tetap update via webhook
2. **User langsung ke dashboard tanpa klik link**: Status sudah paid via webhook
3. **Transaction code invalid**: Error handling dengan toast notification
4. **Network timeout**: Retry logic dengan 3 detik interval

## User Experience

### Success Flow
```
Singapay Payment Success
    ↓ (auto redirect)
PaymentSuccess Page
    ↓ (polling 3s)
Status: PAID ✅
    ↓ (countdown 5s)
Dashboard (PDF Pro Active)
```

### Pending Flow
```
Singapay Payment Initiated
    ↓ (manual redirect)
PaymentSuccess Page
    ↓ (polling 3s)
Status: PENDING ⏳
    ↓ (user wait)
User complete payment
    ↓ (webhook arrive)
Status: PAID ✅
    ↓ (countdown 5s)
Dashboard
```

### Failed Flow
```
Singapay Payment Cancelled
    ↓ (redirect/timeout)
PaymentSuccess Page
    ↓ (check status)
Status: FAILED ❌
    ↓ (user action)
[Coba Lagi] → /pricing
[Dashboard] → /dashboard
```

## Mobile Responsiveness

Halaman `PaymentSuccess` sudah responsive:
- Padding & spacing adaptif (px-4, py-12)
- Font sizes responsive (text-3xl md:text-4xl)
- Button layout flex-col sm:flex-row
- Dark mode fully supported
- Card max-width 2xl untuk desktop

## Maintenance

### Jika Return URL Berubah
1. Update `FRONTEND_URL` di `.env` backend
2. Restart backend service
3. Payment links baru akan gunakan URL terbaru

### Jika Perlu Custom Success Page per Package
Edit `PdfPaymentService.php`:
```php
$returnUrl = $frontendUrl . '/payment/success?transaction_code=' . $purchase->transaction_code . '&package=' . $purchase->package_type;
```

Lalu di `PaymentSuccess.jsx` handle parameter `package`.

## Support

Jika ada masalah dengan return URL atau payment flow:
1. Check `.env` FRONTEND_URL sudah benar
2. Check Singapay dashboard logs
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console untuk frontend errors
5. Test payment status API endpoint langsung

---

**Last Updated**: January 2, 2026
**Version**: 1.0.0
**Author**: Pandu (branch-pandu)

---

## Production Deployment Checklist

### Backend Setup (.env)
```env
# ✅ Set production frontend URL dengan subdirectory
FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix

# ✅ Set Singapay mode ke production
SINGAPAY_MODE=production

# ✅ Set Singapay credentials
SINGAPAY_PARTNER_ID=your_partner_id
SINGAPAY_CLIENT_ID=your_client_id
SINGAPAY_CLIENT_SECRET=your_client_secret
SINGAPAY_MERCHANT_ACCOUNT_ID=your_account_id
```

### Setelah Update .env
```bash
# Clear config cache
php artisan config:cache

# Restart queue workers (jika menggunakan queue)
php artisan queue:restart
```

### Frontend Setup
Pastikan frontend di-build dengan base URL yang benar:

**vite.config.js**:
```javascript
export default defineConfig({
  base: '/grapadistrategix/', // Subdirectory path
  // ... config lainnya
});
```

**Build command**:
```bash
npm run build
```

### Testing Production Return URL

1. **Test Payment Link Creation**:
   ```bash
   # Check logs untuk melihat return_url yang digenerate
   tail -f storage/logs/laravel.log | grep return_url
   ```

2. **Expected Return URL**:
   ```
   https://grapadikonsultan.co.id/grapadistrategix/payment/success?transaction_code=PDF-xxxxx
   ```

3. **Test Full Flow**:
   - Login ke dashboard production
   - Pilih paket di /pricing
   - Klik "Beli Sekarang"
   - Check redirect ke Singapay payment link
   - Setelah payment → Check redirect kembali ke website
   - Verify auto-redirect ke dashboard

### Common Issues & Solutions

#### Issue: Double Slash in URL
**Symptom**: URL jadi `https://domain.com//payment/success`
**Solution**: Pastikan `FRONTEND_URL` TIDAK ada trailing slash

```env
# ❌ SALAH
FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix/

# ✅ BENAR
FRONTEND_URL=https://grapadikonsultan.co.id/grapadistrategix
```

#### Issue: 404 Not Found setelah redirect
**Symptom**: Payment success page tidak ditemukan
**Solution**: 
1. Check frontend base URL di `vite.config.js`
2. Pastikan `.htaccess` atau nginx config support client-side routing
3. Rebuild frontend dengan base path yang benar

#### Issue: Return URL tidak bekerja
**Symptom**: User tidak di-redirect setelah payment
**Solution**:
1. Check Singapay dashboard apakah return_url diterima
2. Check browser console untuk CORS error
3. Verify `FRONTEND_URL` di backend `.env` sudah benar
4. Clear config cache: `php artisan config:cache`

### Verification Steps

✅ **Backend**:
```bash
# Check config value
php artisan tinker
>>> config('app.frontend_url')
=> "https://grapadikonsultan.co.id/grapadistrategix"
```

✅ **Frontend**:
- Access: `https://grapadikonsultan.co.id/grapadistrategix/payment/success?transaction_code=TEST`
- Should load PaymentSuccess page (even if transaction not found)

✅ **End-to-End**:
- Complete real payment flow
- Verify redirect works correctly
- Check dashboard shows Pro access activated

