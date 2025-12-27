# 🚀 Panduan Deployment ke Hosting (Production)

Dokumen ini berisi checklist dan konfigurasi yang HARUS diubah saat aplikasi diunggah ke hosting (Live Server).

## 1. Konfigurasi Environment (`.env`)

Di server hosting, edit file `.env` dan sesuaikan variabel berikut:

### Umum

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com
```

> **PENTING**: `APP_DEBUG=false` wajib untuk keamanan agar error tidak menampilkan detail kode ke user.

### SingaPay Payment Gateway

Ganti credential Sandbox dengan **Production/Live credential** yang didapat dari dashboard SingaPay.

```ini
# Ganti ke 'live' untuk menggunakan uang asli
SINGAPAY_MODE=live

# URL Production SingaPay (Hapus 'sandbox-' dari URL)
SINGAPAY_BASE_URL=https://payment-b2b.singapay.id

# Masukkan API Key & Credential ASLI dari Dashboard Production
SINGAPAY_API_KEY=produksi_api_key_anda_disini
SINGAPAY_CLIENT_ID=produksi_client_id_anda
SINGAPAY_CLIENT_SECRET=produksi_client_secret_anda
SINGAPAY_ACCOUNT_ID=produksi_account_id_anda
```

---

## 2. Setup Webhook di Dashboard SingaPay

Karena alamat server sudah menggunakan domain asli (bukan localhost lagi), Anda harus mengupdate URL webhook di dashboard SingaPay.

1. Login ke **SingaPay Dashboard** (Mode Live/Production).
2. Masuk menu **Settings** > **Webhook**.
3. Update/Tambah URL untuk **Disbursement**:
   ```
   https://domain-anda.com/api/webhook/singapay/disbursement
   ```
4. Pastikan domain Anda sudah menggunakan **HTTPS** (SSL aktif).

---

## 3. Frontend Build (React)

Di komputer lokal sebelum upload, atau di server jika ada akses SSH/Node.js:

1. Jalankan perintah build:
   ```bash
   npm run build
   ```
2. Upload isi folder `dist` (atau `build`) ke folder `public_html` di hosting.
3. Pastikan file `index.html` dan assets terload dengan benar.

---

## 4. Database

1. Export database dari local (localhost) jika ada data yang mau dibawa.
2. Buat database baru di hosting (MySQL).
3. Import file SQL, ATAU jalankan migrasi jika punya akses terminal (SSH):
   ```bash
   php artisan migrate --force
   ```

---

## 5. Optimasi Server (Optional tapi Recommended)

Jika Anda memiliki akses terminal (SSH) di hosting:

```bash
# Cache konfigurasi agar lebih cepat
php artisan config:cache

# Cache route
php artisan route:cache

# Cache view
php artisan view:cache
```

Jika tidak punya akses SSH (Shared Hosting biasa), Anda bisa buat route khusus di `web.php` untuk menjalankan command ini sekali saja, lalu hapus routenya.

```php
// Contoh route sementara untuk clear cache di shared hosting
Route::get('/clear-cache', function() {
    Artisan::call('optimize:clear');
    return "Cache cleared";
});
```

---

## ✅ Checklist Final Sebelum Launch

- [ ] `.env` sudah `APP_ENV=production` & `APP_DEBUG=false`
- [ ] Credential SingaPay di `.env` sudah pakai yang **LIVE** (bukan sandbox)
- [ ] Saldo Merchant SingaPay sudah diisi (Top Up) untuk bisa proses withdraw
- [ ] Webhook URL sudah diset ke domain asli (https)
- [ ] Email server (SMTP) sudah disetting agar notifikasi jalan (jika ada)

---

## 6. Spesial: Tips Deployment di Plesk (Exabytes)

Karena Anda menggunakan **Exabytes Plesk**, berikut tips khususnya:

### A. Struktur Folder

Plesk biasanya punya folder `httpdocs`. Jangan upload codingan rahasia (backend) langsung ke situ semua.

1. Buat folder baru sejajar dengan `httpdocs`, misal `smartplan_backend`.
2. Upload semua isi folder `backend` ke situ.
3. Upload hasil build frontend (`dist` folder) ke dalam `httpdocs`.

### B. Setting Document Root (Penting!)

Laravel butuh document root mengarah ke folder `public`.

1. Di Dashboard Plesk, masuk ke **Hosting Settings**.
2. Ubah **Document Root** dari `httpdocs` menjadi `smartplan_backend/public` (Jika Anda mau menyatukan frontend & backend di satu domain)
   **ATAU**
   Jika Frontend dan Backend dipisah (misal backend di subdomain `api.domain.com`):
   - Domain `api.domain.com` -> Document Root: `smartplan_backend/public`
   - Domain `domain.com` -> Upload isi `frontend/dist` ke folder `httpdocs`.

### C. Permissions

Pastikan folder `storage` dan `bootstrap/cache` di backend memiliki permission write (775 atau 777).

- Di File Manager Plesk, klik kanan folder tersebut > **Change Permissions**.

### D. Windows vs Linux

Jika hosting Anda **Windows** (IIS):

- Saya sudah buatkan file `web.config` di folder `public`. Pastikan file itu ikut terupload.
- Jika hosting Anda **Linux**, file `.htaccess` yang akan bekerja.

### E. Node.js

Di shared hosting, biasanya kita **TIDAK** menjalankan `npm start` atau `npm run dev`.

- **Cara Benar**: Jalankan `npm run build` di laptop Anda.
- Upload **hanya** folder `dist` (hasil build) ke hosting.
