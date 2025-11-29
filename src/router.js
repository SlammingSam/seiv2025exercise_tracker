import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";

import AddTutorial from "./views/AddTutorial.vue";
import AddLesson from "./views/AddLesson.vue";
import EditLesson from "./views/EditLesson.vue";
import Home from "./views/Home.vue";
import ExercisePlan from "./views/ExercisePlan.vue";
import Goals from "./views/Goals.vue";
import Profile from "./views/Profile.vue";
import Athletes from "./views/Athletes.vue";
import AthletePlan from "./views/AthletePlan.vue";
import AddPlan from "./views/AddPlan.vue";
import AddGoal from "./views/AddGoal.vue";
import RoleSelect from "./views/RoleSelect.vue";
import Teams from "./views/Teams.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/add",
      name: "add",
      component: AddTutorial,
    },
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/exercise-plan",
      name: "ExercisePlan",
      component: ExercisePlan,
    },
    {
      path: "/goals",
      name: "Goals",
      component: Goals,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
    },
    {
      path: "/athletes",
      name: "Athletes",
      component: Athletes,
    },
    {
      path: "/athlete-plan",
      name: "AthletePlan",
      component: AthletePlan,
    },
    {
      path: "/add-plan",
      name: "AddPlan",
      component: AddPlan,
    },
    {
      path: "/add-goal",
      name: "AddGoal",
      component: AddGoal,
    },
     {
      path: "/role-select",
      name: "RoleSelect",
      component: RoleSelect,
    },
    {
      path: "/teams",
      name: "Teams",
      component: Teams,
    },
  ],
});

export default router;
