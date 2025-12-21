<?php

/**
 * SINGAPAY B2B PAYMENT GATEWAY CONFIGURATION
 * For Export PDF Pro Payment System
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Operating Mode
    |--------------------------------------------------------------------------
    | Supported: "mock", "sandbox", "production"
    */
    'mode' => env('SINGAPAY_MODE', 'mock'),

    /*
    |--------------------------------------------------------------------------
    | API Credentials
    |--------------------------------------------------------------------------
    */
    'partner_id' => env('SINGAPAY_PARTNER_ID'),
    'client_id' => env('SINGAPAY_CLIENT_ID'),
    'client_secret' => env('SINGAPAY_CLIENT_SECRET'),
    'merchant_account_id' => env('SINGAPAY_MERCHANT_ACCOUNT_ID'),

    /*
    |--------------------------------------------------------------------------
    | API URLs
    |--------------------------------------------------------------------------
    */
    'sandbox_url' => env('SINGAPAY_SANDBOX_URL', 'https://sandbox-payment-b2b.singapay.id'),
    'production_url' => env('SINGAPAY_PRODUCTION_URL', 'https://payment-b2b.singapay.id'),

    /*
    |--------------------------------------------------------------------------
    | PDF Payment Packages
    |--------------------------------------------------------------------------
    */
    'packages' => [
        'monthly' => [
            'name' => 'Paket Bulanan',
            'duration_days' => 30,
            'price' => 200000,
            'description' => 'Export PDF Pro tanpa watermark - 30 hari',
        ],
        'yearly' => [
            'name' => 'Paket Tahunan',
            'duration_days' => 365,
            'price' => 1680000,
            'description' => 'Export PDF Pro tanpa watermark - 365 hari (Hemat 30%)',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Virtual Account Configuration
    |--------------------------------------------------------------------------
    */
    'virtual_account' => [
        'banks' => ['BRI', 'BNI', 'DANAMON', 'MAYBANK'],
        'expiry_hours' => 24,
        'kind' => 'temporary',
        'max_usage' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | QRIS Configuration
    |--------------------------------------------------------------------------
    */
    'qris' => [
        'expiry_hours' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    */
    'webhook' => [
        'secret' => env('SINGAPAY_WEBHOOK_SECRET'),
        'url' => env('SINGAPAY_WEBHOOK_URL', env('APP_URL') . '/api/webhooks/singapay/pdf-payment'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mock Configuration
    |--------------------------------------------------------------------------
    */
    'mock' => [
        'auto_approve_delay' => 5,
        'success_rate' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'enabled' => true,
        'ttl' => 3600,
        'prefix' => 'singapay_token_',
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging Configuration
    |--------------------------------------------------------------------------
    */
    'logging' => [
        'enabled' => env('SINGAPAY_LOGGING', true),
        'channel' => env('SINGAPAY_LOG_CHANNEL', 'daily'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Timeout & Retry
    |--------------------------------------------------------------------------
    */
    'timeout' => env('SINGAPAY_TIMEOUT', 30),
    'retry' => [
        'max_attempts' => 3,
        'delay' => 1000,
    ],
];
