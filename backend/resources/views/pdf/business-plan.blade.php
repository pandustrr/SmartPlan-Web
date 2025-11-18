<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Business Plan - {{ $data['business_background']->name }}</title>
    <style>
        /* Reset dan base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 12px;
        }

        /* Watermark untuk mode gratis */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            color: rgba(0,0,0,0.1);
            z-index: -1;
            white-space: nowrap;
            font-weight: bold;
        }

        /* Layout halaman */
        .page {
            page-break-after: always;
            padding: 20mm;
            position: relative;
        }

        .page:last-child {
            page-break-after: auto;
        }

        /* Header */
        .header {
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
            margin-bottom: 20px;
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

        /* Sections */
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
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
        }

        .subsection-title {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            margin-bottom: 8px;
        }

        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 10px;
        }

        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        .table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        /* Utilities */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-bold { font-weight: bold; }
        .mb-10 { margin-bottom: 10px; }
        .mb-15 { margin-bottom: 15px; }
        .mt-15 { margin-top: 15px; }

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
    </style>
</head>
<body>
    @if($mode === 'free')
    <div class="watermark">SMARTPLAN - FREE VERSION</div>
    @endif

    <!-- Cover Page -->
    <div class="page">
        <div style="text-align: center; margin-top: 100px;">
            @if($data['business_background']->logo)
            <div style="margin-bottom: 30px;">
                <img src="{{ $data['business_background']->logo }}"
                     alt="Logo"
                     style="max-width: 150px; max-height: 150px;">
            </div>
            @endif

            <h1 style="font-size: 32px; color: #2c5aa0; margin-bottom: 20px;">
                {{ $data['business_background']->name }}
            </h1>
            <h2 style="font-size: 24px; color: #666; margin-bottom: 30px;">
                BUSINESS PLAN
            </h2>
            <p style="font-size: 14px; color: #888;">
                Disusun pada: {{ $generated_at }}
            </p>
        </div>

        <div style="position: absolute; bottom: 50px; left: 0; right: 0; text-align: center;">
            <p style="font-size: 12px; color: #666;">
                Dokumen ini dibuat secara otomatis oleh SMARTPLAN-WEB System
            </p>
        </div>
    </div>

    <!-- Table of Contents -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">DAFTAR ISI</div>
        </div>

        <div class="section">
            <ol style="line-height: 2; font-size: 14px;">
                <li>Ringkasan Eksekutif</li>
                <li>Latar Belakang Bisnis</li>
                <li>Analisis Pasar
                    <ol style="list-style-type: lower-alpha;">
                        <li>Target Pasar</li>
                        <li>Analisis Kompetitor</li>
                        <li>Analisis SWOT</li>
                    </ol>
                </li>
                <li>Produk & Layanan</li>
                <li>Strategi Pemasaran</li>
                <li>Rencana Operasional</li>
                <li>Struktur Tim</li>
                <li>Rencana Keuangan</li>
            </ol>
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">1. RINGKASAN EKSEKUTIF</div>
        </div>

        <div class="section">
            {!! nl2br(e($this->createExecutiveSummary($data))) !!}
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
                        <td>{{ $data['business_background']->start_date ? date('d F Y', strtotime($data['business_background']->start_date)) : '-' }}</td>
                    </tr>
                </table>
            </div>

            <div class="subsection">
                <div class="subsection-title">Deskripsi Bisnis</div>
                <p>{!! nl2br(e($data['business_background']->description)) !!}</p>
            </div>

            @if($data['business_background']->purpose)
            <div class="subsection">
                <div class="subsection-title">Tujuan Bisnis</div>
                <p>{!! nl2br(e($data['business_background']->purpose)) !!}</p>
            </div>
            @endif

            @if($data['business_background']->vision)
            <div class="subsection">
                <div class="subsection-title">Visi</div>
                <p>{!! nl2br(e($data['business_background']->vision)) !!}</p>
            </div>
            @endif

            @if($data['business_background']->mission)
            <div class="subsection">
                <div class="subsection-title">Misi</div>
                <p>{!! nl2br(e($data['business_background']->mission)) !!}</p>
            </div>
            @endif

            @if($data['business_background']->values)
            <div class="subsection">
                <div class="subsection-title">Nilai-Nilai</div>
                <p>{!! nl2br(e($data['business_background']->values)) !!}</p>
            </div>
            @endif
        </div>
    </div>

    <!-- Market Analysis -->
    @if($data['market_analysis'])
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">3. ANALISIS PASAR</div>
        </div>

        <div class="section">
            @if($data['market_analysis']->target_market)
            <div class="subsection">
                <div class="subsection-title">Target Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->target_market)) !!}</p>
            </div>
            @endif

            @if($data['market_analysis']->market_size)
            <div class="subsection">
                <div class="subsection-title">Ukuran Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->market_size)) !!}</p>
            </div>
            @endif

            @if($data['market_analysis']->market_trends)
            <div class="subsection">
                <div class="subsection-title">Tren Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->market_trends)) !!}</p>
            </div>
            @endif

            <!-- Market Size Metrics -->
            @if($data['market_analysis']->tam_total)
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
                            Rp {{ number_format($data['market_analysis']->sam_total, 0, ',', '.') }}
                            ({{ $data['market_analysis']->sam_percentage }}%)
                        </td>
                        <td>Pasar yang dapat dilayani</td>
                    </tr>
                    <tr>
                        <td>Serviceable Obtainable Market (SOM)</td>
                        <td>
                            Rp {{ number_format($data['market_analysis']->som_total, 0, ',', '.') }}
                            ({{ $data['market_analysis']->som_percentage }}%)
                        </td>
                        <td>Pasar yang dapat diraih</td>
                    </tr>
                </table>
            </div>
            @endif

            <!-- Competitors -->
            @if($data['market_analysis']->competitors->count() > 0)
            <div class="subsection">
                <div class="subsection-title">Analisis Kompetitor</div>
                <table class="table">
                    <tr>
                        <th>Nama Kompetitor</th>
                        <th>Tipe</th>
                        <th>Perkiraan Penjualan Tahunan</th>
                        <th>Harga Jual</th>
                        <th>Kekuatan</th>
                        <th>Kelemahan</th>
                    </tr>
                    @foreach($data['market_analysis']->competitors as $competitor)
                    <tr>
                        <td>{{ $competitor->competitor_name }}</td>
                        <td>{{ $competitor->type_label }}</td>
                        <td>
                            @if($competitor->annual_sales_estimate)
                            Rp {{ number_format($competitor->annual_sales_estimate, 0, ',', '.') }}
                            @else
                            -
                            @endif
                        </td>
                        <td>
                            @if($competitor->selling_price)
                            Rp {{ number_format($competitor->selling_price, 0, ',', '.') }}
                            @else
                            -
                            @endif
                        </td>
                        <td>{{ $competitor->strengths ? substr($competitor->strengths, 0, 50) . '...' : '-' }}</td>
                        <td>{{ $competitor->weaknesses ? substr($competitor->weaknesses, 0, 50) . '...' : '-' }}</td>
                    </tr>
                    @endforeach
                </table>
            </div>
            @endif

            <!-- SWOT Analysis -->
            @if($data['market_analysis']->strengths || $data['market_analysis']->weaknesses ||
                $data['market_analysis']->opportunities || $data['market_analysis']->threats)
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

            @if($data['market_analysis']->competitive_advantage)
            <div class="subsection">
                <div class="subsection-title">Keunggulan Kompetitif</div>
                <p>{!! nl2br(e($data['market_analysis']->competitive_advantage)) !!}</p>
            </div>
            @endif
        </div>
    </div>
    @endif

    <!-- Products & Services -->
    @if($data['products_services']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">4. PRODUK & LAYANAN</div>
        </div>

        <div class="section">
            @foreach($data['products_services'] as $product)
            <div class="subsection" style="page-break-inside: avoid;">
                <div class="subsection-title">
                    {{ $product->name }} ({{ $product->type === 'product' ? 'Produk' : 'Layanan' }})
                </div>

                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Deskripsi</strong></td>
                        <td>{!! nl2br(e($product->description)) !!}</td>
                    </tr>
                    @if($product->price)
                    <tr>
                        <td><strong>Harga</strong></td>
                        <td>Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                    </tr>
                    @endif
                    @if($product->advantages)
                    <tr>
                        <td><strong>Keunggulan</strong></td>
                        <td>{!! nl2br(e($product->advantages)) !!}</td>
                    </tr>
                    @endif
                    @if($product->development_strategy)
                    <tr>
                        <td><strong>Strategi Pengembangan</strong></td>
                        <td>{!! nl2br(e($product->development_strategy)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>
                            @if($product->status === 'draft')
                            Draft
                            @elseif($product->status === 'in_development')
                            Dalam Pengembangan
                            @else
                            Diluncurkan
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Marketing Strategies -->
    @if($data['marketing_strategies']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">5. STRATEGI PEMASARAN</div>
        </div>

        <div class="section">
            @foreach($data['marketing_strategies'] as $strategy)
            <div class="subsection">
                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Strategi Promosi</strong></td>
                        <td>{!! nl2br(e($strategy->promotion_strategy)) !!}</td>
                    </tr>
                    @if($strategy->media_used)
                    <tr>
                        <td><strong>Media yang Digunakan</strong></td>
                        <td>{!! nl2br(e($strategy->media_used)) !!}</td>
                    </tr>
                    @endif
                    @if($strategy->pricing_strategy)
                    <tr>
                        <td><strong>Strategi Harga</strong></td>
                        <td>{!! nl2br(e($strategy->pricing_strategy)) !!}</td>
                    </tr>
                    @endif
                    @if($strategy->monthly_target)
                    <tr>
                        <td><strong>Target Bulanan</strong></td>
                        <td>{{ number_format($strategy->monthly_target, 0, ',', '.') }}</td>
                    </tr>
                    @endif
                    @if($strategy->collaboration_plan)
                    <tr>
                        <td><strong>Rencana Kolaborasi</strong></td>
                        <td>{!! nl2br(e($strategy->collaboration_plan)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>{{ $strategy->status === 'draft' ? 'Draft' : 'Aktif' }}</td>
                    </tr>
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Operational Plans -->
    @if($data['operational_plans']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">6. RENCANA OPERASIONAL</div>
        </div>

        <div class="section">
            @foreach($data['operational_plans'] as $plan)
            <div class="subsection">
                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Lokasi Bisnis</strong></td>
                        <td>{{ $plan->business_location }}</td>
                    </tr>
                    @if($plan->location_description)
                    <tr>
                        <td><strong>Deskripsi Lokasi</strong></td>
                        <td>{!! nl2br(e($plan->location_description)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Tipe Lokasi</strong></td>
                        <td>{{ $plan->location_type }}</td>
                    </tr>
                    @if($plan->location_size)
                    <tr>
                        <td><strong>Ukuran Lokasi</strong></td>
                        <td>{{ number_format($plan->location_size, 0, ',', '.') }} m²</td>
                    </tr>
                    @endif
                    @if($plan->rent_cost)
                    <tr>
                        <td><strong>Biaya Sewa</strong></td>
                        <td>Rp {{ number_format($plan->rent_cost, 0, ',', '.') }}/bulan</td>
                    </tr>
                    @endif
                    @if($plan->daily_workflow)
                    <tr>
                        <td><strong>Alur Kerja Harian</strong></td>
                        <td>{!! nl2br(e($plan->daily_workflow)) !!}</td>
                    </tr>
                    @endif
                    @if($plan->equipment_needs)
                    <tr>
                        <td><strong>Kebutuhan Peralatan</strong></td>
                        <td>{!! nl2br(e($plan->equipment_needs)) !!}</td>
                    </tr>
                    @endif
                    @if($plan->technology_stack)
                    <tr>
                        <td><strong>Teknologi yang Digunakan</strong></td>
                        <td>{!! nl2br(e($plan->technology_stack)) !!}</td>
                    </tr>
                    @endif
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Team Structure -->
    @if($data['team_structures']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">7. STRUKTUR TIM</div>
        </div>

        <div class="section">
            <table class="table">
                <tr>
                    <th>Kategori Tim</th>
                    <th>Nama Anggota</th>
                    <th>Posisi</th>
                    <th>Pengalaman</th>
                </tr>
                @foreach($data['team_structures'] as $member)
                <tr>
                    <td>{{ $member->team_category }}</td>
                    <td>{{ $member->member_name }}</td>
                    <td>{{ $member->position }}</td>
                    <td>{!! nl2br(e($member->experience)) !!}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
    @endif

    <!-- Financial Plans -->
    @if($data['financial_plans']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">8. RENCANA KEUANGAN</div>
        </div>

        <div class="section">
            @foreach($data['financial_plans'] as $financial)
            <div class="subsection">
                <div class="subsection-title">{{ $financial->plan_name }}</div>

                <!-- Financial Highlights -->
                <div class="financial-highlights mb-15">
                    <div class="subsection-title">Ringkasan Keuangan</div>
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
                @if($financial->capital_sources)
                <div class="subsection">
                    <div class="subsection-title">Sumber Modal</div>
                    <table class="table">
                        <tr>
                            <th>Sumber</th>
                            <th>Jumlah</th>
                            <th>Persentase</th>
                        </tr>
                        @foreach($financial->capital_sources as $source)
                        <tr>
                            <td>{{ $source['source'] }}</td>
                            <td>Rp {{ number_format($source['amount'], 0, ',', '.') }}</td>
                            <td>{{ $source['percentage'] }}%</td>
                        </tr>
                        @endforeach
                        <tr class="text-bold">
                            <td>Total Modal Awal</td>
                            <td colspan="2">Rp {{ number_format($financial->total_initial_capital, 0, ',', '.') }}</td>
                        </tr>
                    </table>
                </div>
                @endif

                <!-- Sales Projections -->
                @if($financial->sales_projections)
                <div class="subsection">
                    <div class="subsection-title">Proyeksi Penjualan</div>
                    <table class="table">
                        <tr>
                            <th>Produk/Layanan</th>
                            <th>Harga</th>
                            <th>Volume/Bulan</th>
                            <th>Pendapatan/Bulan</th>
                        </tr>
                        @foreach($financial->sales_projections as $projection)
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
                </div>
                @endif

                <!-- Profit Loss Summary -->
                <div class="subsection">
                    <div class="subsection-title">Ringkasan Laba Rugi (Bulanan)</div>
                    <table class="table">
                        <tr>
                            <td><strong>Pendapatan Bulanan</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->total_monthly_income, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td><strong>Biaya Operasional Bulanan</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->total_monthly_opex, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td><strong>Laba Kotor</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->gross_profit, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td><strong>Pajak ({{ $financial->tax_rate }}%)</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td><strong>Biaya Bunga</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->interest_expense, 0, ',', '.') }}</td>
                        </tr>
                        <tr class="text-bold">
                            <td><strong>Laba Bersih</strong></td>
                            <td class="text-right">Rp {{ number_format($financial->net_profit, 0, ',', '.') }}</td>
                        </tr>
                    </table>
                </div>

                @if($financial->feasibility_notes)
                <div class="subsection">
                    <div class="subsection-title">Analisis Kelayakan</div>
                    <p>{!! nl2br(e($financial->feasibility_notes)) !!}</p>
                </div>
                @endif
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Footer untuk semua halaman -->
    <div class="footer">
        <div style="float: left;">
            {{ $data['business_background']->name }} - Business Plan
        </div>
        <div style="float: right;" class="page-number"></div>
        <div style="clear: both;"></div>
    </div>
</body>
</html>
