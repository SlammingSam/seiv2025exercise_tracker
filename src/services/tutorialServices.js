import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/tutorials");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/tutorials/${id}`);
  },
  create(data) {
    return apiClient.post("/tutorials", data);
  },
  update(id, data) {
    return apiClient.put(`/tutorials/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/tutorials/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/tutorials`);
  },
  findByTitle(title) {
    return apiClient.get(`/tutorials?title=${title}`);
  },
};
