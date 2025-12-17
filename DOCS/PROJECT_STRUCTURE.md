# Grapadi Strategix Project Structure - Dokumentasi Lengkap

## 📁 Struktur Project Umum

```
Grapadi Strategix/
├── backend/            # Laravel API Backend
├── frontend/           # React + Vite Frontend
└── PROJECT_STRUCTURE.md # File dokumentasi ini
```

---

## 🔧 Backend (Laravel) - Struktur Detail

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php                          # Base Controller
│   │   │   ├── AuthController.php                      # Authentication
│   │   │   ├── UserController.php                      # User Management
│   │   │   ├── BusinessPlan/
│   │   │   │   ├── BusinessController.php              # Business Plans
│   │   │   │   ├── FinancialPlanController.php         # Financial Plans
│   │   │   │   ├── MarketAnalysisController.php        # Market Analysis
│   │   │   │   ├── MarketingStrategyController.php     # Marketing Strategies
│   │   │   │   ├── OperationalPlanController.php       # Operational Plans
│   │   │   │   ├── ProductServiceController.php        # Products/Services
│   │   │   │   ├── TeamStructureController.php         # Team Structure
│   │   │   │   └── PdfBusinessPlanController.php       # PDF Generation
│   │   │   ├── ManagementFinancial/
│   │   │   │   ├── ManagementFinancialController.php   # Financial Management
│   │   │   │   ├── FinancialSimulationController.php   # Simulations
│   │   │   │   ├── FinancialSummaryController.php      # Financial Summaries
│   │   │   │   ├── FinancialProjectionController.php   # Financial Projections (NEW)
│   │   │   │   ├── PdfFinancialReportController.php    # PDF Report Export (NEW)
│   │   │   │   ├── CombinedPdfController.php          # Combined PDF Export (NEW - v1.3)
│   │   │   │   └── MonthlyReportController.php         # Monthly Reports
│   │   │   └── Affiliate/
│   │   │       ├── AffiliateLinkController.php         # Affiliate Link Management
│   │   │       ├── AffiliateTrackController.php        # Click Tracking & Analytics
│   │   │       └── AffiliateLeadController.php         # Lead Capture & Management
│   │   └── Middleware/
│   │       └── CorsMiddleware.php                      # CORS Configuration
│   │
│   ├── Console/
│   │   └── Commands/
│   │       └── RecalculateProjections.php              # Recalculate Projections (NEW)
│   │
│   ├── Models/
│   │   ├── User.php                                    # User Model
│   │   ├── BusinessBackground.php                      # Business Info
│   │   ├── FinancialPlan.php                           # Financial Plans
│   │   ├── MarketAnalysis.php                          # Market Analysis
│   │   ├── MarketAnalysisCompetitor.php                # Competitors
│   │   ├── MarketingStrategy.php                       # Marketing
│   │   ├── OperationalPlan.php                         # Operations
│   │   ├── ProductService.php                          # Products/Services
│   │   ├── TeamStructure.php                           # Team
│   │   ├── Affiliate/
│   │   │   ├── AffiliateLink.php                       # Affiliate Links
│   │   │   ├── AffiliateTrack.php                      # Affiliate Tracking
│   │   │   └── AffiliateLead.php                       # Affiliate Leads
│   │   └── ManagementFinancial/
│   │       ├── FinancialCategory.php                   # Categories
│   │       ├── FinancialSimulation.php                 # Simulations
│   │       ├── FinancialSummary.php                    # Summaries
│   │       └── FinancialProjection.php                 # Projections (NEW)
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php                      # App Service Provider
│   │   └── PdfServiceProvider.php                      # PDF Service Provider
│   │
│   └── Services/
│       ├── WhatsAppService.php                         # WhatsApp API Integration
│       ├── WorkflowDiagramService.php                  # Workflow Diagrams
│       ├── AffiliateService.php                        # Affiliate Logic
│       ├── ForecastService.php                         # Forecast Service
│       └── PdfService.php                              # PDF Generation Service (NEW - v1.3)
│
├── bootstrap/
│   ├── app.php                                         # Bootstrap App
│   ├── providers.php                                   # Service Providers
│   └── cache/
│
├── config/
│   ├── app.php                                         # App Config
│   ├── auth.php                                        # Authentication Config
│   ├── cache.php                                       # Cache Config
│   ├── cors.php                                        # CORS Config
│   ├── database.php                                    # Database Config
│   ├── filesystems.php                                 # File System Config
│   ├── logging.php                                     # Logging Config
│   ├── mail.php                                        # Email Config
│   ├── queue.php                                       # Queue Config
│   ├── sanctum.php                                     # Sanctum/Auth Config
│   ├── services.php                                    # External Services Config
│   └── session.php                                     # Session Config
│
├── database/
│   ├── factories/
│   │   └── UserFactory.php                             # User Factory
│   ├── migrations/                                     # Database Migrations
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2025_11_05_225908_create_personal_access_tokens_table.php
│   │   ├── 2025_11_06_005444_create_sessions_table.php
│   │   ├── 2025_11_07_111922_create_password_reset_tokens_table.php
│   │   ├── 2025_11_07_173204_create_business_backgrounds_table.php
│   │   ├── 2025_11_07_202516_create_market_analyses_table.php
│   │   ├── 2025_11_08_152551_create_product_services_table.php
│   │   ├── 2025_11_08_162434_create_marketing_strategies_table.php
│   │   ├── 2025_11_08_183358_create_operational_plans_table.php
│   │   ├── 2025_11_09_155228_create_team_structures_table.php
│   │   ├── 2025_11_11_174135_create_financial_plans_table.php
│   │   ├── 2025_11_13_073205_add_fields_to_users_table.php
│   │   ├── 2025_11_23_233153_create_financial_categories_table.php
│   │   ├── 2025_11_24_030540_create_financial_simulations_table.php
│   │   ├── 2025_11_25_004624_create_financial_summaries_table.php
│   │   ├── 2025_11_26_000000_add_year_to_financial_simulations_table.php
│   │   ├── 2025_11_28_000001_add_category_subtype_to_financial_categories.php (NEW)
│   │   ├── 2025_11_29_000001_create_financial_projections_table.php (NEW)
│   │   └── 2025_12_01_050355_add_current_cash_balance_to_financial_projections_table.php (NEW)
│   └── seeders/
│       ├── BusinessBackgroundSeeder.php
│       ├── FinancialCategorySeeder.php (UPDATED)
│       ├── FinancialSimulationSeeder.php (UPDATED)
│       └── (Other seeders)
│
├── public/
│   ├── index.php
│   ├── robots.txt
│   ├── images/                                         # Static images folder (NEW - v1.3)
│   │   └── watermark-logo.png                          # Watermark logo for PDF
│   └── storage/
│
├── resources/
│   ├── css/
│   ├── js/
│   └── views/
│       └── pdf/
│           ├── financial-report.blade.php
│           ├── business-plan.blade.php
│           └── combined-report.blade.php              # Combined PDF Report (NEW - v1.3)
│
├── routes/
│   ├── api.php (UPDATED)
│   ├── console.php
│   └── web.php
│
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── tests/
│   ├── TestCase.php
│   ├── Feature/
│   └── Unit/
│
├── DOCS/
│   ├── PROJECT_STRUCTURE.md                           # This file
│   ├── EXPORT_PDF_FINANCIAL_REPORT.md                 # Financial report export docs
│   ├── COMBINED_PDF_EXPORT.md                         # Combined PDF export docs (NEW - v1.3)
│   └── Singapay/
├── vendor/
├── artisan
├── composer.json
├── package.json
├── phpunit.xml
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚛️ Frontend (React + Vite) - Struktur Detail

```
frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── BusinessPlan/
│   │   │   ├── BusinessBackground/
│   │   │   ├── FinancialPlan/
│   │   │   ├── MarketAnalysis/
│   │   │   ├── MarketingStrategies/
│   │   │   ├── OperationalPlan/
│   │   │   ├── ProductService/
│   │   │   ├── TeamStructure/
│   │   │   └── PdfBusinessPlan/
│   │   │
│   │   ├── ManagementFinancial/
│   │   │   ├── FinancialCategories/
│   │   │   │   ├── Category-List.jsx
│   │   │   │   ├── Category-Create.jsx
│   │   │   │   ├── Category-Edit.jsx
│   │   │   │   ├── Category-View.jsx
│   │   │   │   └── FinancialCategories.jsx
│   │   │   ├── FinancialSimulation/
│   │   │   │   ├── Simulation-Dashboard.jsx
│   │   │   │   ├── Simulation-List.jsx
│   │   │   │   ├── Simulation-Create.jsx
│   │   │   │   ├── Simulation-Edit.jsx
│   │   │   │   ├── Simulation-View.jsx
│   │   │   │   ├── Simulation-Form.jsx
│   │   │   │   ├── Year-Management.jsx
│   │   │   │   └── FinancialSimulation.jsx
│   │   │   ├── FinancialProjections/
│   │   │   │   └── FinancialProjections.jsx (NEW)
│   │   │   ├── FinancialSummaries/
│   │   │   │   ├── Summary-List.jsx
│   │   │   │   ├── Summary-View.jsx
│   │   │   │   ├── Summary-Create.jsx
│   │   │   │   ├── Summary-Edit.jsx
│   │   │   │   ├── Summary-Form.jsx
│   │   │   │   ├── SummaryChart.jsx
│   │   │   │   ├── Year-Display.jsx
│   │   │   │   └── FinancialSummaries.jsx
│   │   │   ├── ExportPDF/
│   │   │   │   ├── ExportPDF.jsx (NEW)
│   │   │   │   └── ExportPDFLengkap.jsx              # Combined PDF Export (NEW - v1.3)
│   │   │   └── MonthlyReports/
│   │   │       ├── MonthlyReports.jsx
│   │   │       ├── MonthlyReports-View.jsx
│   │   │       ├── IncomeStatement.jsx
│   │   │       ├── CashFlow.jsx
│   │   │       ├── BalanceSheet.jsx
│   │   │       └── TrendCharts.jsx
│   │   │
│   │   ├── Dashboard/
│   │   ├── Forecast/
│   │   ├── Layout/ (UPDATED)
│   │   ├── Public/
│   │   └── UserProfile/
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── BusinessPlan.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManagementFinancial.jsx (UPDATED)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── OtpVerification.jsx
│   │   └── LandingPage.jsx
│   │
│   ├── services/
│   │   ├── businessPlan/
│   │   │   ├── businessPlanApi.js
│   │   │   ├── marketAnalysisApi.js
│   │   │   ├── financialPlanApi.js
│   │   │   ├── marketingStrategyApi.js
│   │   │   └── productServiceApi.js
│   │   ├── ManagementFinancial/
│   │   │   ├── monthlyReportApi.js
│   │   │   ├── financialProjectionApi.js (NEW)
│   │   │   ├── financialCategoryApi.js
│   │   │   ├── financialSummaryApi.js
│   │   │   └── combinedPdfApi.js                     # Combined PDF API (NEW - v1.3)
│   │   ├── authApi.js
│   │   └── userApi.js
│   │
│   └── utils/
│       ├── chartCapture.js
│       ├── dateHelpers.js
│       ├── validators.js
│       ├── formatters.js
│       └── constants.js
│
├── public/
├── index.html
├── package.json (UPDATED)
├── package-lock.json (UPDATED)
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

---

## 📋 Database Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `cache` | Cache table |
| `jobs` | Queue jobs |
| `personal_access_tokens` | API tokens (Sanctum) |
| `sessions` | Session data |
| `password_reset_tokens` | Password reset tokens |
| `business_backgrounds` | Business information |
| `market_analyses` | Market analysis data |
| `product_services` | Products/Services |
| `marketing_strategies` | Marketing plans |
| `operational_plans` | Operational plans |
| `team_structures` | Team organization |
| `financial_plans` | Financial planning |
| `financial_categories` | Financial categories (with subtype support - NEW) |
| `financial_simulations` | What-if simulations |
| `financial_summaries` | Financial summaries |
| `financial_projections` | Financial projections (NEW) |
| `affiliate_links` | Affiliate links |
| `affiliate_tracks` | Click tracking |
| `affiliate_leads` | Lead capture |

---

## 📊 Tech Stack

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8+
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DOMPDF
- **Build Tool**: Vite + PostCSS + Tailwind

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Charts**: Chart.js + react-chartjs-2

---

## 🔄 Key Features

### Financial Management
- **Financial Simulation**: Dashboard, Create, Edit, View, Year management
- **Financial Projections** (NEW): Long-term forecasting, Cash balance tracking
- **Financial Summaries**: Monthly summaries, KPI cards, Chart visualization
- **Monthly Reports**: Income Statement, Cash Flow, Balance Sheet, Trend Charts
- **PDF Export** (NEW): Professional financial report generation
- **Financial Categories**: Category management with subtype support

### Business Planning
- Business background, Financial planning, Market analysis, Marketing strategies
- Operational planning, Product/service management, Team structure

### Affiliate & Lead Generation
- Affiliate Link Management, Traffic Tracking, Lead Capture, Analytics Dashboard

### Additional Features
- ARIMA-based forecasting, WhatsApp notifications, Workflow diagrams

---

## 🚀 Development

### Backend Commands
```bash
cd backend
php artisan serve                           # Start API server
php artisan migrate                         # Run migrations
php artisan seed                            # Seed database
php artisan command:recalculate-projections # Recalculate Projections (NEW)
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🆕 Recent Updates (v1.3 - Dec 12, 2025)

### New Features
1. **Combined PDF Export** - Complete Business Plan + Financial Report in single PDF
2. **Organization Chart Hierarchy** - Text-based hierarchical display in PDF
3. **Market Analysis Pie Chart** - TAM/SAM/SOM visualization in PDF
4. **Watermark Logo** - Transparent logo watermark on every PDF page
5. **Enhanced Executive Summary** - Extended with vision, mission, team info, and strategic details
6. **Logo Embedding** - Logo display on cover page (converted to base64 for PDF compatibility)
7. **Font Enhancement** - Improved typography (13px Arial)

### New Files
- Backend: `CombinedPdfController.php`, `combined-report.blade.php`
- Frontend: `ExportPDFLengkap.jsx`, `combinedPdfApi.js`
- Static: `public/images/watermark-logo.png`
- Config: Updated `config/app.php` with watermark_logo setting

### Updated Files
- Backend:
  - `CombinedPdfController.php` - Main PDF generation logic
  - `config/app.php` - Watermark logo configuration
  - `createBusinessExecutiveSummary()` - Extended summary generation
  - `convertLogoToDataUrl()` - Base64 logo conversion for PDF embedding
- Frontend:
  - `ExportPDFLengkap.jsx` - Combined PDF export UI
  - `combinedPdfApi.js` - API client for PDF endpoint
- Database:
  - `TeamStructureSeeder.php` - Updated with 12 team members (4 hierarchy levels)

### Key Improvements
- ✅ Logo watermark (8% opacity, 600px size) on every page
- ✅ Text-based organization hierarchy with tree connectors (├─, └─)
- ✅ TAM/SAM/SOM pie chart without internal labels
- ✅ Extended executive summary with business details
- ✅ Base64 logo embedding for safe hosting deployment
- ✅ Axios + JSON response pattern (prevents IDM interception)
- ✅ Professional PDF layout (A4 Portrait, full coverage)

### PDF Sections Included
1. Cover Page - Logo, Business Name, Title, Generated Date
2. Table of Contents
3. Market Analysis - With TAM/SAM/SOM pie chart
4. Competitive Analysis
5. Marketing & Sales Strategy
6. Operational Plan - With workflow diagrams
7. Team Structure - With text-based hierarchy
8. Financial Plan - With business charts (6 charts)
9. Financial Report - With financial charts (4 charts)
10. Forecast & Insights
11. Executive Summary - Extended version
12. Appendices

---

## ✅ Version Info

| Item | Value |
|------|-------|
| **Current Version** | v1.3 |
| **Release Date** | December 12, 2025 |
| **Repository** | Grapadi Strategix |
| **Current Branch** | branch-pandu |
| **Default Branch** | main |
| **Last Updated** | December 12, 2025 |

### v1.3 Changes (NEW - v1.3)
- ✅ Combined PDF Export (Business Plan + Financial Report)
- ✅ Organization hierarchy text-based display
- ✅ Market analysis pie chart (TAM/SAM/SOM)
- ✅ Watermark logo system (configurable)
- ✅ Extended executive summary generation
- ✅ Logo embedding with base64 conversion
- ✅ Font size enhancement (13px)
- ✅ Team structure seeder with hierarchy

### v1.2 Changes
- ✅ Financial Projections with forecasting
- ✅ PDF Report generation
- ✅ RecalculateProjections command
- ✅ Category subtype support
- ✅ 3 new database migrations
- ✅ ExportPDF component
- ✅ Financial projection API service

### v1.1 Highlights
- ✅ Monthly Financial Reports module
- ✅ Income Statement, Cash Flow, Balance Sheet
- ✅ Improved year management
- ✅ Print functionality & Dark mode support
