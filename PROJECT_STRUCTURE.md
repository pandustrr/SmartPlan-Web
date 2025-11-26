# SmartPlan-Web Project Structure - Dokumentasi Lengkap

## 📁 Struktur Project Umum

```
SmartPlan-Web/
├── ai-server/          # Python AI Services
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
│   │   │   └── ManagementFinancial/
│   │   │       ├── ManagementFinancialController.php   # Financial Management
│   │   │       ├── FinancialSimulationController.php   # Simulations
│   │   │       └── FinancialSummaryController.php      # Financial Summaries
│   │   └── Middleware/
│   │       └── CorsMiddleware.php                      # CORS Configuration
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
│       └── WorkflowDiagramService.php                  # Workflow Diagrams
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
│   │   └── 2025_11_25_004624_create_financial_summaries_table.php
│   │
│   └── seeders/
│       ├── BusinessBackgroundSeeder.php                # Business Data Seeds
│       └── (Other seeders)
│
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
│   │   │   └── FinancialSummaries/
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
│   │   └── (API calls, utilities)
│   │
│   └── utils/                                          # Utility Functions
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
- **ManagementFinancial Components**: Financial Categories, Financial Simulation, Financial Summaries
- **Dashboard Components**: Visualizations and summaries
- **Layout Components**: Navigation, sidebar, headers
- **Forecast Components**: Forecasting tools

---

## 🤖 AI Server (Python)

```
ai-server/
└── arima.py                                            # ARIMA Time Series Forecasting
                                                        # Used for financial predictions
                                                        # and data analysis
```

### Fungsi:
- Time series forecasting menggunakan ARIMA
- Prediksi finansial
- Data analysis dan insights

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
- **Linting**: ESLint
- **Language**: JavaScript (JSX)

### AI/Data Science
- **Language**: Python
- **Libraries**: ARIMA (statsmodels)
- **Purpose**: Time series forecasting

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
- Financial plan creation
- Financial categories
- What-if simulations
- Financial summaries
- PDF report generation

### 4. Forecasting & Analysis
- ARIMA-based time series forecasting
- Data visualization
- Predictive analytics

### 5. Integration Services
- WhatsApp notifications
- PDF generation
- Workflow diagrams

### 6. Dashboard
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

### AI Server
```bash
cd ai-server
python arima.py               # Run ARIMA forecasting
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
└── Many: FinancialSimulations

FinancialPlan (1)
├── Many: FinancialSimulations
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

### Python (AI Server)
- `statsmodels` - ARIMA
- `numpy` - Numerical computing
- `pandas` - Data manipulation

---

## 📋 Current Branch Info

- **Repository**: SmartPlan-Web
- **Owner**: pandustrr
- **Current Branch**: branch-pandu
- **Default Branch**: main

---

*Generated on: 2025-11-26*
*Last Updated: Dokumentasi Lengkap v1.0*
