import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  ArrowLeft,
  Mail,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const VerificationNotice = ({ isDarkMode, toggleDarkMode }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail, isAuthenticated } = useAuth();

  const email = location.state?.email;

  useEffect(() => {
    // Redirect to dashboard if already authenticated and verified
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    // Redirect to login if no email provided
    if (!email) {
      navigate("/login");
    }
  }, [isAuthenticated, email, navigate]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendStatus("");

    const result = await resendVerificationEmail(email);

    if (result.success) {
      setResendStatus("success");
    } else {
      setResendStatus("error");
    }

    setIsResending(false);

    // Clear status after 5 seconds
    setTimeout(() => {
      setResendStatus("");
    }, 5000);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
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
                <span className="text-green-600 dark:text-green-400">Plan</span>
                Web
              </h1>
            </Link>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Business Management
            </p>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 shadow-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Mail className="text-green-600 dark:text-green-400" size={28} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Verifikasi Email Anda
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Kami telah mengirim link verifikasi ke:
            </p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
              {email}
            </p>
          </div>

          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Langkah-langkah verifikasi:
              </h3>
              <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  Buka inbox email Anda
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  Cari email dari PlanWeb dengan subjek "Verifikasi Email"
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  Klik link verifikasi dalam email
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  Kembali ke halaman login untuk masuk ke akun
                </li>
              </ol>
            </div>

            {/* Resend Email Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tidak menerima email?
              </p>

              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2" size={16} />
                    Kirim Ulang Email Verifikasi
                  </>
                )}
              </button>

              {/* Resend Status */}
              {resendStatus === "success" && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                    <CheckCircle className="mr-2" size={16} />
                    Email verifikasi telah dikirim ulang!
                  </p>
                </div>
              )}

              {resendStatus === "error" && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Gagal mengirim ulang email. Coba lagi nanti.
                  </p>
                </div>
              )}
            </div>

            {/* Check Spam Note */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pastikan untuk memeriksa folder spam atau junk mail jika Anda
                tidak menemukan email verifikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 PlanWeb. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationNotice;
