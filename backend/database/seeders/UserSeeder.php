<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Pandu',
            'username' => 'pandu123',
            'phone' => '628123456789',
            'password' => Hash::make('password'),
            'profile_photo' => null,
            'account_status' => 'active',
            'phone_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
            'reset_otp_code' => null,
            'reset_otp_expires_at' => null,
        ]);
    }
}
