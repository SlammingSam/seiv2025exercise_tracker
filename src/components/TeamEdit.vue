<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js";
import goalServices from "../services/goalServices.js"; 
import TeamNameEdit from "./TeamNameEdit.vue";
import {watch, ref, onMounted } from "vue";
const currentProgress = ref(75);
const users = ref([]);
const message = ref("");
const emit = defineEmits(['select-user', 'refresh']);
const teamGoals = ref([]); 

const props = defineProps({
  teamId: { type: [Number, String] },
  teamName: { type: [Number, String] },
});
defineExpose({
loadTeamGoals, getUsers
});
onMounted(() => {
  console.log("team id:" + props.teamId);
  console.log("onMounted ran");  
  getUsers();

  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});
watch(() => props.teamId, (newId) => {
  if (newId) loadTeamGoals();
});

async function getUsers() {
  try {
    const response = await userServices.getAll();
    console.log(response);
    users.value = response.data;
  } catch (error) {
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

async function deleteGoal(id) {
  try {
    await goalServices.delete(id);

    // remove from UI without reloading
    teamGoals.value = teamGoals.value.filter(g => g.id !== id);

  } catch (err) {
    console.error("Error deleting goal:", err);
  }
}


function changeName() {}

async function removeFromTeam(id) {
  
  users.value = users.value.filter(g => g.id !== id);
  const response = await userServices.update(id, {
    team_id: null,
  });
  console.log(response);
  emit("refresh");
}

async function addToTeam(user_id) {
  userServices.update(user_id, {
    team_id: props.teamId,
  });
}

function hideModal() {
  let modal = document.getElementById("teamEdit");
  modal.style.opacity = "0%";
  modal.style.top = "-100%";
  emit("refresh");
}

function openPlanAssignment() {
  let modal = document.getElementById("planAssignment");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

function toggleAthleteView() {
  let modal = document.getElementById("athleteView");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}


  async function loadTeamGoals() {
  try {
    const response = await goalServices.get(props.teamId);
    console.log("loadTeamGoals response:", response);
    teamGoals.value = response.data; // check if response.data is actually an array
  } catch (err) {
    console.error("Error loading team goals:", err);
  }
}



function openAddGoal() {
  const modal = document.getElementById("addGoal");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

async function saveGoalStatus(goal){
   try {
    const response = await goalServices.update(goal.id, {
      status: goal.status
    });
    console.log("Goal updated:", response);
    // Optionally show a toast or small message here
  } catch (err) {
    console.error("Error updating goal status:", err);
  }
}
</script>



<template>  
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>{{ props.teamName }}'s Athletes</p>
      </div>
    </v-toolbar>
   
    <div class="flex-row-search">
      <button class="button-gradient-2" @click="hideModal()">Back</button>
      <button class="button-gradient-2" @click="openPlanAssignment()">Training Calendar</button>
      <input type="text" class="inputBetter" v-model="input" placeholder="Search Athletes..." />
    </div>
   
    <div class="flex-row-table">
      <table class="long-table">
        <tbody class="long-table">
          <tr class="long-table">
           <th>First Name</th>
           <th>Last Name</th>
        </tr>
        <tr v-for="item in users" :key="item.id" class="long-table">
          <td v-if="item.role == 'Athlete' && item.team_id == props.teamId">{{ item.fName }}</td>
          <td v-if="item.role == 'Athlete' && item.team_id == props.teamId">{{ item.lName }}</td>
          <td v-if="item.role == 'Athlete' && item.team_id == props.teamId">
            <button class="button-gradient-2" @click="$emit('select-user', item.id); toggleAthleteView()">View</button>
            <button class="button-gradient-2" @click="removeFromTeam(item.id)">Remove</button>
          </td>
            <!-- i'll need to write this today. -->
        </tr>
      </tbody>
    </table> 
    </div>


    <div style="margin-top: 24px;">
      <div class="flex-between mb-2">
  <h3>Team Goals</h3>
  <button class="button-gradient" @click="openAddGoal()">
    + Add Goal
  </button>
</div>


      <div class="flex-row-table" style="margin-top: 8px;">
        <table class="long-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody class="long-table">
           <tr v-for="goal in teamGoals" :key="goal.id" class="long-table">
  <td>{{ goal.name }}</td>
  <td>
    <select v-model="goal.status">
      <option value="not started">Not Started</option>
      <option value="in-progress">In Progress</option>
      <option value="complete">Complete</option>
    </select>
  </td>
  <td>
    <button class="button-gradient-2" @click="deleteGoal(goal.id)">Delete</button>
    <button class="button-gradient-2" @click="saveGoalStatus(goal)">Save</button>
  </td>
</tr>
          </tbody>
        </table>
      </div>
    </div>

  </v-container>
</template>