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
        Schema::create('market_analyses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // pemilik data
            $table->unsignedBigInteger('business_background_id')->nullable(); // relasi ke usaha (opsional)

            // Fields sesuai checklist
            $table->text('target_market')->nullable(); // deskripsi target pasar (usia, lokasi, preferensi, dll)
            $table->string('market_size')->nullable(); // ukuran & potensi pasar (string agar fleksibel)
            $table->text('market_trends')->nullable(); // tren pasar (ringkasan manual)
            $table->text('main_competitors')->nullable(); // kompetitor utama (bisa list/json string)
            $table->text('competitor_strengths')->nullable(); // kelebihan kompetitor
            $table->text('competitor_weaknesses')->nullable(); // kekurangan kompetitor
            $table->text('competitive_advantage')->nullable(); // keunggulan kompetitif usaha sendiri

            $table->timestamps();

            // foreign keys (pastikan tabel users dan business_backgrounds ada)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('business_background_id')->references('id')->on('business_backgrounds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_analyses');
    }
};
