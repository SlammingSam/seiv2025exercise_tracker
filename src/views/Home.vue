<script setup>
import { ref, onMounted, computed } from "vue";
import BurgerIcon from "../components/BurgerIcon.vue";
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices.js";
import planAssignmentServices from "../services/planAssignmentServices.js";
import exercise_statusServices from "../services/exercise_statusServices.js";
import exercise_dayServices from "../services/exercise_dayServices.js";
import userServices from "../services/userServices.js";
import store from "../store/store.js";

//I'll be using this one for overall progress, sort of like progress on the goal. 
const allExercises = ref([]);

const exercises = ref([]);
const name = ref("");
const currentUser = ref(null)
const userSession = computed(() => store.getters.getLoginUserInfo);
const overallProgress = computed(() => {
  if (!allExercises.value.length) return 0;

  const completed = allExercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / allExercises.value.length) * 100);
});

onMounted(async () => {
  await getCurrentUser()

  if (currentUser.value) {
    name.value = currentUser.value.fName
  }


  await loadExercisesForToday();
  await loadAllExercises();
   let menu = document.getElementById("menu")
    menu.style.top = "-20vh"
});

async function toggleStatus(item) {
  try {
    const newStatus = item.status === "complete" ? "not started" : "complete";

    await exercise_statusServices.update(item.id, {
      status: newStatus,
      status_id: newStatus === "complete" ? 2 : 1
    });

    item.status = newStatus;
    item.status_id = newStatus === "complete" ? 2 : 1;
    const match = allExercises.value.find(e => e.id === item.id);
    if (match) {
      match.status = newStatus;
      match.status_id = newStatus === "complete" ? 2 : 1;
    }

  } catch (err) {
    console.error("Error updating exercise status:", err);
  }
}


async function getCurrentUser(){
    console.log('userSession.value:', userSession.value);
    if (!userSession.value || !userSession.value.userId) {
      console.log('No user session or userId');
      return;
    }
    const response = await userServices.get(userSession.value.userId);
    currentUser.value = response.data;
}

async function loadAllExercises() {
  try {
    const athlete = currentUser.value;

    if (!athlete.team_id) {
      allExercises.value = [];
      return;
    }

    const teamId = athlete.team_id;

    const paRes = await planAssignmentServices.getByTeam(teamId);
    const assignments = paRes.data;

    if (!assignments.length) {
      allExercises.value = [];
      return;
    }

    let all = [];

    for (const a of assignments) {
      const exRes = await exercise_statusServices.getForPlanAndUser(
        a.exercise_plan_id,
        athlete.id
      );

      all.push(...exRes.data);
    }

    allExercises.value = all;

  } catch (err) {
    console.error("Error loading all exercises:", err);
  }
}


async function loadExercisesForToday() {
  try {
    const athlete = currentUser.value;

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
      const exRes = await exercise_statusServices.getForPlanAndUser(
        a.exercise_plan_id,
        athlete.id
      );

      allDays.push(...exRes.data);
    }

    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    exercises.value = allDays.filter(d => d.day === today);

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
           <td>
            <!-- Now you can finally that status, since its individual to users now. -->
            <button class="status-btn" @click="toggleStatus(item)">
              {{ item.status }}
            </button>
          </td>

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
      <v-progress-circular
  :model-value="overallProgress"
  :rotate="90"
  :size="320"
  :width="20"
  class="home-pro"
>
  <span class="progress-words">overall-{{ overallProgress }}%</span>
</v-progress-circular>

    </div>
  </v-container>
</template>
