<script setup>
import { ref, watch, computed } from "vue";
import goalServices from "../services/goalServices";
import planAssignmentServices from "../services/planAssignmentServices";
import exercise_statusServices from "../services/exercise_statusServices";
import userServices from "../services/userServices";

const teamGoals = ref([]);
const exercises = ref([]);
const user = ref(null);
const picture = ref("../public/oc-logo-white.png");
const name = ref("");

const props = defineProps({
  currentAthlete: { type: [Number, String] },
  teamId: { type: [Number, String] }, // optional
});

// WATCH athlete ID — reload everything whenever they pick a different athlete
watch(() => props.currentAthlete, async (newId) => {
  if (!newId) return;

  // STEP 1 — load athlete info
  const userRes = await userServices.get(newId);
  user.value = userRes.data;

  name.value = user.value.fName;
  picture.value = user.value.picture || picture.value;

  const teamId = user.value.team_id;

  // STEP 2 — load team goals
  await loadTeamGoals(teamId);

  // STEP 3 — load today's workouts (with status)
  await loadExercisesForToday(teamId, newId);
});

async function loadTeamGoals(teamId) {
  try {
    const res = await goalServices.get(teamId);
    teamGoals.value = res.data;
  } catch (err) {
    console.error("Error loading team goals:", err);
  }
}

async function loadExercisesForToday(teamId, athleteId) {
  try {
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
        athleteId
      );

      // exRes.data includes: { id, status, status_id, day, exercise }
      allDays.push(...exRes.data);
    }

    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    exercises.value = allDays.filter(d => d.day === today);

  } catch (err) {
    console.error("Error loading exercises:", err);
  }
}

// Progress for today
const currentProgress = computed(() => {
  if (!exercises.value.length) return 0;
  const completed = exercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / exercises.value.length) * 100);
});

function hideModal() {
  let modal = document.getElementById("athleteView");
  modal.style.opacity = "0%";
  modal.style.top = "-100%";
}
</script>


<template>
  <v-container>
    <button @click="hideModal()">Back</button>

    <div class="flex-row-profile">
      <div class="flex-column-right">
        <img class="image_pfp" :src="picture" />
        <div class="pfp-header">
          <p class="pfp-table-header">{{ name }}</p>
        </div>

        <div class="left-header">
          <p>{{ name }}'s Progress for Today</p>
        </div>

        <v-progress-circular
          :model-value="currentProgress"
          :rotate="90"
          :size="140"
          :width="10"
          class="home-pro"
        >
          <span class="profile-words">{{ currentProgress }}%</span>
        </v-progress-circular>
      </div>

      <div class="flex-column-pfp">
        <div class="pfp-header">
          <p class="pfp-table-header">Team Goals</p>
        </div>
        <table class="pfp_table">
          <tbody>
            <tr v-for="item in teamGoals" :key="item.id">
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
            <tr v-for="item in exercises" :key="item.id">
              <td>{{ item.exercise.name }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </v-container>
</template>
