import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";

import TutorialsList from "./views/TutorialsList.vue";
import EditTutorial from "./views/EditTutorial.vue";
import AddTutorial from "./views/AddTutorial.vue";
import ViewTutorial from "./views/ViewTutorial.vue";
import AddLesson from "./views/AddLesson.vue";
import EditLesson from "./views/EditLesson.vue";
import Home from "./views/Home.vue";
import ExercisePlan from "./views/ExercisePlan.vue";
import Goals from "./views/Goals.vue";
import Profile from "./views/Profile.vue";
import Athletes from "./views/Athletes.vue";
import AthletePlan from "./views/AthletePlan.vue";
import AddPlan from "./views/AddPlan.vue";

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
      path: "/tutorials",
      name: "tutorials",
      component: TutorialsList,
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: EditTutorial,
      props: true,
    },
    {
      path: "/add",
      name: "add",
      component: AddTutorial,
    },
    {
      path: "/view/:id",
      name: "view",
      component: ViewTutorial,
      props: true,
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
  ],
});

export default router;
