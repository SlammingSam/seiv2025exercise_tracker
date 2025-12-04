<script setup>
import { ref, onMounted, computed } from "vue";
import BurgerIcon from "../components/BurgerIcon.vue";
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices.js";
import planAssignmentServices from "../services/planAssignmentServices.js";
import exercise_dayServices from "../services/exercise_dayServices.js";
import userServices from "../services/userServices.js";
import store from "../store/store.js";

const exercises = ref([]);
const name = ref("");
const currentUser = ref(null)
const userSession = computed(() => store.getters.getLoginUserInfo);
onMounted(async () => {
  await getCurrentUser()

  if (currentUser.value) {
    name.value = currentUser.value.fName
  }


  await loadExercisesForToday();
});

async function getCurrentUser(){
    console.log('userSession.value:', userSession.value);
    if (!userSession.value || !userSession.value.userId) {
      console.log('No user session or userId');
      return;
    }
    const response = await userServices.get(userSession.value.userId);
    currentUser.value = response.data;
}
async function loadExercisesForToday() {
  try {
   
    const athlete = currentUser.value

    if (!athlete.team_id) {
      exercises.value = [];
      return;
    }

    const teamId = athlete.team_id;

    const paRes = await planAssignmentServices.getByTeam(teamId);
    const assignments = paRes.data;

    if (!assignments.length) {
      exercises.value = [];
      return;
    }

    let allDays = [];

    for (const a of assignments) {
      const exRes = await exercise_dayServices.get(a.exercise_plan_id);
      allDays.push(...exRes.data);
    }

    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    exercises.value = allDays.filter(e => e.day === today);

  } catch (err) {
    console.error("Error loading today's exercises:", err);
  }
}


const currentProgress = computed(() => {
  if (!exercises.value.length) return 0;

  const completed = exercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / exercises.value.length) * 100);
});
</script>

<template>
  <role-picker />

  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>Welcome, {{ name }}!</p>
      </div>
    </v-toolbar>

    <div class="flex-row-home">
      <div class="right-header"><p>Your Progress Today</p></div> 
    </div>

    <div class="flex-row-home">
      <table class="home_table">
        <tbody>
          <tr v-for="item in exercises" :key="item.id">
            <td>{{ item.exercise.name }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>

      <v-progress-circular
        :model-value="currentProgress"
        :rotate="90"
        :size="320"
        :width="20"
        class="home-pro"
      >
        <span class="progress-words">{{ currentProgress }}%</span>
      </v-progress-circular>
    </div>
  </v-container>
</template>
