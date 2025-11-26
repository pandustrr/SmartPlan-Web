<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ManagementFinancial\FinancialCategory;
use App\Models\User;

class FinancialCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Truncate untuk bisa run berulang kali (gunakan DB::table karena truncate bypass model events)
        DB::table('financial_categories')->delete();

        $users = User::all();

        // Kategori Income default
        $incomeCategories = [
            ['name' => 'Penjualan Produk', 'color' => '#10B981', 'description' => 'Pendapatan dari penjualan produk utama'],
            ['name' => 'Penjualan Jasa', 'color' => '#059669', 'description' => 'Pendapatan dari layanan jasa'],
            ['name' => 'Pendapatan Lain-lain', 'color' => '#34D399', 'description' => 'Pendapatan di luar operasional utama'],
        ];

        // Kategori Expense default
        $expenseCategories = [
            ['name' => 'Pembelian Bahan Baku', 'color' => '#EF4444', 'description' => 'Pengeluaran untuk bahan baku produksi'],
            ['name' => 'Gaji Karyawan', 'color' => '#DC2626', 'description' => 'Pengeluaran untuk gaji dan tunjangan karyawan'],
            ['name' => 'Biaya Operasional', 'color' => '#F87171', 'description' => 'Biaya operasional harian'],
            ['name' => 'Listrik & Air', 'color' => '#FB923C', 'description' => 'Biaya utilitas listrik dan air'],
            ['name' => 'Sewa Tempat', 'color' => '#F59E0B', 'description' => 'Biaya sewa lokasi usaha'],
            ['name' => 'Marketing & Promosi', 'color' => '#8B5CF6', 'description' => 'Biaya untuk iklan dan promosi'],
            ['name' => 'Transportasi', 'color' => '#3B82F6', 'description' => 'Biaya transportasi dan distribusi'],
            ['name' => 'Perawatan & Maintenance', 'color' => '#6366F1', 'description' => 'Biaya perawatan peralatan dan fasilitas'],
            ['name' => 'Pengeluaran Lain-lain', 'color' => '#6B7280', 'description' => 'Pengeluaran di luar kategori utama'],
        ];

        foreach ($users as $user) {
            // Insert Income Categories
            foreach ($incomeCategories as $category) {
                FinancialCategory::create([
                    'user_id' => $user->id,
                    'business_background_id' => 1,
                    'name' => $category['name'],
                    'type' => 'income',
                    'color' => $category['color'],
                    'status' => 'actual',
                    'description' => $category['description'],
                ]);
            }

            // Insert Expense Categories
            foreach ($expenseCategories as $category) {
                FinancialCategory::create([
                    'user_id' => $user->id,
                    'business_background_id' => 1,
                    'name' => $category['name'],
                    'type' => 'expense',
                    'color' => $category['color'],
                    'status' => 'actual',
                    'description' => $category['description'],
                ]);
            }

            // Tambahkan beberapa kategori dengan status 'plan' untuk simulasi
            FinancialCategory::create([
                'user_id' => $user->id,
                'business_background_id' => 1,
                'name' => 'Rencana Ekspansi',
                'type' => 'expense',
                'color' => '#A855F7',
                'status' => 'plan',
                'description' => 'Rencana biaya untuk ekspansi bisnis',
            ]);

            FinancialCategory::create([
                'user_id' => $user->id,
                'business_background_id' => 1,
                'name' => 'Proyeksi Pendapatan Baru',
                'type' => 'income',
                'color' => '#22C55E',
                'status' => 'plan',
                'description' => 'Proyeksi pendapatan dari produk baru',
            ]);
        }
    }
}
