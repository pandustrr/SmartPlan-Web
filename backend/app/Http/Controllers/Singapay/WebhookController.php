<?php

namespace App\Http\Controllers\Singapay;

use App\Http\Controllers\Controller;
use App\Services\Singapay\WebhookService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $webhookService;

    public function __construct(WebhookService $webhookService)
    {
        $this->webhookService = $webhookService;
    }

    /**
     * Handle payment webhook from SingaPay
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handlePayment(Request $request): JsonResponse
    {
        try {
            $payload = $request->all();

            Log::info('[SingaPay Webhook] Received payment webhook', [
                'payload' => $payload,
                'headers' => $request->headers->all(),
            ]);

            $result = $this->webhookService->processPaymentWebhook($payload);

            $statusCode = $result['success'] ? 200 : 400;

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
            ], $statusCode);

        } catch (\Exception $e) {
            Log::error('[SingaPay Webhook] Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Webhook processing failed',
            ], 500);
        }
    }

    /**
     * Handle Virtual Account webhook
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handleVirtualAccount(Request $request): JsonResponse
    {
        return $this->handlePayment($request);
    }

    /**
     * Handle QRIS webhook
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handleQris(Request $request): JsonResponse
    {
        return $this->handlePayment($request);
    }

    /**
     * Test webhook (mock mode only)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function test(Request $request): JsonResponse
    {
        if (config('singapay.mode') !== 'mock') {
            return response()->json([
                'success' => false,
                'message' => 'Test webhook only available in mock mode',
            ], 403);
        }

        $validated = $request->validate([
            'transaction_code' => 'required|string',
        ]);

        $transaction = \App\Models\Singapay\PaymentTransaction::where('transaction_code', $validated['transaction_code'])->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $result = $this->webhookService->processMockWebhook($transaction);

        return response()->json($result);
    }
}
