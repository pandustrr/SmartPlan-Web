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
        Schema::table('financial_simulations', function (Blueprint $table) {
            // Add business_background_id column (nullable)
            $table->foreignId('business_background_id')
                ->nullable()
                ->after('user_id')
                ->constrained('business_backgrounds')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('financial_simulations', function (Blueprint $table) {
            // Drop foreign key and column
            $table->dropForeign(['business_background_id']);
            $table->dropColumn('business_background_id');
        });
    }
};
