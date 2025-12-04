<script setup>
import { ref, onMounted, computed } from "vue";
import goalServices from "../services/goalServices";
import planAssignmentServices from "../services/planAssignmentServices";
import exercise_statusServices from "../services/exercise_statusServices.js";
import userServices from "../services/userServices";
import store from "../store/store.js";
import RoleModal from "../components/RoleModal.vue";
import teamServices from "../services/teamServices";

const goals = ref([]);
const todayExercises = ref([]);   // Today’s exercises for toggle
const allExercises = ref([]);     // All exercises for overall progress
const picture = ref("../public/oc-logo-white.png");
const name = ref("");
const user = computed(() => store.getters.getLoginUserInfo);
const currentUser = ref(null);
const isModalVisible = ref(false);
const noTeam = ref(false);
const teamName = ref("");

// Overall progress computed from all exercises
const overallProgress = computed(() => {
  if (!allExercises.value.length) return 0;
  const completed = allExercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / allExercises.value.length) * 100);
});

onMounted(async () => {
  await getCurrentUser();
  if (currentUser.value) {
    picture.value = user.value.picture;
    name.value = `${user.value.fName}'s Progress`;
  }
  await loadProfileData();
   let menu = document.getElementById("menu")
    menu.style.top = "-20vh"
});

async function getCurrentUser() {
  if (!user.value || !user.value.userId) return;
  const response = await userServices.get(user.value.userId);
  currentUser.value = response.data;
}

async function loadProfileData() {
  if (!currentUser.value) return;

  const athlete = currentUser.value;

  if (!athlete.team_id) {
    noTeam.value = true;
    goals.value = [];
    todayExercises.value = [];
    allExercises.value = [];
    return;
  }
  noTeam.value = false;

  const teamId = athlete.team_id;

  try {
    const teamRes = await teamServices.get(teamId);
    teamName.value = teamRes.data.name;
  } catch (err) {
    console.error("Failed to load team name:", err);
    teamName.value = "Unknown Team";
  }

  // Load **only user goals**
  await loadUserGoals(athlete.id);

  await loadAllExercises(teamId);
  await loadTodayExercises(teamId);
}

async function loadUserGoals(userId) {
  try {
    const res = await goalServices.getAll();
    // Only keep goals where user_id matches the current user
    goals.value = res.data.filter(goal => goal.user_id === userId);
  } catch (err) {
    console.error("loadUserGoals error:", err);
    goals.value = [];
  }
}

async function loadTeamGoals(teamId) {
  try {
    const response = await goalServices.get(teamId);
    goals.value = response.data;
  } catch (err) {
    console.error("loadTeamGoals error:", err);
  }
}

async function loadAllExercises(teamId) {
  try {
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
        currentUser.value.id
      );
      all.push(...exRes.data);
    }
    allExercises.value = all;
  } catch (err) {
    console.error("loadAllExercises error:", err);
  }
}

async function loadTodayExercises(teamId) {
  try {
    const paRes = await planAssignmentServices.getByTeam(teamId);
    const assignments = paRes.data;
    if (!assignments.length) {
      todayExercises.value = [];
      return;
    }

    let allDays = [];
    for (const a of assignments) {
      const exRes = await exercise_statusServices.getForPlanAndUser(
        a.exercise_plan_id,
        currentUser.value.id
      );
      allDays.push(...exRes.data);
    }

    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    todayExercises.value = allDays.filter(d => d.day === today);
  } catch (err) {
    console.error("loadTodayExercises error:", err);
  }
}

async function toggleStatus(item) {
  try {
    const newStatus = item.status === "complete" ? "not started" : "complete";

    await exercise_statusServices.update(item.id, {
      status: newStatus,
      status_id: newStatus === "complete" ? 2 : 1
    });


    item.status = newStatus;
    item.status_id = newStatus === "complete" ? 2 : 1;

    const idx = allExercises.value.findIndex(e => e.id === item.id);
    if (idx !== -1) {
      allExercises.value[idx].status = newStatus;
      allExercises.value[idx].status_id = item.status_id;
    }
  } catch (err) {
    console.error("Error updating exercise status:", err);
  }
}

function openModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}
</script>

<template>
  <v-container>
    <RoleModal v-if="isModalVisible" :user="user" @close="closeModal" />

    <div class="flex-row-profile">
      <div class="flex-column-right">
        <div class="left-header" v-if="teamName">
          <p>Your Team: {{ teamName }}</p>
        </div>

        <img class="image_pfp" :src="picture" />
        <div class="pfp-header">
          <v-btn @click="openModal" color="secondary">
            Change Role
          </v-btn>
          <p class="pfp-table-header">{{ name }}</p>
        </div>

        <v-progress-circular
          :model-value="overallProgress"
          :rotate="90"
          :size="140"
          :width="20"
        >
          <span class="profile-words">{{ overallProgress }}%</span>
        </v-progress-circular>
      </div>

      <div class="flex-column-pfp">
        <div class="pfp-header">
          <p class="pfp-table-header">Goals</p>
        </div>
        <table class="pfp_table">
          <tbody>
            <tr v-for="item in goals" :key="item.goal_id">
              <td>{{ item.name }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex-column-pfp">
        <div class="pfp-header">
          <p class="pfp-table-header">Today's Workouts</p>
        </div>
        <table class="pfp_table">
          <tbody>
            <tr v-for="item in todayExercises" :key="item.id">
              <td>{{ item.exercise.name }}</td>
              <td>
                <button class="status-btn" @click="toggleStatus(item)">
                  {{ item.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </v-container>

  <div v-if="noTeam" class="no-team-box">
    <p>You are not currently assigned to a team.</p>
    <p>No workouts or goals can be shown.</p>
  </div>
</template>
