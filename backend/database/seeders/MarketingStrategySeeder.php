<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketingStrategy;

class MarketingStrategySeeder extends Seeder
{
    public function run(): void
    {
        MarketingStrategy::create([
            'user_id' => 1,
            'business_background_id' => 1,

            'promotion_strategy' => 'Menggunakan social media ads (Instagram & TikTok), promo bundling, dan program loyalitas pelanggan.',
            'media_used' => 'Instagram, TikTok, WhatsApp Broadcast, Brosur digital',
            'pricing_strategy' => 'Harga kompetitif dengan strategi psychological pricing dan diskon event tertentu.',
            'monthly_target' => 150,
            'collaboration_plan' => 'Kerja sama dengan influencer lokal dan komunitas mahasiswa sekitar kampus.',
            'status' => 'active',
        ]);
    }
}
