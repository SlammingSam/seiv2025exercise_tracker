import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exercise_plans");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/exercise_plans/${id}`);
  },
  create(data) {
    return apiClient.post("/exercise_plans", data);
  },
  update(id, data) {
    return apiClient.put(`/exercise_plans/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/exercise_plans/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/exercise_plans`);
  },
};
