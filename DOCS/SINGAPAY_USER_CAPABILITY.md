# 🎯 Capability User/Merchant di Singapay B2B

**Untuk**: SmartPlan-Web Project  
**Tanggal**: December 1, 2025

---

## 📋 Daftar Isi
1. [Capabilities Utama](#capabilities-utama)
2. [Receive Payment (Terima Pembayaran)](#receive-payment-terima-pembayaran)
3. [Send Payment (Kirim Pembayaran)](#send-payment-kirim-pembayaran)
4. [Account Management](#account-management)
5. [Reporting & Analytics](#reporting--analytics)
6. [Security & Control](#security--control)

---

## 🚀 Capabilities Utama

### 1. **Terima Pembayaran dari Customer** ✅
User bisa menerima pembayaran melalui berbagai metode:
- Virtual Account (Transfer Bank)
- QRIS (QR Code)
- E-wallet
- Retail (Indomaret, Alfamart)
- Payment Link (Generate link untuk di-share)

### 2. **Kirim Dana ke Pihak Lain** ✅
User bisa mengirim uang ke:
- Rekening bank penerima
- Staff/karyawan
- Vendor/supplier
- Customer (refund)
- Multiple recipients (batch disbursement)

### 3. **Kelola Rekening & Virtual Account** ✅
User bisa:
- Membuat rekening merchant
- Generate Virtual Account (VA) permanent & temporary
- Kelola VA untuk berbagai customer
- Set VA dengan nominal tetap atau flexible

### 4. **Monitor Transaksi & Saldo** ✅
User bisa:
- Lihat saldo real-time
- Lihat history semua transaksi
- Track pembayaran masuk/keluar
- Generate laporan harian/bulanan

### 5. **Webhook & Notifikasi Real-time** ✅
User bisa:
- Terima notifikasi otomatis saat ada transaksi
- Integrate ke sistem backoffice
- Update status order secara real-time
- Custom webhook handling

---

## 💰 Receive Payment (Terima Pembayaran)

### A. Virtual Account Payment
**Apa bisa dilakukan:**
```
✅ Membuat VA untuk setiap customer
✅ Set VA permanent (bertahan lama) atau temporary (satu kali)
✅ Set nominal pembayaran (exact amount atau flexible)
✅ Auto-generated bank account number
✅ Support 4 bank: BRI, BNI, Danamon, Maybank
✅ Terima notifikasi real-time saat pembayaran masuk
✅ Rekonsiliasi otomatis dengan order/invoice
✅ Multi-currency support (IDR)
✅ Customer bisa transfer dari bank mana saja
✅ Gratis cek saldo di VA
```

**Contoh Use Case di SmartPlan:**
```
Order #001 - Customer: Budi Santoso
├─ Amount: Rp 500.000
├─ Create VA BRI: 787295514657XYZ
├─ Share ke customer
├─ Customer transfer
├─ Webhook terima notifikasi
└─ Update order status: PAID ✓
```

---

### B. QRIS Payment
**Apa bisa dilakukan:**
```
✅ Generate QR code untuk setiap transaksi
✅ Set nominal di QR code
✅ Customer bisa scan dengan app bank/e-wallet
✅ Support semua metode pembayaran QRIS
✅ Display di POS, Invoice, Aplikasi
✅ Terima notifikasi saat scan/bayar
✅ Track pembayaran per QR code
✅ Regenerate QR jika perlu
✅ No setup fee
✅ Real-time settlement
```

**Contoh Use Case di SmartPlan:**
```
Invoice #001 - Customer: Ahmad Wijaya
├─ Amount: Rp 250.000
├─ Generate QRIS
├─ Display QR code di invoice
├─ Customer scan dengan GCash/Gopay/OVO
├─ Webhook notifikasi
└─ Update invoice: PAID ✓
```

---

### C. Payment Link
**Apa bisa dilakukan:**
```
✅ Generate shareable payment link
✅ Embed link di invoice/email/SMS
✅ Set expiration time (1 jam - 30 hari)
✅ Support multiple payment methods (VA, QRIS, E-wallet)
✅ Customer bisa bayar tanpa VA
✅ Track payment link history
✅ Custom description & branding
✅ Auto redirect after payment
✅ One-time use atau reusable
✅ See who clicked & paid
```

**Contoh Use Case di SmartPlan:**
```
Invoice #001
├─ Email ke customer dengan link:
│  https://payment.singapay.id/link/abc123xyz
├─ Customer klik link
├─ Pilih metode pembayaran
├─ Bayar
├─ Redirect ke thank you page
└─ Aplikasi terima webhook
```

---

### D. Settlement & Balance
**Apa bisa dilakukan:**
```
✅ Saldo real-time tersedia di dashboard
✅ Breakdown saldo: available, pending, held
✅ Auto-settlement setiap transaksi selesai
✅ Instant transfer ke bank merchant
✅ Minimal settlement: Rp 10.000 (contoh)
✅ Settlement schedule: daily/weekly/monthly
✅ Transfer fee: Rp 2.500-5.000 per transfer
✅ View detailed settlement report
✅ Track pending balance
```

**Saldo Breakdown:**
```
Total Balance: Rp 10.000.000
├─ Available: Rp 8.000.000 (langsung bisa digunakan)
├─ Pending: Rp 1.500.000 (menunggu 3 hari proses)
└─ Held: Rp 500.000 (ditahan untuk dispute)
```

---

## 🏦 Send Payment (Kirim Pembayaran)

### A. Disbursement/Transfer
**Apa bisa dilakukan:**
```
✅ Transfer ke 60+ bank di Indonesia
✅ Instant atau scheduled transfer
✅ Bulk transfer (multiple recipients)
✅ Auto deduct fee dari balance
✅ Verify rekening sebelum transfer
✅ Get fee quote sebelum transfer
✅ Track transfer status real-time
✅ Terima webhook saat transfer selesai
✅ Retry otomatis jika transfer gagal
✅ Detailed transaction report
```

**Step-by-step:**
```
1. Cek balance (ada cukup dana?)
2. Cek biaya transfer
3. Verify rekening penerima
4. Initiate transfer
5. Tunggu webhook notifikasi
6. Confirm sukses atau gagal
```

**Contoh Use Case di SmartPlan:**
```
Payroll - Transfer komisi ke 10 staff:
├─ Staff 1 (Ahmad): Rp 500.000 → BRI 1234567
├─ Staff 2 (Budi): Rp 350.000 → BNI 7654321
├─ Staff 3 (Citra): Rp 400.000 → Mandiri 9876543
├─ ... (bulk/batch processing)
├─ Total: Rp 10.000.000
├─ Fees: Rp 100.000 (10 transfers)
├─ Net: Rp 9.900.000
└─ All transfers selesai → Webhook notifikasi
```

---

### B. Refund Payment
**Apa bisa dilakukan:**
```
✅ Refund customer jika order dibatalkan
✅ Partial refund (sebagian dari transaksi)
✅ Full refund (100% kembalikan)
✅ Auto reverse VA payment
✅ Instant atau scheduled refund
✅ Track refund status
✅ Refund history report
✅ Customer terima refund dalam 1-5 hari kerja
```

**Contoh:**
```
Order #001 dibatalkan
├─ Original payment: Rp 500.000 (via VA)
├─ Customer refund request
├─ Admin approve refund
├─ Singapay reverse VA payment
├─ Dana kembali ke customer
└─ Status: REFUNDED ✓
```

---

## 🔧 Account Management

### A. Merchant Account
**Apa bisa dilakukan:**
```
✅ Setup merchant profile (nama, alamat, tax ID)
✅ Manage bank accounts (primary & backup)
✅ Set settlement preferences
✅ Configure webhook URLs
✅ Manage API keys
✅ Set transaction limits
✅ Enable/disable payment methods
✅ Team member management (permissions)
✅ IP whitelisting untuk API
✅ Two-factor authentication
```

---

### B. Virtual Account Management
**Apa bisa dilakukan:**
```
✅ Create VA (permanent atau temporary)
✅ Assign VA ke customer/invoice
✅ Set VA amount (fixed atau flexible)
✅ List semua VA created
✅ Check VA balance
✅ Check VA transactions
✅ Update VA status (active/inactive)
✅ Close/delete VA jika perlu
✅ Search VA by customer/reference
✅ Export VA list
```

**Contoh:**
```
Customer Database di SmartPlan:
├─ Customer 1 (Budi)
│  ├─ VA BRI: 787295514657001 (active)
│  └─ VA Maybank: 531001234567001 (inactive)
├─ Customer 2 (Ahmad)
│  └─ VA BNI: 889087654321002 (active)
└─ Customer 3 (Citra)
   ├─ VA Danamon: 123000111222003 (active)
   └─ VA BRI: 787295514657003 (active)
```

---

### C. Payment Method Configuration
**Apa bisa dilakukan:**
```
✅ Enable/disable VA payment
✅ Enable/disable QRIS payment
✅ Enable/disable e-wallet
✅ Enable/disable retail payment
✅ Set transaction fee per method
✅ Set transaction limit per method
✅ Configure billing notification
✅ Set payment expiration time
✅ Custom payment page branding
```

---

## 📊 Reporting & Analytics

### A. Dashboard & Reporting
**Apa bisa dilakukan:**
```
✅ Real-time dashboard dengan key metrics:
   - Total balance
   - Today's revenue
   - Total transactions
   - Success rate
✅ Daily/Weekly/Monthly reports
✅ Transaction detail report
✅ Customer payment history
✅ Disbursement report
✅ Settlement report
✅ Fee breakdown report
✅ Export ke Excel/PDF
✅ Scheduled email reports
✅ Custom report builder
```

**Report Types:**
```
1. Revenue Report
   - Daily revenue
   - Monthly revenue
   - Revenue by payment method
   - Revenue by customer

2. Transaction Report
   - All incoming payments
   - All outgoing transfers
   - Failed transactions
   - Pending transactions

3. Financial Report
   - Balance history
   - Fee paid
   - Settlement details
   - Reconciliation

4. Compliance Report
   - Transaction audit trail
   - Webhook logs
   - API access logs
   - User activity logs
```

---

### B. Transaction History & Search
**Apa bisa dilakukan:**
```
✅ View all transactions (inbound & outbound)
✅ Search by:
   - Date range
   - Amount
   - Customer/Beneficiary
   - Reference number
   - Status (success/failed/pending)
   - Payment method
✅ Filter by:
   - VA transactions
   - QRIS transactions
   - Disbursement transactions
   - Refunds
✅ Download transaction list
✅ Print transaction detail
✅ Export to accounting software
```

---

### C. Analytics & Insights
**Apa bisa dilakukan:**
```
✅ Revenue trends (grafik)
✅ Payment method breakdown (pie chart)
✅ Top customers by volume
✅ Peak transaction times
✅ Success rate metrics
✅ Average transaction value
✅ Customer retention rate
✅ Payment failure reasons
✅ Fraud detection alerts
```

---

## 🔒 Security & Control

### A. Transaction Control
**Apa bisa dilakukan:**
```
✅ Set daily transaction limit
✅ Set per-transaction limit
✅ Require approval untuk besar transaksi
✅ Whitelist/blacklist beneficiary account
✅ Fraud detection & alerting
✅ 3D Secure verification
✅ OTP untuk konfirmasi transfer
✅ IP whitelist untuk dashboard access
✅ Session timeout management
```

---

### B. Risk Management
**Apa bisa dilakukan:**
```
✅ Chargeback protection (untuk kartu kredit)
✅ Dispute resolution
✅ Transaction reversal (dengan approval)
✅ Hold fund (hold balance untuk dispute)
✅ Refund period setting (contoh: 30 hari)
✅ Automated fraud scoring
✅ Manual review option
✅ SLA guarantee (99.99% uptime)
```

---

### C. Compliance & Audit
**Apa bisa dilakukan:**
```
✅ Audit trail (semua activity tercatat)
✅ API access logs
✅ Webhook delivery logs
✅ User activity tracking
✅ KYC/KYB verification
✅ Tax reporting (export SPT data)
✅ Export data for compliance
✅ Data retention policy
✅ GDPR compliance
✅ PCI DSS compliance
```

---

### D. API Security
**Apa bisa dilakukan:**
```
✅ API key management
   - Generate multiple keys
   - Set key expiration
   - Revoke key
   - Rotate key
✅ OAuth 2.0 authentication
✅ HMAC signature validation
✅ Rate limiting (prevent abuse)
✅ Request throttling
✅ IP whitelisting
✅ Webhook signature verification
✅ Asymmetric encryption for disbursement
✅ Encryption at rest & transit
```

---

## 🎯 Real-world Scenarios untuk SmartPlan-Web

### Scenario 1: Order Payment + Commission Transfer
```
Workflow:
1. Customer pesan jasa (Rp 500.000)
2. Buat VA BRI untuk customer
3. Customer transfer
4. Webhook terima notifikasi
5. Update order status: PAID
6. Calculate commission (10% = Rp 50.000)
7. Transfer commission ke staff BRI account
8. Staff terima dana
9. Dashboard show:
   - Order revenue: +Rp 500.000
   - Commission paid: -Rp 50.000
   - Net income: +Rp 450.000
```

---

### Scenario 2: Invoice with QRIS + Settlement
```
Workflow:
1. Generate invoice (Rp 1.000.000)
2. Generate QRIS code
3. Customer scan QRIS
4. Customer pilih payment method (Go-Pay/OVO/Dana)
5. Payment selesai instant
6. Webhook notifikasi
7. Update invoice: PAID
8. Settlement otomatis ke bank merchant
9. Dashboard show:
   - Invoice total: Rp 1.000.000
   - Settlement: Rp 997.500 (fee: Rp 2.500)
```

---

### Scenario 3: Bulk Payroll Disbursement
```
Workflow:
1. Prepare payroll (10 staff, total Rp 5.000.000)
2. Batch check beneficiary account semua staff
3. Batch check fee per transfer
4. Batch disbursement ke semua staff
5. Webhook notifikasi per transfer
6. Track all transfers
7. Dashboard show:
   - Payroll total: Rp 5.000.000
   - Total fee: Rp 75.000
   - Net disburse: Rp 4.925.000
   - All 10 transfers selesai ✓
```

---

### Scenario 4: Daily Report & Reconciliation
```
Workflow:
1. Dashboard show today's metrics:
   - Revenue: Rp 10.000.000 (50 orders)
   - Commission paid: Rp 1.000.000
   - Disbursement: Rp 2.000.000
   - Net balance: +Rp 7.000.000
2. Export transaction report
3. Compare dengan internal accounting
4. Reconciliation complete ✓
5. Email report to management
```

---

## 📈 Feature Expansion (Future Possible)

### Possible Additional Features
```
✅ Subscription/Recurring payment
✅ Invoice generation & tracking
✅ Multi-currency support (USD, SGD, MYR)
✅ Marketplace splitting (untuk aggregator)
✅ Escrow service (hold fund until confirmation)
✅ Split payment (auto-distribute ke multiple recipient)
✅ Virtual card for business
✅ Bill aggregation (terima dari multiple merchant)
✅ Cross-border settlement
✅ Advanced reporting & BI tools
```

---

## 🎓 Capability Summary by User Role

### Role: Admin/Owner
```
✅ Penuh akses semua fitur
✅ Manage user & permissions
✅ Set transaction limits
✅ Configure webhook
✅ Access all reports
✅ Manage API keys
✅ View audit logs
```

### Role: Finance/Accountant
```
✅ View transaction history
✅ Generate reports
✅ Export data
✅ Track disbursement
✅ No modify permissions
✅ No delete/refund
```

### Role: Customer Service
```
✅ View customer transactions
✅ Create manual invoice link
✅ View payment status
✅ No access financial data
✅ No modify/delete
```

### Role: Operations
```
✅ Manage VA creation
✅ Track payment status
✅ View order status
✅ Generate payment reports
✅ No financial access
```

---

## ✅ Checklist: Apa Saja yang Dibutuhkan SmartPlan

### Payment Receiving
- [ ] Virtual Account integration
- [ ] QRIS integration
- [ ] Payment Link integration
- [ ] Webhook handler
- [ ] Order status update automation

### Payment Sending
- [ ] Disbursement/Transfer integration
- [ ] Beneficiary verification
- [ ] Bulk disbursement support
- [ ] Commission auto-calculation

### Reporting
- [ ] Dashboard metrics
- [ ] Transaction history
- [ ] Daily/Monthly reports
- [ ] Revenue analytics

### Admin Panel
- [ ] Transaction management
- [ ] VA management
- [ ] Settings/Configuration
- [ ] User management

---

**Last Updated**: December 1, 2025  
**For**: SmartPlan-Web Project
