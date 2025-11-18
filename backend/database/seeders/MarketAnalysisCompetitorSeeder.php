<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketAnalysis;
use App\Models\MarketAnalysisCompetitor;

class MarketAnalysisCompetitorSeeder extends Seeder
{
    public function run(): void
    {
        $analysis = MarketAnalysis::first(); // Ambil market analysis pertama (ID = 1)

        // Competitor 1
        MarketAnalysisCompetitor::create([
            'market_analysis_id' => $analysis->id,
            'competitor_name' => 'Janji Jiwa',
            'type' => 'competitor',
            'code' => 'JJ-01',
            'address' => 'Jalan Kalimantan, dekat kampus UNEJ',
            'annual_sales_estimate' => 350000000,
            'selling_price' => 18000,
            'strengths' => 'Brand kuat, banyak pilihan menu, harga stabil.',
            'weaknesses' => 'Rasa kadang tidak konsisten, tempat sempit.',
            'sort_order' => 1,
        ]);

        // Competitor 2
        MarketAnalysisCompetitor::create([
            'market_analysis_id' => $analysis->id,
            'competitor_name' => 'Kopi Kenangan',
            'type' => 'competitor',
            'code' => 'KK-02',
            'address' => 'Roxy Square Jember',
            'annual_sales_estimate' => 500000000,
            'selling_price' => 22000,
            'strengths' => 'Brand nasional kuat, banyak promo.',
            'weaknesses' => 'Harga lebih mahal, antrean panjang.',
            'sort_order' => 2,
        ]);

        // Competitor 3 (contoh ownshop)
        MarketAnalysisCompetitor::create([
            'market_analysis_id' => $analysis->id,
            'competitor_name' => 'Kedai Kopi Pandu',
            'type' => 'ownshop',
            'code' => 'OWN-01',
            'address' => 'Jember, Jawa Timur',
            'annual_sales_estimate' => 150000000,
            'selling_price' => 15000,
            'strengths' => 'Tempat cozy, harga mahasiswa, rasa premium.',
            'weaknesses' => 'Brand baru, belum banyak dikenal.',
            'sort_order' => 0,
        ]);
    }
}
