# Database Seeder Documentation

## Overview
Dokumentasi lengkap untuk semua seeder di Grapadi Strategix. Seeder dirancang untuk membuat data sample yang konsisten dan realistic untuk testing.

## Urutan Eksekusi (PENTING!)

Seeder **HARUS** dijalankan dalam urutan ini karena ada dependency:

```
1. UserSeeder              ← User harus ada dulu (semua data bergantung pada user)
2. BusinessBackgroundSeeder ← Background bisnis
3. MarketAnalysisSeeder     ← Market analysis
4. MarketAnalysisCompetitorSeeder ← Kompetitor
5. ProductServiceSeeder     ← Produk & Jasa
6. MarketingStrategySeeder  ← Strategi marketing
7. OperationalPlanSeeder    ← Rencana operasional
8. TeamStructureSeeder      ← Struktur tim
9. FinancialPlanSeeder      ← Rencana finansial
10. FinancialCategorySeeder ← Kategori keuangan
11. FinancialSimulationSeeder ← Simulasi transaksi
12. FinancialSummarySeeder  ← Ringkasan finansial
13. AffiliateLinkSeeder     ← Link affiliate
14. AffiliateTrackSeeder    ← Tracking klik affiliate
15. AffiliateLeadSeeder     ← Lead dari affiliate
```

**DatabaseSeeder.php sudah mengatur urutan ini otomatis!**

## Detail Seeder

### 1. UserSeeder
**File:** `database/seeders/UserSeeder.php`
**Fungsi:** Membuat user sample untuk testing

**Data yang dibuat:**
- Name: Pandu
- Username: pandu123
- Phone: 628123456789
- Status: active
- Phone verified

### 2. BusinessBackgroundSeeder
**File:** `database/seeders/BusinessBackgroundSeeder.php`
**Fungsi:** Membuat background bisnis (company profile)

**Data yang dibuat:**
- Business: Kedai Kopi Pandu
- Category: Kuliner
- Location: Jember, Jawa Timur
- Type: UMKM
- Vision, Mission, Values

### 3. MarketAnalysisSeeder
**File:** `database/seeders/MarketAnalysisSeeder.php`
**Fungsi:** Membuat data analisis pasar

**Data yang dibuat:**
- Target market: Mahasiswa 18-35 tahun
- Market size: 30,000 mahasiswa
- Competitors: Janji Jiwa, Kopi Kenangan, dll
- TAM/SAM/SOM calculation
- SWOT Analysis

### 4. MarketAnalysisCompetitorSeeder
**File:** `database/seeders/MarketAnalysisCompetitorSeeder.php`
**Fungsi:** Membuat data kompetitor

**Data yang dibuat:**
- Janji Jiwa (competitor, estimated sales: 350jt/tahun)
- Kopi Kenangan (competitor, estimated sales: 500jt/tahun)
- Kedai Kopi Pandu (ownshop, estimated sales: 150jt/tahun)

Masing-masing dengan strengths, weaknesses, harga, lokasi

### 5. ProductServiceSeeder
**File:** `database/seeders/ProductServiceSeeder.php`
**Fungsi:** Membuat data produk & jasa

**Data yang dibuat:**
- Signature Caramel Latte (product, 25,000)
- Chicken Rice Bowl (product, 30,000)
- Café Event Hosting (service, 150,000)

Masing-masing dengan detail advantages, development strategy, BMC alignment

### 6. MarketingStrategySeeder
**File:** `database/seeders/MarketingStrategySeeder.php`
**Fungsi:** Membuat strategi marketing

**Data yang dibuat:**
- Promotion strategy: Social media ads (Instagram & TikTok)
- Media: Instagram, TikTok, WhatsApp, Brosur
- Pricing: Psychological pricing dengan diskon event
- Monthly target: 150 customers
- Collaboration: Influencer lokal & komunitas mahasiswa

### 7. OperationalPlanSeeder
**File:** `database/seeders/OperationalPlanSeeder.php`
**Fungsi:** Membuat rencana operasional

**Data yang dibuat:**
- Location: Ruko Kampus Jember (45.5m²)
- Rent cost: 2,500,000/bulan
- Employees: 2 staff
- Operating hours: Senin-Sabtu 09:00-15:00, Minggu tutup
- Suppliers: PT Sumber Makmur, CV Digital Partner
- Equipment: Laptop, Printer, Mesin kasir, Router, dll
- Technology: Laravel, React, MySQL, Firebase, Docker

### 8. TeamStructureSeeder
**File:** `database/seeders/TeamStructureSeeder.php`
**Fungsi:** Membuat struktur tim

**Data yang dibuat (4 team member):**
1. Rizky Pratama - Founder & CEO (3 tahun pengalaman)
2. Andi Setiawan - Operational Staff (2 tahun pengalaman)
3. Rina Oktaviani - Customer Support (1+ tahun pengalaman)
4. (ada 4 member total dengan detail pengalaman)

Masing-masing: team_category, position, experience, photo

### 9. FinancialPlanSeeder
**File:** `database/seeders/FinancialPlanSeeder.php`
**Fungsi:** Membuat rencana finansial

**Data yang dibuat:**
- Initial Capital: 25,000,000 (60% modal pribadi, 40% investor)
- CAPEX: 16,000,000 (mesin, renovasi, furniture)
- Monthly OPEX: 10,250,000
- Sales Projection: 32,000,000/bulan
- Gross Profit: 21,750,000
- Net Profit (after tax 10%): 19,575,000

### 10. FinancialCategorySeeder
**File:** `database/seeders/FinancialCategorySeeder.php`
**Fungsi:** Membuat kategori transaksi keuangan

**Kategori Income:**
- Penjualan Produk (green)
- Penjualan Jasa (green)
- Pendapatan Lain-lain (green)

**Kategori Expense:**
- Pembelian Bahan Baku (red)
- Gaji Karyawan (red)
- Biaya Operasional (red)
- Listrik & Air (orange)
- Sewa Tempat (orange)
- Marketing & Promosi (purple)
- Transportasi (blue)
- Perawatan & Maintenance (indigo)
- Pengeluaran Lain-lain (gray)

**Kategori Plan (Simulasi):**
- Rencana Ekspansi
- Proyeksi Pendapatan Baru

### 11. FinancialSimulationSeeder
**File:** `database/seeders/FinancialSimulationSeeder.php`
**Fungsi:** Membuat data simulasi transaksi keuangan

**Breakdown Konsisten:**
```
Per User (dengan 12 financial categories):
  - Income categories: 3 × 10 simulasi = 30
  - Expense categories: 9 × 10 simulasi = 90
  - Recurring transactions: 3 (Gaji, Sewa, Listrik) = 3
  
  TOTAL PER USER = 30 + 90 + 3 = 123 simulasi

Jika 1 user → 123 total
Jika 2 users → 246 total
```

**Data yang dibuat:**
- 10 simulasi per kategori (income & expense)
- Amount: Income 500rb-10jt, Expense 200rb-5jt (variasi per kategori)
- Payment method: cash, bank_transfer, credit_card, digital_wallet
- Status: 80% completed, 20% planned
- Date range: 3 bulan terakhir
- Recurring: 3 monthly transactions (Gaji, Sewa, Listrik)

### 12. FinancialSummarySeeder
**File:** `database/seeders/FinancialSummarySeeder.php`
**Fungsi:** Membuat ringkasan keuangan bulanan

**Data yang dibuat:**
- Ringkasan untuk 3 bulan terakhir
- Total income per bulan: ~32,000,000
- Total expense per bulan: ~10,250,000
- Gross profit, net profit, growth rate

### 13. AffiliateLinkSeeder (NEW)
**File:** `database/seeders/AffiliateLinkSeeder.php`
**Fungsi:** Membuat affiliate link untuk user

**Data yang dibuat:**
- 1 affiliate link per user
- Slug: random (8 char) + username (contoh: "a1b2c3d4-pandu123")
- Max changes: 999 (unlimited)
- Status: active

### 14. AffiliateTrackSeeder (NEW)
**File:** `database/seeders/AffiliateTrackSeeder.php`
**Fungsi:** Membuat tracking data klik affiliate

**Data yang dibuat:**
- 10 klik simulasi
- Device: mobile atau desktop
- IP address: random
- Date: 0-30 hari terakhir

### 15. AffiliateLeadSeeder (NEW)
**File:** `database/seeders/AffiliateLeadSeeder.php`
**Fungsi:** Membuat lead dari affiliate link

**Data yang dibuat (5 leads):**
1. Ahmad Ridho - Tertarik franchise (status: baru)
2. Siti Nurhaliza - Konsultasi bisnis (status: dihubungi)
3. Budi Santoso - Supplier kopi (status: closing)
4. Dewi Lestari - Partnership (status: baru)
5. Rafi Firmansyah - Reseller (status: dihubungi)

Masing-masing: name, email, whatsapp, interest, notes, device, status

## Cara Menjalankan Seeder

### Fresh Database (Reset semua data)
```bash
# Di folder backend
php artisan migrate:fresh --seed
```

### Hanya Seed (Jika tabel sudah ada)
```bash
php artisan db:seed
```

### Seed Seeder Tertentu Saja
```bash
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=AffiliateLinkSeeder
```

### Truncate & Seed (Delete data, buat baru)
```bash
php artisan migrate:fresh --seed
```

## Relationships (Dependency)

```
User
├── BusinessBackground
├── MarketAnalysis
│   └── MarketAnalysisCompetitor
├── ProductService
├── MarketingStrategy
├── OperationalPlan
│   └── TeamStructure
├── FinancialPlan
├── ManagementFinancial
│   ├── FinancialCategory
│   ├── FinancialSimulation
│   └── FinancialSummary
└── Affiliate
    ├── AffiliateLink
    │   ├── AffiliateTrack
    │   └── AffiliateLead
```

## Tips

1. **Konsistensi User ID:** Semua seeder menggunakan `user_id = 1`, pastikan UserSeeder berjalan pertama
2. **Business Background ID:** Semua menggunakan `business_background_id = 1`, pastikan BusinessBackgroundSeeder berjalan
3. **Clear Data:** Beberapa seeder menggunakan `DB::table()->delete()` untuk reset data sebelum insert
4. **Timestamp:** Gunakan `now()` untuk auto-timestamp
5. **Random Data:** FinancialSimulation & AffiliateTrack menggunakan random data untuk realistis

## Troubleshooting

### Error: Foreign Key Constraint Failed
**Penyebab:** Seeder tidak dijalankan dalam urutan yang benar
**Solusi:** Jalankan `php artisan migrate:fresh --seed` (akan otomatis urut)

### Error: Duplicate Entry
**Penyebab:** Seeder sudah pernah dijalankan
**Solusi:** Gunakan `php artisan migrate:fresh --seed` untuk reset total

### Data Tidak Muncul
**Penyebab:** Seeder tidak terdaftar di DatabaseSeeder
**Solusi:** Pastikan `$this->call([...])` di DatabaseSeeder mencakup seeder yang diinginkan

## Pengembangan Lebih Lanjut

### Menambah Seeder Baru
1. Buat file di `database/seeders/NamaSeeder.php`
2. Extend class Seeder dan implementasi `run()` method
3. Tambahkan ke `$this->call([...])` di DatabaseSeeder
4. Jalankan `php artisan migrate:fresh --seed`

### Menggunakan Factories
Untuk data yang lebih kompleks, bisa menggunakan Factories:
```php
// database/factories/UserFactory.php
$users = User::factory(10)->create();
```

### Seed dengan Kondisi
```php
if (!User::where('username', 'pandu123')->exists()) {
    User::create([...]);
}
```

---

**Last Updated:** November 30, 2025
**Version:** 1.0
**Status:** Production Ready ✅
