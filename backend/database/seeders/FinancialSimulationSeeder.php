<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ManagementFinancial\FinancialSimulation;
use App\Models\ManagementFinancial\FinancialCategory;
use App\Models\BusinessBackground;
use App\Models\User;
use Carbon\Carbon;

class FinancialSimulationSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate untuk bisa run berulang kali
        DB::table('financial_simulations')->delete();

        $users = User::all();
        $paymentMethods = ['cash', 'bank_transfer', 'credit_card', 'digital_wallet', 'other'];
        $statuses = ['completed', 'completed', 'completed', 'completed', 'planned']; // 80% completed

        // Data untuk 2 tahun terakhir (2024-2025) untuk testing proyeksi
        $startDate = Carbon::create(2024, 1, 1);
        $endDate = Carbon::now();

        foreach ($users as $user) {
            // Ambil business background milik user ini
            $businessBackground = BusinessBackground::where('user_id', $user->id)->first();

            if (!$businessBackground) {
                continue; // Skip jika user tidak punya business background
            }

            // Ambil kategori milik user ini (hanya yang actual)
            $categories = FinancialCategory::where('user_id', $user->id)
                ->where('status', 'actual')
                ->get();

            // Generate simulasi untuk beberapa bulan dalam 2 tahun terakhir (untuk proyeksi 5 tahun)
            $months = [];
            for ($year = 2024; $year <= 2025; $year++) {
                for ($month = 1; $month <= 12; $month++) {
                    if ($year == 2025 && $month > Carbon::now()->month) {
                        break; // Tidak generate bulan future di tahun 2025
                    }
                    $months[] = ['year' => $year, 'month' => $month];
                }
            }

            foreach ($categories as $category) {
                // Generate simulasi untuk setiap bulan
                foreach ($months as $monthData) {
                    $year = $monthData['year'];
                    $month = $monthData['month'];

                    // 2-5 transaksi per kategori per bulan
                    $transactionCount = rand(2, 5);

                    for ($i = 0; $i < $transactionCount; $i++) {
                        // Random tanggal dalam bulan tersebut
                        $randomDay = rand(1, Carbon::create($year, $month, 1)->daysInMonth);
                        $randomDate = Carbon::create($year, $month, $randomDay);

                        // Skip jika tanggal future
                        if ($randomDate->isFuture()) {
                            continue;
                        }

                        // Amount berdasarkan category_subtype dan tipe kategori
                        if ($category->type === 'income') {
                            if ($category->category_subtype === 'operating_revenue') {
                                $amount = rand(1000000, 15000000); // 1jt - 15jt
                            } else { // non_operating_revenue
                                $amount = rand(100000, 2000000); // 100rb - 2jt
                            }

                            $descriptions = [
                                'Penjualan harian ' . $category->name,
                                'Transaksi pelanggan ' . $category->name,
                                'Pembayaran dari klien ' . $category->name,
                                'Penjualan online ' . $category->name,
                                'Pendapatan ' . $category->name,
                            ];
                        } else {
                            // Expense amounts berdasarkan category_subtype
                            switch ($category->category_subtype) {
                                case 'cogs':
                                    $amount = rand(2000000, 8000000); // 2jt - 8jt
                                    break;
                                case 'operating_expense':
                                    if (str_contains(strtolower($category->name), 'gaji')) {
                                        $amount = rand(3000000, 15000000); // 3jt - 15jt
                                    } elseif (str_contains(strtolower($category->name), 'sewa')) {
                                        $amount = rand(2000000, 8000000); // 2jt - 8jt
                                    } elseif (str_contains(strtolower($category->name), 'listrik')) {
                                        $amount = rand(500000, 2000000); // 500rb - 2jt
                                    } else {
                                        $amount = rand(500000, 5000000); // 500rb - 5jt
                                    }
                                    break;
                                case 'interest_expense':
                                    $amount = rand(200000, 1500000); // 200rb - 1.5jt
                                    break;
                                case 'tax_expense':
                                    $amount = rand(500000, 3000000); // 500rb - 3jt
                                    break;
                                default: // other
                                    $amount = rand(100000, 2000000); // 100rb - 2jt
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

                        // Generate unique simulation code with timestamp + random
                        $simulationCode = 'SIM' . $randomDate->format('YmdHis') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

                        FinancialSimulation::create([
                            'user_id' => $user->id,
                            'business_background_id' => $businessBackground->id,
                            'financial_category_id' => $category->id,
                            'simulation_code' => $simulationCode,
                            'type' => $category->type,
                            'amount' => $amount,
                            'simulation_date' => $randomDate,
                            'year' => $year, // Explicit set year
                            'description' => $descriptions[array_rand($descriptions)],
                            'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                            'status' => $status,
                            'is_recurring' => false,
                            'recurring_frequency' => null,
                            'recurring_end_date' => null,
                            'notes' => $status === 'planned' ? 'Simulasi yang direncanakan untuk ' . $randomDate->format('F Y') : null,
                        ]);

                        // Small delay to ensure unique simulation codes
                        usleep(1000); // 1ms delay
                    }
                }
            }

            // Tambahkan beberapa recurring simulation untuk pengeluaran rutin
            $recurringCategories = $categories->where('type', 'expense')
                ->where('category_subtype', 'operating_expense')
                ->take(3);

            foreach ($recurringCategories as $category) {
                // Recurring simulation untuk tahun 2025
                $recurringAmount = 0;
                if (str_contains(strtolower($category->name), 'gaji')) {
                    $recurringAmount = 5000000; // 5jt
                } elseif (str_contains(strtolower($category->name), 'sewa')) {
                    $recurringAmount = 3000000; // 3jt
                } elseif (str_contains(strtolower($category->name), 'listrik')) {
                    $recurringAmount = 1000000; // 1jt
                } else {
                    $recurringAmount = 2000000; // 2jt default
                }

                $simulationCode = 'SIM' . Carbon::now()->format('YmdHis') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

                FinancialSimulation::create([
                    'user_id' => $user->id,
                    'business_background_id' => $businessBackground->id,
                    'financial_category_id' => $category->id,
                    'simulation_code' => $simulationCode,
                    'type' => 'expense',
                    'amount' => $recurringAmount,
                    'simulation_date' => Carbon::now()->startOfMonth(),
                    'year' => Carbon::now()->year,
                    'description' => 'Biaya bulanan ' . strtolower($category->name),
                    'payment_method' => 'bank_transfer',
                    'status' => 'completed',
                    'is_recurring' => true,
                    'recurring_frequency' => 'monthly',
                    'recurring_end_date' => Carbon::now()->addYear(),
                    'notes' => 'Pembayaran otomatis setiap bulan untuk ' . $category->name,
                ]);

                usleep(1000); // Small delay for unique codes
            }
        }
    }
}
