import api from "../authApi";

const executiveSummaryApi = {
  getAll: () => api.get("/executive-summary"),

  getById: (id) => {
    return api.get(`/executive-summary/${id}`);
  },

  create: (executiveSummary) => {
    return api.post("/executive-summary", executiveSummary);
  },

  update: (id, executiveSummary) => {
    return api.put(`/executive-summary/${id}`, executiveSummary);
  },

  delete: (id, userId) => {
    return api.delete(`/executive-summary/${id}`, {
      data: { user_id: userId },
    });
  },
};

export default executiveSummaryApi;
