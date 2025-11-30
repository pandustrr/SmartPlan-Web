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
│   │   │   │   └── MonthlyReportController.php         # Monthly Reports
│   │   │   └── Affiliate/
│   │   │       ├── AffiliateLinkController.php         # Affiliate Link Management
│   │   │       ├── AffiliateTrackController.php        # Click Tracking & Analytics
│   │   │       └── AffiliateLeadController.php         # Lead Capture & Management
│   │   └── Middleware/
│   │       └── CorsMiddleware.php                      # CORS Configuration
│   │
│   │   ├── Models/
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
│   │   │   ├── AffiliateLink.php                       # Affiliate Links (NEW)
│   │   │   ├── AffiliateTrack.php                      # Affiliate Tracking (NEW)
│   │   │   └── AffiliateLead.php                       # Affiliate Leads (NEW)
│   │   └── ManagementFinancial/
│   │       ├── FinancialCategory.php                   # Categories
│   │       ├── FinancialSimulation.php                 # Simulations
│   │       └── FinancialSummary.php                    # Summaries
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php                      # App Service Provider
│   │   └── PdfServiceProvider.php                      # PDF Service Provider
│   │
│   └── Services/
│       ├── WhatsAppService.php                         # WhatsApp API Integration
│       ├── WorkflowDiagramService.php                  # Workflow Diagrams
│       └── AffiliateService.php                        # Affiliate Logic (NEW)
│
├── bootstrap/
│   ├── app.php                                         # Bootstrap App
│   ├── providers.php                                   # Service Providers
│   └── cache/
│       ├── packages.php                                # Package Cache
│       └── services.php                                # Services Cache
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
│   │   └── 2025_11_26_000000_add_year_to_financial_simulations_table.php
│   │
│   └── seeders/
│       ├── BusinessBackgroundSeeder.php                # Business Data Seeds
│       └── (Other seeders)
���
├── public/
│   ├── index.php                                       # Entry Point
│   ├── robots.txt                                      # SEO Robots
│   └── storage/                                        # Symbolic Link
│
├── resources/
│   ├── css/                                            # CSS Files
│   ├── js/                                             # JavaScript Files
│   └── views/                                          # Blade Views
│
├── routes/
│   ├── api.php                                         # API Routes
│   ├── console.php                                     # Console Commands
│   └── web.php                                         # Web Routes
│
├── storage/
│   ├── app/                                            # Application Storage
│   ├── framework/                                      # Framework Storage
│   └── logs/                                           # Log Files
│
├── tests/
│   ├── TestCase.php                                    # Base Test Case
│   ├── Feature/                                        # Feature Tests
│   └── Unit/                                           # Unit Tests
│
├── vendor/                                             # Composer Dependencies
│   ├── laravel/                                        # Laravel Framework
│   ├── symfony/                                        # Symfony Components
│   ├── phpunit/                                        # PHPUnit Testing
│   ├── doctrine/                                       # Doctrine ORM
│   ├── guzzlehttp/                                     # HTTP Client
│   ├── composer/                                       # Composer
│   └── (Other dependencies)
│
├── artisan                                             # Artisan CLI
├── composer.json                                       # PHP Dependencies
├── package.json                                        # Node.js Dependencies
├── phpunit.xml                                         # PHPUnit Config
├── postcss.config.js                                   # PostCSS Config
├── tailwind.config.js                                  # Tailwind CSS Config
├── vite.config.js                                      # Vite Build Config
└── README.md
```

### 📋 Backend Database Tables (dari migrations):
- `users` - User accounts
- `cache` - Cache table
- `jobs` - Queue jobs
- `personal_access_tokens` - API tokens (Sanctum)
- `sessions` - Session data
- `password_reset_tokens` - Password reset tokens
- `business_backgrounds` - Business information
- `market_analyses` - Market analysis data
- `product_services` - Products/Services
- `marketing_strategies` - Marketing plans
- `operational_plans` - Operational plans
- `team_structures` - Team organization
- `financial_plans` - Financial planning
- `financial_categories` - Financial categories
- `financial_simulations` - What-if simulations
- `financial_summaries` - Financial summaries
- `affiliate_links` - Affiliate links (NEW)
- `affiliate_tracks` - Click tracking (NEW)
- `affiliate_leads` - Lead capture (NEW)

---

## ⚛️ Frontend (React + Vite) - Struktur Detail

```
frontend/
├── src/
│   ├── App.jsx                                         # Main App Component
│   ├── App.css                                         # Global Styles
│   ├── main.jsx                                        # Entry Point
│   ├── index.css                                       # Global CSS
│   │
│   ├── assets/                                         # Static Assets
│   │   └── (images, fonts, etc.)
│   │
│   ├── components/                                     # Reusable Components
│   │   ├── BusinessPlan/                               # Business Plan Components
│   │   │   ├── BusinessBackground/
│   │   │   ├── FinancialPlan/
│   │   │   ├── MarketAnalysis/
│   │   │   ├── MarketingStrategies/
│   │   │   ├── OperationalPlan/
│   │   │   ├── ProductService/
│   │   │   ├── TeamStructure/
│   │   │   └── PdfBusinessPlan/
│   │   │
│   │   ├── ManagementFinancial/                        # Financial Management Components
│   │   │   ├── FinancialCategories/
│   │   │   ├── FinancialSimulation/
│   │   │   │   ├── Simulation-Dashboard.jsx            # Dashboard view
│   │   │   │   ├── Simulation-List.jsx                 # List view
│   │   │   │   ├── Simulation-Create.jsx               # Create form
│   │   │   │   ├── Simulation-Edit.jsx                 # Edit form
│   │   │   │   ├── Simulation-View.jsx                 # Detail view
│   │   │   │   ├── Year-Management.jsx                 # Year CRUD management
│   │   │   │   └── FinancialSimulation.jsx             # Main component
│   │   │   ├── FinancialSummaries/
│   │   │   │   ├── Summary-List.jsx                    # List view with KPI cards
│   │   │   │   ├── Summary-View.jsx                    # Detail view
│   │   │   │   ├── Summary-Chart.jsx                   # Chart visualization
│   │   │   │   ├── Year-Display.jsx                    # Year selector (read-only)
│   │   │   │   ├── FinancialSummaries.jsx              # Main component
│   │   │   │   └── Year-Manager.jsx                    # (Deprecated - use Year-Display)
│   │   │   └── MonthlyReports/
│   │   │       ├── MonthlyReports.jsx                  # Monthly financial reports
│   │   │       └── (Includes: Income Statement, Cash Flow, Balance Sheet, Trend Charts)
│   │   │
│   │   ├── Dashboard/                                  # Dashboard Components
│   │   ├── Forecast/                                   # Forecasting Components
│   │   ├── Layout/                                     # Layout Components
│   │   ├── Public/                                     # Public Components
│   │   └── UserProfile/                                # User Profile Components
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx                             # Authentication Context
│   │
│   ├── pages/                                          # Page Components
│   │   ├── BusinessPlan.jsx                            # Business Plan Page
│   │   ├── Dashboard.jsx                               # Dashboard Page
│   │   ├── ManagementFinancial.jsx                     # Financial Management Page
│   │   ├── Login.jsx                                   # Login Page
│   │   ├── Register.jsx                                # Registration Page
│   │   ├── ForgotPassword.jsx                          # Forgot Password Page
│   │   ├── ResetPassword.jsx                           # Reset Password Page
│   │   ├── OtpVerification.jsx                         # OTP Verification Page
│   │   ├── LandingPage.jsx                             # Landing Page
│   │   └── (Other pages)
│   │
│   ├── services/                                       # API & Services
│   │   ├── businessPlan/                               # Business Plan APIs
│   │   ├── ManagementFinancial/
│   │   │   ├── monthlyReportApi.js                     # Monthly Reports API
│   │   │   └── (Other financial APIs)
│   │   ├── authApi.js                                  # Authentication API
│   │   └── userApi.js                                  # User API
│   │
│   └── utils/                                          # Utility Functions
│       ├── chartCapture.js                             # Chart utilities
│       └── (Helper functions)
│
├── public/                                             # Public Static Files
├── index.html                                          # HTML Entry Point
├── package.json                                        # NPM Dependencies
├── vite.config.js                                      # Vite Config
├── tailwind.config.js                                  # Tailwind CSS Config
├── eslint.config.js                                    # ESLint Config
├── README.md
└── (Other config files)
```

### 🎨 Frontend Pages & Routes:
- **LandingPage** - Public landing page
- **Login** - User login
- **Register** - User registration
- **ForgotPassword** - Password recovery
- **ResetPassword** - Password reset
- **OtpVerification** - OTP verification
- **Dashboard** - Main dashboard
- **BusinessPlan** - Business planning module
- **ManagementFinancial** - Financial management module

### 🧩 Frontend Component Structure:
- **BusinessPlan Components**: Business Background, Financial Plan, Market Analysis, Marketing Strategy, Operational Plan, Product/Service, Team Structure, PDF Export
- **ManagementFinancial Components**:
  - **Financial Simulation**: Dashboard, List, Create, Edit, View, Year Management
  - **Financial Summaries**: List with KPI cards, Detail view, Chart visualization, Year selector (read-only)
  - **Monthly Reports**: Income Statement, Cash Flow, Balance Sheet, Trend Charts
- **Dashboard Components**: Visualizations and summaries
- **Layout Components**: Navigation, sidebar, headers
- **Forecast Components**: Forecasting tools

---

## 📊 Tech Stack Summary

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8+
- **Database**: MySQL/PostgreSQL (via Laravel)
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DOMPDF (barryvdh/laravel-dompdf)
- **Email**: PHPMailer
- **Testing**: PHPUnit
- **Build Tool**: Vite + PostCSS + Tailwind
- **API Documentation**: RESTful API

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API (AuthContext)
- **Charts**: Chart.js + react-chartjs-2
- **Linting**: ESLint
- **Language**: JavaScript (JSX)

---

## 🔄 Key Features & Modules

### 1. Authentication & User Management
- User registration & login
- OTP verification
- Password reset
- Role-based access

### 2. Business Planning
- Business background information
- Financial planning
- Market analysis
- Competitor analysis
- Marketing strategies
- Operational planning
- Product/service management
- Team structure

### 3. Financial Management
- **Financial Simulation**:
  - Dashboard with cash flow summary
  - Create, edit, view simulations
  - Year management (add/delete years)
  - Filter by type, status, category, year, month
  - Quick stats and recent simulations
  
- **Financial Summaries**:
  - Monthly financial summaries
  - KPI cards (Total Income, Total Expense, Net Profit, Avg Monthly)
  - Summary chart visualization
  - Year selector (read-only, auto-synced from simulations)
  - Month filter
  - Generate summaries from simulations
  - Helper card with summary information
  
- **Monthly Reports** (NEW):
  - Laporan Laba Rugi Bulanan (Monthly Income Statement)
  - Laporan Arus Kas Bulanan (Monthly Cash Flow)
  - Neraca Sederhana (Simple Balance Sheet)
  - Grafik Tren Bulanan (Monthly Trend Charts)
  - KPI metrics cards
  - Year filter (auto-synced from simulations)
  - Print functionality
  - Dark mode support
  - Helper text for each report type

- Financial plan creation
- Financial categories
- What-if simulations
- Financial summaries
- PDF report generation

### 4. Affiliate & Lead Generation (NEW)
- **Affiliate Link Management**:
  - Auto-generated slug dari nama user
  - Custom slug editor (max 2x perubahan)
  - Full affiliate URL: `domain.com/affiliate/{slug}`
  - Toggle link active/inactive
  
- **Traffic Tracking**:
  - Track setiap klik affiliate link
  - Device detection (mobile, tablet, desktop)
  - Browser & OS tracking
  - Referrer tracking
  - Monthly breakdown
  
- **Lead Capture**:
  - Lead form di landing page
  - Capture: nama, email, WA, interest, notes
  - Auto-assign ke affiliate pemilik link
  - Lead status management (baru, dihubungi, closing)
  
- **Analytics Dashboard**:
  - Total clicks & leads
  - Conversion rate (leads/clicks)
  - Device breakdown chart
  - Monthly trend chart
  - Lead statistics by status

### 5. Forecasting & Analysis
- ARIMA-based time series forecasting
- Data visualization
- Predictive analytics

### 6. Integration Services
- WhatsApp notifications
- PDF generation
- Workflow diagrams

### 7. Dashboard
- KPI visualization
- Business metrics
- Financial summaries

---

## 🚀 Development Workflow

### Backend Development
```bash
cd backend
php artisan serve              # Start API server
php artisan migrate            # Run migrations
php artisan seed              # Seed database
php artisan tinker            # Interactive shell
```

### Frontend Development
```bash
cd frontend
npm run dev                    # Start development server
npm run build                  # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint
```

---

## 📝 Database Relationships

```
Users (1)
├── Many: BusinessBackgrounds
├── Many: FinancialPlans
├── Many: MarketAnalyses
├── Many: MarketingStrategies
├── Many: OperationalPlans
├── Many: ProductServices
├── Many: TeamStructures
├── Many: FinancialSimulations
└── Many: FinancialSummaries

BusinessBackground (1)
├── Many: FinancialSimulations
└── Many: FinancialSummaries

FinancialPlan (1)
├── Many: FinancialSimulations
└── Many: FinancialSummaries

FinancialCategory (1)
└── Many: FinancialSimulations

FinancialSimulation (1)
└── Many: FinancialSummaries
```

---

## 🔐 Configuration Files

### Backend Config
- **auth.php** - Authentication guards (Sanctum)
- **cors.php** - Cross-origin requests
- **database.php** - Database connections 
- **mail.php** - Email configuration
- **queue.php** - Job queues
- **cache.php** - Cache drivers

### Frontend Config
- **vite.config.js** - Build optimization
- **tailwind.config.js** - Design tokens
- **eslint.config.js** - Code standards

---

## 📦 Key Dependencies

### Backend (Laravel Packages)
- `laravel/framework` - Core framework
- `laravel/sanctum` - API authentication
- `barryvdh/laravel-dompdf` - PDF generation
- `phpunit/phpunit` - Testing
- `doctrine/orm` - ORM
- `guzzlehttp/guzzle` - HTTP client
- `symfony/` - Various utilities

### Frontend (NPM Packages)
- `react` - UI library
- `react-dom` - React DOM
- `tailwindcss` - CSS framework
- `postcss` - CSS processing
- `eslint` - Code linting
- `vite` - Build tool
- `chart.js` - Chart library
- `react-chartjs-2` - React Chart.js wrapper
- `react-toastify` - Toast notifications
- `lucide-react` - Icon library

---

## 🆕 Recent Updates (v1.1)

### New Features Added:
1. **Monthly Financial Reports Module**
   - Laporan Laba Rugi Bulanan (Monthly Income Statement)
   - Laporan Arus Kas Bulanan (Monthly Cash Flow)
   - Neraca Sederhana (Simple Balance Sheet)
   - Grafik Tren Bulanan (Monthly Trend Charts)
   - KPI metrics cards
   - Print functionality
   - Dark mode support
   - Helper text for each report type

2. **Financial Summaries Improvements**
   - Year selector now read-only (auto-synced from simulations)
   - Removed CRUD year operations (add/delete)
   - Helper card with summary information (Total Records, Tahun, Bulan Tercatat, Status)
   - Moved helper card above KPI cards and charts

3. **Financial Simulation Fixes**
   - Fixed year initialization (default to 2025)
   - Consistent year filtering across modules
   - Year auto-sync between Simulation and Summaries

### Backend API Endpoints:
- `GET /api/management-financial/reports/monthly` - Get monthly financial reports
- `GET /api/management-financial/summaries` - Get financial summaries
- `GET /api/management-financial/simulations` - Get financial simulations
- `GET /api/management-financial/simulations/available-years` - Get available years

### Frontend Routes:
- `/management-financial` - Main financial management page
  - Tab: `simulations` - Financial Simulation
  - Tab: `summaries` - Financial Summaries
  - Tab: `monthly-reports` - Monthly Reports

### Component Changes:
- **Removed**: Year-Manager CRUD functionality from FinancialSummaries
- **Added**: Year-Display component (read-only year selector)
- **Updated**: MonthlyReports component with full feature set
- **Fixed**: Year initialization in FinancialSimulation (2025 default)

---

## 🗂️ Complete Directory Tree

### Backend Complete Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── BusinessPlan/
│   │   │   │   ├── BusinessController.php
│   │   │   │   ├── FinancialPlanController.php
│   │   │   │   ├── MarketAnalysisController.php
│   │   │   │   ├── MarketingStrategyController.php
│   │   │   │   ├── OperationalPlanController.php
│   │   │   │   ├── ProductServiceController.php
│   │   │   │   ├── TeamStructureController.php
│   │   │   │   └── PdfBusinessPlanController.php
│   │   │   └── ManagementFinancial/
│   │   │       ├── ManagementFinancialController.php
│   │   │       ├── FinancialSimulationController.php
│   │   │       ├── FinancialSummaryController.php
│   │   │       └── MonthlyReportController.php
│   │   └── Middleware/
│   │       └── CorsMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── BusinessBackground.php
│   │   ├── FinancialPlan.php
│   │   ├── MarketAnalysis.php
│   │   ├── MarketAnalysisCompetitor.php
│   │   ├── MarketingStrategy.php
│   │   ├── OperationalPlan.php
│   │   ├── ProductService.php
│   │   ├── TeamStructure.php
│   │   └── ManagementFinancial/
│   │       ├── FinancialCategory.php
│   │       ├── FinancialSimulation.php
│   │       └── FinancialSummary.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── PdfServiceProvider.php
│   └── Services/
│       ├── WhatsAppService.php
│       └── WorkflowDiagramService.php
├── bootstrap/
│   ├── app.php
│   ├── providers.php
│   └── cache/
│       ├── packages.php
│       └── services.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── services.php
│   └── session.php
├── database/
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
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
│   │   └── 2025_11_26_000000_add_year_to_financial_simulations_table.php
│   └── seeders/
│       └── BusinessBackgroundSeeder.php
├── public/
│   ├── index.php
│   ├── robots.txt
│   └── storage/
├── resources/
│   ├── css/
│   ├── js/
│   └── views/
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
├── tests/
│   ├── TestCase.php
│   ├── Feature/
│   └── Unit/
├── vendor/
├── artisan
├── composer.json
├── composer.lock
├── package.json
├── phpunit.xml
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### Frontend Complete Structure
```
frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   ├── BusinessPlan/
│   │   │   ├── BusinessBackground/
│   │   │   │   ├── BusinessBackground.jsx
│   │   │   │   ├── BusinessBackground-List.jsx
│   │   │   │   ├── BusinessBackground-Create.jsx
│   │   │   │   ├── BusinessBackground-Edit.jsx
│   │   │   │   └── BusinessBackground-View.jsx
│   │   │   ├── FinancialPlan/
│   │   │   ├── MarketAnalysis/
│   │   │   ├── MarketingStrategies/
│   │   │   ├── OperationalPlan/
│   │   │   ├── ProductService/
│   │   │   ├── TeamStructure/
│   │   │   └── PdfBusinessPlan/
│   │   ├── ManagementFinancial/
│   │   │   ├── FinancialCategories/
│   │   │   │   ├── FinancialCategories.jsx
│   │   │   │   ├── Category-List.jsx
│   │   │   │   ├── Category-Create.jsx
│   │   │   │   ├── Category-Edit.jsx
│   │   │   │   └── Category-View.jsx
│   │   │   ├── FinancialSimulation/
│   │   │   │   ├── FinancialSimulation.jsx
│   │   │   │   ├── Simulation-Dashboard.jsx
│   │   │   │   ├── Simulation-List.jsx
│   │   │   │   ├── Simulation-Create.jsx
│   │   │   │   ├── Simulation-Edit.jsx
│   │   │   │   ├── Simulation-View.jsx
│   │   │   │   ├── Simulation-Form.jsx
│   │   │   │   └── Year-Management.jsx
│   │   │   ├── FinancialSummaries/
│   │   │   │   ├── FinancialSummaries.jsx
│   │   │   │   ├── Summary-List.jsx
│   │   │   │   ├── Summary-View.jsx
│   │   │   │   ├── Summary-Create.jsx
│   │   │   │   ├── Summary-Edit.jsx
│   │   │   │   ├── Summary-Form.jsx
│   │   │   │   ├── SummaryChart.jsx
│   │   │   │   └── Year-Display.jsx
│   │   │   └── MonthlyReports/
│   │   │       ├── MonthlyReports.jsx
│   │   │       ├── MonthlyReports-View.jsx
│   │   │       ├── IncomeStatement.jsx
│   │   │       ├── CashFlow.jsx
│   │   │       ├── BalanceSheet.jsx
│   │   │       └── TrendCharts.jsx
│   │   ├── Dashboard/
│   │   ├── Forecast/
│   │   ├── Layout/
│   │   ├── Public/
│   │   └── UserProfile/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── BusinessPlan.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManagementFinancial.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── OtpVerification.jsx
│   │   └── LandingPage.jsx
│   ├── services/
│   │   ├── businessPlan/
│   │   │   ├── businessPlanApi.js
│   │   │   ├── marketAnalysisApi.js
│   │   │   ├── financialPlanApi.js
│   │   │   ├── marketingStrategyApi.js
│   │   │   └── productServiceApi.js
│   │   ├── ManagementFinancial/
│   │   │   ├── financialCategoryApi.js
│   │   │   ├── financialSimulationApi.js
│   │   │   ├── financialSummaryApi.js
│   │   │   └── monthlyReportApi.js
│   │   ├── authApi.js
│   │   └── userApi.js
│   └── utils/
│       ├── chartCapture.js
│       ├── dateHelpers.js
│       ├── validators.js
│       ├── formatters.js
│       └── constants.js
├── public/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

---

## 📋 File Count Summary
- **Backend Controllers**: 16 files
- **Backend Models**: 12 files
- **Frontend Components**: ~85 files
- **Frontend Pages**: 9 files
- **API Service Files**: 11 files
- **Utility Files**: 5+ files
- **Database Migrations**: 18 files

---

## 📌 Key Statistics

| Metric | Count |
|--------|-------|
| Backend Files | ~45 |
| Frontend Components | ~85 |
| API Endpoints | ~60+ |
| Database Tables | 17 |
| Controllers | 16 |
| Models | 12 |
| Pages | 9 |
| Service Files | 11 |

---

## ✅ Version Info

**Current Version**: v1.1  
**Release Date**: November 29, 2025  
**Repository**: Grapadi Strategix  
**Owner**: pandustrr  
**Current Branch**: branch-pandu  
**Default Branch**: main

### v1.1 New Features
- ✅ Monthly Financial Reports module
- ✅ Income Statement (Laporan Laba Rugi)
- ✅ Cash Flow Report (Laporan Arus Kas)
- ✅ Balance Sheet (Neraca Sederhana)
- ✅ Trend Charts (Grafik Tren Bulanan)
- ✅ Improved year management system
- ✅ Read-only year selector in Financial Summaries
- ✅ KPI metrics display
- ✅ Print functionality for reports
- ✅ Dark mode support

**Last Updated**: November 29, 2025
