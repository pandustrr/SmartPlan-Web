import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Phone, Sun, Moon } from "lucide-react";

const ForgotPassword = ({ isDarkMode, toggleDarkMode }) => {
  const { forgotPassword, verifyResetOtp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  });
  const [step, setStep] = useState(1); // 1: Input phone, 2: Input OTP
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    // Validasi format nomor telepon
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Format nomor WhatsApp tidak valid. Contoh: 081234567890');
      setIsLoading(false);
      return;
    }

    const result = await forgotPassword(formData.phone);

    if (result.success) {
      setMessage("Kode OTP telah dikirim ke WhatsApp Anda. Silakan verifikasi.");
      setStep(2);
      // Start countdown untuk resend OTP
      setCountdown(60);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (formData.otp.length !== 6) {
      setError("Masukkan 6 digit kode OTP");
      setIsLoading(false);
      return;
    }

    const result = await verifyResetOtp({
      phone: formData.phone,
      otp: formData.otp
    });

    if (result.success) {
      setMessage("OTP berhasil diverifikasi. Mengarahkan ke reset password...");
      // Redirect ke reset password dengan token
      setTimeout(() => navigate('/reset-password', {
        state: { reset_token: result.resetToken }
      }), 2000);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setMessage("");

    const result = await forgotPassword(formData.phone);

    if (result.success) {
      setMessage("Kode OTP baru telah dikirim ke WhatsApp Anda");
      setCountdown(60);
    } else {
      setError(result.message || "Gagal mengirim ulang OTP");
    }

    setIsLoading(false);
  };

  // Countdown timer
  useState(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format nomor telepon saat input
    let processedValue = value;
    if (name === 'phone') {
      processedValue = value.replace(/[^\d+]/g, '');
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
    
    // Clear error when user types
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center relative">
          {/* Back to Login - Mobile */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 sm:hidden">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
            </Link>
          </div>

          {/* Back to Login - Desktop */}
          <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Kembali ke Login
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Logo */}
          <div className="mx-auto">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                <span className="text-green-600 dark:text-green-400">Smart</span>Web
              </h1>
            </Link>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Business Management
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 shadow-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
              <Phone className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {step === 1 ? "Lupa Password" : "Verifikasi OTP"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {step === 1 
                ? "Masukkan nomor WhatsApp Anda untuk menerima kode OTP reset password."
                : `Kode OTP telah dikirim ke ${formData.phone}`
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                {message}
              </p>
            </div>
          )}

          {/* Step 1: Input Phone Number */}
          {step === 1 && (
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors"
                    placeholder="081234567890"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Contoh: 081234567890, 6281234567890, atau +6281234567890
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim OTP...
                    </>
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Input OTP */}
          {step === 2 && (
            <form className="space-y-4 sm:space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Kode OTP (6 digit)
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-3 py-3 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors text-center"
                  placeholder="123456"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length !== 6}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi OTP"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className="text-green-600 dark:text-green-400 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Kirim ulang OTP {countdown > 0 && `(${countdown}s)`}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Info */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
              <strong>Info:</strong> Kode OTP akan dikirim via WhatsApp dan berlaku selama 10 menit.
            </p>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingat password Anda?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info - Desktop */}
        <div className="hidden sm:block text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 SmartWeb. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;