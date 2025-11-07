import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);

      // Check if email needs verification
      if (
        response.data.success === false &&
        response.data.data?.needs_verification
      ) {
        return {
          success: false,
          needsVerification: true,
          email: response.data.data.email,
          message: response.data.message,
        };
      }

      const { user, access_token } = response.data.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      // Handle verification needs from error response
      if (error.response?.data?.data?.needs_verification) {
        return {
          success: false,
          needsVerification: true,
          email: error.response.data.data.email,
          message: error.response.data.message,
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      // For email verification, user might not be logged in immediately
      if (response.data.data?.user && response.data.data?.access_token) {
        const { user, access_token } = response.data.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        return {
          success: true,
          data: response.data,
          needsVerification: true,
          email: userData.email,
        };
      } else {
        // If no token returned, it means verification is required
        return {
          success: true,
          data: response.data,
          needsVerification: true,
          email: userData.email,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registrasi gagal",
        errors: error.response?.data?.errors,
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const response = await authAPI.resendVerification(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Gagal mengirim ulang email verifikasi",
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan",
      };
    }
  };

  const resetPassword = async (data) => {
    try {
      await authAPI.resetPassword(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan",
      };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
