# Combined PDF Export - Implementation Guide (v1.3)

## 📋 Overview

Fitur **Combined PDF Export** memungkinkan pengguna mengunduh laporan lengkap yang menggabungkan Business Plan dan Financial Report dalam satu file PDF profesional. Laporan ini dirancang untuk presentasi lengkap kepada stakeholder dengan layout profesional dan visualisasi data yang komprehensif.

---

## 🎯 Features

### Core Functionality

1. **Unified Report Generation**
   - Business Plan + Financial Report dalam satu PDF
   - 12 sections dengan konten detail
   - Professional A4 Portrait layout
   - Enhanced typography (Arial 13px)

2. **Content Sections**
   - Cover Page dengan logo bisnis
   - Table of Contents
   - Market Analysis (dengan TAM/SAM/SOM pie chart)
   - Competitive Analysis
   - Marketing & Sales Strategy
   - Operational Plan (dengan workflow diagrams)
   - Team Structure (dengan organization hierarchy)
   - Financial Plan (6 charts)
   - Financial Report (4 charts)
   - Forecast & Insights
   - Extended Executive Summary
   - Appendices

3. **Visual Elements**
   - Logo watermark (8% opacity, 600px, on every page)
   - TAM/SAM/SOM pie chart (market analysis)
   - Workflow diagrams (operational plans)
   - Organization hierarchy text-based (team structure)
   - Business plan charts (6 charts)
   - Financial charts (4 charts)
   - Color-coded team levels

4. **Configuration**
   - Mode: Free (with watermark) / Pro (without watermark)
   - Period Type: Year / Month
   - Period Value: Flexible year/month selection
   - Watermark logo customizable via `config/app.php`

---

## 🔧 Technical Implementation

### Backend Architecture

#### Controller: `CombinedPdfController.php`
**Location**: `app/Http/Controllers/ManagementFinancial/CombinedPdfController.php`

**Main Endpoint**:
```php
POST /api/management-financial/pdf/generate-combined
```

**Request Parameters**:
```json
{
  "user_id": "integer",
  "business_background_id": "integer",
  "period_type": "year|month",
  "period_value": "2025|12-2025",
  "mode": "free|pro"
}
```

**Response Format**:
```json
{
  "status": "success",
  "data": {
    "filename": "laporan-lengkap-kedai-kopi-pandu-2025.pdf",
    "pdf_base64": "[base64 encoded PDF content]"
  }
}
```

**Generation Process (8 Steps)**:

1. **Step 1**: Fetch Business Plan Data
   - Business background, market analysis, products/services
   - Marketing strategies, operational plans, team structures
   - Financial plans

2. **Step 2**: Fetch Financial Data
   - Financial simulations per category
   - Income/expense data
   - Cash balance information

3. **Step 3**: Generate Executive Summaries
   - Business executive summary (extended)
   - Financial executive summary

4. **Step 4**: Generate Workflow Diagrams
   - Operational plan workflows (Mermaid)

5. **Step 4b**: Generate Organization Charts
   - Text-based hierarchy with tree connectors
   - Color-coded by level (Manager/Supervisor/Staff)

6. **Step 5**: Generate Business Plan Charts
   - 6 business plan visualization charts

7. **Step 5b**: Generate Market Analysis Charts
   - TAM/SAM/SOM pie chart (QuickChart API)

8. **Step 6-8**: Generate PDF
   - Compile all data
   - Convert logos to base64
   - Generate PDF using DOMPDF
   - Return as JSON with base64 encoding

#### Helper Functions

**convertLogoToDataUrl()**
- Converts local logo files to base64 data URLs
- Supports: direct file paths, URLs, storage paths
- Returns data URL for PDF embedding
- Handles MIME type detection

**createBusinessExecutiveSummary()**
- Extended summary generation
- Includes: company info, vision, mission, market target
- Adds: product count, marketing strategies, team info
- Includes: financial projections and strategic overview

**generateMarketAnalysisCharts()**
- Generates TAM/SAM/SOM pie chart
- Uses QuickChart API for rendering
- Returns chart URL for PDF embedding

**generateOrganizationCharts()**
- Text-based hierarchy per team category
- Tree connectors: ├─, └─
- Color-coded backgrounds by level
- Indented display for visual hierarchy

### Template: `combined-report.blade.php`

**Location**: `resources/views/pdf/combined-report.blade.php`

**Structure**:
- CSS styles for PDF rendering
- Watermark logo display (fixed position, 600px width)
- 12 main sections with nested content
- Tables, charts, and diagrams integration
- Page breaks between sections

**Key Variables**:
```php
$data                    // Business plan data
$financial_data          // Financial simulations
$executiveSummary        // Business summary
$financial_summary       // Financial summary
$charts                  // 6 business plan charts
$marketAnalysisCharts    // TAM/SAM/SOM pie chart
$financialCharts         // 4 financial charts
$workflows               // Workflow diagrams
$orgCharts               // Organization hierarchies
$forecast_data           // Forecast information
$watermark_logo          // Watermark logo (base64)
$mode                    // Free or Pro mode
```

### Configuration

**File**: `config/app.php`

```php
'watermark_logo' => env('WATERMARK_LOGO', '/images/watermark-logo.png'),
```

**Environment Variable** (optional):
```env
WATERMARK_LOGO=/images/custom-logo.png
```

**Default Logo Location**:
```
backend/public/images/watermark-logo.png
```

---

## 🖥️ Frontend Implementation

### Component: `ExportPDFLengkap.jsx`

**Location**: `src/components/ManagementFinancial/ExportPDF/ExportPDFLengkap.jsx`

**Main Features**:
- Business selection dropdown
- Period type selector (Year/Month)
- Period value input
- Mode selector (Free/Pro)
- Generate PDF button with loading state
- Error handling and validation
- Toast notifications for feedback

**Workflow**:
1. User selects business, period, and mode
2. Click "Generate PDF" button
3. Validate inputs and show loading state
4. Call API via `combinedPdfApi.generateCombinedPdf()`
5. Receive JSON response with base64 PDF
6. Convert base64 to Blob
7. Create download link and trigger download
8. Show success toast notification

**Error Handling**:
- 422: Validation error (missing required data)
- 404: Business not found
- 500: Server error
- Custom error messages for user feedback

### API Service: `combinedPdfApi.js`

**Location**: `src/services/ManagementFinancial/combinedPdfApi.js`

**Method**: `generateCombinedPdf(params)`

**Parameters**:
```javascript
{
  user_id: integer,
  business_background_id: integer,
  period_type: 'year' | 'month',
  period_value: '2025' | '12-2025',
  mode: 'free' | 'pro'
}
```

**Base64 to Blob Conversion**:
```javascript
const binaryString = atob(pdf_base64);
const bytes = new Uint8Array(binaryString.length);
const blob = new Blob([bytes], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
```

**Features**:
- Uses axios with auth interceptors
- 120 second timeout for large PDFs
- Automatic Bearer token injection
- Error handling and logging

---

## 📊 Data Flow Diagram

```
Frontend (React)
  ↓
[ExportPDFLengkap.jsx] - User selects: business, period, mode
  ↓
[combinedPdfApi.js] - API call with parameters
  ↓
POST /api/management-financial/pdf/generate-combined
  ↓
Backend (Laravel)
  ↓
[CombinedPdfController.php] - 8-step generation process
  ├─ Step 1: Fetch business data
  ├─ Step 2: Fetch financial data
  ├─ Step 3: Generate summaries
  ├─ Step 4: Generate workflows
  ├─ Step 4b: Generate org charts
  ├─ Step 5: Generate business charts
  ├─ Step 5b: Generate market charts
  └─ Step 6-8: Generate PDF + convert logos
  ↓
[combined-report.blade.php] - Template rendering
  ↓
[DOMPDF] - PDF generation
  ↓
base64 encoding
  ↓
JSON Response: { status, data: { filename, pdf_base64 } }
  ↓
Frontend
  ↓
[ExportPDFLengkap.jsx] - Receive response
  ↓
base64 → Blob conversion
  ↓
Download trigger
  ↓
User receives PDF file ✅
```

---

## 🎨 Design Details

### Watermark Logo

**Properties**:
- **Position**: Fixed at center of page
- **Size**: 600px width (adaptive height)
- **Opacity**: 8% (very subtle)
- **Z-index**: -1 (behind content)
- **Repeat**: Every page automatically
- **Format**: Base64 embedded (no external URL needed)

**Configuration in `config/app.php`**:
```php
'watermark_logo' => env('WATERMARK_LOGO', '/images/watermark-logo.png'),
```

**File Location**:
```
backend/public/images/watermark-logo.png
```

### Organization Hierarchy Display

**Format**: Text-based with tree connectors

**Example Output**:
```
MANAJEMEN PUNCAK (Level 1 - Light Blue)
├─ Direktur Utama
├─ Kepala Operasional

MANAGER/SUPERVISOR (Level 2 - Light Purple)
├─ Manager Penjualan
│  └─ Sales Representative
├─ Manager IT
│  └─ System Administrator

STAFF/KARYAWAN (Level 3 - Light Green)
├─ Kasir
├─ Barista
└─ Cleaning Staff
```

**Styling**:
- Level 1: Light blue background (#E3F2FD)
- Level 2: Light purple background (#F3E5F5)
- Level 3: Light green background (#E8F5E9)
- Indented by level for visual hierarchy
- Tree connectors: ├─, └─

### Market Analysis Pie Chart

**Data**:
- TAM (Total Addressable Market)
- SAM (Serviceable Addressable Market)
- SOM (Serviceable Obtainable Market)

**Visualization**:
- Pie chart via QuickChart API
- Colors: Blue (#2C5AA0), Green (#10B981), Purple (#8B5CF6)
- Legend at bottom
- No internal labels (clean look)
- 600x400px size

---

## 🚀 API Routes

**File**: `routes/api.php`

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/management-financial/pdf/generate-combined', 
        [CombinedPdfController::class, 'generateCombinedPdf']
    );
});
```

---

## 📦 Dependencies

### Backend
- **Laravel**: 11.x
- **Barryvdh DomPDF**: For PDF generation
- **Illuminate\Support\Facades**: Storage, Validator, Log, Str
- **QuickChart API**: For chart rendering (external)

### Frontend
- **React**: 18.x
- **Axios**: HTTP client
- **Vite**: Build tool

---

## ✅ Testing

### Backend Testing

1. **Database Seeding**:
   ```bash
   php artisan db:seed --class=BusinessBackgroundSeeder
   php artisan db:seed --class=TeamStructureSeeder
   php artisan db:seed --class=FinancialSimulationSeeder
   ```

2. **API Test** (Postman/Insomnia):
   ```
   POST /api/management-financial/pdf/generate-combined
   Headers: Authorization: Bearer {token}
   Body: {
     "user_id": 1,
     "business_background_id": 1,
     "period_type": "year",
     "period_value": "2025",
     "mode": "free"
   }
   ```

3. **Response Validation**:
   - Check status: "success"
   - Verify pdf_base64 is valid
   - Test base64 decode: no errors
   - Verify filename format

### Frontend Testing

1. **Component Mounting**:
   - Component renders without errors
   - Form inputs display correctly
   - Business dropdown populates

2. **User Interaction**:
   - Select business, period, mode
   - Click "Generate PDF"
   - Loading state shows
   - Success toast appears
   - PDF downloads to system

3. **Error Cases**:
   - No business selected → validation error
   - Invalid period → error message
   - Server error → error toast
   - Network timeout → retry option

---

## 🔒 Security

### Base64 Encoding
- PDF is base64 encoded server-side
- Decoded client-side before download
- Prevents IDM (Internet Download Manager) interception
- Safe for transmission over HTTP/HTTPS

### Logo Embedding
- Logos converted to base64 data URLs
- No external URL references
- Self-contained PDF file
- No dependency on external resources

### File Handling
- Temporary files cleaned up after PDF generation
- No sensitive data in filename
- PDF content is not stored on server
- Each request generates fresh PDF

---

## 🌐 Hosting Considerations

### Production Deployment

1. **Folder Structure**:
   ```
   backend/public/images/
   └── watermark-logo.png  ← Must exist
   ```

2. **Configuration**:
   - Set `WATERMARK_LOGO` in `.env` (optional)
   - Default uses `public/images/watermark-logo.png`

3. **Performance**:
   - PDF generation is CPU-intensive
   - Consider queue jobs for multiple requests
   - Typical generation time: 3-10 seconds

4. **File Permissions**:
   - `public/images/` readable by web server
   - `storage/logs/` writable for logging

5. **Memory Settings**:
   - Increase PHP memory limit if needed
   - `memory_limit = 256M` (recommended)

6. **External Services**:
   - QuickChart API must be accessible
   - Ensure CORS if on different domain

---

## 📝 Changelog

### v1.3 (Dec 12, 2025)
- ✅ Combined PDF export feature
- ✅ Organization hierarchy text-based display
- ✅ Market analysis pie chart
- ✅ Watermark logo system
- ✅ Extended executive summary
- ✅ Logo base64 embedding
- ✅ Font enhancement (Arial 13px)
- ✅ 12-section comprehensive layout

### v1.2 (Dec 1, 2025)
- ✅ Financial report PDF export
- ✅ Financial projections
- ✅ Excel-like reports

### v1.1 (Nov 2025)
- ✅ Monthly financial reports
- ✅ Basic PDF export

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Logo not showing in PDF**
- Check `public/images/watermark-logo.png` exists
- Verify file permissions (644)
- Clear cache: `php artisan cache:clear`
- Check file format (PNG/JPG supported)

**2. PDF generation timeout**
- Increase PHP timeout: `max_execution_time = 300`
- Increase memory: `memory_limit = 256M`
- Check server logs for errors

**3. Watermark not visible**
- Check CSS opacity value (8% is very subtle)
- Verify logo file is readable
- Check browser PDF viewer settings

**4. API returns 422 error**
- Validate all required parameters
- Check user and business exist in database
- Verify period format matches: "year" or "year-month"

**5. Download doesn't trigger**
- Check browser console for errors
- Verify base64 decoding works
- Test in different browser
- Check CORS settings if on different domain

---

## 📚 Related Documentation

- [Financial Report Export](./EXPORT_PDF_FINANCIAL_REPORT.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Backend Setup Guide](../backend/README.md)
- [Frontend Setup Guide](../frontend/README.md)

---

**Last Updated**: December 12, 2025  
**Version**: v1.3  
**Status**: ✅ Stable
