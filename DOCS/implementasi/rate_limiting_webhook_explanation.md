# Penjelasan Fitur Baru: Rate Limiting & Webhook Handler

## 1. ✅ Rate Limiting (Sudah Diimplementasikan)

### **Apa itu Rate Limiting?**

Batasan jumlah request withdraw yang bisa dilakukan user dalam periode waktu tertentu.

### **Kenapa Perlu?**

- **Cegah Abuse**: User tidak bisa spam withdraw berkali-kali
- **Keamanan**: Melindungi dari bot/script otomatis
- **Biaya SingaPay**: Setiap transaksi ada fee, limiting menghemat biaya

### **Implementasi:**

- **Limit**: Maksimal **5x withdraw per hari** (24 jam terakhir)
- **Pesan Error**: "Anda telah mencapai batas maksimal penarikan (5x per hari). Silakan coba lagi besok."
- **HTTP Status**: 429 (Too Many Requests)

### **Lokasi Kode:**

`backend/app/Http/Controllers/Affiliate/AffiliateWithdrawalController.php` (line 47-59)

---

## 2. ✅ Webhook Handler (Sudah Diimplementasikan)

### **Apa itu Webhook?**

Notifikasi otomatis dari SingaPay ke server Anda ketika ada event penting (misalnya: withdraw sukses/gagal).

### **Kenapa Perlu Webhook?**

#### **TANPA Webhook (Manual/Polling):**

```
User klik withdraw → Status: "pending"
  ↓ (tunggu 1-2 hari)
Admin cek manual di SingaPay dashboard → "Oh sudah sukses!"
  ↓
Admin update status di database manual → Status: "processed"
```

❌ Ribet, lambat, manual work

#### **DENGAN Webhook (Otomatis):**

```
User klik withdraw → Status: "pending"
  ↓ (tunggu 1-2 hari)
SingaPay transfer selesai
  ↓
SingaPay kirim webhook ke server SmartPlan
  ↓
Server auto-update status → Status: "processed"
  ↓
User lihat status terbaru (refresh)
```

✅ Otomatis, real-time, zero manual work!

### **Webhook URL:**

```
https://yourdomain.com/api/webhook/singapay/disbursement
```

**PENTING:** URL ini harus:

- Menggunakan **HTTPS** (bukan HTTP)
- Terdaftar di **SingaPay Dashboard** (bagian Webhook Settings)
- Bisa diakses dari internet (tidak boleh localhost di production)

### **Payload yang Dikirim SingaPay:**

```json
{
  "status": 200,
  "success": true,
  "data": {
    "transaction_id": "1512220251105174015668",
    "reference_number": "REF-123-1703593200",
    "status": "success", // atau "failed"
    "bank": {
      "code": "BCA",
      "account_name": "Supri",
      "account_number": "1234567890"
    },
    "amount": 200000,
    "processed_at": "2025-12-26T19:30:00+07:00"
  }
}
```

### **Implementasi:**

- **Controller**: `WebhookController.php` → method `handleDisbursement()`
- **Service**: `WebhookService.php` → method `processDisbursementWebhook()`
- **Route**: `POST /api/webhook/singapay/disbursement`

### **Flow:**

1. SingaPay mengirim POST request ke webhook URL
2. `WebhookController::handleDisbursement()` menerima request
3. Log payload untuk audit
4. `WebhookService::processDisbursementWebhook()` memproses:
   - Cari `AffiliateWithdrawal` berdasarkan `reference_number`
   - Update status: `success` → `processed`, `failed` → `failed`
   - Simpan webhook data ke `singapay_response` (JSON)
5. Return HTTP 200 ke SingaPay (konfirmasi received)

---

## 3. ❓ Bank yang Didukung

### **Apakah User Bisa Withdraw ke Semua Bank?**

**TERGANTUNG pada SingaPay**. SingaPay mendukung disbursement ke bank-bank berikut:

#### **Bank yang Umum Didukung:**

- ✅ BCA (Bank Central Asia)
- ✅ Mandiri
- ✅ BNI (Bank Negara Indonesia)
- ✅ BRI (Bank Rakyat Indonesia)
- ✅ CIMB Niaga
- ✅ Permata Bank
- ✅ Danamon
- ✅ Maybank
- ✅ BII (Bank Internasional Indonesia)
- ✅ Panin Bank
- ✅ Bank Syariah Indonesia (BSI)
- ✅ BTN (Bank Tabungan Negara)

#### **E-Wallet yang Mungkin Didukung:**

- GoPay
- OVO
- Dana
- LinkAja

**CARA MEMASTIKAN:**

1. Login ke **SingaPay Dashboard**
2. Buka menu **Disbursement** atau **Transfer**
3. Lihat daftar bank/metode yang tersedia
4. Atau tanya langsung ke **support SingaPay**

### **Penting:**

- User harus input **kode bank** yang tepat (misalnya `BCA`, `MANDIRI`, `BNI`)
- Jika bank tidak didukung, SingaPay akan return error
- **Solusi**: Buat dropdown di frontend dengan daftar bank yang didukung (jangan free text)

---

## 📋 Checklist Deployment

### **Sebelum Go Live:**

- [ ] Daftar webhook URL di SingaPay Dashboard
- [ ] Test webhook dengan tool seperti **webhook.site** atau **ngrok**
- [ ] Pastikan SSL certificate aktif (HTTPS)
- [ ] Verifikasi daftar bank yang didukung SingaPay
- [ ] Buat dropdown bank di frontend (jangan free text)
- [ ] Test dengan withdrawal kecil (Rp50.000)
- [ ] Monitor log untuk memastikan webhook diterima

---

## 🔍 Cara Test Webhook di Local

### **Menggunakan ngrok (Recommended):**

```bash
# Install ngrok
# Download dari https://ngrok.com/

# Jalankan ngrok
ngrok http 8000

# Ngrok akan memberikan URL publik, contoh:
# https://abc123.ngrok.io

# Daftar URL webhook di SingaPay:
# https://abc123.ngrok.io/api/webhook/singapay/disbursement
```

### **Test Manual dengan cURL:**

```bash
curl -X POST https://yourdomain.com/api/webhook/singapay/disbursement \
  -H "Content-Type: application/json" \
  -H "X-Signature: test_signature" \
  -H "X-Timestamp: 2025-12-26T19:30:00+07:00" \
  -d '{
    "status": 200,
    "success": true,
    "data": {
      "reference_number": "REF-1-1703593200",
      "status": "success",
      "transaction_id": "12345"
    }
  }'
```

---

## 🎯 Kesimpulan

1. **Rate Limiting**: ✅ User max 5x withdraw per hari
2. **Webhook Handler**: ✅ Status withdrawal auto-update dari SingaPay
3. **Bank Support**: Tergantung SingaPay, umumnya BCA/Mandiri/BNI/BRI pasti support
4. **Next Step**: Daftar webhook URL di SingaPay Dashboard saat deploy
