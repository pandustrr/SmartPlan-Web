# 🎨 Singapay Frontend Implementation - React/Vue Template

**Untuk**: SmartPlan-Web Project  
**Tanggal**: December 3, 2025  
**Framework**: React (dengan contoh Vue alternative)

---

## 📋 Daftar Isi
1. [React Components](#react-components)
2. [Payment UI Components](#payment-ui-components)
3. [Services & API Integration](#services--api-integration)
4. [State Management](#state-management)
5. [Example Pages](#example-pages)
6. [Styling Guide](#styling-guide)

---

## React Components

### 1. Virtual Account Payment Component

**Lokasi**: `src/components/Payment/VAPaymentForm.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { singapayService } from '../../services/singapayService';
import './VAPaymentForm.css';

export const VAPaymentForm = ({ orderId, customerId, amount }) => {
  const [va, setVA] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId && amount) {
      generateVA();
    }
  }, [orderId, amount]);

  // ============================================
  // [CUSTOMIZATION] Generate VA untuk order
  // ============================================
  const generateVA = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await singapayService.createVAForOrder({
        order_id: orderId,
        customer_id: customerId,
        amount: amount
      });

      setVA(response.data);
    } catch (err) {
      setError(err.message || 'Gagal membuat Virtual Account');
      console.error('VA generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // [CUSTOMIZATION] Handle copy VA number
  // ============================================
  const handleCopyVA = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="va-payment-loading">
        <div className="spinner"></div>
        <p>Membuat Virtual Account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="va-payment-error">
        <div className="error-icon">❌</div>
        <p>{error}</p>
        <button onClick={generateVA} className="retry-btn">
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!va) {
    return <div className="va-payment-empty">Memproses...</div>;
  }

  return (
    <div className="va-payment-container">
      <div className="va-header">
        <h2>Transfer Bank Virtual Account</h2>
        <p className="va-subtitle">Silakan transfer ke nomor Virtual Account di bawah</p>
      </div>

      <div className="va-details">
        {/* Bank Name */}
        <div className="va-item">
          <label>Bank</label>
          <div className="va-value">
            <span className="bank-icon">🏦</span>
            <span className="bank-name">{va.bank_name}</span>
          </div>
        </div>

        {/* VA Number - Main Focus */}
        <div className="va-item va-number-section">
          <label>Nomor Virtual Account</label>
          <div className="va-number-wrapper">
            <div className="va-number-display">{va.va_number}</div>
            <CopyToClipboard text={va.va_number} onCopy={handleCopyVA}>
              <button className="copy-btn" title="Copy VA Number">
                {copied ? '✓ Tersalin' : '📋 Salin'}
              </button>
            </CopyToClipboard>
          </div>
        </div>

        {/* Account Name */}
        <div className="va-item">
          <label>Atas Nama</label>
          <div className="va-value">{va.account_name}</div>
        </div>

        {/* Amount */}
        <div className="va-item">
          <label>Jumlah Transfer</label>
          <div className="va-value amount">
            Rp {new Intl.NumberFormat('id-ID').format(va.amount)}
          </div>
          <small className="amount-note">
            Jumlah harus tepat sesuai nominal di atas
          </small>
        </div>
      </div>

      {/* Instructions */}
      <div className="va-instructions">
        <h3>📝 Cara Melakukan Transfer</h3>
        <ol>
          <li>Buka aplikasi perbankan Anda</li>
          <li>Pilih menu "Transfer Antar Bank"</li>
          <li>Masukkan nomor Virtual Account di atas</li>
          <li>Masukkan nominal sesuai jumlah pembayaran</li>
          <li>Verifikasi data dan konfirmasi transfer</li>
          <li>Pembayaran akan dikonfirmasi otomatis dalam beberapa menit</li>
        </ol>
      </div>

      {/* Payment Status */}
      <div className="va-status">
        <div className="status-icon waiting">⏳</div>
        <div className="status-text">
          <strong>Status: Menunggu Pembayaran</strong>
          <p>Kami akan mengkonfirmasi pembayaran Anda secara otomatis</p>
        </div>
      </div>

      {/* Alternative Payment Methods */}
      <div className="alternative-methods">
        <p>Atau gunakan metode pembayaran lain:</p>
        <div className="method-buttons">
          <button className="method-btn qris-method">QRIS (QR Code)</button>
          <button className="method-btn link-method">Payment Link</button>
        </div>
      </div>
    </div>
  );
};

export default VAPaymentForm;
```

---

### 2. QRIS Payment Component

**Lokasi**: `src/components/Payment/QRISPaymentForm.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { singapayService } from '../../services/singapayService';
import './QRISPaymentForm.css';

export const QRISPaymentForm = ({ orderId, customerId, amount }) => {
  const [qris, setQRIS] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId && amount) {
      generateQRIS();
    }
  }, [orderId, amount]);

  // ============================================
  // [CUSTOMIZATION] Generate QRIS Code
  // ============================================
  const generateQRIS = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await singapayService.generateQRIS({
        order_id: orderId,
        customer_id: customerId,
        amount: amount
      });

      setQRIS(response.data);
    } catch (err) {
      setError(err.message || 'Gagal membuat QRIS');
      console.error('QRIS generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQRData = () => {
    navigator.clipboard.writeText(qris.qr_data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="qris-payment-loading">
        <div className="spinner"></div>
        <p>Membuat QRIS Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qris-payment-error">
        <div className="error-icon">❌</div>
        <p>{error}</p>
        <button onClick={generateQRIS} className="retry-btn">
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!qris) {
    return <div className="qris-payment-empty">Memproses...</div>;
  }

  return (
    <div className="qris-payment-container">
      <div className="qris-header">
        <h2>Pembayaran QRIS</h2>
        <p className="qris-subtitle">Scan QR Code dengan aplikasi perbankan Anda</p>
      </div>

      {/* QR Code Display */}
      <div className="qris-code-section">
        <div className="qr-wrapper">
          <QRCode
            value={qris.qr_data}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="qr-reference">ID: {qris.reference}</p>
      </div>

      {/* Payment Details */}
      <div className="qris-details">
        <div className="detail-item">
          <label>Jumlah Pembayaran</label>
          <div className="detail-value">
            Rp {new Intl.NumberFormat('id-ID').format(qris.amount)}
          </div>
        </div>

        {qris.tip > 0 && (
          <div className="detail-item">
            <label>Tip (Opsional)</label>
            <div className="detail-value">
              Rp {new Intl.NumberFormat('id-ID').format(qris.tip)}
            </div>
          </div>
        )}

        <div className="detail-item">
          <label>Total</label>
          <div className="detail-value total">
            Rp {new Intl.NumberFormat('id-ID').format(qris.amount + (qris.tip || 0))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="qris-instructions">
        <h3>📱 Cara Membayar dengan QRIS</h3>
        <ol>
          <li>Buka aplikasi mobile banking atau e-wallet Anda</li>
          <li>Pilih menu "Scan QRIS" atau "Pembayaran"</li>
          <li>Arahkan kamera ke QR Code di atas</li>
          <li>Verifikasi nominal pembayaran</li>
          <li>Konfirmasi dan selesaikan pembayaran</li>
          <li>Pembayaran akan dikonfirmasi otomatis</li>
        </ol>
      </div>

      {/* Payment Status */}
      <div className="qris-status">
        <div className="status-icon waiting">⏳</div>
        <div className="status-text">
          <strong>Status: Menunggu Pembayaran</strong>
          <p>Halaman ini akan otomatis ter-update ketika pembayaran berhasil</p>
        </div>
      </div>

      {/* Download QR Code */}
      <div className="qris-actions">
        <button
          className="download-qr-btn"
          onClick={() => {
            const qrElement = document.querySelector('canvas');
            const link = document.createElement('a');
            link.href = qrElement.toDataURL('image/png');
            link.download = `qris-${qris.reference}.png`;
            link.click();
          }}
        >
          📥 Download QR Code
        </button>

        <button
          className="copy-qr-btn"
          onClick={handleCopyQRData}
        >
          {copied ? '✓ Tersalin' : '📋 Salin QRIS Data'}
        </button>
      </div>
    </div>
  );
};

export default QRISPaymentForm;
```

---

### 3. Payment Link Component

**Lokasi**: `src/components/Payment/PaymentLinkForm.jsx`

```jsx
import React, { useState } from 'react';
import { singapayService } from '../../services/singapayService';
import './PaymentLinkForm.css';

export const PaymentLinkForm = ({ orderId, customerId, amount }) => {
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // ============================================
  // [CUSTOMIZATION] Generate Payment Link
  // ============================================
  const generatePaymentLink = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await singapayService.createPaymentLink({
        order_id: orderId,
        customer_id: customerId,
        amount: amount
      });

      setPaymentLink(response.data);
    } catch (err) {
      setError(err.message || 'Gagal membuat Payment Link');
      console.error('Payment link error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink.payment_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(paymentLink.payment_link, '_blank');
  };

  return (
    <div className="payment-link-container">
      <div className="link-header">
        <h2>Payment Link</h2>
        <p className="link-subtitle">Bagikan link pembayaran kepada customer</p>
      </div>

      {!paymentLink ? (
        <button
          className="generate-link-btn"
          onClick={generatePaymentLink}
          disabled={loading}
        >
          {loading ? 'Membuat Link...' : '🔗 Buat Payment Link'}
        </button>
      ) : (
        <div className="link-details">
          <div className="link-display">
            <input
              type="text"
              value={paymentLink.payment_link}
              readOnly
              className="link-input"
            />
            <button className="copy-link-btn" onClick={handleCopyLink}>
              {copied ? '✓ Tersalin' : '📋 Salin Link'}
            </button>
          </div>

          <button className="open-link-btn" onClick={handleOpenLink}>
            🔗 Buka Payment Link
          </button>

          <div className="link-info">
            <p>Link berlaku hingga: {paymentLink.expires_at}</p>
            <p>Customer bisa membayar dengan berbagai metode pembayaran</p>
          </div>
        </div>
      )}

      {error && (
        <div className="link-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentLinkForm;
```

---

### 4. Payment Method Selector Component

**Lokasi**: `src/components/Payment/PaymentMethodSelector.jsx`

```jsx
import React, { useState } from 'react';
import VAPaymentForm from './VAPaymentForm';
import QRISPaymentForm from './QRISPaymentForm';
import PaymentLinkForm from './PaymentLinkForm';
import './PaymentMethodSelector.css';

export const PaymentMethodSelector = ({ orderId, customerId, amount }) => {
  const [selectedMethod, setSelectedMethod] = useState('va'); // va, qris, link

  // ============================================
  // [CUSTOMIZATION] Payment methods available
  // ============================================
  const paymentMethods = [
    {
      id: 'va',
      name: 'Virtual Account',
      description: 'Transfer langsung dari bank Anda',
      icon: '🏦',
      component: VAPaymentForm,
      banks: ['BRI', 'BNI', 'Danamon', 'Maybank']
    },
    {
      id: 'qris',
      name: 'QRIS',
      description: 'Scan QR Code dengan aplikasi banking',
      icon: '📱',
      component: QRISPaymentForm
    },
    {
      id: 'link',
      name: 'Payment Link',
      description: 'Buka link pembayaran',
      icon: '🔗',
      component: PaymentLinkForm
    }
  ];

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const CurrentComponent = currentMethod.component;

  return (
    <div className="payment-method-selector">
      {/* Method Tabs */}
      <div className="method-tabs">
        {paymentMethods.map(method => (
          <button
            key={method.id}
            className={`tab-btn ${selectedMethod === method.id ? 'active' : ''}`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <span className="tab-icon">{method.icon}</span>
            <span className="tab-name">{method.name}</span>
          </button>
        ))}
      </div>

      {/* Method Description */}
      <div className="method-description">
        <p>{currentMethod.description}</p>
        {currentMethod.banks && (
          <p className="banks-info">
            Bank: {currentMethod.banks.join(', ')}
          </p>
        )}
      </div>

      {/* Method Component */}
      <div className="method-content">
        <CurrentComponent
          orderId={orderId}
          customerId={customerId}
          amount={amount}
        />
      </div>

      {/* Payment Info */}
      <div className="payment-info">
        <div className="info-item">
          <strong>📍 Order ID:</strong> {orderId}
        </div>
        <div className="info-item">
          <strong>💰 Total:</strong> Rp {new Intl.NumberFormat('id-ID').format(amount)}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
```

---

## Services & API Integration

### Singapay Service

**Lokasi**: `src/services/singapayService.js`

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ============================================
// [CUSTOMIZATION] Axios instance dengan base URL
// ============================================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor untuk attach token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const singapayService = {
  /**
   * Create VA for order
   * [CUSTOMIZATION] Adjust endpoint sesuai backend routing
   */
  createVAForOrder: async (data) => {
    try {
      const response = await apiClient.post('/singapay/create-va', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Generate Payment Link
   */
  createPaymentLink: async (data) => {
    try {
      const response = await apiClient.post('/singapay/create-payment-link', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Generate QRIS Code
   */
  generateQRIS: async (data) => {
    try {
      const response = await apiClient.post('/singapay/generate-qris', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get balance
   */
  getBalance: async () => {
    try {
      const response = await apiClient.get('/singapay/balance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get transaction history
   */
  getTransactions: async (params = {}) => {
    try {
      const response = await apiClient.get('/singapay/transactions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (orderId) => {
    try {
      const response = await apiClient.get(`/singapay/payment-status/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default singapayService;
```

---

## State Management

### Redux Store (Optional)

**Lokasi**: `src/store/slices/paymentSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import singapayService from '../../services/singapayService';

// ============================================
// [CUSTOMIZATION] Async Thunks untuk API calls
// ============================================
export const createVAForOrder = createAsyncThunk(
  'payment/createVA',
  async (data, { rejectWithValue }) => {
    try {
      const response = await singapayService.createVAForOrder(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPaymentLink = createAsyncThunk(
  'payment/createLink',
  async (data, { rejectWithValue }) => {
    try {
      const response = await singapayService.createPaymentLink(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateQRIS = createAsyncThunk(
  'payment/generateQRIS',
  async (data, { rejectWithValue }) => {
    try {
      const response = await singapayService.generateQRIS(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// Payment Slice
// ============================================
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    va: null,
    qris: null,
    link: null,
    loading: false,
    error: null,
    paymentStatus: null
  },
  extraReducers: (builder) => {
    // Create VA
    builder
      .addCase(createVAForOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVAForOrder.fulfilled, (state, action) => {
        state.va = action.payload;
        state.loading = false;
      })
      .addCase(createVAForOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // Create Payment Link
    builder
      .addCase(createPaymentLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentLink.fulfilled, (state, action) => {
        state.link = action.payload;
        state.loading = false;
      })
      .addCase(createPaymentLink.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // Generate QRIS
    builder
      .addCase(generateQRIS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQRIS.fulfilled, (state, action) => {
        state.qris = action.payload;
        state.loading = false;
      })
      .addCase(generateQRIS.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default paymentSlice.reducer;
```

---

## Example Pages

### Order Payment Page

**Lokasi**: `src/pages/OrderPayment.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentMethodSelector from '../components/Payment/PaymentMethodSelector';
import { singapayService } from '../services/singapayService';
import './OrderPayment.css';

export const OrderPaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  // ============================================
  // [CUSTOMIZATION] Load order data dari backend
  // ============================================
  const loadOrderData = async () => {
    try {
      setLoading(true);
      // [CUSTOMIZATION] Sesuaikan endpoint dengan backend
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      setOrder(data.data);
    } catch (err) {
      setError('Gagal memuat data order');
      console.error('Load order error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-payment-loading">Memuat...</div>;
  }

  if (error) {
    return <div className="order-payment-error">{error}</div>;
  }

  if (!order) {
    return <div className="order-payment-empty">Order tidak ditemukan</div>;
  }

  return (
    <div className="order-payment-page">
      {/* Header */}
      <div className="page-header">
        <h1>Pembayaran Order</h1>
        <p>Silakan pilih metode pembayaran untuk menyelesaikan transaksi Anda</p>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-card">
          <div className="summary-header">
            <h2>Ringkasan Order</h2>
          </div>

          <div className="summary-items">
            {/* Order ID */}
            <div className="summary-item">
              <span className="item-label">Order ID</span>
              <span className="item-value">{order.id}</span>
            </div>

            {/* Order Date */}
            <div className="summary-item">
              <span className="item-label">Tanggal</span>
              <span className="item-value">
                {new Date(order.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            {/* Customer Name */}
            <div className="summary-item">
              <span className="item-label">Customer</span>
              <span className="item-value">{order.customer_name}</span>
            </div>

            {/* Order Items */}
            <div className="summary-item">
              <span className="item-label">Layanan</span>
              <span className="item-value">{order.service_name}</span>
            </div>

            {/* Divider */}
            <hr className="summary-divider" />

            {/* Total Amount */}
            <div className="summary-item total">
              <span className="item-label">Total Pembayaran</span>
              <span className="item-value">
                Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="payment-section">
        <PaymentMethodSelector
          orderId={order.id}
          customerId={order.customer_id}
          amount={order.total_price}
        />
      </div>

      {/* Payment Status */}
      {order.payment_status === 'paid' && (
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h3>Pembayaran Berhasil!</h3>
          <p>Terima kasih atas pembayaran Anda. Order sedang diproses.</p>
        </div>
      )}

      {/* FAQ */}
      <div className="payment-faq">
        <h3>❓ Pertanyaan Umum</h3>
        <div className="faq-items">
          <details>
            <summary>Berapa lama pembayaran dikonfirmasi?</summary>
            <p>
              Pembayaran Virtual Account biasanya dikonfirmasi dalam waktu 1-5 menit.
              QRIS dikonfirmasi secara instant.
            </p>
          </details>

          <details>
            <summary>Apakah ada biaya tambahan?</summary>
            <p>
              Tidak ada biaya tambahan. Harga yang tertera adalah harga final.
            </p>
          </details>

          <details>
            <summary>Apa yang harus dilakukan jika pembayaran gagal?</summary>
            <p>
              Silakan hubungi customer service kami atau coba lagi dengan metode pembayaran lain.
            </p>
          </details>
        </div>
      </div>

      {/* Support */}
      <div className="payment-support">
        <p>Butuh bantuan? Hubungi kami di support@smartplan.com</p>
      </div>
    </div>
  );
};

export default OrderPaymentPage;
```

---

## Styling Guide

### Main Stylesheet

**Lokasi**: `src/components/Payment/PaymentMethodSelector.css`

```css
/* ============================================
   [CUSTOMIZATION] Sesuaikan warna dengan brand Anda
   ============================================ */

:root {
  --primary-color: #6366f1;      /* Brand primary color */
  --success-color: #10b981;      /* Success state */
  --error-color: #ef4444;        /* Error state */
  --warning-color: #f59e0b;      /* Warning state */
  --neutral-color: #64748b;      /* Neutral text */
  --border-color: #e2e8f0;       /* Borders */
  --bg-color: #f8fafc;           /* Background */
}

/* ============================================
   Payment Method Selector
   ============================================ */
.payment-method-selector {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Tabs */
.method-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-color);
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-icon {
  font-size: 24px;
}

.tab-name {
  font-size: 12px;
}

/* Description */
.method-description {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.method-description p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--neutral-color);
}

.banks-info {
  font-size: 12px !important;
  color: #71717a;
}

/* Content */
.method-content {
  margin-bottom: 24px;
}

/* ============================================
   VA Payment Form
   ============================================ */
.va-payment-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.va-header {
  text-align: center;
  margin-bottom: 16px;
}

.va-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.va-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--neutral-color);
}

.va-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.va-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.va-item label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.5px;
}

.va-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.va-value.amount {
  font-size: 24px;
  color: var(--success-color);
}

.amount-note {
  font-size: 12px;
  color: #94a3b8;
  margin-top: -4px;
}

/* VA Number Section */
.va-number-section {
  padding: 16px;
  background: white;
  border: 2px dashed var(--primary-color);
  border-radius: 8px;
}

.va-number-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.va-number-display {
  flex: 1;
  padding: 12px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--primary-color);
  background: var(--bg-color);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.copy-btn {
  padding: 10px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Instructions */
.va-instructions {
  padding: 16px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
}

.va-instructions h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #92400e;
}

.va-instructions ol {
  margin: 0;
  padding-left: 20px;
}

.va-instructions li {
  margin: 6px 0;
  font-size: 13px;
  color: #92400e;
  line-height: 1.5;
}

/* Status */
.va-status {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.status-icon {
  font-size: 32px;
  animation: pulse 2s infinite;
}

.status-icon.waiting {
  animation: spin 2s linear infinite;
}

.status-text strong {
  display: block;
  margin-bottom: 4px;
  color: #1e293b;
}

.status-text p {
  margin: 0;
  font-size: 13px;
  color: var(--neutral-color);
}

/* ============================================
   QRIS Payment Form
   ============================================ */
.qris-payment-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.qris-header {
  text-align: center;
}

.qris-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.qris-code-section {
  padding: 24px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  text-align: center;
}

.qr-wrapper {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  display: inline-block;
}

.qr-reference {
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .payment-method-selector {
    padding: 16px;
  }

  .tab-btn {
    min-width: 100px;
    font-size: 12px;
  }

  .va-number-display {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .method-tabs {
    gap: 8px;
  }
}

/* Loading Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
```

---

## Environment Variables

**Lokasi**: `.env`

```bash
# ============================================
# [CUSTOMIZATION] Frontend Configuration
# ============================================

# API Base URL
REACT_APP_API_URL=http://localhost:8000/api
# REACT_APP_API_URL=https://api.smartplan.com/api (untuk production)

# Singapay Configuration
REACT_APP_SINGAPAY_ENV=sandbox
# REACT_APP_SINGAPAY_ENV=production (untuk production)

# Features
REACT_APP_ENABLE_VA=true
REACT_APP_ENABLE_QRIS=true
REACT_APP_ENABLE_PAYMENT_LINK=true

# Analytics (Optional)
REACT_APP_ANALYTICS_ID=your_analytics_id
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install axios qrcode.react react-copy-to-clipboard
```

### 2. Update Routes

**Lokasi**: `src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderPaymentPage from './pages/OrderPayment';

function App() {
  return (
    <Router>
      <Routes>
        {/* [CUSTOMIZATION] Payment page route */}
        <Route path="/order/:orderId/payment" element={<OrderPaymentPage />} />
        
        {/* Add other routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Vue Alternative

Jika menggunakan Vue.js, struktur serupa dengan:

**Lokasi**: `src/components/Payment/VAPaymentForm.vue`

```vue
<template>
  <div class="va-payment-container">
    <div class="va-header">
      <h2>Transfer Bank Virtual Account</h2>
      <p class="va-subtitle">Silakan transfer ke nomor Virtual Account di bawah</p>
    </div>

    <div v-if="loading" class="va-payment-loading">
      <div class="spinner"></div>
      <p>Membuat Virtual Account...</p>
    </div>

    <div v-else-if="error" class="va-payment-error">
      <p>{{ error }}</p>
      <button @click="generateVA" class="retry-btn">Coba Lagi</button>
    </div>

    <div v-else-if="va" class="va-details">
      <!-- VA Details -->
      <div class="va-item">
        <label>Bank</label>
        <div class="va-value">
          <span class="bank-name">{{ va.bank_name }}</span>
        </div>
      </div>

      <div class="va-item va-number-section">
        <label>Nomor Virtual Account</label>
        <div class="va-number-wrapper">
          <div class="va-number-display">{{ va.va_number }}</div>
          <button 
            class="copy-btn"
            @click="copyToClipboard(va.va_number)"
          >
            {{ copied ? '✓ Tersalin' : '📋 Salin' }}
          </button>
        </div>
      </div>

      <div class="va-item">
        <label>Jumlah Transfer</label>
        <div class="va-value amount">
          Rp {{ formatCurrency(va.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { singapayService } from '../../services/singapayService';

const props = defineProps(['orderId', 'customerId', 'amount']);

const va = ref(null);
const loading = ref(false);
const error = ref(null);
const copied = ref(false);

// [CUSTOMIZATION] Generate VA
const generateVA = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await singapayService.createVAForOrder({
      order_id: props.orderId,
      customer_id: props.customerId,
      amount: props.amount
    });

    va.value = response.data;
  } catch (err) {
    error.value = err.message || 'Gagal membuat Virtual Account';
  } finally {
    loading.value = false;
  }
};

// Copy to clipboard
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

onMounted(() => {
  generateVA();
});
</script>

<style scoped>
/* Styles here */
</style>
```

---

## API Integration Endpoints

**Backend Routes yang Diperlukan:**

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    // [CUSTOMIZATION] Singapay endpoints
    Route::post('/singapay/create-va', [SingapayController::class, 'createVAForOrder']);
    Route::post('/singapay/create-payment-link', [SingapayController::class, 'createPaymentLink']);
    Route::post('/singapay/generate-qris', [SingapayController::class, 'generateQRIS']);
    Route::get('/singapay/balance', [SingapayController::class, 'getBalance']);
    Route::get('/singapay/transactions', [SingapayController::class, 'getTransactions']);
    Route::get('/singapay/payment-status/{orderId}', [SingapayController::class, 'getPaymentStatus']);
});
```

---

**Last Updated**: December 3, 2025  
**Version**: 1.0  
**For**: SmartPlan-Web Frontend
