# Implementasi Sistem Withdraw Affiliate SingaPay

Sistem ini memungkinkan user affiliate untuk menarik komisi mereka. Penarikan akan diproses melalui SingaPay (Disbursement) atau disimulasikan (Mock) di environment local.

## User Review Required

> [!IMPORTANT] > **SingaPay Disbursement API**: Saya perlu memastikan apakah dokumen panduan SingaPay mencakup API untuk "Transfer Dana" atau "Disbursement". Jika tidak, kita mungkin perlu melakukan simulasi penuh atau menggunakan "Manual Transfer" flow di mana sistem hanya mencatat request withdraw, dan admin yang melakukan transfer manual.
> _Berdasarkan request user, user berasumsi SingaPay bisa melakukannya. Saya akan mengecek dokumen._

## Proposed Changes

### Backend (Laravel)

#### [NEW] [AffiliateWithdrawal.php](file:///e:/Pandu-Projek/Freelance/SmartPlan-Web/backend/app/Models/Affiliate/AffiliateWithdrawal.php)

- Model untuk mencatat riwayat penarikan.
- Fields: `user_id`, `amount`, `status` (pending, processed, failed), `bank_details`, `singapay_reference`, `scheduled_date`.

#### [NEW] [SingaPayPayoutService.php](file:///e:/Pandu-Projek/Freelance/SmartPlan-Web/backend/app/Services/Singapay/SingaPayPayoutService.php)

- Service untuk menangani request payout.
- **Mock Feature**: Jika `APP_ENV=local`, service ini hanya akan mensimulasikan sukses dan mengembalikan tanggal estimasi dummy tanpa memanggil API SingaPay asli.

#### [MODIFY] [AffiliateCommissionService.php](file:///e:/Pandu-Projek/Freelance/SmartPlan-Web/backend/app/Services/AffiliateCommissionService.php)

- Tambahkan method `withdraw($userId, $amount)`.
- Method ini akan memanggil `SingaPayPayoutService` dan mengubah status komisi terkait dari 'approved' menjadi 'paid' (atau status perantara 'processing' jika mau lebih detail).

#### [MODIFY] [AffiliateCommissionController.php](file:///e:/Pandu-Projek/Freelance/SmartPlan-Web/backend/app/Http/Controllers/Affiliate/AffiliateCommissionController.php)

- Tambahkan method `withdraw(Request $request)`.

### Frontend (React)

#### [MODIFY] [AffiliateCommissions.jsx](file:///e:/Pandu-Projek/Freelance/SmartPlan-Web/frontend/src/components/Affiliate/AffiliateCommissions.jsx)

- Implementasi aksi tombol "Withdraw".
- Tambahkan modal/popup simulasi: “Permintaan withdraw sebesar Rp X diterima. Saldo akan dikirim pada [Tanggal].”
- Tampilkan list riwayat withdraw di tab terpisah atau di bawah tabel komisi.

## Verification Plan

### Automated Tests

- Test unit untuk `MockSingaPayPayoutService`.

### Manual Verification

1. Login sebagai User A (Affiliate) yang punya saldo.
2. Klik Withdraw.
3. Verifikasi muncul notifikasi tanggal estimasi.
4. Verifikasi saldo 'Approved' berkurang atau status berubah.
5. Verifikasi riwayat withdraw muncul.
