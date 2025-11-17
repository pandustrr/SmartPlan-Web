<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OperationalPlan;

class OperationalPlanSeeder extends Seeder
{
    public function run(): void
    {
        OperationalPlan::create([
            'user_id' => 1,
            'business_background_id' => 3,

            // Lokasi Usaha
            'business_location' => 'Ruko Kampus, Jember',
            'location_description' => 'Ruko 2 lantai dekat kampus, cocok untuk operasional dan meeting kecil.',
            'location_type' => 'rented',
            'location_size' => 45.50,
            'rent_cost' => 2500000,

            // Karyawan
            'employees' => [
                [
                    'name' => 'Andi Setiawan',
                    'role' => 'Operational Staff',
                    'schedule' => '09:00 - 17:00'
                ],
                [
                    'name' => 'Rina Oktaviani',
                    'role' => 'Customer Support',
                    'schedule' => '10:00 - 18:00'
                ]
            ],

            // Jam Operasional
            'operational_hours' => [
                'monday' => '09:00 - 17:00',
                'tuesday' => '09:00 - 17:00',
                'wednesday' => '09:00 - 17:00',
                'thursday' => '09:00 - 17:00',
                'friday' => '09:00 - 17:00',
                'saturday' => '10:00 - 15:00',
                'sunday' => 'closed'
            ],

            // Supplier
            'suppliers' => [
                [
                    'name' => 'PT Sumber Makmur',
                    'type' => 'Peralatan Operasional',
                    'contact' => '08123456789'
                ],
                [
                    'name' => 'CV Digital Partner',
                    'type' => 'Software & Tools',
                    'contact' => '081298765432'
                ]
            ],

            // Daily Workflow
            'daily_workflow' => "1. Buka operasional harian\n2. Cek peralatan dan stok\n3. Layani pelanggan yang masuk\n4. Proses pesanan dan pencatatan\n5. Tutup operasional dan buat laporan harian",

            // Workflow diagram otomatis (biarkan null dulu, nanti digenerate jika perlu)
            'workflow_diagram' => null,
            'workflow_image_path' => null,

            // Equipment
            'equipment_needs' => "Laptop, Printer, Mesin kasir, Router WiFi, Lemari penyimpanan",
            'technology_stack' => "Laravel 11, React JS, MySQL, Firebase, Docker",

            // Status
            'status' => 'completed'
        ]);
    }
}
