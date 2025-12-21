<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Singapay\PremiumPdf;

class PremiumPdfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'package_type' => 'monthly',
                'name' => 'Paket Bulanan Export PDF Pro',
                'description' => 'Akses Export PDF Pro selama 30 hari dengan fitur lengkap untuk kebutuhan business plan dan financial report Anda.',
                'price' => 200000, // Rp 200.000
                'duration_days' => 30,
                'features' => [
                    'Export Business Plan ke PDF',
                    'Export Financial Report ke PDF',
                    'Export Forecast Report ke PDF',
                    'Layout profesional dan rapi',
                    'Unlimited export selama masa aktif',
                    'Watermark SmartPlan (opsional)',
                    'Download langsung',
                    'Support email',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'package_type' => 'yearly',
                'name' => 'Paket Tahunan Export PDF Pro',
                'description' => 'Akses Export PDF Pro selama 365 hari dengan hemat 30%! Solusi terbaik untuk kebutuhan jangka panjang.',
                'price' => 1680000, // Rp 1.680.000 (hemat Rp 720.000 dari harga normal Rp 2.400.000)
                'duration_days' => 365,
                'features' => [
                    'Semua fitur Paket Bulanan',
                    'Export Business Plan ke PDF',
                    'Export Financial Report ke PDF',
                    'Export Forecast Report ke PDF',
                    'Layout profesional dan rapi',
                    'Unlimited export selama masa aktif',
                    'Watermark SmartPlan (opsional)',
                    'Download langsung',
                    'Priority support email',
                    'Hemat 30% (Rp 720.000)',
                    'Cocok untuk penggunaan jangka panjang',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($packages as $package) {
            PremiumPdf::updateOrCreate(
                ['package_type' => $package['package_type']],
                $package
            );
        }

        $this->command->info('Premium PDF packages seeded successfully!');
    }
}
