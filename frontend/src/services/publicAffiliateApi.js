import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Public Affiliate Routes (NO AUTH REQUIRED)
export const publicAffiliateApi = {
  // Get affiliate landing page data (public - no auth)
  getLandingPage: async (slug) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/public/landing/${slug}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit lead from landing page (public - no auth)
  submitLead: async (slug, leadData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/affiliate/public/leads/${slug}/submit`,
        leadData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Track affiliate click (public - no auth)
  trackClick: async (slug) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/affiliate/public/track/${slug}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
