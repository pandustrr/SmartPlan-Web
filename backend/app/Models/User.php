<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'phone',
        'password',
        'otp_code',
        'otp_expires_at',
        'reset_otp_code',
        'reset_otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
        'reset_otp_code',
    ];

    protected function casts(): array
    {
        return [
            'phone_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'reset_otp_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Generate OTP untuk verifikasi
    public function generateOtp()
    {
        $otp = rand(100000, 999999);
        $this->otp_code = $otp;
        $this->otp_expires_at = now()->addMinutes(10);
        $this->save();

        return $otp;
    }

    // Generate OTP untuk reset password
    public function generateResetOtp()
    {
        $otp = rand(100000, 999999);
        $this->reset_otp_code = $otp;
        $this->reset_otp_expires_at = now()->addMinutes(10);
        $this->save();

        return $otp;
    }

    // Validasi OTP
    public function validateOtp($otp)
    {
        return $this->otp_code === $otp &&
               $this->otp_expires_at &&
               $this->otp_expires_at->isFuture();
    }

    // Validasi Reset OTP
    public function validateResetOtp($otp)
    {
        return $this->reset_otp_code === $otp &&
               $this->reset_otp_expires_at &&
               $this->reset_otp_expires_at->isFuture();
    }

    // Cek apakah nomor sudah diverifikasi
    public function hasVerifiedPhone()
    {
        return !is_null($this->phone_verified_at);
    }

    // Tandai nomor WA sudah diverifikasi
    public function markPhoneAsVerified()
    {
        $this->phone_verified_at = now();
        $this->otp_code = null;
        $this->otp_expires_at = null;
        $this->save();
    }

    // Clear reset OTP setelah berhasil reset password
    public function clearResetOtp()
    {
        $this->reset_otp_code = null;
        $this->reset_otp_expires_at = null;
        $this->save();
    }
}
