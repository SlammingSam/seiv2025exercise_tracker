<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices";
import exercise_planServices from "../services/exercise_planServices";
import exercisesServices from "../services/exercisesServices";
import userServices from "../services/userServices.js";
import planAssignmentServices from "../services/planAssignmentServices.js";
import exercise_dayServices from "../services/exercise_dayServices.js";
import store from "../store/store.js";
import { computed, watch } from "vue";

const teamGoals = ref([])
const currentAthlete = ref(null);
const goals = ref([])
const exercises = ref([])
const message = ref("")
const user = ref(null)
const picture = ref("../public/oc-logo-white.png");
const name = ref("");
const props = defineProps({
  currentAthlete: { type: [Number, String] },
  teamId: { type: [Number, String] },
})


watch(() => props.currentAthlete, async (newId) => {
  if (!newId) return;

  // STEP 1: get user
  const userRes = await userServices.get(newId);
  user.value = userRes.data;
  const teamId = user.value.team_id;
  name.value = user.value.fName
  await loadTeamGoals(teamId)
  // STEP 2: get ALL plan assignments for the team
  const paRes = await planAssignmentServices.getByTeam(teamId);
  const assignments = paRes.data;


  if (!assignments.length) {
    exercises.value = [];
    return;
  }

  // STEP 3: load ALL exercise_days for ALL plans
  let allDays = [];

  for (const a of assignments) {
    const exRes = await exercise_dayServices.get(a.exercise_plan_id);
    allDays.push(...exRes.data);
  }

  console.log("all days across all plans:", allDays);

  // STEP 4: filter for today
  const todayName = new Date().toLocaleString("en-US", { weekday: "long" });

  exercises.value = allDays.filter(d => d.day === todayName);

  console.log("exercises for today:", exercises.value);
  
});
const currentProgress = computed(() => {
  if (!exercises.value.length) return 0;

  const completed = exercises.value.filter(e => e.status === "complete").length;
  return Math.round((completed / exercises.value.length) * 100);
});


  async function loadTeamGoals(id) {
  try {
    const response = await goalServices.get(id);
    console.log("loadTeamGoals response:", response);
    teamGoals.value = response.data; // check if response.data is actually an array
  } catch (err) {
    console.error("Error loading team goals:", err);
  }
}

//console.log(user.value.picture);

async function getExercises(){
  try{
    const response = await exercisesServices.getAll();
    exercises.value = response.data;
    console.log("Exercises: " + exercises.value)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}


function hideModal(){
  let modal = document.getElementById("athleteView")
  modal.style.opacity = "0%"
  modal.style.top = "-100%"
}

</script>

<template>  
   
  <v-container>
   <button @click = "hideModal()"> Back</button>
<div class="flex-row-profile">
    <div class="flex-column-right">
        <img class="image_pfp" :src="picture"/> 
         <div class="pfp-header">
        <p class="pfp-table-header">{{ name }}</p>
         </div>
     <div class="left-header">
      <p>{{ name }}'s Progress for today</p>
    </div>
        <v-progress-circular 
        :model-value="currentProgress" 
        :rotate="90" 
        :size="140" 
        :width="10" 
        class="home-pro"><span class="profile-words">{{ currentProgress }}%</span> 
  </v-progress-circular>
    </div>
<div class="flex-column-pfp">
     <div class="pfp-header">
        <p class="pfp-table-header">Team Goals</p>
         </div>
  <table class="pfp_table">
      <tbody class="pfp_table">
          <tr v-for="item in teamGoals" :key="item.id" class="pfp_table">
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
  <table class="pfp_table" >
      <tbody class="pfp_table">
         <tr v-for="item in exercises" :key="item.id" class="pfp_table">
  <td>{{ item.exercise.name }}</td>
  <td>{{ item.status }}</td>
</tr>

      </tbody>
    </table>   
</div>
   
</div>  

  
  </v-container>
</template>
