{{--
    Template Error View untuk Client
    Simpan di: resources/views/errors/api-error.blade.php
--}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Error - {{ $code ?? 500 }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }

        .error-code {
            font-size: 72px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .error-title {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .error-details {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 16px;
            margin-bottom: 32px;
            text-align: left;
        }

        .error-details-title {
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }

        .error-details-content {
            font-size: 14px;
            color: #718096;
            font-family: 'Courier New', monospace;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
            transform: translateY(-2px);
        }

        .timestamp {
            margin-top: 24px;
            font-size: 12px;
            color: #a0aec0;
        }

        @media (max-width: 640px) {
            .error-container {
                padding: 24px;
            }

            .error-code {
                font-size: 56px;
            }

            .error-title {
                font-size: 20px;
            }

            .action-buttons {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">{{ $code ?? 500 }}</div>

        <h1 class="error-title">
            @if($code == 401)
                Unauthorized Access
            @elseif($code == 403)
                Forbidden
            @elseif($code == 404)
                Not Found
            @elseif($code == 422)
                Validation Error
            @elseif($code == 500)
                Server Error
            @else
                Error Occurred
            @endif
        </h1>

        <p class="error-message">
            {{ $message ?? 'Terjadi kesalahan saat memuat data dari Payment Gateway API.' }}
        </p>

        @if(config('app.debug') && isset($details))
        <div class="error-details">
            <div class="error-details-title">Error Details (Debug Mode):</div>
            <div class="error-details-content">{{ $details }}</div>
        </div>
        @endif

        <div class="action-buttons">
            <a href="javascript:history.back()" class="btn btn-secondary">
                ← Go Back
            </a>
            <a href="{{ url('/') }}" class="btn btn-primary">
                Go to Home
            </a>
        </div>

        <div class="timestamp">
            {{ now()->format('Y-m-d H:i:s') }}
        </div>
    </div>
</body>
</html>
