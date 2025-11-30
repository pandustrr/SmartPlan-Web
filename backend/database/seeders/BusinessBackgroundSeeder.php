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
            'logo' => null, // Bisa diisi dengan path gambar: 'uploads/logo.png'
            'name' => 'Kedai Kopi Pandu',
            'category' => 'Kuliner',

            // Deskripsi singkat untuk header
            'description' => 'Kedai kopi premium dengan suasana cozy untuk komunitas mahasiswa dan profesional muda di Jember. Kami menyajikan kopi specialty berkualitas tinggi dengan harga terjangkau dan layanan terbaik.',

            // Tujuan bisnis yang detail
            'purpose' => 'Menyediakan tempat nongkrong yang nyaman, berkualitas, dan terjangkau khususnya untuk mahasiswa UNEJ dan area sekitarnya. Kami berkomitmen menciptakan ruang yang inspiratif untuk belajar, bertemu, dan berkolaborasi sambil menikmati kopi terbaik.',

            'location' => 'Ruko Kampus, Jalan Kalimantan, Jember, Jawa Timur 68121',
            'business_type' => 'UMKM (Usaha Mikro Kecil Menengah)',
            'start_date' => '2023-06-01',

            // Nilai-nilai bisnis yang komprehensif
            'values' => 'Integritas dalam setiap transaksi, Kualitas layanan yang konsisten, Inovasi berkelanjutan dalam menu dan pengalaman, Keberlanjutan lingkungan, Inklusi dan keberagaman dalam komunitas kami.',

            // Visi yang inspiratif dan terukur
            'vision' => 'Menjadi kedai kopi pilihan utama bagi mahasiswa dan komunitas muda di Jember, dikenal dengan kualitas rasa premium, suasana nyaman, harga terjangkau, dan layanan yang berkesan. Pada 2025 kami ingin ekspansi ke 3 lokasi strategis.',

            // Misi yang detail dan actionable
            'mission' => 'Memberikan pelayanan prima dengan senyuman tulus kepada setiap pelanggan. Menyajikan kopi specialty dengan biji pilihan terbaik, disangrai sempurna, dan diseduh dengan keahlian barista profesional. Menciptakan komunitas yang harmonis melalui berbagai event dan kolaborasi. Mendukung UMKM lokal dengan menjadi distributor produk lokal berkualitas.',

            'contact' => 'instagram.com/kedaikopipandu | WhatsApp: 0821-3456-7890 | Email: info@kedaikopipandu.com',
        ]);
    }
}
