import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const response = await resetPassword({
      email,
      token,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    });

    setIsLoading(false);

    if (response.success) {
      setMessage("Password berhasil direset. Silakan login kembali.");
      setTimeout(() => navigate("/signin"), 1500);
    } else {
      setError(response.message || "Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
            <Lock className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Silakan masukkan password baru Anda.
          </p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Notifikasi Sukses */}
        {message && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              {message}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Masukkan password baru"
            />
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              required
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ulangi password baru"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? "Memproses..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
