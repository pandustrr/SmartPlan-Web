<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketAnalysis;

class MarketAnalysisSeeder extends Seeder
{
    public function run(): void
    {
        $analysis = MarketAnalysis::create([
            'user_id' => 1,
            'business_background_id' => 3, // Pastikan BusinessBackgroundSeeder sudah jalan

            // Basic Market Analysis
            'target_market' => 'Mahasiswa, pekerja muda, dan pecinta kopi usia 18–35 tahun.',
            'market_size' => '± 30.000 mahasiswa di sekitar UNEJ dan area Jember kota.',
            'market_trends' => 'Pertumbuhan konsumsi kopi meningkat, tren nongkrong di kafe meningkat 20% per tahun.',
            'main_competitors' => 'Janji Jiwa, Kopi Kenangan, Kafe lokal sekitar kampus.',
            'competitor_strengths' => 'Brand kuat, lokasi strategis, harga terjangkau.',
            'competitor_weaknesses' => 'Antrian lama, rasa tidak konsisten, ruang duduk terbatas.',
            'competitive_advantage' => 'Rasa premium, suasana cozy, harga ramah mahasiswa, menu unik.',

            // TAM, SAM, SOM
            'tam_total' => 500000000,     // contoh: 500 juta per tahun
            'sam_percentage' => 40.00,
            'sam_total' => 200000000,     // 40% dari TAM
            'som_percentage' => 10.00,
            'som_total' => 50000000,      // 10% dari SAM

            // SWOT
            'strengths' => 'Rasa kopi premium, tempat nyaman, harga bersaing.',
            'weaknesses' => 'Brand masih baru, modal terbatas.',
            'opportunities' => 'Pertumbuhan pasar kopi, minat nongkrong meningkat.',
            'threats' => 'Kenaikan harga bahan baku, kompetitor baru.',
        ]);
    }
}
