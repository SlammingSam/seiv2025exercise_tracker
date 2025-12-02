import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exercises");
  },
  getAllForUser(userId) {
    return {};
  },
  get(id) {
    return apiClient.get(`/exercise_days/exercise_plans/${id}`);
  },
  create(data) {
    return apiClient.post("/exercise_days", data);
  },
  update(id, data) {
    return apiClient.put(`/exercise_days/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/exercise_days/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/exercise_days`);
  },
  reset(exercisePlanId) {
    return apiClient.delete(`/exercise_days/reset/${exercisePlanId}`);
  },
};
