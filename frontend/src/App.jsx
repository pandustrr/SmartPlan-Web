import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OtpVerification from "./pages/OtpVerification";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import PaymentSuccess from "./pages/PaymentSuccess";

import AffiliateLinkRedirect from "./components/Affiliate/AffiliateLinkRedirect";

// 🔔 Import react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 🌐 Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// 🔄 Catch-all Redirect Component
const NavigateToCorrectRoot = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
};

// 🔐 Verification Route Component (bisa diakses baik authenticated maupun tidak)
const VerificationRoute = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return children;
};

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    console.log(`[App] Current Route Path: ${window.location.pathname}`);
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<LandingPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/features" element={<FeaturesPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/pricing" element={<PricingPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/faq" element={<FAQ isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/terms" element={<Terms isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />

          {/* � Payment Success/Callback Route */}
          <Route path="/payment/success" element={<PaymentSuccess isDarkMode={isDarkMode} />} />

          {/* �🔗 Affiliate Link Redirect (NEW - for tracking & redirect) */}
          <Route path="/affiliate/:slug" element={<AffiliateLinkRedirect />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </PublicRoute>
            }
          />

          {/* 🔔 OTP Verification Route */}
          <Route
            path="/verify-otp"
            element={
              <VerificationRoute>
                <OtpVerification isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </VerificationRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </PublicRoute>
            }
          />

          {/* 🔐 Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NavigateToCorrectRoot />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />

      {/* ✅ ToastContainer biar toast muncul */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" style={{ zIndex: 9999 }} />
    </AuthProvider>
  );
}

export default App;
