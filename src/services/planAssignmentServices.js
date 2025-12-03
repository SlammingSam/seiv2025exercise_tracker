import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/plan_assignments");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  getByTeam(teamId) {
  return apiClient.get(`/plan_assignments/team/${teamId}`);
},

  get(id) {
    return apiClient.get(`/plan_assignments/${id}`);
  },
  create(data) {
    return apiClient.post("/plan_assignments", data);
  },
  update(id, data) {
    return apiClient.put(`/plan_assignments/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/plan_assignments/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/plan_assignments`);
  },
};
