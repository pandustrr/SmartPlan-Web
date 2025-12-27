# Panduan Testing: Sistem Withdraw Affiliate

## 1. Masalah "RpNaN" - SUDAH DIPERBAIKI ✅

**Penyebab**: Frontend salah parsing response API.

- **Backend mengirim**: `{success: true, data: {balance: 285600, can_withdraw: true}}`
- **Frontend mengakses**: `response.data` (harusnya `response.data.data.balance`)

**Solusi**: Sudah diperbaiki di `AffiliateCommissions.jsx` line 35-47.

**Cara Verifikasi**:

1. Refresh halaman Affiliate Dashboard
2. Card "Siap Dicairkan" sekarang harus menampilkan **Rp 285.600**
3. Tombol "Withdraw" akan muncul karena saldo >= Rp100.000

---

## 2. Testing Integrasi SingaPay (Mode Mock)

### A. Endpoint API yang Terlibat

#### Backend Routes

```
GET  /api/affiliate/commissions/withdrawable    → Cek saldo
POST /api/affiliate/withdraw                    → Kirim request withdraw
GET  /api/affiliate/withdrawals                 → Lihat history withdraw
```

#### File Penting

- **Service**: `backend/app/Services/Singapay/SingaPayPayoutService.php`
- **Controller**: `backend/app/Http/Controllers/Affiliate/AffiliateWithdrawalController.php`
- **Model**: `backend/app/Models/Affiliate/AffiliateWithdrawal.php`

### B. Mode Mock (Default di Local)

**Konfigurasi** (`backend/.env`):

```env
SINGAPAY_MODE=mock  # atau tidak usah diset, local environment otomatis mock
```

**Cara Kerja Mock**:

- SingaPay **TIDAK** dipanggil sama sekali
- Sistem langsung mensimulasikan sukses
- Status withdrawal langsung jadi `processed`
- Saldo berkurang otomatis

### C. Langkah Testing

#### 1. Cek Saldo

```bash
# Browser Console (saat di halaman Affiliate)
# Lihat Network Tab → XHR Request ke `/api/affiliate/commissions/withdrawable`
# Response:
{
  "success": true,
  "data": {
    "balance": 285600,
    "can_withdraw": true,
    "minimum_withdrawal": 100000
  }
}
```

#### 2. Klik Tombol "Withdraw"

- Modal akan muncul
- Isi form:
  - **Jumlah**: 200000 (misalnya)
  - **Bank**: BCA
  - **No. Rekening**: 1234567890
  - **Atas Nama**: Nama Anda

#### 3. Submit Form

**Request**:

```
POST /api/affiliate/withdraw
Body: {
  "amount": 200000,
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "Supri"
}
```

**Response (Mock)**:

```json
{
  "success": true,
  "message": "Permintaan withdraw berhasil dikirim (MOCK).",
  "data": {
    "id": 1,
    "user_id": 2,
    "amount": "200000.00",
    "status": "processed",
    "singapay_reference": "MOCK-DISB-67a1b2c3d4e5f",
    "scheduled_date": "2025-12-27T19:05:00.000000Z"
  }
}
```

#### 4. Verifikasi Hasil

- **Alert** muncul: "Permintaan withdraw berhasil dikirim! Permintaan withdraw berhasil dikirim (MOCK)."
- **Saldo "Siap Dicairkan"** berkurang dari Rp285.600 → **Rp85.600**
- Buka **database** → tabel `affiliate_withdrawals`:
  ```sql
  SELECT * FROM affiliate_withdrawals ORDER BY id DESC LIMIT 1;
  ```
  Hasilnya:
  - `status`: `processed`
  - `singapay_reference`: `MOCK-DISB-xxxxx`
  - `scheduled_date`: Besok

### D. Debugging

#### Jika Saldo Masih "RpNaN"

1. Buka **Browser Console**
2. Cek error network request
3. Pastikan token auth masih valid
4. Cek response `/api/affiliate/commissions/withdrawable`

#### Jika Withdraw Gagal

1. Buka **Laravel Log**: `backend/storage/logs/laravel.log`
2. Cari error tag: `[SingaPay Payout]`
3. Pastikan migration sudah jalan:
   ```bash
   php artisan migrate:status
   ```

---

## 3. Cara Mengaktifkan Mode Production (Real SingaPay)

**PERINGATAN**: Jangan lakukan ini di local kecuali Anda sudah punya kredensial sandbox SingaPay!

### Konfigurasi `.env`

```env
SINGAPAY_MODE=live
SINGAPAY_BASE_URL=https://sandbox-payment-b2b.singapay.id
SINGAPAY_API_KEY=your_api_key_here
SINGAPAY_CLIENT_ID=your_client_id
SINGAPAY_CLIENT_SECRET=your_client_secret
SINGAPAY_ACCOUNT_ID=your_account_id
```

### Testing di Sandbox

1. Request withdrawal seperti biasa
2. Sistem akan memanggil **real API** SingaPay:
   ```
   POST https://sandbox-payment-b2b.singapay.id/api/v1.0/disbursements/{account_id}/transfer
   ```
3. Cek response di log
4. Verifikasi di **SingaPay Dashboard** (jika ada akses)

---

## 4. Notifikasi Withdraw

**Saat Ini**: Notifikasi hanya berupa `alert()` di browser.

**Rencana Upgrade** (Opsional):

- Email notification ke user saat withdraw diproses
- Push notification via Firebase
- WhatsApp notification via SingaPay webhook

**Webhook Handler** (Sudah ada di `WebhookController.php`):

- Endpoint: `/api/singapay/v1.0/callback/disbursement`
- SingaPay akan hit endpoint ini saat disbursement sukses/gagal
- Update status withdrawal otomatis

---

## 5. Checklist Testing Lengkap

- [x] Saldo "Siap Dicairkan" menampilkan angka (bukan NaN)
- [ ] Tombol "Withdraw" muncul jika saldo >= Rp100.000
- [ ] Modal form withdraw bisa dibuka
- [ ] Form validasi bekerja (min. Rp100.000, maks. sesuai saldo)
- [ ] Submit berhasil, dapat notifikasi sukses
- [ ] Saldo berkurang setelah withdraw
- [ ] Database `affiliate_withdrawals` tercatat
- [ ] Log tidak ada error

**Jika semua checklist ✅**, sistem withdraw sudah siap production!
