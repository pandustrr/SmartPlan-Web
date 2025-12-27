# Panduan Implementasi: Sistem Penarikan Afiliasi

Kami telah berhasil mengimplementasikan Sistem Penarikan Afiliasi dengan integrasi SingaPay (Dukungan Mock untuk pengembangan lokal).

## Fitur yang Diimplementasikan

### 1. Model Penarikan Afiliasi (`AffiliateWithdrawal`)

- Menyimpan permintaan penarikan dengan pelacakan status (`pending`, `processed`, `failed`).
- Mencatat detail bank (`bank_name`, `account_number`, `account_name`).
- Terintegrasi dengan ID referensi SingaPay.

### 2. Layanan Pembayaran SingaPay (`SingaPayPayoutService`)

- Menangani permintaan pencairan dana aktual ke SingaPay.
- **Mode Mock**: Secara otomatis diaktifkan di lingkungan lokal. Mensimulasikan pembayaran yang berhasil dengan tanggal terjadwal (besok).

### 3. Pembaruan Logika Backend

- **`AffiliateCommissionService`**: Menambahkan logika `getWithdrawableBalance` (Total Komisi Disetujui - Total Penarikan).
- **`AffiliateWithdrawalController`**: Endpoint untuk meminta penarikan dan melihat riwayat.

### 4. UI Frontend (`AffiliateCommissions.jsx`)

- **Statistik Penarikan**: Menampilkan "Total Pendapatan", "Siap Dicairkan", "Total Dibayar".
- **Tombol Withdraw**: Aktif ketika saldo >= Rp100.000 (minimum penarikan).
- **Modal Penarikan**: Formulir untuk memasukkan jumlah dan detail bank.
- **Riwayat**: Menampilkan riwayat komisi.

## Cara Menguji (Lingkungan Lokal)

1.  **Login** sebagai pengguna yang memiliki komisi afiliasi.
2.  Buka **Dashboard Afiliasi**.
3.  Periksa kartu **"Siap Dicairkan"**.
    - Jika saldo < Rp100.000, tombol disembunyikan/dinonaktifkan.
    - Jika saldo >= Rp100.000, klik **"Withdraw"**.
4.  Isi **Formulir Penarikan** (Bank, Nomor Rekening, dll.).
5.  Klik **"Kirim Permintaan"**.
6.  **Hasil**:
    - Anda akan melihat notifikasi sukses.
    - Saldo "Siap Dicairkan" akan berkurang.
    - Status penarikan akan ditandai sebagai `processed` (Logika Mock).

## Tangkapan Layar

_(Tempat untuk tangkapan layar jika tersedia)_
