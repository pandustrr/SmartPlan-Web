import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = ({ isDarkMode, toggleDarkMode }) => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setMessage(
        "Email reset password telah dikirim. Periksa kotak masuk Anda."
      );
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
        {/* Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Kembali
          </Link>
        </div>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
            <Mail className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Lupa Password?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Masukkan email Anda untuk menerima tautan reset password.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Masukkan email Anda"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? "Mengirim..." : "Kirim Tautan Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
