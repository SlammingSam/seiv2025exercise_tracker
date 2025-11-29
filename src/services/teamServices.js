import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/teams");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/teams/${id}`);
  },
  create(data) {
    return apiClient.post("/teams", data);
  },
  update(id, data) {
    return apiClient.put(`/teams/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/teams/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/teams`);
  },
};
