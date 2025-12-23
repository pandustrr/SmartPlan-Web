# Grapadi Strategix Project Structure - Dokumentasi Lengkap

## 📁 Struktur Project Umum

```
SmartPlan-Web/
├── backend/            # Laravel API Backend
├── frontend/           # React + Vite Frontend
├── DOCS/               # Dokumentasi Project
├── .git/               # Git Repository
├── .vscode/            # VSCode Settings
├── .qodo/              # Qodo (AI) Configuration
└── debug-pdf.ps1       # PowerShell Debug Script
```

---

## 🔧 Backend (Laravel) - Struktur Detail

```
backend/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── RecalculateProjections.php              # Recalculate Projections Command
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php                          # Base Controller
│   │   │   ├── AuthController.php                      # Authentication
│   │   │   ├── UserController.php                      # User Management
│   │   │   │
│   │   │   ├── BusinessPlan/
│   │   │   │   ├── BusinessController.php              # Business Background
│   │   │   │   ├── FinancialPlanController.php         # Financial Plans
│   │   │   │   ├── MarketAnalysisController.php        # Market Analysis
│   │   │   │   ├── MarketingStrategyController.php     # Marketing Strategies
│   │   │   │   ├── OperationalPlanController.php       # Operational Plans
│   │   │   │   ├── ProductServiceController.php        # Products/Services
│   │   │   │   ├── TeamStructureController.php         # Team Structure
│   │   │   │   └── PdfBusinessPlanController.php       # PDF Business Plan Export
│   │   │   │
│   │   │   ├── ManagementFinancial/
│   │   │   │   ├── ManagementFinancialController.php   # Financial Categories Management
│   │   │   │   ├── FinancialSimulationController.php   # What-If Simulations
│   │   │   │   ├── FinancialSummaryController.php      # Financial Summaries
│   │   │   │   ├── FinancialProjectionController.php   # Financial Projections
│   │   │   │   ├── MonthlyReportController.php         # Monthly Reports
│   │   │   │   ├── PdfFinancialReportController.php    # PDF Financial Report Export
│   │   │   │   └── CombinedPdfController.php           # Combined PDF Export (Business Plan + Financial)
│   │   │   │
│   │   │   ├── Forecast/
│   │   │   │   ├── ForecastDataController.php          # Forecast Data Management
│   │   │   │   ├── ForecastResultController.php        # Forecast Results & AI Analysis
│   │   │   │   └── PdfForecastController.php           # PDF Forecast Export
│   │   │   │
│   │   │   ├── Affiliate/
│   │   │   │   ├── AffiliateLinkController.php         # Affiliate Link Management
│   │   │   │   ├── AffiliateTrackController.php        # Click Tracking & Analytics
│   │   │   │   └── AffiliateLeadController.php         # Lead Capture & Management
│   │   │   │
│   │   │   └── Singapay/
│   │   │       ├── WebhookController.php               # Payment Webhook Handler
│   │   │       └── PdfPaymentController.php            # PDF Payment/Purchase
│   │   │
│   │   └── Middleware/
│   │       └── CorsMiddleware.php                      # CORS Configuration
│   │
│   ├── Models/
│   │   ├── User.php                                    # User Model
│   │   ├── BusinessBackground.php                      # Business Information
│   │   ├── FinancialPlan.php                           # Financial Plans
│   │   ├── MarketAnalysis.php                          # Market Analysis
│   │   ├── MarketAnalysisCompetitor.php                # Competitor Analysis
│   │   ├── MarketingStrategy.php                       # Marketing Strategies
│   │   ├── OperationalPlan.php                         # Operational Plans
│   │   ├── ProductService.php                          # Products/Services
│   │   ├── TeamStructure.php                           # Team Structure
│   │   │
│   │   ├── ManagementFinancial/
│   │   │   ├── FinancialCategory.php                   # Financial Categories
│   │   │   ├── FinancialSimulation.php                 # Financial Simulations
│   │   │   ├── FinancialSummary.php                    # Financial Summaries
│   │   │   └── FinancialProjection.php                 # Financial Projections
│   │   │
│   │   ├── Forecast/
│   │   │   ├── ForecastData.php                        # Forecast Historical Data
│   │   │   ├── ForecastResult.php                      # Forecast Results
│   │   │   └── ForecastInsight.php                     # AI Forecast Insights
│   │   │
│   │   ├── Affiliate/
│   │   │   ├── AffiliateLink.php                       # Affiliate Links
│   │   │   ├── AffiliateTrack.php                      # Affiliate Tracking
│   │   │   └── AffiliateLead.php                       # Affiliate Leads
│   │   │
│   │   └── Singapay/
│   │       ├── PaymentTransaction.php                  # Payment Transactions
│   │       ├── PremiumPdf.php                          # Premium PDF Products
│   │       └── PdfPurchase.php                         # PDF Purchase Records
│   │
│   ├── Observers/
│   │   └── FinancialCategoryObserver.php               # Financial Category Observer
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php                      # App Service Provider
│   │   └── PdfServiceProvider.php                      # PDF Service Provider
│   │
│   └── Services/
│       ├── WhatsAppService.php                         # WhatsApp API Integration
│       ├── WorkflowDiagramService.php                  # Workflow Diagrams Generation
│       ├── AffiliateService.php                        # Affiliate Business Logic
│       ├── ForecastService.php                         # Forecast/ARIMA Service
│       ├── PdfService.php                              # PDF Generation Service
│       ├── SingapayService.php                         # Singapay Integration
│       └── (Other Services)
│
├── bootstrap/
│   ├── app.php                                         # Bootstrap App
│   ├── providers.php                                   # Service Providers
│   └── cache/                                          # Cache Directory
│
├── config/
│   ├── app.php                                         # App Configuration
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
│   │
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
│   │   ├── 2025_11_28_000001_add_category_subtype_to_financial_categories.php
│   │   ├── 2025_11_29_000001_create_financial_projections_table.php
│   │   ├── 2025_12_01_050355_add_current_cash_balance_to_financial_projections_table.php
│   │   ├── (Forecast migrations)
│   │   ├── (Affiliate migrations)
│   │   └── (Singapay migrations)
│   │
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── BusinessBackgroundSeeder.php
│       ├── FinancialCategorySeeder.php
│       ├── FinancialSimulationSeeder.php
│       ├── TeamStructureSeeder.php
│       └── (Other Seeders)
│
├── public/
│   ├── index.php                                       # Entry Point
│   ├── robots.txt                                      # SEO Robots
│   ├── images/                                         # Static Images
│   │   └── watermark-logo.png                          # PDF Watermark Logo
│   └── storage/                                        # Public Storage Link
│
├── resources/
│   ├── css/
│   ├── js/
│   └── views/
│       └── pdf/
│           ├── financial-report.blade.php              # Financial Report PDF Template
│           ├── business-plan.blade.php                 # Business Plan PDF Template
│           ├── combined-report.blade.php               # Combined PDF Template
│           └── forecast-report.blade.php               # Forecast Report PDF Template
│
├── routes/
│   ├── api.php                                         # API Routes
│   ├── console.php                                     # Console Commands
│   └── web.php                                         # Web Routes
│
├── storage/
│   ├── app/                                            # Application Storage
│   ├── framework/                                      # Framework Files
│   └── logs/                                           # Log Files
│
├── tests/
│   ├── TestCase.php
│   ├── Feature/                                        # Feature Tests
│   └── Unit/                                           # Unit Tests
│
├── vendor/                                             # Composer Dependencies
├── .env                                                # Environment Variables
├── .env.example                                        # Environment Example
├── .env.singapay.example                               # Singapay Config Example
├── artisan                                             # Artisan CLI
├── composer.json                                       # Composer Config
├── composer.lock                                       # Composer Lock
├── package.json                                        # NPM Config (for Vite/Tailwind)
├── phpunit.xml                                         # PHPUnit Config
├── postcss.config.js                                   # PostCSS Config
├── tailwind.config.js                                  # Tailwind Config
├── vite.config.js                                      # Vite Config
└── README.md                                           # Backend Documentation
```

---

## ⚛️ Frontend (React + Vite) - Struktur Detail

```
frontend/
├── src/
│   ├── App.jsx                                         # Main App Component
│   ├── App.css                                         # App Styles
│   ├── main.jsx                                        # Entry Point
│   ├── index.css                                       # Global Styles
│   │
│   ├── assets/
│   │   └── (Images, Icons, etc.)
│   │
│   ├── components/
│   │   │
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx                              # Navigation Bar
│   │   │   ├── Sidebar.jsx                             # Sidebar Menu
│   │   │   ├── Footer.jsx                              # Footer Component
│   │   │   └── DashboardLayout.jsx                     # Dashboard Layout
│   │   │
│   │   ├── Public/
│   │   │   └── ProtectedRoute.jsx                      # Route Protection
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── DashboardOverview.jsx                   # Dashboard Overview
│   │   │   ├── DashboardStats.jsx                      # Statistics Cards
│   │   │   └── RecentActivity.jsx                      # Recent Activity Feed
│   │   │
│   │   ├── UserProfile/
│   │   │   ├── Profile.jsx                             # User Profile Main
│   │   │   ├── Profile-Edit.jsx                        # Edit Profile
│   │   │   └── Profile-Settings.jsx                    # Profile Settings
│   │   │
│   │   ├── BusinessPlan/
│   │   │   │
│   │   │   ├── BusinessBackground/
│   │   │   │   ├── Background.jsx                      # Main Component
│   │   │   │   ├── Background-List.jsx                 # List View
│   │   │   │   ├── Background-Create.jsx               # Create Form
│   │   │   │   ├── Background-Edit.jsx                 # Edit Form
│   │   │   │   ├── Background-View.jsx                 # Detail View
│   │   │   │   └── Background-Form.jsx                 # Shared Form Component
│   │   │   │
│   │   │   ├── MarketAnalysis/
│   │   │   │   ├── MarketAnalysis.jsx                  # Main Component
│   │   │   │   ├── MarketAnalysis-List.jsx             # List View
│   │   │   │   ├── MarketAnalysis-Create.jsx           # Create Form
│   │   │   │   ├── MarketAnalysis-Edit.jsx             # Edit Form
│   │   │   │   ├── MarketAnalysis-View.jsx             # Detail View
│   │   │   │   └── MarketAnalysis-Form.jsx             # Shared Form Component
│   │   │   │
│   │   │   ├── ProductService/
│   │   │   │   ├── ProductService.jsx                  # Main Component
│   │   │   │   ├── ProductService-List.jsx             # List View
│   │   │   │   ├── ProductService-Create.jsx           # Create Form
│   │   │   │   ├── ProductService-Edit.jsx             # Edit Form
│   │   │   │   ├── ProductService-View.jsx             # Detail View
│   │   │   │   └── ProductService-Form.jsx             # Shared Form Component
│   │   │   │
│   │   │   ├── MarketingStrategies/
│   │   │   │   ├── MarketingStrategies.jsx             # Main Component
│   │   │   │   ├── MarketingStrategies-List.jsx        # List View
│   │   │   │   ├── MarketingStrategies-Create.jsx      # Create Form
│   │   │   │   ├── MarketingStrategies-Edit.jsx        # Edit Form
│   │   │   │   ├── MarketingStrategies-View.jsx        # Detail View
│   │   │   │   └── MarketingStrategies-Form.jsx        # Shared Form Component
│   │   │   │
│   │   │   ├── OperationalPlan/
│   │   │   │   ├── OperationalPlan.jsx                 # Main Component
│   │   │   │   ├── OperationalPlan-List.jsx            # List View
│   │   │   │   ├── OperationalPlan-Create.jsx          # Create Form
│   │   │   │   ├── OperationalPlan-Edit.jsx            # Edit Form
│   │   │   │   ├── OperationalPlan-View.jsx            # Detail View
│   │   │   │   └── OperationalPlan-Form.jsx            # Shared Form Component
│   │   │   │
│   │   │   ├── TeamStructure/
│   │   │   │   ├── TeamStructure.jsx                   # Main Component
│   │   │   │   ├── TeamStructure-List.jsx              # List View
│   │   │   │   ├── TeamStructure-Create.jsx            # Create Form
│   │   │   │   ├── TeamStructure-Edit.jsx              # Edit Form
│   │   │   │   ├── TeamStructure-View.jsx              # Detail View
│   │   │   │   ├── TeamStructure-Form.jsx              # Shared Form Component
│   │   │   │   ├── OrgChart.jsx                        # Organization Chart
│   │   │   │   └── GenerateSalaryModal.jsx             # Salary Generator Modal
│   │   │   │
│   │   │   ├── FinancialPlan/
│   │   │   │   ├── FinancialPlan.jsx                   # Main Component
│   │   │   │   ├── FinancialPlan-List.jsx              # List View
│   │   │   │   ├── FinancialPlan-Create.jsx            # Create Form
│   │   │   │   ├── FinancialPlan-Edit.jsx              # Edit Form
│   │   │   │   ├── FinancialPlan-View.jsx              # Detail View
│   │   │   │   ├── FinancialPlan-Form.jsx              # Shared Form Component
│   │   │   │   ├── FinancialPlan-Charts.jsx            # Charts Component
│   │   │   │   └── FinancialPlan-DashboardCharts.jsx   # Dashboard Charts
│   │   │   │
│   │   │   └── PdfBusinessPlan/
│   │   │       ├── PdfBusinessPlan.jsx                 # PDF Export Component
│   │   │       └── ChartCaptureRenderer.jsx            # Chart Capture Utility
│   │   │
│   │   ├── ManagementFinancial/
│   │   │   │
│   │   │   ├── FinancialCategories/
│   │   │   │   ├── FinancialCategories.jsx             # Main Component
│   │   │   │   ├── Category-List.jsx                   # List View
│   │   │   │   ├── Category-Create.jsx                 # Create Form
│   │   │   │   ├── Category-Edit.jsx                   # Edit Form
│   │   │   │   └── Category-View.jsx                   # Detail View
│   │   │   │
│   │   │   ├── FinancialSimulation/
│   │   │   │   ├── FinancialSimulation.jsx             # Main Component
│   │   │   │   ├── Simulation-Dashboard.jsx            # Simulation Dashboard
│   │   │   │   ├── Simulation-List.jsx                 # List View
│   │   │   │   ├── Simulation-Create.jsx               # Create Form
│   │   │   │   ├── Simulation-Edit.jsx                 # Edit Form
│   │   │   │   ├── Simulation-View.jsx                 # Detail View
│   │   │   │   ├── Simulation-Form.jsx                 # Shared Form Component
│   │   │   │   └── Year-Management.jsx                 # Year Management
│   │   │   │
│   │   │   ├── FinancialProjections/
│   │   │   │   └── FinancialProjections.jsx            # Financial Projections Component
│   │   │   │
│   │   │   ├── FinancialSummaries/
│   │   │   │   ├── FinancialSummaries.jsx              # Main Component
│   │   │   │   ├── Summary-List.jsx                    # List View
│   │   │   │   ├── Summary-Create.jsx                  # Create Form
│   │   │   │   ├── Summary-Edit.jsx                    # Edit Form
│   │   │   │   ├── Summary-View.jsx                    # Detail View
│   │   │   │   ├── Summary-Form.jsx                    # Shared Form Component
│   │   │   │   ├── SummaryChart.jsx                    # Summary Charts
│   │   │   │   └── Year-Display.jsx                    # Year Display Component
│   │   │   │
│   │   │   ├── MonthlyReports/
│   │   │   │   ├── MonthlyReports.jsx                  # Main Component
│   │   │   │   ├── MonthlyReports-View.jsx             # Reports View
│   │   │   │   ├── IncomeStatement.jsx                 # Income Statement
│   │   │   │   ├── CashFlow.jsx                        # Cash Flow Statement
│   │   │   │   ├── BalanceSheet.jsx                    # Balance Sheet
│   │   │   │   └── TrendCharts.jsx                     # Trend Charts
│   │   │   │
│   │   │   └── ExportPDF/
│   │   │       ├── ExportPDF.jsx                       # Financial Report PDF Export
│   │   │       └── ExportPDFLengkap.jsx                # Combined PDF Export
│   │   │
│   │   ├── Forecast/
│   │   │   ├── Forecast-Create.jsx                     # Create Forecast
│   │   │   ├── Forecast-Data.jsx                       # Forecast Data Management
│   │   │   ├── Forecast-DataList.jsx                   # Data List View
│   │   │   ├── Forecast-Edit.jsx                       # Edit Forecast
│   │   │   ├── Forecast-List.jsx                       # Forecast List
│   │   │   ├── Forecast-Results.jsx                    # Results Display
│   │   │   ├── Forecast-View.jsx                       # Detail View
│   │   │   ├── ForecastChart.jsx                       # Forecast Charts
│   │   │   ├── InsightCard.jsx                         # AI Insight Card
│   │   │   └── PdfForecastExport.jsx                   # PDF Export
│   │   │
│   │   └── Affiliate/
│   │       ├── Affiliate.jsx                           # Main Component
│   │       ├── AffiliateLink.jsx                       # Link Management
│   │       ├── AffiliateLandingPage.jsx                # Landing Page Builder
│   │       ├── AffiliateLeads.jsx                      # Lead Management
│   │       └── AffiliateTracking.jsx                   # Analytics & Tracking
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx                             # Authentication Context
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx                             # Public Landing Page
│   │   ├── Login.jsx                                   # Login Page
│   │   ├── Register.jsx                                # Registration Page
│   │   ├── ForgotPassword.jsx                          # Forgot Password Page
│   │   ├── ResetPassword.jsx                           # Reset Password Page
│   │   ├── OtpVerification.jsx                         # OTP Verification Page
│   │   ├── Dashboard.jsx                               # Main Dashboard
│   │   ├── BusinessPlan.jsx                            # Business Plan Page
│   │   ├── ManagementFinancial.jsx                     # Financial Management Page
│   │   ├── Forecast.jsx                                # Forecast Page
│   │   ├── Forecast-List.jsx                           # Forecast List Page
│   │   ├── Forecast-Results.jsx                        # Forecast Results Page
│   │   ├── Affiliate.jsx                               # Affiliate Page
│   │   └── ExportPDFLengkap.jsx                        # Combined PDF Export Page
│   │
│   ├── services/
│   │   │
│   │   ├── businessPlan/
│   │   │   ├── businessPlanApi.js                      # Business Background API
│   │   │   ├── marketAnalysisApi.js                    # Market Analysis API
│   │   │   ├── financialPlanApi.js                     # Financial Plan API
│   │   │   ├── marketingStrategyApi.js                 # Marketing Strategy API
│   │   │   ├── productServiceApi.js                    # Product/Service API
│   │   │   ├── operationalPlanApi.js                   # Operational Plan API
│   │   │   ├── teamStructureApi.js                     # Team Structure API
│   │   │   └── pdfBusinessPlanApi.js                   # PDF Business Plan API
│   │   │
│   │   ├── ManagementFinancial/
│   │   │   ├── financialCategoryApi.js                 # Financial Category API
│   │   │   ├── financialSimulationApi.js               # Financial Simulation API
│   │   │   ├── financialSummaryApi.js                  # Financial Summary API
│   │   │   ├── financialProjectionApi.js               # Financial Projection API
│   │   │   ├── monthlyReportApi.js                     # Monthly Report API
│   │   │   ├── pdfFinancialReportApi.js                # PDF Financial Report API
│   │   │   └── combinedPdfApi.js                       # Combined PDF API
│   │   │
│   │   ├── forecast/
│   │   │   ├── forecastDataApi.js                      # Forecast Data API
│   │   │   ├── forecastResultApi.js                    # Forecast Result API
│   │   │   └── pdfForecastApi.js                       # PDF Forecast API
│   │   │
│   │   ├── affiliate/
│   │   │   ├── affiliateLinkApi.js                     # Affiliate Link API
│   │   │   ├── affiliateTrackApi.js                    # Affiliate Tracking API
│   │   │   └── affiliateLeadApi.js                     # Affiliate Lead API
│   │   │
│   │   ├── authApi.js                                  # Authentication API
│   │   └── userApi.js                                  # User Management API
│   │
│   └── utils/
│       ├── chartCapture.js                             # Chart Screenshot Utility
│       ├── dateHelpers.js                              # Date Formatting Helpers
│       ├── validators.js                               # Form Validators
│       ├── formatters.js                               # Data Formatters
│       └── constants.js                                # App Constants
│
├── public/
│   └── (Static Assets)
│
├── dist/                                               # Production Build Output
├── node_modules/                                       # NPM Dependencies
├── .env                                                # Environment Variables
├── .env.development                                    # Development Environment
├── .env.production                                     # Production Environment
├── index.html                                          # HTML Template
├── package.json                                        # NPM Config
├── package-lock.json                                   # NPM Lock
├── vite.config.js                                      # Vite Configuration
├── tailwind.config.js                                  # Tailwind Configuration
├── eslint.config.js                                    # ESLint Configuration
└── README.md                                           # Frontend Documentation
```

---

## 📋 Database Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts & authentication |
| `cache` | Application cache |
| `jobs` | Queue jobs |
| `personal_access_tokens` | API tokens (Sanctum) |
| `sessions` | User session data |
| `password_reset_tokens` | Password reset tokens |
| **Business Plan** | |
| `business_backgrounds` | Business information & background |
| `market_analyses` | Market analysis data |
| `product_services` | Products & services catalog |
| `marketing_strategies` | Marketing & sales strategies |
| `operational_plans` | Operational plans & workflows |
| `team_structures` | Team organization & hierarchy |
| `financial_plans` | Business financial planning |
| **Financial Management** | |
| `financial_categories` | Financial categories (Income/Expense with subtypes) |
| `financial_simulations` | What-if scenario simulations |
| `financial_summaries` | Monthly financial summaries |
| `financial_projections` | Long-term financial projections |
| **Forecast & AI** | |
| `forecast_data` | Historical data for forecasting |
| `forecast_results` | ARIMA forecast results |
| `forecast_insights` | AI-generated insights |
| **Affiliate System** | |
| `affiliate_links` | Affiliate marketing links |
| `affiliate_tracks` | Click tracking & analytics |
| `affiliate_leads` | Lead capture & conversion |
| **Payment (Singapay)** | |
| `payment_transactions` | Payment transaction records |
| `premium_pdfs` | Premium PDF products |
| `pdf_purchases` | PDF purchase history |

---

## 📊 Tech Stack

### Backend
- **Framework**: Laravel 11.x
- **Language**: PHP 8.2+
- **Database**: MySQL 8.0+ / PostgreSQL
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DomPDF
- **Payment Gateway**: Singapay Integration
- **Forecasting**: PHP-ML (ARIMA Algorithm)
- **Build Tools**: Vite, PostCSS, Tailwind CSS

### Frontend
- **Framework**: React 18.3+
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Context API
- **Charts**: Chart.js 4.x + react-chartjs-2
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6.x
- **Icons**: Lucide React
- **Forms**: React Hook Form (optional)
- **Date Handling**: date-fns / dayjs

---

## 🔄 Fitur Utama Aplikasi

### 1. Business Planning
- **Business Background**: Informasi dasar bisnis, visi, misi, nilai perusahaan
- **Market Analysis**: Analisis pasar (TAM/SAM/SOM), competitor analysis
- **Product/Service**: Katalog produk & layanan
- **Marketing Strategy**: Strategi pemasaran & penjualan
- **Operational Plan**: Rencana operasional & workflow bisnis
- **Team Structure**: Struktur organisasi dengan hierarchy
- **Financial Plan**: Perencanaan keuangan bisnis
- **PDF Export**: Export business plan lengkap ke PDF

### 2. Financial Management
- **Financial Categories**: Manajemen kategori keuangan (Income/Expense dengan subtype)
- **Financial Simulation**: Simulasi what-if scenario keuangan
- **Financial Summaries**: Ringkasan keuangan bulanan dengan KPI
- **Financial Projections**: Proyeksi keuangan jangka panjang
- **Monthly Reports**: 
  - Income Statement (Laporan Laba Rugi)
  - Cash Flow Statement (Laporan Arus Kas)
  - Balance Sheet (Neraca)
  - Trend Analysis Charts
- **PDF Export**: Export laporan keuangan & proyeksi ke PDF
- **Combined PDF**: Export business plan + financial report dalam satu PDF

### 3. Forecast & AI Analytics
- **Forecast Data Management**: Input & manage historical data
- **ARIMA Forecasting**: Prediksi berbasis algoritma ARIMA
- **AI Insights**: Rekomendasi & insight otomatis dari AI
- **Trend Visualization**: Visualisasi trend dengan chart interaktif
- **PDF Export**: Export forecast report ke PDF

### 4. Affiliate & Lead Generation
- **Affiliate Link Management**: Buat & kelola affiliate links
- **Click Tracking**: Track klik & konversi affiliate
- **Lead Capture**: Tangkap & kelola leads
- **Analytics Dashboard**: Dashboard analitik performa affiliate
- **Landing Page Builder**: Buat landing page untuk affiliate

### 5. User Management
- **Registration & Login**: Sistem authentication lengkap
- **Password Recovery**: Forgot password & reset via email
- **OTP Verification**: Verifikasi OTP untuk keamanan
- **User Profile**: Manajemen profil user
- **Role & Permissions**: (Future: RBAC system)

### 6. Dashboard & Analytics
- **Overview Dashboard**: Ringkasan bisnis & keuangan
- **Statistics Cards**: KPI cards untuk metrik penting
- **Recent Activity**: Feed aktivitas terbaru
- **Interactive Charts**: Visualisasi data dengan Chart.js
- **Dark Mode Support**: Tema gelap untuk kenyamanan mata

### 7. Payment Integration (Singapay)
- **Payment Processing**: Proses pembayaran via Singapay
- **Webhook Handler**: Handle callback dari payment gateway
- **Premium PDF**: Jual PDF premium
- **Transaction History**: Riwayat transaksi pembayaran

---

## 🚀 Development Commands

### Backend Commands
```bash
cd backend

# Development
php artisan serve                           # Start API server (http://localhost:8000)
php artisan migrate                         # Run database migrations
php artisan migrate:fresh --seed            # Fresh migrate with seeders
php artisan db:seed                         # Run seeders only

# Artisan Commands
php artisan command:recalculate-projections # Recalculate financial projections
php artisan cache:clear                     # Clear application cache
php artisan config:clear                    # Clear config cache
php artisan route:list                      # List all routes

# Testing
php artisan test                            # Run PHPUnit tests
vendor/bin/phpunit                          # Run tests directly

# Production
php artisan optimize                        # Optimize for production
php artisan storage:link                    # Create symbolic link for storage
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Package Management
npm install          # Install dependencies
npm update           # Update dependencies
npm outdated         # Check outdated packages
```

---

## 🆕 Recent Updates & Version History

### **Current Version: v1.3** (December 23, 2025)

#### ✨ New Features
1. **Warna Brand Custom**: Implementasi warna primer #084404 di seluruh aplikasi
2. **Dark Mode Enhancement**: Optimasi warna untuk dark mode (#10b517)
3. **Landing Page Update**: Redesign landing page dengan warna brand baru

#### 🎨 UI/UX Improvements
- Custom CSS classes untuk dark mode responsif
- Gradient background yang konsisten
- Hover effects yang smooth dan natural
- Badge & icon colors yang harmonis

---

### **Version: v1.3** (December 12, 2025)

#### ✨ New Features
1. **Combined PDF Export**: Business Plan + Financial Report dalam satu PDF
2. **Organization Chart Hierarchy**: Text-based hierarchical display in PDF
3. **Market Analysis Pie Chart**: TAM/SAM/SOM visualization
4. **Watermark Logo**: Transparent logo watermark pada setiap halaman PDF
5. **Enhanced Executive Summary**: Extended summary dengan vision, mission, team info
6. **Logo Embedding**: Logo display di cover page (base64 conversion)
7. **Font Enhancement**: Improved typography (13px Arial)

#### 📄 New Files
- Backend: 
  - `CombinedPdfController.php`
  - `combined-report.blade.php`
  - `public/images/watermark-logo.png`
- Frontend:
  - `ExportPDFLengkap.jsx`
  - `combinedPdfApi.js`

#### 🔧 Key Improvements
- ✅ Logo watermark (8% opacity, 600px)
- ✅ Text-based organization hierarchy (├─, └─)
- ✅ TAM/SAM/SOM pie chart
- ✅ Extended executive summary
- ✅ Base64 logo embedding
- ✅ Axios + JSON response pattern
- ✅ Professional A4 Portrait layout

#### 📊 PDF Sections Included
1. Cover Page
2. Table of Contents
3. Market Analysis with Charts
4. Competitive Analysis
5. Marketing & Sales Strategy
6. Operational Plan with Diagrams
7. Team Structure with Hierarchy
8. Financial Plan with Charts
9. Financial Report with Charts
10. Forecast & Insights
11. Executive Summary
12. Appendices

---

### **Version: v1.2** (November 2025)

#### ✨ New Features
1. **Financial Projections**: Long-term forecasting dengan cash balance tracking
2. **PDF Report Generation**: Professional financial report export
3. **RecalculateProjections Command**: Artisan command untuk recalculate
4. **Category Subtype Support**: Financial categories dengan subtype
5. **Export PDF Component**: UI untuk export financial reports

#### 📄 New Files
- Backend:
  - `FinancialProjectionController.php`
  - `PdfFinancialReportController.php`
  - `RecalculateProjections.php`
  - 3 new migrations
- Frontend:
  - `FinancialProjections.jsx`
  - `ExportPDF.jsx`
  - `financialProjectionApi.js`

---

### **Version: v1.1** (October 2025)

#### ✨ New Features
1. **Monthly Financial Reports**: Income Statement, Cash Flow, Balance Sheet
2. **Trend Charts**: Visualisasi trend dengan Chart.js
3. **Improved Year Management**: Better handling untuk multi-year data
4. **Print Functionality**: Print-friendly reports
5. **Dark Mode Support**: Dark mode untuk dashboard & reports

---

### **Version: v1.0** (September 2025)

#### 🎉 Initial Release
- Business Planning Module
- Financial Management Module
- Forecast & AI Analytics
- Affiliate System
- User Authentication
- Dashboard & Analytics
- PDF Export (Business Plan)

---

## 📝 Development Guidelines

### Coding Standards
- **Backend**: Follow PSR-12 coding standard
- **Frontend**: Follow Airbnb JavaScript Style Guide
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Write clear comments for complex logic

### Git Workflow
- **Main Branch**: `main` (production-ready)
- **Development Branch**: `branch-pandu` (active development)
- **Feature Branches**: `feature/feature-name`
- **Bug Fixes**: `bugfix/bug-description`

### Testing Guidelines
- Write unit tests for critical business logic
- Write feature tests for API endpoints
- Test UI components with user interactions
- Maintain test coverage above 70%

---

## 🔗 API Endpoints Overview

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password
- `POST /api/verify-otp` - Verify OTP

### Business Plan
- `/api/business-plans/*` - Business background CRUD
- `/api/market-analyses/*` - Market analysis CRUD
- `/api/product-services/*` - Product/service CRUD
- `/api/marketing-strategies/*` - Marketing strategy CRUD
- `/api/operational-plans/*` - Operational plan CRUD
- `/api/team-structures/*` - Team structure CRUD
- `/api/financial-plans/*` - Financial plan CRUD
- `/api/business-plan/pdf` - Export business plan PDF

### Financial Management
- `/api/financial-categories/*` - Category CRUD
- `/api/financial-simulations/*` - Simulation CRUD
- `/api/financial-summaries/*` - Summary CRUD
- `/api/financial-projections/*` - Projection CRUD
- `/api/monthly-reports/*` - Monthly report CRUD
- `/api/financial-report/pdf` - Export financial report PDF
- `/api/combined-report/pdf` - Export combined PDF

### Forecast
- `/api/forecast-data/*` - Forecast data CRUD
- `/api/forecast-results/*` - Forecast results CRUD
- `/api/forecast/pdf` - Export forecast PDF

### Affiliate
- `/api/affiliate-links/*` - Affiliate link CRUD
- `/api/affiliate-tracks/*` - Tracking CRUD
- `/api/affiliate-leads/*` - Lead CRUD

### User
- `/api/user/profile` - Get user profile
- `/api/user/update` - Update profile

---

## 📧 Contact & Support

- **Developer**: Pandu
- **Project**: Grapadi Strategix - SmartPlan Web
- **Repository**: SmartPlan-Web
- **Current Branch**: branch-pandu
- **Last Updated**: December 23, 2025 22:15 WIB

---

## 📌 Notes

- Dokumentasi ini akan terus diperbarui seiring perkembangan project
- Untuk detail implementasi spesifik, lihat dokumentasi di folder `DOCS/`
- Untuk troubleshooting, gunakan script `debug-pdf.ps1` untuk debug PDF generation
- Environment variables harus dikonfigurasi sesuai `.env.example`

---

**© 2025 Grapadi Strategix. All rights reserved.**
