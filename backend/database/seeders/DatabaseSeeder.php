<?php

namespace Database\Seeders;

use App\Models\FinancialPlan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class, // Harus dipanggil pertama!
            BusinessBackgroundSeeder::class,
            MarketAnalysisSeeder::class,
            MarketAnalysisCompetitorSeeder::class,
            ProductServiceSeeder::class,
            MarketingStrategySeeder::class,
            OperationalPlanSeeder::class,
            TeamStructureSeeder::class,
            FinancialPlanSeeder::class,
        ]);
    }
}
