<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessBackground;

class BusinessBackgroundSeeder extends Seeder
{
    public function run(): void
    {
        BusinessBackground::create([
            'user_id' => 1,
            'logo' => null, // atau isi dengan path gambar: 'uploads/logo.png'
            'name' => 'Kedai Kopi Pandu',
            'category' => 'Kuliner',
            'description' => 'Usaha kafe yang menyediakan berbagai minuman kopi dan snack premium.',
            'purpose' => 'Menyediakan tempat nongkrong nyaman untuk mahasiswa dengan harga terjangkau.',
            'location' => 'Jember, Jawa Timur',
            'business_type' => 'UMKM',
            'start_date' => '2023-06-01',
            'values' => 'Integritas, kualitas layanan, dan inovasi dalam penyajian produk.',
            'vision' => 'Menjadi kafe mahasiswa terbaik di Jember.',
            'mission' => 'Memberikan pelayanan prima, kualitas rasa terbaik, dan suasana nyaman.',
            'contact' => 'instagram.com/kedaikopipandu',
        ]);
    }
}
