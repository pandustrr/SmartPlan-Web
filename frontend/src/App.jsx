import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import VerificationNotice from "./pages/VerificationNotice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
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
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <LandingPage
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          />

          {/* Verification Notice Route */}
          <Route
            path="/verification-notice"
            element={
              <PublicRoute>
                <VerificationNotice
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          />

          {/* Forgot Password */}
          {/* <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          /> */}

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          />

          {/* Forgot Password */}
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </PublicRoute>
            }
          /> */}

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
