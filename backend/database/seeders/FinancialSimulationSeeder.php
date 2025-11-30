<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ManagementFinancial\FinancialSimulation;
use App\Models\ManagementFinancial\FinancialCategory;
use App\Models\User;
use Carbon\Carbon;

class FinancialSimulationSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate untuk bisa run berulang kali
        DB::table('financial_simulations')->delete();

        $users = User::all();
        $paymentMethods = ['cash', 'bank_transfer', 'credit_card', 'digital_wallet'];
        $statuses = ['completed', 'completed', 'completed', 'completed', 'planned']; // 80% completed

        // 3 bulan terakhir
        $startDate = Carbon::now()->subMonths(3)->startOfMonth();
        $endDate = Carbon::now();

        foreach ($users as $user) {
            // Ambil kategori milik user ini (hanya yang actual)
            $categories = FinancialCategory::where('user_id', $user->id)
                ->where('status', 'actual')
                ->get();

            foreach ($categories as $category) {
                // Exactly 10 simulasi per kategori (KONSISTEN)
                for ($i = 0; $i < 10; $i++) {
                    // Random tanggal dalam 3 bulan terakhir
                    $randomDate = Carbon::createFromTimestamp(
                        rand($startDate->timestamp, $endDate->timestamp)
                    );

                    // Amount berdasarkan tipe kategori
                    if ($category->type === 'income') {
                        // Income: 500rb - 10jt
                        $amount = rand(500000, 10000000);
                        $descriptions = [
                            'Penjualan harian',
                            'Transaksi pelanggan',
                            'Pembayaran dari klien',
                            'Penjualan online',
                            'Pendapatan cabang',
                        ];
                    } else {
                        // Expense: variasi berdasarkan nama kategori
                        if (str_contains($category->name, 'Gaji')) {
                            $amount = rand(3000000, 15000000); // 3jt - 15jt
                        } elseif (str_contains($category->name, 'Sewa')) {
                            $amount = rand(2000000, 8000000); // 2jt - 8jt
                        } elseif (str_contains($category->name, 'Listrik')) {
                            $amount = rand(500000, 2000000); // 500rb - 2jt
                        } elseif (str_contains($category->name, 'Bahan Baku')) {
                            $amount = rand(1000000, 5000000); // 1jt - 5jt
                        } else {
                            $amount = rand(100000, 3000000); // 100rb - 3jt
                        }

                        $descriptions = [
                            'Pembayaran ' . strtolower($category->name),
                            'Pengeluaran ' . strtolower($category->name),
                            'Biaya ' . strtolower($category->name),
                            'Transaksi ' . strtolower($category->name),
                        ];
                    }

                    // Random status (mayoritas completed)
                    $status = $statuses[array_rand($statuses)];

                    // Generate unique simulation code: SIM + date + index + user_id
                    $simulationCode = 'SIM' . $randomDate->format('YmdHis') . str_pad($i, 3, '0', STR_PAD_LEFT) . $user->id;

                    FinancialSimulation::create([
                        'user_id' => $user->id,
                        'business_background_id' => 1,
                        'financial_category_id' => $category->id,
                        'simulation_code' => $simulationCode,
                        'type' => $category->type,
                        'amount' => $amount,
                        'simulation_date' => $randomDate,
                        'description' => $descriptions[array_rand($descriptions)],
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                        'status' => $status,
                        'is_recurring' => false,
                        'recurring_frequency' => null,
                        'recurring_end_date' => null,
                        'notes' => $status === 'planned' ? 'Simulasi yang direncanakan' : null,
                    ]);
                }
            }

            // Tambahkan 3 recurring simulation (Gaji Karyawan, Sewa Tempat, Listrik & Air)
            // Total simulasi per user = (3 income + 9 expense) × 10 + 3 recurring = 123
            $recurringCategories = [
                'Gaji Karyawan' => 5000000,
                'Sewa Tempat' => 3000000,
                'Listrik & Air' => 1000000,
            ];

            $recurringIndex = 0;
            foreach ($recurringCategories as $categoryName => $amount) {
                $category = $categories->firstWhere('name', $categoryName);

                if ($category) {
                    $recurringSimulationCode = 'SIM' . Carbon::now()->format('YmdHis') . str_pad($recurringIndex, 3, '0', STR_PAD_LEFT) . 'REC' . $user->id;

                    FinancialSimulation::create([
                        'user_id' => $user->id,
                        'business_background_id' => 1,
                        'financial_category_id' => $category->id,
                        'simulation_code' => $recurringSimulationCode,
                        'type' => 'expense',
                        'amount' => $amount,
                        'simulation_date' => Carbon::now()->startOfMonth(),
                        'description' => 'Biaya bulanan ' . strtolower($categoryName),
                        'payment_method' => 'bank_transfer',
                        'status' => 'completed',
                        'is_recurring' => true,
                        'recurring_frequency' => 'monthly',
                        'recurring_end_date' => Carbon::now()->addYear(),
                        'notes' => 'Pembayaran otomatis setiap bulan',
                    ]);
                    $recurringIndex++;
                }
            }
        }
    }
}
