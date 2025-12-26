import api from "./authApi";

export const affiliateCommissionApi = {
  // Get commission statistics
  getStatistics: () => api.get("/affiliate/commissions/statistics"),

  // Get commission history with pagination
  getHistory: (params = {}) => api.get("/affiliate/commissions/history", { params }),

  // Get withdrawable balance
  getWithdrawableBalance: () => api.get("/affiliate/commissions/withdrawable"),

  // Request withdrawal
  requestWithdrawal: (amount) => api.post("/affiliate/commissions/withdraw", { amount }),
};

export default affiliateCommissionApi;
