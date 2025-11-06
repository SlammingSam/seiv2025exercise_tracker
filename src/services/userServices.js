import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/users");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/users/${id}`);
  },
  create(data) {
    return apiClient.post("/users", data);
  },
  update(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/users/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/users`);
  },
};
