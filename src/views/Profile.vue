<script setup>
import { ref, onMounted, computed } from "vue";
import goalServices from "../services/goalServices";
import planAssignmentServices from "../services/planAssignmentServices";
import exercise_dayServices from "../services/exercise_dayServices";
import userServices from "../services/userServices";
import store from "../store/store.js";
import RoleModal from "../components/RoleModal.vue";
import teamServices from "../services/teamServices";


const goals = ref([]);
const exercises = ref([]);
const message = ref("");
const picture = ref("../public/oc-logo-white.png");
const name = ref("");
const user = computed(() => store.getters.getLoginUserInfo);//I know this is a dup, i'm just lazyyyy...
const userSession = computed(() => store.getters.getLoginUserInfo);
const currentUser = ref (null)
const isModalVisible = ref(false);
const noTeam = ref(false);
const teamName = ref("");

onMounted(async () => {
  await getCurrentUser()
  if (currentUser.value) {
    picture.value = user.value.picture;
    name.value = `${user.value.fName}'s Progress`;
  }

  await loadProfileData(currentUser);
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
async function loadProfileData(user) {
  if (!user.value) return;

  const resUser = await userServices.get(user.value.id);
  const athlete = resUser.data;

  if (!athlete.team_id) {
    noTeam.value = true;
    goals.value = [];
    exercises.value = [];
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


  await loadTeamGoals(teamId);


  await loadExercisesForToday(teamId);
}
async function loadTeamGoals(teamId) {
  try {
    const response = await goalServices.get(teamId);
    goals.value = response.data;
  } catch (err) {
    console.error("loadTeamGoals error:", err);
  }
}


async function loadExercisesForToday(teamId) {
  try {
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

    exercises.value = allDays.filter(d => d.day === today);

  } catch (err) {
    console.error("loadExercisesForToday error:", err);
  }
}


const currentProgress = computed(() => {
  if (!exercises.value.length) return 0;

  const completed = exercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / exercises.value.length) * 100);
});


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
        <div class="left-header">
        </div>
        <v-progress-circular
          :model-value="currentProgress"
          :rotate="90"
          :size="140"
          :width="10"
          class="home-pro"
          ><span class="profile-words">{{ currentProgress }}%</span>
        </v-progress-circular>
      </div>
      <div class="flex-column-pfp">
      
        <div class="pfp-header">
          <p class="pfp-table-header">Goals</p>
        </div>
        <table class="pfp_table">
          <tbody class="pfp_table">
            <tr v-for="item in goals" :key="item.goal_id" class="pfp_table">
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
          <tbody class="pfp_table">
            <tr
              v-for="item in exercises"
              :key="item.exercise_id"
              class="pfp_table"
            >
              <td>{{ item.exercise.name }}</td>
              <td>{{ item.status }}</td>
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
