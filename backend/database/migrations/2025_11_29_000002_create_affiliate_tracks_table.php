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
        Schema::create('affiliate_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_link_id')->constrained('affiliate_links')->onDelete('cascade');
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type')->nullable(); // mobile, tablet, desktop
            $table->string('browser')->nullable(); // Chrome, Firefox, Safari, etc
            $table->string('os')->nullable(); // Windows, iOS, Android, macOS, etc
            $table->string('referrer')->nullable();
            $table->timestamp('tracked_at')->useCurrent();
            $table->timestamps();

            $table->index('affiliate_link_id');
            $table->index('tracked_at');
            $table->index('device_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_tracks');
    }
};
