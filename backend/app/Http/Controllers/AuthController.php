<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Affiliate\AffiliateLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use App\Services\WhatsAppService;
use App\Services\AffiliateService;

class AuthController extends Controller
{
    protected $whatsappService;
    protected $affiliateService;

    public function __construct(WhatsAppService $whatsappService, AffiliateService $affiliateService)
    {
        $this->whatsappService = $whatsappService;
        $this->affiliateService = $affiliateService;
    }

    public function register(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'phone' => [
                'required',
                'string',
                'unique:users',
                function ($attribute, $value, $fail) {
                    // Validasi format nomor Indonesia
                    $cleanPhone = preg_replace('/[^0-9]/', '', $value);

                    if (strlen($cleanPhone) < 10 || strlen($cleanPhone) > 15) {
                        $fail('Format nomor WhatsApp tidak valid.');
                    }
                },
            ],
            'password' => 'required|string|min:8|confirmed',
            'referral_code' => 'nullable|string', // Affiliate referral code
        ], [
            'phone.unique' => 'Nomor WhatsApp sudah terdaftar.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check referral code and get referrer user ID
        $referredByUserId = null;
        if ($request->filled('referral_code')) {
            $affiliateLink = AffiliateLink::where('slug', $request->referral_code)
                ->where('is_active', true)
                ->first();

            if ($affiliateLink) {
                $referredByUserId = $affiliateLink->user_id;
                Log::info('[Register] User registered via affiliate link', [
                    'referral_code' => $request->referral_code,
                    'referrer_user_id' => $referredByUserId,
                ]);
            }
        }

        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'referred_by_user_id' => $referredByUserId,
        ]);

        // Generate dan kirim OTP
        $otp = $user->generateOtp();

        $whatsappSent = $this->whatsappService->sendOtp($user->phone, $otp);

        if (!$whatsappSent) {
            // Jika gagal kirim OTP, hapus user yang baru dibuat
            $user->delete();

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP ke WhatsApp. Pastikan nomor WhatsApp aktif dan coba lagi.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan cek WhatsApp Anda untuk kode verifikasi.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'phone' => $user->phone,
                    'phone_verified' => false,
                ]
            ]
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid'
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if ($user->hasVerifiedPhone()) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp sudah terverifikasi sebelumnya'
            ], 400);
        }

        if (!$user->validateOtp($request->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa'
            ], 400);
        }

        // Verifikasi berhasil
        $user->markPhoneAsVerified();

        // Create affiliate link automatically for new verified user
        $affiliateLink = AffiliateLink::where('user_id', $user->id)->first();
        if (!$affiliateLink) {
            $slug = $this->affiliateService->generateInitialSlug($user);
            AffiliateLink::create([
                'user_id' => $user->id,
                'slug' => $slug,
                'original_slug' => $slug,
                'is_custom' => false,
                'change_count' => 0,
                'max_changes' => 999,
                'is_active' => true,
            ]);
        }

        // Auto login setelah verifikasi
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil! Akun Anda telah aktif.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'phone' => $user->phone,
                    'phone_verified' => true,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp tidak valid'
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if ($user->hasVerifiedPhone()) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp sudah terverifikasi'
            ], 400);
        }

        // Generate OTP baru
        $otp = $user->generateOtp();

        $whatsappSent = $this->whatsappService->sendOtp($user->phone, $otp);

        if (!$whatsappSent) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP. Silakan coba lagi nanti.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP baru telah dikirim ke WhatsApp Anda.'
        ]);
    }

    public function login(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah input adalah phone atau username
        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : (preg_match('/^[0-9+]+$/', $request->login) ? 'phone' : 'username');

        // Attempt login
        $credentials = [
            $loginType => $request->login,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Username/nomor WhatsApp atau password salah'
            ], 401);
        }

        $user = User::where($loginType, $request->login)->firstOrFail();

        // Check if phone is verified
        if (!$user->hasVerifiedPhone()) {
            // Kirim OTP otomatis saat login jika belum verifikasi
            $otp = $user->generateOtp();
            $whatsappSent = $this->whatsappService->sendOtp($user->phone, $otp);

            if (!$whatsappSent) {
                Log::error('Failed to send WhatsApp OTP during login: ' . $user->phone);
            }

            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp belum terverifikasi. Kode OTP baru telah dikirim ke WhatsApp Anda.',
                'data' => [
                    'needs_verification' => true,
                    'phone' => $user->phone
                ]
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'phone' => $user->phone,
                    'phone_verified' => true,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|exists:users,phone',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp tidak terdaftar'
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Generate reset OTP
        $otp = $user->generateResetOtp();

        $whatsappSent = $this->whatsappService->sendResetOtp($user->phone, $otp);

        if (!$whatsappSent) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP. Silakan coba lagi nanti.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP reset password telah dikirim ke WhatsApp Anda.'
        ]);
    }

    public function verifyResetOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid'
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user->validateResetOtp($request->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa'
            ], 400);
        }

        // OTP valid, return token untuk reset password
        $resetToken = bin2hex(random_bytes(32));

        // Simpan token sementara (bisa menggunakan cache)
        cache()->put('reset_token_' . $resetToken, $user->id, now()->addMinutes(10));

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully',
            'data' => [
                'reset_token' => $resetToken
            ]
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid'
            ], 422);
        }

        // Validasi reset token
        $cacheKey = 'reset_token_' . $request->reset_token;
        $userId = cache()->get($cacheKey);

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Token reset tidak valid atau sudah kedaluwarsa'
            ], 400);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->clearResetOtp();
        $user->save();

        // Hapus token dari cache
        cache()->forget($cacheKey);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login dengan password baru.'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }
}
