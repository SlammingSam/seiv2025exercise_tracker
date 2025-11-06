import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/goals");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/goals/${id}`);
  },
  create(data) {
    return apiClient.post("/goals", data);
  },
  update(id, data) {
    return apiClient.put(`/goals/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/goals/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/goals`);
  },
};
