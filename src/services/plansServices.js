import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/plans");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/plans/${id}`);
  },
  create(data) {
    return apiClient.post("/plans", data);
  },
  update(id, data) {
    return apiClient.put(`/plans/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/plans/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/plans`);
  },
};
