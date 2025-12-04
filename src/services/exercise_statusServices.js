
import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/exercises");
  },
  getAllForUser(userId) {
    //currently errors and will need to be modified to fit the schema
    //return apiClient.get("/tutorials/userTut/" + userId);
    return {};
  },
  get(id) {
    return apiClient.get(`/exercise_status/${id}`);
  },
  getForPlanAndUser(planId, userId) {
  return apiClient.get(`/exercise_status/plan/${planId}/user/${userId}`);
},
  create(data) {
    return apiClient.post("/exercise_status", data);
  },
  update(id, data) {
    return apiClient.put(`/exercise_status/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/exercise_status/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/exercise_status`);
  },
  
};
