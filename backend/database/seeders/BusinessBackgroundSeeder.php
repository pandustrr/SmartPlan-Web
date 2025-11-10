<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BusinessBackgroundSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('business_backgrounds')->insert([
            [
                'user_id' => 1, // pastikan user dengan ID 1 sudah ada
                'logo' => 'logos/coolbeans.png',
                'name' => 'Cool Beans Coffee',
                'category' => 'Kafe & Minuman',
                'description' => 'Kafe lokal yang menyediakan kopi premium dan suasana nyaman untuk mahasiswa.',
                'purpose' => 'Menyediakan tempat nongkrong sekaligus ruang produktif bagi mahasiswa.',
                'location' => 'Jl. Kalimantan No. 10, Jember',
                'business_type' => 'UMKM',
                'start_date' => '2022-06-15',
                'values' => 'Kualitas, Pelayanan, dan Komunitas.',
                'vision' => 'Menjadi kafe mahasiswa terbaik di Jember.',
                'mission' => 'Menyajikan kopi terbaik dengan pelayanan ramah dan suasana hangat.',
                'contact' => '@coolbeanscoffee',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'logo' => 'logos/techconnect.png',
                'name' => 'TechConnect ID',
                'category' => 'Teknologi & Edukasi',
                'description' => 'Startup edutech yang fokus pada pelatihan digital untuk mahasiswa dan pelaku UMKM.',
                'purpose' => 'Memberikan akses pelatihan digital berkualitas di daerah.',
                'location' => 'Jl. Mastrip No. 55, Jember',
                'business_type' => 'PT',
                'start_date' => '2023-01-10',
                'values' => 'Inovasi, Edukasi, dan Kolaborasi.',
                'vision' => 'Meningkatkan literasi digital masyarakat Indonesia.',
                'mission' => 'Menghadirkan pelatihan yang relevan dengan industri 4.0.',
                'contact' => '@techconnect.id',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
