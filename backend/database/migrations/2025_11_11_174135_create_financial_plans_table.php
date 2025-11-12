<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financial_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('business_background_id')->constrained('business_backgrounds')->onDelete('cascade');

            $table->enum('capital_source', ['Pribadi', 'Pinjaman', 'Investor'])->default('Pribadi');
            $table->decimal('initial_capex', 15, 2)->default(0); // Estimasi Modal Awal (CapEx)
            $table->decimal('monthly_operational_cost', 15, 2)->default(0);
            $table->decimal('estimated_monthly_income', 15, 2)->default(0);
            $table->decimal('profit_loss_estimation', 15, 2)->default(0); // Auto dihitung

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_plans');
    }
};
