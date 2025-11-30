import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const affiliateLinkApi = {
  // Get or create affiliate link for authenticated user
  getMyLink: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliate/my-link`, getAuthHeader());
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update affiliate slug
  updateSlug: async (newSlug) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/affiliate/slug`,
        { new_slug: newSlug },
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Toggle affiliate link active status
  toggleActive: async (affiliateLinkId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/affiliate/${affiliateLinkId}/toggle-active`,
        {},
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Show affiliate link details
  show: async (affiliateLinkId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/${affiliateLinkId}`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const affiliateTrackingApi = {
  // Get affiliate statistics
  getStatistics: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/tracking/statistics`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get affiliate tracks (clicks)
  getTracks: async (params = {}) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/tracking/tracks`,
        {
          ...getAuthHeader(),
          params: {
            page: params.page || 1,
            per_page: params.per_page || 20,
            device_type: params.device_type || null,
            date_from: params.date_from || null,
            date_to: params.date_to || null,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get device breakdown
  getDeviceBreakdown: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/tracking/device-breakdown`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get monthly breakdown
  getMonthlyBreakdown: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/tracking/monthly-breakdown`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const affiliateLeadApi = {
  // Get leads for authenticated user
  getMyLeads: async (params = {}) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/leads/my-leads`,
        {
          ...getAuthHeader(),
          params: {
            page: params.page || 1,
            per_page: params.per_page || 20,
            status: params.status || null,
            date_from: params.date_from || null,
            date_to: params.date_to || null,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get lead detail
  show: async (leadId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/leads/${leadId}`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update lead status
  updateStatus: async (leadId, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/affiliate/leads/${leadId}/status`,
        { status },
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get lead statistics
  getStatistics: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/affiliate/leads/statistics`,
        getAuthHeader()
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
