import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/register", userData),
  verifyOtp: (data) => api.post("/verify-otp", data),
  resendOtp: (phone) => api.post("/resend-otp", { phone }),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getMe: () => api.get("/me"),
  forgotPassword: (phone) => api.post("/forgot-password", { phone }),
  verifyResetOtp: (data) => api.post("/verify-reset-otp", data),
  resetPassword: (data) => api.post("/reset-password", data),
};

export default api;