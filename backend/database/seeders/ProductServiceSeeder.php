<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductService;

class ProductServiceSeeder extends Seeder
{
    public function run(): void
    {
        ProductService::create([
            'user_id' => 1,
            'business_background_id' => 1,
            'type' => 'product',
            'name' => 'Signature Caramel Latte',
            'description' => 'Minuman kopi spesial dengan karamel homemade yang creamy, menjadi salah satu menu favorit pelanggan.',
            'price' => 25000,
            'image_path' => null, // bisa diisi storage path jika sudah upload
            'advantages' => 'Rasa premium, bahan berkualitas, cocok untuk semua kalangan.',
            'development_strategy' => 'Pengembangan varian rasa baru dan paket bundling untuk meningkatkan penjualan.',
            'bmc_alignment' => [
                'customer_segment' => 'Mahasiswa, pekerja, dan pecinta kopi.',
                'value_proposition' => 'Rasa premium dengan harga terjangkau.',
                'channels' => 'Penjualan langsung dan aplikasi delivery.',
                'customer_relationships' => 'Customer service ramah dan program loyalitas.',
                'revenue_streams' => 'Penjualan minuman dan layanan tambahan.',
                'key_resources' => 'Bahan baku premium, brand café, tenaga barista.',
                'key_activities' => 'Produksi minuman, layanan pelanggan.',
                'key_partnerships' => 'Supplier kopi lokal, marketplace delivery.',
                'cost_structure' => 'Biaya bahan baku, SDM, dan operasional café.'
            ],
            'status' => 'launched',
        ]);

        ProductService::create([
            'user_id' => 1,
            'business_background_id' => 1,
            'type' => 'product',
            'name' => 'Chicken Rice Bowl',
            'description' => 'Menu makanan praktis dengan ayam crispy dan saus signature, cocok untuk makan siang.',
            'price' => 30000,
            'image_path' => null,
            'advantages' => 'Porsi besar, cita rasa khas, harga pelajar.',
            'development_strategy' => 'Menambahkan pilihan level pedas dan varian saus baru.',
            'bmc_alignment' => [
                'customer_segment' => 'Mahasiswa yang butuh makanan cepat dan murah.',
                'value_proposition' => 'Porsi banyak, rasa enak, harga ramah kantong.',
                'channels' => 'Dine-in, take-away, dan marketplace.',
                'customer_relationships' => 'Program diskon bundling.',
                'revenue_streams' => 'Penjualan makanan utama.',
                'key_resources' => 'Dapur produksi, chef, bahan baku.',
                'key_activities' => 'Memasak, quality control.',
                'key_partnerships' => 'Supplier ayam dan beras.',
                'cost_structure' => 'Biaya bahan baku + tenaga masak.'
            ],
            'status' => 'launched',
        ]);

        ProductService::create([
            'user_id' => 1,
            'business_background_id' => 1,
            'type' => 'service',
            'name' => 'Café Event Hosting',
            'description' => 'Layanan penyewaan café untuk acara kecil seperti meeting, birthday, atau komunitas.',
            'price' => 150000,
            'image_path' => null,
            'advantages' => 'Tempat cozy, fasilitas lengkap, harga terjangkau.',
            'development_strategy' => 'Menambahkan paket dekorasi dan sound system.',
            'bmc_alignment' => [
                'customer_segment' => 'Komunitas kampus dan pekerja.',
                'value_proposition' => 'Tempat nyaman dengan pelayanan lengkap.',
                'channels' => 'Booking via WhatsApp dan website.',
                'customer_relationships' => 'Support personal untuk kebutuhan acara.',
                'revenue_streams' => 'Sewa tempat + upsell makanan/minuman.',
                'key_resources' => 'Ruang café, staf event.',
                'key_activities' => 'Persiapan tempat, service event.',
                'key_partnerships' => 'Vendor dekorasi dan event komunitas.',
                'cost_structure' => 'Biaya listrik, staf, dan maintenance.'
            ],
            'status' => 'in_development',
        ]);
    }
}
