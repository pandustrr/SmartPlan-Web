<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Lengkap - {{ $data['business_background']->name }}</title>
    <style>
        /* Reset dan base styles - SAMA SEPERTI BUSINESS PLAN */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            font-size: 13px;
        }

        /* Watermark untuk mode gratis */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
            opacity: 0.08;
            pointer-events: none;
        }

        .watermark img {
            width: 600px;
            height: auto;
            display: block;
        }

        /* Layout halaman */
        .page {
            page-break-after: always;
            padding: 15mm;
            position: relative;
        }

        .page:last-child {
            page-break-after: auto;
        }

        /* Header - SAMA SEPERTI BUSINESS PLAN */
        .header {
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .company-name {
            font-size: 24px;
            color: #2c5aa0;
            font-weight: bold;
        }

        .document-title {
            font-size: 18px;
            color: #666;
            margin-top: 5px;
        }

        /* Sections - SAMA SEPERTI BUSINESS PLAN */
        .section {
            margin-top: 15px;
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 16px;
            color: #2c5aa0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .subsection {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }

        .subsection-title {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            margin-bottom: 8px;
        }

        /* Tables - SAMA SEPERTI BUSINESS PLAN */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 9px;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            text-align: left;
            word-wrap: break-word;
        }

        .table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        .table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        /* Utilities */
        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-bold {
            font-weight: bold;
        }

        .mb-10 {
            margin-bottom: 10px;
        }

        .mb-15 {
            margin-bottom: 15px;
        }

        .mb-5 {
            margin-bottom: 5px;
        }

        .mt-15 {
            margin-top: 15px;
        }

        .text-green {
            color: #10b981;
        }

        .text-red {
            color: #ef4444;
        }

        /* Chart images */
        .chart-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            margin: 10px auto;
            display: block;
            page-break-inside: avoid;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px;
            background: #ffffff;
        }

        /* Financial highlights */
        .financial-highlights {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #2c5aa0;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            font-size: 10px;
            color: #666;
        }

        /* Page numbers */
        .page-number:after {
            content: "Page " counter(page);
        }

        /* Separator page untuk pemisah bagian */
        .separator-page {
            text-align: center;
            padding-top: 200px;
        }

        .separator-title {
            font-size: 36px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 20px;
        }

        .separator-subtitle {
            font-size: 20px;
            color: #666;
        }
    </style>
</head>

<body>
    @if ($mode === 'free' && !empty($watermark_logo))
        <div class="watermark">
            <img src="{{ $watermark_logo }}" alt="Watermark">
        </div>
    @endif

    <!-- Cover Page - SAMA SEPERTI BUSINESS PLAN -->
    <div class="page">
        <div style="text-align: center; margin-top: 100px;">
            <h1 style="font-size: 32px; color: #2c5aa0; margin-bottom: 30px;">
                {{ $data['business_background']->name }}
            </h1>

            <!-- Logo Below Title -->
            @if ($data['business_background']->logo)
                <div style="margin-bottom: 30px;">
                    <img src="{{ $data['business_background']->logo }}" alt="Logo"
                        style="max-width: 200px; max-height: 200px;">
                </div>
            @endif

            <h2 style="font-size: 24px; color: #666; margin-bottom: 10px;">
                BUSINESS PLAN & PROYEKSI KEUANGAN
            </h2>
            <p style="font-size: 14px; color: #888;">
                Disusun pada: {{ $generated_at }}
            </p>
            @if ($mode === 'pro')
                <p style="font-size: 12px; color: #2c5aa0; margin-top: 20px; font-weight: bold;">
                    PRO VERSION
                </p>
            @endif
        </div>

        <div style="position: absolute; bottom: 50px; left: 0; right: 0; text-align: center;">
            <p style="font-size: 12px; color: #666;">
                Dokumen ini dibuat secara otomatis oleh GRAPADI STRATEGIX System
            </p>
        </div>
    </div>

    <!-- Table of Contents - SAMA SEPERTI BUSINESS PLAN -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">DAFTAR ISI</div>
        </div>

        <div class="section">
            <h3 style="font-size: 16px; color: #2c5aa0; margin-bottom: 15px;">BAGIAN 1: BUSINESS PLAN</h3>
            <ol style="line-height: 2; font-size: 14px; margin-bottom: 30px;">
                <li>Ringkasan Eksekutif</li>
                <li>Latar Belakang Bisnis</li>
                <li>Rencana Operasional</li>
                <li>Struktur Tim</li>
            </ol>

            <h3 style="font-size: 16px; color: #2c5aa0; margin-bottom: 15px;">BAGIAN 2: ASPEK PASAR
                ({{ $period_label }})</h3>
            <ol style="line-height: 2; font-size: 14px;" start="5">
                <li>Ringkasan Eksekutif Keuangan</li>
                <li>Analisis Pasar
                    <ol style="list-style-type: lower-alpha;">
                        <li>Target Pasar</li>
                        <li>Analisis Kompetitor</li>
                        <li>Analisis SWOT</li>
                    </ol>
                </li>
                <li>Produk & Layanan</li>
                <li>Strategi Pemasaran</li>
                <li>Ringkasan Per Kategori</li>
                <li>Tren Bulanan</li>
                <li>Proyeksi Keuangan 5 Tahun</li>
                <li>Ringkasan Eksekutif Forecast</li>
                <li>Detail Proyeksi Bulanan</li>
                <li>Auto Insights & Analisis</li>
            </ol>
        </div>
    </div>

    {{-- ========================================
         BAGIAN 1: BUSINESS PLAN
         Copy PERSIS dari business-plan.blade.php
    ========================================= --}}

    <!-- Separator: BAGIAN 1 -->
    <div class="page">
        <div class="separator-page">
            <div class="separator-title">BAGIAN 1</div>
            <div class="separator-subtitle">BUSINESS PLAN</div>
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">1. RINGKASAN EKSEKUTIF</div>
        </div>

        <div class="section">
            {!! nl2br(e($executiveSummary)) !!}
        </div>
    </div>

    <!-- Business Background -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">2. LATAR BELAKANG BISNIS</div>
        </div>

        <div class="section">
            <div class="subsection">
                <div class="subsection-title">Informasi Umum</div>
                <table class="table">
                    <tr>
                        <td style="width: 30%;"><strong>Nama Bisnis</strong></td>
                        <td>{{ $data['business_background']->name }}</td>
                    </tr>
                    <tr>
                        <td><strong>Kategori</strong></td>
                        <td>{{ $data['business_background']->category }}</td>
                    </tr>
                    <tr>
                        <td><strong>Lokasi</strong></td>
                        <td>{{ $data['business_background']->location }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tipe Bisnis</strong></td>
                        <td>{{ $data['business_background']->business_type }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tanggal Mulai</strong></td>
                        <td>{{ $data['business_background']->start_date ? date('d F Y', strtotime($data['business_background']->start_date)) : '-' }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="subsection">
                <div class="subsection-title">Deskripsi Bisnis</div>
                <p>{!! nl2br(e($data['business_background']->description)) !!}</p>
            </div>

            @if ($data['business_background']->business_overview)
                <div class="subsection">
                    <div class="subsection-title">Gambaran Umum Usaha</div>
                    <p>{!! nl2br(e($data['business_background']->business_overview)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->business_legality)
                <div class="subsection">
                    <div class="subsection-title">Legalitas Usaha</div>
                    <p>{!! nl2br(e($data['business_background']->business_legality)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->business_objectives)
                <div class="subsection">
                    <div class="subsection-title">Maksud & Tujuan Pendirian Usaha</div>
                    <p>{!! nl2br(e($data['business_background']->business_objectives)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->purpose)
                <div class="subsection">
                    <div class="subsection-title">Tujuan Bisnis</div>
                    <p>{!! nl2br(e($data['business_background']->purpose)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->vision)
                <div class="subsection">
                    <div class="subsection-title">Visi</div>
                    <p>{!! nl2br(e($data['business_background']->vision)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->mission)
                <div class="subsection">
                    <div class="subsection-title">Misi</div>
                    <p>{!! nl2br(e($data['business_background']->mission)) !!}</p>
                </div>
            @endif

            @if ($data['business_background']->values)
                <div class="subsection">
                    <div class="subsection-title">Nilai-Nilai</div>
                    <p>{!! nl2br(e($data['business_background']->values)) !!}</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Operational Plans -->
    @if ($data['operational_plans']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">3. RENCANA OPERASIONAL</div>
            </div>

            <div class="section">
                @foreach ($data['operational_plans'] as $plan)
                    <div style="margin-bottom: 20px;">
                        <table class="table">
                            <tr>
                                <td style="width: 20%;"><strong>Lokasi Bisnis</strong></td>
                                <td>{{ $plan->business_location }}</td>
                            </tr>
                            @if ($plan->location_description)
                                <tr>
                                    <td><strong>Deskripsi Lokasi</strong></td>
                                    <td>{!! nl2br(e($plan->location_description)) !!}</td>
                                </tr>
                            @endif
                            <tr>
                                <td><strong>Tipe Lokasi</strong></td>
                                <td>{{ $plan->location_type }}</td>
                            </tr>
                            @if ($plan->location_size)
                                <tr>
                                    <td><strong>Ukuran Lokasi</strong></td>
                                    <td>{{ number_format($plan->location_size, 0, ',', '.') }} m²</td>
                                </tr>
                            @endif
                            @if ($plan->rent_cost)
                                <tr>
                                    <td><strong>Biaya Sewa</strong></td>
                                    <td>Rp {{ number_format($plan->rent_cost, 0, ',', '.') }}/bulan</td>
                                </tr>
                            @endif
                            @if ($plan->daily_workflow)
                                <tr>
                                    <td><strong>Alur Kerja Harian</strong></td>
                                    <td>{!! nl2br(e($plan->daily_workflow)) !!}</td>
                                </tr>
                            @endif
                            @if ($plan->equipment_needs)
                                <tr>
                                    <td><strong>Kebutuhan Peralatan</strong></td>
                                    <td>{!! nl2br(e($plan->equipment_needs)) !!}</td>
                                </tr>
                            @endif
                            @if ($plan->technology_stack)
                                <tr>
                                    <td><strong>Teknologi yang Digunakan</strong></td>
                                    <td>{!! nl2br(e($plan->technology_stack)) !!}</td>
                                </tr>
                            @endif
                        </table>

                        @if (isset($workflows[$plan->id]))
                            <div style="margin-top: 15px;">
                                <h3 style="margin: 10px 0; font-size: 14px; font-weight: bold;">Diagram Alur Kerja (Generated)</h3>
                                <img src="{{ $workflows[$plan->id] }}"
                                    style="width: 100%; max-width: 120px; height: auto; margin: 10px auto; display: block; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #ffffff;"
                                    alt="Workflow Diagram {{ $plan->business_location }}" />
                            </div>
                        @endif

                        @if ($plan->workflow_image_url)
                            <div style="margin-top: 15px;">
                                <h3 style="margin: 10px 0; font-size: 14px; font-weight: bold;">Gambar Diagram Alur Kerja</h3>
                                <img src="{{ $plan->workflow_image_url }}"
                                    style="width: 100%; max-width: 200px; height: auto; margin: 10px auto; display: block; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #ffffff;"
                                    alt="Workflow Image {{ $plan->business_location }}" />
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    <!-- Team Structure -->
    @if ($data['team_structures']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">4. STRUKTUR TIM</div>
            </div>

            <div class="section">
                @php
                    $groupedTeams = $data['team_structures']->groupBy('team_category');
                @endphp

                <!-- Summary Statistics - Pindah ke atas -->
                <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
                    <p style="font-size: 11px; color: #666; line-height: 1.8; margin: 0;">
                        <strong style="color: #2c5aa0;">Total Anggota:</strong>
                        {{ $data['team_structures']->count() }} orang
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        <strong style="color: #2c5aa0;">Kategori Tim:</strong> {{ $groupedTeams->count() }} kategori
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        <strong style="color: #10b981;">Anggota Aktif:</strong>
                        {{ $data['team_structures']->where('status', 'active')->count() }} orang
                    </p>
                </div>

                @foreach ($groupedTeams as $category => $members)
                    <div style="margin-bottom: 30px; page-break-inside: avoid;">
                        <!-- Category Header - Sederhana -->
                        <h3
                            style="font-size: 14px; font-weight: bold; color: #2c5aa0; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #2c5aa0;">
                            Bagian {{ $category }}
                        </h3>

                        <!-- Member Details Table -->
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="width: 5%;">No</th>
                                    <th style="width: 20%;">Nama</th>
                                    <th style="width: 15%;">Posisi</th>
                                    <th style="width: 30%;">Job Desk</th>
                                    <th style="width: 30%;">Pengalaman</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($members as $index => $member)
                                    <tr>
                                        <td style="text-align: center;">{{ $index + 1 }}</td>
                                        <td style="font-weight: bold;">{{ $member->member_name }}</td>
                                        <td style="font-style: italic;">{{ $member->position }}</td>
                                        <td style="font-size: 8px;">{!! nl2br(e($member->jobdesk ?? '-')) !!}</td>
                                        <td style="font-size: 8px;">{!! nl2br(e($member->experience ?? '-')) !!}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    {{-- TODO: Comment - FinancialPlan nonaktif di Business Plan --}}
    {{--
    <!-- Financial Plans -->
    @if ($data['financial_plans']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">8. RENCANA KEUANGAN</div>
            </div>

            <div class="section" style="margin-top: 10px;">
                @foreach ($data['financial_plans'] as $financial)
                    <div class="subsection-title" style="margin-bottom: 10px;">{{ $financial->plan_name }}</div>

                    <!-- Financial Highlights -->
                    <div class="financial-highlights mb-15" style="page-break-inside: avoid;">
                        <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Ringkasan Keuangan</h4>
                        <table class="table">
                            <tr>
                                <td style="width: 40%;"><strong>Modal Awal</strong></td>
                                <td class="text-bold">Rp {{ number_format($financial->initial_capital, 0, ',', '.') }}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Proyeksi Penjualan Bulanan</strong></td>
                                <td>Rp {{ number_format($financial->monthly_sales, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Biaya Operasional Bulanan</strong></td>
                                <td>Rp {{ number_format($financial->monthly_opex, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Laba Bersih Bulanan</strong></td>
                                <td class="{{ $financial->monthly_net_profit >= 0 ? 'text-green' : 'text-red' }}">
                                    Rp {{ number_format($financial->monthly_net_profit, 0, ',', '.') }}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>BEP (Break Event Point)</strong></td>
                                <td>{{ number_format($financial->bep_months, 1) }} bulan</td>
                            </tr>
                            <tr>
                                <td><strong>ROI (Return on Investment)</strong></td>
                                <td>{{ number_format($financial->roi_percentage, 2) }}%</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Capital Sources -->
                    @if ($financial->capital_sources)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <div class="subsection-title">Sumber Modal</div>
                            <table class="table">
                                <tr>
                                    <th style="width: 60%;">Sumber</th>
                                    <th style="width: 40%;">Jumlah</th>
                                </tr>
                                @foreach (json_decode($financial->capital_sources, true) as $source)
                                    <tr>
                                        <td>{{ $source['source'] }}</td>
                                        <td>Rp {{ number_format($source['amount'], 0, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                            </table>
                        </div>
                    @endif

                    <!-- Sales Projections -->
                    @if ($financial->sales_projections)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <div class="subsection-title">Proyeksi Penjualan</div>
                            <table class="table">
                                <tr>
                                    <th>Item</th>
                                    <th>Harga per Unit</th>
                                    <th>Unit Terjual/Bulan</th>
                                    <th>Pendapatan/Bulan</th>
                                    <th>Pendapatan/Tahun</th>
                                </tr>
                                @foreach (json_decode($financial->sales_projections, true) as $projection)
                                    <tr>
                                        <td>{{ $projection['item'] }}</td>
                                        <td>Rp {{ number_format($projection['price'], 0, ',', '.') }}</td>
                                        <td>{{ number_format($projection['units_sold'], 0, ',', '.') }}</td>
                                        <td>Rp {{ number_format($projection['price'] * $projection['units_sold'], 0, ',', '.') }}
                                        </td>
                                        <td>Rp
                                            {{ number_format($projection['price'] * $projection['units_sold'] * 12, 0, ',', '.') }}
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </div>
                    @endif

                    <!-- Operational Expenses Breakdown -->
                    @if ($financial->monthly_opex)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <div class="subsection-title">Rincian Biaya Operasional Bulanan</div>
                            <table class="table">
                                <tr>
                                    <th>Kategori</th>
                                    <th>Biaya</th>
                                </tr>
                                @if ($financial->opex_breakdown)
                                    @foreach (json_decode($financial->opex_breakdown, true) as $expense)
                                        <tr>
                                            <td>{{ $expense['category'] }}</td>
                                            <td>Rp {{ number_format($expense['amount'], 0, ',', '.') }}</td>
                                        </tr>
                                    @endforeach
                                @else
                                    <tr>
                                        <td>Total Biaya Operasional</td>
                                        <td>Rp {{ number_format($financial->monthly_opex, 0, ',', '.') }}</td>
                                    </tr>
                                @endif
                            </table>
                        </div>
                    @endif

                    <!-- Profit Loss Summary -->
                    <div class="mb-15" style="page-break-inside: avoid;">
                        <div class="subsection-title">Proyeksi Laba Rugi</div>
                        <table class="table">
                            <tr>
                                <th>Keterangan</th>
                                <th>Bulanan</th>
                                <th>Tahunan</th>
                            </tr>
                            <tr>
                                <td><strong>Pendapatan</strong></td>
                                <td>Rp {{ number_format($financial->monthly_sales, 0, ',', '.') }}</td>
                                <td>Rp {{ number_format($financial->monthly_sales * 12, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Biaya Operasional</strong></td>
                                <td>(Rp {{ number_format($financial->monthly_opex, 0, ',', '.') }})</td>
                                <td>(Rp {{ number_format($financial->monthly_opex * 12, 0, ',', '.') }})</td>
                            </tr>
                            <tr>
                                <td><strong>Laba Bersih</strong></td>
                                <td class="{{ $financial->monthly_net_profit >= 0 ? 'text-green' : 'text-red' }}">
                                    <strong>Rp {{ number_format($financial->monthly_net_profit, 0, ',', '.') }}</strong>
                                </td>
                                <td class="{{ $financial->monthly_net_profit >= 0 ? 'text-green' : 'text-red' }}">
                                    <strong>Rp {{ number_format($financial->monthly_net_profit * 12, 0, ',', '.') }}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Margin Keuntungan</strong></td>
                                <td colspan="2">{{ number_format(($financial->monthly_net_profit / $financial->monthly_sales) * 100, 2) }}%
                                </td>
                            </tr>
                        </table>
                    </div>

                    @if ($financial->feasibility_notes)
                        <div class="subsection">
                            <div class="subsection-title">Catatan Kelayakan</div>
                            <p>{!! nl2br(e($financial->feasibility_notes)) !!}</p>
                        </div>
                    @endif

                    <!-- Financial Forecast / Cash Flow Projection -->
                    @if ($financial)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <div class="subsection-title">Proyeksi Arus Kas (12 Bulan)</div>
                            <table class="table">
                                <tr>
                                    <th>Bulan</th>
                                    <th>Pendapatan</th>
                                    <th>Pengeluaran</th>
                                    <th>Laba Bersih</th>
                                    <th>Saldo Akumulasi</th>
                                </tr>
                                @php
                                    $accumulated = $financial->initial_capital;
                                @endphp
                                @for ($month = 1; $month <= 12; $month++)
                                    @php
                                        $monthlyIncome = $financial->monthly_sales;
                                        $monthlyExpense = $financial->monthly_opex;
                                        $monthlyProfit = $monthlyIncome - $monthlyExpense;
                                        $accumulated += $monthlyProfit;
                                    @endphp
                                    <tr>
                                        <td>Bulan {{ $month }}</td>
                                        <td>Rp {{ number_format($monthlyIncome, 0, ',', '.') }}</td>
                                        <td>Rp {{ number_format($monthlyExpense, 0, ',', '.') }}</td>
                                        <td class="{{ $monthlyProfit >= 0 ? 'text-green' : 'text-red' }}">
                                            Rp {{ number_format($monthlyProfit, 0, ',', '.') }}
                                        </td>
                                        <td class="{{ $accumulated >= 0 ? 'text-green' : 'text-red' }}">
                                            <strong>Rp {{ number_format($accumulated, 0, ',', '.') }}</strong>
                                        </td>
                                    </tr>
                                @endfor
                            </table>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    @endif
    --}}
    {{-- END: TODO Comment - FinancialPlan nonaktif di Business Plan --}}

    {{-- ========================================
         BAGIAN 2: ASPEK PASAR
         Market Aspects & Financial Analysis Section
    ========================================= --}}

    <!-- Separator: BAGIAN 2 -->
    <div class="page">
        <div class="separator-page">
            <div class="separator-title">BAGIAN 2</div>
            <div class="separator-subtitle">ASPEK PASAR</div>
            <p style="font-size: 16px; color: #666; margin-top: 20px;">Periode: {{ $period_label }}</p>
        </div>
    </div>

    <!-- Financial Executive Summary -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">5. RINGKASAN EKSEKUTIF KEUANGAN</div>
        </div>

        <div class="section">
            {!! nl2br(e($financial_summary['executive_summary'] ?? 'Data ringkasan eksekutif tidak tersedia')) !!}

            @if (isset($financial_summary['summary_cards']))
                <div style="margin-top: 20px;">
                    <table class="table">
                        <tr>
                            <th style="width: 50%;">Metrik</th>
                            <th style="width: 50%;">Nilai</th>
                        </tr>
                        <tr>
                            <td><strong>Total Pendapatan</strong></td>
                            <td class="text-green">
                                Rp {{ number_format($financial_summary['summary_cards']['total_income'], 0, ',', '.') }}
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Total Pengeluaran</strong></td>
                            <td class="text-red">
                                Rp {{ number_format($financial_summary['summary_cards']['total_expense'], 0, ',', '.') }}
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Laba Bersih</strong></td>
                            <td
                                class="{{ $financial_summary['summary_cards']['net_profit'] >= 0 ? 'text-green' : 'text-red' }}">
                                <strong>
                                    Rp {{ number_format($financial_summary['summary_cards']['net_profit'], 0, ',', '.') }}
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Saldo Kas</strong></td>
                            <td class="{{ $financial_summary['summary_cards']['cash_balance'] >= 0 ? 'text-green' : 'text-red' }}">
                                Rp {{ number_format($financial_summary['summary_cards']['cash_balance'], 0, ',', '.') }}
                            </td>
                        </tr>
                    </table>
                </div>
            @endif

            @if (isset($financialCharts['income_vs_expense']))
                <div style="margin-top: 15px;">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Grafik Pendapatan vs
                        Pengeluaran</h4>
                    <img src="{{ $financialCharts['income_vs_expense'] }}" alt="Income vs Expense Chart"
                        class="chart-image">
                </div>
            @endif
        </div>
    </div>

    <!-- Market Analysis -->
    @if ($data['market_analysis'])
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">6. ANALISIS PASAR</div>
            </div>

            <div class="section">
                <!-- 1. Target Pasar -->
                @if ($data['market_analysis']->target_market)
                    <div class="subsection">
                        <div class="subsection-title">Target Pasar</div>
                        <p>{!! nl2br(e($data['market_analysis']->target_market)) !!}</p>
                    </div>
                @endif

                <!-- 2. Ukuran Pasar -->
                @if ($data['market_analysis']->market_size)
                    <div class="subsection">
                        <div class="subsection-title">Ukuran Pasar</div>
                        <p>{!! nl2br(e($data['market_analysis']->market_size)) !!}</p>
                    </div>
                @endif

                <!-- 3. Analisis Ukuran Pasar (TAM, SAM, SOM) -->
                @if ($data['market_analysis']->tam_total)
                    <div class="subsection">
                        <div class="subsection-title">Analisis Ukuran Pasar</div>
                        <table class="table">
                            <tr>
                                <th>Metrik</th>
                                <th>Nilai</th>
                                <th>Keterangan</th>
                            </tr>
                            <tr>
                                <td>Total Addressable Market (TAM)</td>
                                <td>Rp {{ number_format($data['market_analysis']->tam_total, 0, ',', '.') }}</td>
                                <td>Total pasar yang tersedia</td>
                            </tr>
                            <tr>
                                <td>Serviceable Available Market (SAM)</td>
                                <td>
                                    @if ($data['market_analysis']->sam_total)
                                        Rp {{ number_format($data['market_analysis']->sam_total, 0, ',', '.') }}
                                    @else
                                        -
                                    @endif
                                </td>
                                <td>Pasar yang dapat dilayani</td>
                            </tr>
                            <tr>
                                <td>Serviceable Obtainable Market (SOM)</td>
                                <td>
                                    @if ($data['market_analysis']->som_total)
                                        Rp {{ number_format($data['market_analysis']->som_total, 0, ',', '.') }}
                                    @else
                                        -
                                    @endif
                                </td>
                                <td>Pasar yang dapat diraih</td>
                            </tr>
                        </table>

                        <!-- TAM/SAM/SOM Pie Chart -->
                        @if (isset($marketAnalysisCharts['tam_sam_som']))
                            <div style="margin-top: 15px; text-align: center;">
                                <img src="{{ $marketAnalysisCharts['tam_sam_som'] }}" alt="TAM/SAM/SOM Chart"
                                    class="chart-image">
                            </div>
                        @endif
                    </div>
                @endif

                <!-- 4. Tren Pasar -->
                @if ($data['market_analysis']->market_trends)
                    <div class="subsection">
                        <div class="subsection-title">Tren Pasar</div>
                        <p>{!! nl2br(e($data['market_analysis']->market_trends)) !!}</p>
                    </div>
                @endif

                <!-- 5. Analisis SWOT -->
                @if (
                    $data['market_analysis']->strengths ||
                        $data['market_analysis']->weaknesses ||
                        $data['market_analysis']->opportunities ||
                        $data['market_analysis']->threats)
                    <div class="subsection">
                        <div class="subsection-title">Analisis SWOT</div>
                        <table class="table">
                            <tr>
                                <th style="width: 25%;">Strengths (Kekuatan)</th>
                                <th style="width: 25%;">Weaknesses (Kelemahan)</th>
                                <th style="width: 25%;">Opportunities (Peluang)</th>
                                <th style="width: 25%;">Threats (Ancaman)</th>
                            </tr>
                            <tr>
                                <td>{!! nl2br(e($data['market_analysis']->strengths)) !!}</td>
                                <td>{!! nl2br(e($data['market_analysis']->weaknesses)) !!}</td>
                                <td>{!! nl2br(e($data['market_analysis']->opportunities)) !!}</td>
                                <td>{!! nl2br(e($data['market_analysis']->threats)) !!}</td>
                            </tr>
                        </table>
                    </div>
                @endif

                <!-- 6. Analisis Kompetitor (Tabel Detail) -->
                @if ($data['market_analysis']->competitors->count() > 0)
                    <div class="subsection">
                        <div class="subsection-title">Analisis Kompetitor</div>
                        <table class="table">
                            <tr>
                                <th>Nama Kompetitor</th>
                                <th>Tipe</th>
                                <th>Alamat</th>
                                <th>Penjualan Tahunan</th>
                                <th>Harga Jual</th>
                                <th>Kelebihan</th>
                                <th>Kekurangan</th>
                            </tr>
                            @foreach ($data['market_analysis']->competitors as $competitor)
                                <tr>
                                    <td>{{ $competitor->competitor_name }}</td>
                                    <td>{{ $competitor->type === 'ownshop' ? 'Usaha Sendiri' : 'Kompetitor' }}</td>
                                    <td>{{ $competitor->address ?? '-' }}</td>
                                    <td>
                                        @if ($competitor->annual_sales_estimate)
                                            Rp {{ number_format($competitor->annual_sales_estimate, 0, ',', '.') }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td>
                                        @if ($competitor->selling_price)
                                            Rp {{ number_format($competitor->selling_price, 0, ',', '.') }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td style="font-size: 8px;">{!! nl2br(e($competitor->strengths ?? '-')) !!}</td>
                                    <td style="font-size: 8px;">{!! nl2br(e($competitor->weaknesses ?? '-')) !!}</td>
                                </tr>
                            @endforeach
                        </table>
                    </div>
                @endif

                <!-- 7. Kompetitor Utama -->
                @if ($data['market_analysis']->main_competitors)
                    <div class="subsection">
                        <div class="subsection-title">Kompetitor Utama</div>
                        <p>{!! nl2br(e($data['market_analysis']->main_competitors)) !!}</p>
                    </div>
                @endif

                <!-- 8. Analisis Kelebihan & Kekurangan Kompetitor -->
                @if ($data['market_analysis']->competitor_strengths || $data['market_analysis']->competitor_weaknesses)
                    <div class="subsection">
                        <div class="subsection-title">Analisis Kelebihan & Kekurangan Kompetitor</div>
                        <table class="table">
                            <tr>
                                <th style="width: 50%;">Kekuatan Kompetitor</th>
                                <th style="width: 50%;">Kelemahan Kompetitor</th>
                            </tr>
                            <tr>
                                <td>{!! nl2br(e($data['market_analysis']->competitor_strengths ?? '-')) !!}</td>
                                <td>{!! nl2br(e($data['market_analysis']->competitor_weaknesses ?? '-')) !!}</td>
                            </tr>
                        </table>
                    </div>
                @endif

                <!-- 9. Keunggulan Kompetitif -->
                @if ($data['market_analysis']->competitive_advantage)
                    <div class="subsection">
                        <div class="subsection-title">Keunggulan Kompetitif</div>
                        <p>{!! nl2br(e($data['market_analysis']->competitive_advantage)) !!}</p>
                    </div>
                @endif
            </div>
        </div>
    @endif

    <!-- Products & Services -->
    @if ($data['products_services']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">7. PRODUK & LAYANAN</div>
            </div>

            <div class="section">
                @foreach ($data['products_services'] as $product)
                    <div class="subsection" style="page-break-inside: avoid;">
                        <div class="subsection-title">
                            {{ $product->name }} ({{ $product->type === 'product' ? 'Produk' : 'Layanan' }})
                        </div>

                        <table class="table">
                            <tr>
                                <td style="width: 20%;"><strong>Deskripsi</strong></td>
                                <td>{!! nl2br(e($product->description)) !!}</td>
                            </tr>
                            @if ($product->price)
                                <tr>
                                    <td><strong>Harga</strong></td>
                                    <td>Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                                </tr>
                            @endif
                            @if ($product->advantages)
                                <tr>
                                    <td><strong>Keunggulan</strong></td>
                                    <td>{!! nl2br(e($product->advantages)) !!}</td>
                                </tr>
                            @endif
                            @if ($product->development_strategy)
                                <tr>
                                    <td><strong>Strategi Pengembangan</strong></td>
                                    <td>{!! nl2br(e($product->development_strategy)) !!}</td>
                                </tr>
                            @endif
                            <tr>
                                <td><strong>Status</strong></td>
                                <td>
                                    @if ($product->status == 'available')
                                        Tersedia
                                    @elseif($product->status == 'development')
                                        Dalam Pengembangan
                                    @else
                                        {{ $product->status }}
                                    @endif
                                </td>
                            </tr>
                        </table>

                        <!-- Business Model Canvas (BMC) -->
                        @if (
                            $product->bmc_alignment &&
                                (!empty($product->bmc_alignment['value_proposition']) ||
                                    !empty($product->bmc_alignment['customer_segment']) ||
                                    !empty($product->bmc_alignment['channels']) ||
                                    !empty($product->bmc_alignment['customer_relationships']) ||
                                    !empty($product->bmc_alignment['revenue_streams']) ||
                                    !empty($product->bmc_alignment['key_resources']) ||
                                    !empty($product->bmc_alignment['key_activities']) ||
                                    !empty($product->bmc_alignment['key_partnerships']) ||
                                    !empty($product->bmc_alignment['cost_structure'])))
                            <div style="margin-top: 15px;">
                                <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #2c5aa0;">
                                    Business Model Canvas Alignment
                                </h4>
                                <table class="table">
                                    @if (!empty($product->bmc_alignment['value_proposition']))
                                        <tr>
                                            <td style="width: 30%;"><strong>Value Proposition</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['value_proposition'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['customer_segment']))
                                        <tr>
                                            <td><strong>Customer Segments</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['customer_segment'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['channels']))
                                        <tr>
                                            <td><strong>Channels</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['channels'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['customer_relationships']))
                                        <tr>
                                            <td><strong>Customer Relationships</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['customer_relationships'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['revenue_streams']))
                                        <tr>
                                            <td><strong>Revenue Streams</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['revenue_streams'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['key_resources']))
                                        <tr>
                                            <td><strong>Key Resources</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['key_resources'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['key_activities']))
                                        <tr>
                                            <td><strong>Key Activities</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['key_activities'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['key_partnerships']))
                                        <tr>
                                            <td><strong>Key Partnerships</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['key_partnerships'])) !!}</td>
                                        </tr>
                                    @endif
                                    @if (!empty($product->bmc_alignment['cost_structure']))
                                        <tr>
                                            <td><strong>Cost Structure</strong></td>
                                            <td>{!! nl2br(e($product->bmc_alignment['cost_structure'])) !!}</td>
                                        </tr>
                                    @endif
                                </table>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    <!-- Marketing Strategies -->
    @if ($data['marketing_strategies']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">8. STRATEGI PEMASARAN</div>
            </div>

            <div class="section">
                @foreach ($data['marketing_strategies'] as $strategy)
                    <div class="subsection">
                        <table class="table">
                            <tr>
                                <td style="width: 20%;"><strong>Strategi Promosi</strong></td>
                                <td>{!! nl2br(e($strategy->promotion_strategy ?? '-')) !!}</td>
                            </tr>
                            @if ($strategy->media_used)
                                <tr>
                                    <td><strong>Media yang Digunakan</strong></td>
                                    <td>{!! nl2br(e($strategy->media_used)) !!}</td>
                                </tr>
                            @endif
                            @if ($strategy->pricing_strategy)
                                <tr>
                                    <td><strong>Strategi Harga</strong></td>
                                    <td>{!! nl2br(e($strategy->pricing_strategy)) !!}</td>
                                </tr>
                            @endif
                            @if ($strategy->monthly_target)
                                <tr>
                                    <td><strong>Target Bulanan</strong></td>
                                    <td>{{ $strategy->monthly_target }}</td>
                                </tr>
                            @endif
                            @if ($strategy->collaboration_plan)
                                <tr>
                                    <td><strong>Rencana Kolaborasi</strong></td>
                                    <td>{!! nl2br(e($strategy->collaboration_plan)) !!}</td>
                                </tr>
                            @endif
                        </table>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    {{-- TODO: Comment - FinancialPlan nonaktif di Business Plan --}}
    {{--
    <!-- Financial Plans -->
    @if ($data['financial_plans']->count() > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">8. RENCANA KEUANGAN</div>
            </div>

            <div class="section" style="margin-top: 10px;">
                @foreach ($data['financial_plans'] as $financial)
                    <div class="subsection-title" style="margin-bottom: 10px;">{{ $financial->plan_name }}</div>

                    <!-- Financial Highlights -->
                    <div class="financial-highlights mb-15" style="page-break-inside: avoid;">
                        <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Ringkasan Keuangan</h4>
                        <table class="table">
                            <tr>
                                <td><strong>ROI</strong></td>
                                <td>{{ $financial->roi_percentage }}%</td>
                                <td><strong>Payback Period</strong></td>
                                <td>{{ $financial->payback_period }} bulan</td>
                            </tr>
                            <tr>
                                <td><strong>Profit Margin</strong></td>
                                <td>{{ $financial->profit_margin }}%</td>
                                <td><strong>Status Kelayakan</strong></td>
                                <td>{{ $financial->feasibility_status }}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Capital Sources -->
                    @if ($financial->capital_sources)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Sumber Modal</h4>
                            <table class="table">
                                <tr>
                                    <th>Sumber</th>
                                    <th>Jumlah</th>
                                    <th>Persentase</th>
                                </tr>
                                @foreach ($financial->capital_sources as $source)
                                    <tr>
                                        <td>{{ $source['source'] }}</td>
                                        <td>Rp {{ number_format($source['amount'], 0, ',', '.') }}</td>
                                        <td>{{ $source['percentage'] }}%</td>
                                    </tr>
                                @endforeach
                                <tr class="text-bold">
                                    <td>Total Modal Awal</td>
                                    <td colspan="2">Rp
                                        {{ number_format($financial->total_initial_capital, 0, ',', '.') }}</td>
                                </tr>
                            </table>

                            @if (isset($charts['capital_structure']) && $charts['capital_structure'])
                                <div style="margin-top: 15px;">
                                    <img src="{{ $charts['capital_structure'] }}" alt="Grafik Struktur Modal"
                                        class="chart-image">
                                </div>
                            @endif
                        </div>
                    @endif

                    <!-- Sales Projections -->
                    @if ($financial->sales_projections)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Proyeksi Penjualan</h4>
                            <table class="table">
                                <tr>
                                    <th>Produk/Layanan</th>
                                    <th>Harga</th>
                                    <th>Volume/Bulan</th>
                                    <th>Pendapatan/Bulan</th>
                                </tr>
                                @foreach ($financial->sales_projections as $projection)
                                    <tr>
                                        <td>{{ $projection['product'] }}</td>
                                        <td>Rp {{ number_format($projection['price'], 0, ',', '.') }}</td>
                                        <td>{{ number_format($projection['volume'], 0, ',', '.') }}</td>
                                        <td>Rp {{ number_format($projection['monthly_income'], 0, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                                <tr class="text-bold">
                                    <td colspan="3">Total Pendapatan Bulanan</td>
                                    <td>Rp {{ number_format($financial->total_monthly_income, 0, ',', '.') }}</td>
                                </tr>
                                <tr class="text-bold">
                                    <td colspan="3">Total Pendapatan Tahunan</td>
                                    <td>Rp {{ number_format($financial->total_yearly_income, 0, ',', '.') }}</td>
                                </tr>
                            </table>

                            @if (isset($charts['revenue_streams']) && $charts['revenue_streams'])
                                <div style="margin-top: 15px;">
                                    <img src="{{ $charts['revenue_streams'] }}" alt="Grafik Sumber Pendapatan"
                                        class="chart-image">
                                </div>
                            @endif
                        </div>
                    @endif

                    <!-- Operational Expenses Breakdown -->
                    @if ($financial->monthly_opex)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Breakdown Biaya
                                Operasional</h4>
                            <table class="table">
                                <tr>
                                    <th>Kategori Biaya</th>
                                    <th>Jumlah/Bulan</th>
                                </tr>
                                @foreach ($financial->monthly_opex as $expense)
                                    <tr>
                                        <td>{{ $expense['category'] }}</td>
                                        <td>Rp {{ number_format($expense['amount'], 0, ',', '.') }}</td>
                                    </tr>
                                @endforeach
                                <tr class="text-bold">
                                    <td>Total Biaya Operasional Bulanan</td>
                                    <td>Rp {{ number_format($financial->total_monthly_opex, 0, ',', '.') }}</td>
                                </tr>
                            </table>

                            @if (isset($charts['expense_breakdown']) && $charts['expense_breakdown'])
                                <div style="margin-top: 15px;">
                                    <img src="{{ $charts['expense_breakdown'] }}" alt="Grafik Breakdown Biaya"
                                        class="chart-image">
                                </div>
                            @endif
                        </div>
                    @endif

                    <!-- Profit Loss Summary -->
                    <div class="mb-15" style="page-break-inside: avoid;">
                        <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Ringkasan Laba Rugi
                            (Bulanan)
                        </h4>
                        <table class="table">
                            <tr>
                                <td><strong>Pendapatan Bulanan</strong></td>
                                <td class="text-right">Rp
                                    {{ number_format($financial->total_monthly_income, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Biaya Operasional Bulanan</strong></td>
                                <td class="text-right">Rp
                                    {{ number_format($financial->total_monthly_opex, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Laba Kotor</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->gross_profit, 0, ',', '.') }}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Pajak ({{ $financial->tax_rate }}%)</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->tax_amount, 0, ',', '.') }}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Bunga</strong></td>
                                <td class="text-right">Rp
                                    {{ number_format($financial->interest_expense, 0, ',', '.') }}</td>
                            </tr>
                            <tr class="text-bold">
                                <td><strong>Laba Bersih</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->net_profit, 0, ',', '.') }}
                                </td>
                            </tr>
                        </table>

                        @if (isset($charts['profit_loss']) && $charts['profit_loss'])
                            <div style="margin-top: 15px;">
                                <img src="{{ $charts['profit_loss'] }}" alt="Grafik Laba Rugi" class="chart-image">
                            </div>
                        @endif
                    </div>

                    @if ($financial->feasibility_notes)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Analisis Kelayakan</h4>

                            <table class="table" style="margin-bottom: 10px;">
                                <tr>
                                    <td style="width: 30%;"><strong>ROI</strong></td>
                                    <td>{{ number_format($financial->roi_percentage, 2) }}%</td>
                                </tr>
                                <tr>
                                    <td><strong>Payback Period</strong></td>
                                    <td>{{ $financial->payback_period }} bulan</td>
                                </tr>
                                <tr>
                                    <td><strong>Break Even Point</strong></td>
                                    <td>Rp {{ number_format($financial->bep_amount, 0, ',', '.') }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Profit Margin</strong></td>
                                    <td>{{ number_format($financial->profit_margin, 2) }}%</td>
                                </tr>
                                <tr>
                                    <td><strong>Status</strong></td>
                                    <td><strong>{{ $financial->feasibility_status }}</strong></td>
                                </tr>
                            </table>

                            <p style="margin-top: 10px;">{!! nl2br(e($financial->feasibility_notes)) !!}</p>

                            @if (isset($charts['feasibility']) && $charts['feasibility'])
                                <div style="margin-top: 15px;">
                                    <img src="{{ $charts['feasibility'] }}" alt="Grafik Analisis Kelayakan"
                                        class="chart-image">
                                </div>
                            @endif
                        </div>
                    @endif

                    <!-- Financial Forecast / Cash Flow Projection -->
                    @if ($financial)
                        <div class="mb-15" style="page-break-inside: avoid;">
                            <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Proyeksi Keuangan Masa
                                Depan</h4>

                            @if ($financial->cash_flow_simulation && is_array($financial->cash_flow_simulation) && count($financial->cash_flow_simulation) > 0)
                                <table class="table" style="margin-bottom: 15px;">
                                    <tr>
                                        <th>Periode</th>
                                        <th>Pendapatan</th>
                                        <th>Pengeluaran</th>
                                        <th>Arus Kas</th>
                                        <th>Saldo Kumulatif</th>
                                    </tr>
                                    @php
                                        // Group cash flow by month
                                        $monthlyData = [];
                                        foreach ($financial->cash_flow_simulation as $flow) {
                                            $date = \Carbon\Carbon::parse($flow['date']);
                                            $monthKey = $date->format('Y-m');

                                            if (!isset($monthlyData[$monthKey])) {
                                                $monthlyData[$monthKey] = [
                                                    'period' => $date->format('M Y'),
                                                    'income' => 0,
                                                    'expense' => 0,
                                                ];
                                            }

                                            if ($flow['type'] === 'income') {
                                                $monthlyData[$monthKey]['income'] += floatval($flow['amount']);
                                            } else {
                                                $monthlyData[$monthKey]['expense'] += floatval($flow['amount']);
                                            }
                                        }

                                        ksort($monthlyData);
                                        $cumulativeBalance = 0;
                                        $displayedMonths = 0;
                                        $maxDisplay = 12;
                                    @endphp
                                    @foreach ($monthlyData as $monthKey => $monthData)
                                        @if ($displayedMonths < $maxDisplay)
                                            @php
                                                $netCashFlow = $monthData['income'] - $monthData['expense'];
                                                $cumulativeBalance += $netCashFlow;
                                                $displayedMonths++;
                                            @endphp
                                            <tr>
                                                <td>{{ $monthData['period'] }}</td>
                                                <td>Rp {{ number_format($monthData['income'], 0, ',', '.') }}</td>
                                                <td>Rp {{ number_format($monthData['expense'], 0, ',', '.') }}</td>
                                                <td style="color: {{ $netCashFlow >= 0 ? '#059669' : '#DC2626' }};">
                                                    Rp {{ number_format($netCashFlow, 0, ',', '.') }}
                                                </td>
                                                <td
                                                    style="color: {{ $cumulativeBalance >= 0 ? '#059669' : '#DC2626' }};">
                                                    Rp {{ number_format($cumulativeBalance, 0, ',', '.') }}
                                                </td>
                                            </tr>
                                        @endif
                                    @endforeach
                                </table>
                            @else
                                <table class="table" style="margin-bottom: 15px;">
                                    <tr>
                                        <th>Periode</th>
                                        <th>Proyeksi Pendapatan</th>
                                        <th>Proyeksi Pengeluaran</th>
                                        <th>Proyeksi Laba Bersih</th>
                                        <th>Saldo Kumulatif</th>
                                    </tr>
                                    @php
                                        $cumulativeBalance = 0;
                                    @endphp
                                    @for ($month = 1; $month <= 12; $month++)
                                        @php
                                            $monthlyRevenue = $financial->total_monthly_income;
                                            $monthlyExpense = $financial->total_monthly_opex;
                                            $monthlyProfit = $financial->net_profit;
                                            $cumulativeBalance += $monthlyProfit;
                                        @endphp
                                        <tr>
                                            <td>Bulan {{ $month }}</td>
                                            <td>Rp {{ number_format($monthlyRevenue, 0, ',', '.') }}</td>
                                            <td>Rp {{ number_format($monthlyExpense, 0, ',', '.') }}</td>
                                            <td style="color: {{ $monthlyProfit >= 0 ? '#059669' : '#DC2626' }};">
                                                Rp {{ number_format($monthlyProfit, 0, ',', '.') }}
                                            </td>
                                            <td style="color: {{ $cumulativeBalance >= 0 ? '#059669' : '#DC2626' }};">
                                                Rp {{ number_format($cumulativeBalance, 0, ',', '.') }}
                                            </td>
                                        </tr>
                                    @endfor
                                    <tr class="text-bold">
                                        <td>Total Tahun 1</td>
                                        <td>Rp {{ number_format($financial->total_yearly_income, 0, ',', '.') }}</td>
                                        <td>Rp {{ number_format($financial->total_monthly_opex * 12, 0, ',', '.') }}
                                        </td>
                                        <td>Rp {{ number_format($financial->net_profit * 12, 0, ',', '.') }}</td>
                                        <td>Rp {{ number_format($cumulativeBalance, 0, ',', '.') }}</td>
                                    </tr>
                                </table>
                            @endif

                            @if (isset($charts['forecast']) && $charts['forecast'])
                                <div style="margin-top: 15px;">
                                    <img src="{{ $charts['forecast'] }}" alt="Grafik Proyeksi Masa Depan"
                                        class="chart-image">
                                </div>
                            @endif
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    @endif
    --}}
    {{-- END: TODO Comment - FinancialPlan nonaktif di Business Plan --}}

    <!-- Category Summary -->
    @if (isset($financial_summary['category_summary']))
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">9. RINGKASAN PER KATEGORI</div>
            </div>

            <div class="section">
                <div class="subsection">
                    <div class="subsection-title">Top 5 Pendapatan</div>
                    <table class="table">
                        <tr>
                            <th>No</th>
                            <th>Kategori</th>
                            <th>Total</th>
                            <th>Transaksi</th>
                            <th>Rata-rata</th>
                        </tr>
                        @foreach ($financial_summary['category_summary']['top_income'] as $index => $cat)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $cat['category']->name }}</td>
                                <td class="text-green">Rp {{ number_format($cat['total'], 0, ',', '.') }}</td>
                                <td>{{ $cat['count'] }}</td>
                                <td>Rp {{ number_format($cat['average'], 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </table>

                    @if (isset($financialCharts['category_income_pie']))
                        <img src="{{ $financialCharts['category_income_pie'] }}" alt="Category Income Chart"
                            class="chart-image">
                    @endif
                </div>

                <div class="subsection">
                    <div class="subsection-title">Top 5 Pengeluaran</div>
                    <table class="table">
                        <tr>
                            <th>No</th>
                            <th>Kategori</th>
                            <th>Total</th>
                            <th>Transaksi</th>
                            <th>Rata-rata</th>
                        </tr>
                        @foreach ($financial_summary['category_summary']['top_expense'] as $index => $cat)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $cat['category']->name }}</td>
                                <td class="text-red">Rp {{ number_format($cat['total'], 0, ',', '.') }}</td>
                                <td>{{ $cat['count'] }}</td>
                                <td>Rp {{ number_format($cat['average'], 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </table>

                    @if (isset($financialCharts['category_expense_pie']))
                        <img src="{{ $financialCharts['category_expense_pie'] }}" alt="Category Expense Chart"
                            class="chart-image">
                    @endif
                </div>
            </div>
        </div>
    @endif

    <!-- Monthly Trend (only for year view) -->
    @if ($period_type === 'year' && isset($financial_summary['monthly_summary']))
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">10. TREN BULANAN - TAHUN {{ $financial_summary['year'] }}</div>
            </div>

            <div class="section">
                <table class="table">
                    <tr>
                        <th>Bulan</th>
                        <th>Pendapatan</th>
                        <th>Pengeluaran</th>
                        <th>Laba Bersih</th>
                        <th>Transaksi</th>
                    </tr>
                    @foreach ($financial_summary['monthly_summary'] as $month)
                        <tr>
                            <td>{{ $month['month_name'] }}</td>
                            <td class="text-green">Rp {{ number_format($month['income'], 0, ',', '.') }}</td>
                            <td class="text-red">Rp {{ number_format($month['expense'], 0, ',', '.') }}</td>
                            <td class="{{ $month['net_profit'] >= 0 ? 'text-green' : 'text-red' }}">
                                Rp {{ number_format($month['net_profit'], 0, ',', '.') }}
                            </td>
                            <td>{{ $month['transaction_count'] }}</td>
                        </tr>
                    @endforeach
                </table>

                @if (isset($financialCharts['monthly_trend']))
                    <div style="margin-top: 15px;">
                        <img src="{{ $financialCharts['monthly_trend'] }}" alt="Monthly Trend Chart"
                            class="chart-image">
                    </div>
                @endif
            </div>
        </div>
    @endif

    <!-- Financial Projections -->
    @if (!empty($financial_data['projections']) && count($financial_data['projections']) > 0)
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">11. PROYEKSI KEUANGAN 5 TAHUN</div>
            </div>

            <div class="section">
                <div style="margin-bottom: 20px;">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Ringkasan Proyeksi</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                        @foreach ($financial_data['projections'] as $projection)
                            <div
                                style="background: {{ $projection->scenario_type == 'optimistic' ? '#f0fdf4' : ($projection->scenario_type == 'realistic' ? '#eff6ff' : '#fffbeb') }};
                                        border-left: 4px solid {{ $projection->scenario_type == 'optimistic' ? '#10b981' : ($projection->scenario_type == 'realistic' ? '#3b82f6' : '#f59e0b') }};
                                        border-radius: 4px; padding: 15px;">
                                <div
                                    style="font-size: 11px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">
                                    @if ($projection->scenario_type == 'optimistic')
                                        🚀 Optimistik
                                    @elseif($projection->scenario_type == 'realistic')
                                        📊 Realistik
                                    @else
                                        ⚠️ Pesimistik
                                    @endif
                                </div>
                                <div style="margin: 6px 0; font-size: 9px;">
                                    <span style="color: #666;">NPV:</span>
                                    <span
                                        style="font-weight: bold; color: {{ $projection->npv >= 0 ? '#10b981' : '#ef4444' }}; float: right;">
                                        {{ $projection->formatted_npv ?? 'Rp ' . number_format($projection->npv, 0, ',', '.') }}
                                    </span>
                                    <div style="clear: both;"></div>
                                </div>
                                <div style="margin: 6px 0; font-size: 9px;">
                                    <span style="color: #666;">ROI:</span>
                                    <span style="font-weight: bold; color: #3b82f6; float: right;">
                                        {{ $projection->formatted_roi ?? number_format($projection->roi, 2) . '%' }}
                                    </span>
                                    <div style="clear: both;"></div>
                                </div>
                                <div style="margin: 6px 0; font-size: 9px;">
                                    <span style="color: #666;">IRR:</span>
                                    <span style="font-weight: bold; float: right;">
                                        {{ $projection->formatted_irr ?? number_format($projection->irr, 2) . '%' }}
                                    </span>
                                    <div style="clear: both;"></div>
                                </div>
                                <div style="margin: 6px 0; font-size: 9px;">
                                    <span style="color: #666;">Payback Period:</span>
                                    <span style="font-weight: bold; float: right;">
                                        {{ $projection->formatted_payback ?? number_format($projection->payback_period, 1) . ' tahun' }}
                                    </span>
                                    <div style="clear: both;"></div>
                                </div>
                                <div style="margin: 6px 0; font-size: 9px;">
                                    <span style="color: #666;">Growth Rate:</span>
                                    <span
                                        style="font-weight: bold; float: right;">{{ number_format($projection->growth_rate, 1) }}%</span>
                                    <div style="clear: both;"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Detail Proyeksi Per Tahun</h4>
                    @foreach ($financial_data['projections'] as $projection)
                        <div style="margin-bottom: 15px;">
                            <strong style="font-size: 10px;">
                                Skenario {{ ucfirst($projection->scenario_type) }} (Growth:
                                {{ number_format($projection->growth_rate, 1) }}%)
                            </strong>
                            <table class="table" style="margin-top: 8px;">
                                <thead>
                                    <tr>
                                        <th>Tahun</th>
                                        <th>Pendapatan Proyeksi</th>
                                        <th>Pengeluaran Proyeksi</th>
                                        <th>Laba Bersih</th>
                                        <th>Kumulatif Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php
                                        $years = $projection->yearly_projections ?? [];
                                        $cumulativeProfit = 0;
                                    @endphp
                                    @foreach ($years as $year)
                                        @php $cumulativeProfit += $year['net_profit']; @endphp
                                        <tr>
                                            <td>Tahun {{ $year['year'] }}</td>
                                            <td class="text-green">Rp
                                                {{ number_format($year['revenue'], 0, ',', '.') }}</td>
                                            <td class="text-red">Rp
                                                {{ number_format($year['cost'], 0, ',', '.') }}</td>
                                            <td class="{{ $year['net_profit'] >= 0 ? 'text-green' : 'text-red' }}">
                                                Rp {{ number_format($year['net_profit'], 0, ',', '.') }}
                                            </td>
                                            <td class="text-blue">Rp
                                                {{ number_format($cumulativeProfit, 0, ',', '.') }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    @endif

    @if ($has_forecast)
        <!-- Forecast Executive Summary -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">12. RINGKASAN EKSEKUTIF FORECAST</div>
            </div>

            <div class="section">
                <div
                    style="background: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; line-height: 1.8; margin-bottom: 20px;">
                    {!! nl2br(e($forecast_summary)) !!}
                </div>

                <!-- Statistik Utama -->
                <div style="margin-top: 20px;">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #2563eb;">Statistik
                        Utama</h4>
                    <table class="table">
                        <tr>
                            <td style="width: 25%; text-align: center; background: #f0f9ff;">
                                <div style="font-size: 10px; color: #666; margin-bottom: 5px;">TOTAL PENDAPATAN</div>
                                <div style="font-size: 14px; font-weight: bold; color: #2563eb;">
                                    Rp {{ number_format($forecast_statistics['total_income'], 0, ',', '.') }}
                                </div>
                            </td>
                            <td style="width: 25%; text-align: center; background: #f0f9ff;">
                                <div style="font-size: 10px; color: #666; margin-bottom: 5px;">TOTAL PENGELUARAN</div>
                                <div style="font-size: 14px; font-weight: bold; color: #2563eb;">
                                    Rp {{ number_format($forecast_statistics['total_expense'], 0, ',', '.') }}
                                </div>
                            </td>
                            <td style="width: 25%; text-align: center; background: #f0f9ff;">
                                <div style="font-size: 10px; color: #666; margin-bottom: 5px;">TOTAL LABA</div>
                                <div
                                    style="font-size: 14px; font-weight: bold; color: {{ $forecast_statistics['total_profit'] >= 0 ? '#10b981' : '#ef4444' }};">
                                    Rp {{ number_format($forecast_statistics['total_profit'], 0, ',', '.') }}
                                </div>
                            </td>
                            <td style="width: 25%; text-align: center; background: #f0f9ff;">
                                <div style="font-size: 10px; color: #666; margin-bottom: 5px;">RATA-RATA MARGIN</div>
                                <div style="font-size: 14px; font-weight: bold; color: #2563eb;">
                                    {{ number_format($forecast_statistics['avg_margin'], 2) }}%
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- Forecast Detail Results -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">13. DETAIL PROYEKSI BULANAN</div>
            </div>

            <div class="section">
                <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #2563eb;">Tabel Detail
                    Prediksi Bulanan</h4>

                @if ($forecast_results && count($forecast_results) > 0)
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Bulan</th>
                                <th class="text-right">Pendapatan</th>
                                <th class="text-right">Pengeluaran</th>
                                <th class="text-right">Laba</th>
                                <th class="text-right">Margin %</th>
                                <th class="text-right">Confidence %</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($forecast_results as $result)
                                <tr>
                                    <td>Bulan {{ $result['month'] ?? '-' }}</td>
                                    <td class="text-right">Rp
                                        {{ number_format($result['forecast_income'] ?? 0, 0, ',', '.') }}</td>
                                    <td class="text-right">Rp
                                        {{ number_format($result['forecast_expense'] ?? 0, 0, ',', '.') }}</td>
                                    <td
                                        class="text-right {{ ($result['forecast_profit'] ?? 0) >= 0 ? 'text-green' : 'text-red' }}">
                                        Rp {{ number_format($result['forecast_profit'] ?? 0, 0, ',', '.') }}
                                    </td>
                                    <td class="text-right">{{ number_format($result['forecast_margin'] ?? 0, 2) }}%
                                    </td>
                                    <td class="text-right">{{ number_format($result['confidence_level'] ?? 0, 2) }}%
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <p style="color: #999; font-style: italic; text-align: center; padding: 20px;">Tidak ada data
                        proyeksi yang tersedia.</p>
                @endif

                <!-- Performance Metrics -->
                <div style="margin-top: 20px;">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #2563eb;">Metrik
                        Performa</h4>
                    <table class="table">
                        <tr>
                            <td style="width: 40%; font-weight: bold;">Rata-rata Kepercayaan Prediksi</td>
                            <td class="text-right">{{ number_format($forecast_statistics['avg_confidence'], 2) }}%
                            </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Tingkat Pertumbuhan</td>
                            <td class="text-right">{{ number_format($forecast_statistics['growth_rate'], 2) }}%</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Pendapatan Tertinggi</td>
                            <td class="text-right">Bulan {{ $forecast_statistics['highest_income_month'] ?? '-' }}
                                (Rp
                                {{ number_format($forecast_statistics['highest_income_value'] ?? 0, 0, ',', '.') }})
                            </td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Laba Tertinggi</td>
                            <td class="text-right">Bulan {{ $forecast_statistics['highest_profit_month'] ?? '-' }}
                                (Rp
                                {{ number_format($forecast_statistics['highest_profit_value'] ?? 0, 0, ',', '.') }})
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- Forecast Insights -->
        @if ($forecast_insights && count($forecast_insights) > 0)
            <div class="page">
                <div class="header">
                    <div class="company-name">{{ $data['business_background']->name }}</div>
                    <div class="document-title">14. AUTO INSIGHTS & ANALISIS</div>
                </div>

                <div class="section">
                    <h4 style="font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #2563eb;">Insight
                        Otomatis Sistem</h4>

                    @foreach ($forecast_insights as $insight)
                        @php
                            $severityColor = match (strtolower($insight['severity'] ?? 'info')) {
                                'critical' => ['border' => '#ef4444', 'bg' => '#fef2f2'],
                                'warning' => ['border' => '#f59e0b', 'bg' => '#fffbeb'],
                                'positive' => ['border' => '#10b981', 'bg' => '#f0fdf4'],
                                default => ['border' => '#2563eb', 'bg' => '#eff6ff'],
                            };
                        @endphp
                        <div
                            style="margin-bottom: 15px; padding: 12px; border-left: 3px solid {{ $severityColor['border'] }}; background: {{ $severityColor['bg'] }}; font-size: 11px;">
                            <div style="font-weight: bold; margin-bottom: 5px;">{{ $insight['title'] ?? 'Insight' }}
                            </div>
                            <div>{{ $insight['description'] ?? '-' }}</div>
                            @if (isset($insight['value']) && $insight['value'])
                                <div style="margin-top: 5px; color: #666;">
                                    <strong>Nilai:</strong> {{ $insight['value'] }}
                                </div>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    @else
        <!-- No Forecast Data Available -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">12. LAPORAN FORECAST</div>
            </div>

            <div class="section">
                <div style="text-align: center; padding: 60px 20px; background: #f9fafb; border-radius: 8px;">
                    <div style="font-size: 48px; color: #e5e7eb; margin-bottom: 20px;">📊</div>
                    <h3 style="font-size: 18px; color: #666; margin-bottom: 10px;">Data Forecast Belum Tersedia</h3>
                    <p style="font-size: 12px; color: #999;">
                        Belum ada data forecast untuk periode {{ $period_label }}.<br>
                        Silakan buat forecast terlebih dahulu untuk melihat proyeksi keuangan.
                    </p>
                </div>
            </div>
        </div>
    @endif

    <!-- Footer untuk semua halaman -->
    <div class="footer">
        <div style="float: left;">
            {{ $data['business_background']->name }} - Laporan Lengkap ({{ $period_label }}) - Mode:
            {{ $mode === 'pro' ? 'PRO' : 'FREE' }}
        </div>
        <div style="float: right;" class="page-number"></div>
        <div style="clear: both;"></div>
    </div>
</body>

</html>
