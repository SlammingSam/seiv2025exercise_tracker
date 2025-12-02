<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { computed, ref, onMounted } from "vue";
import teamServices from "../services/teamServices";
import userServices from "../services/userServices"
import plusIcon from "../components/plusIcon.vue";
import TeamCreate from "../components/TeamCreate.vue";
import store from "../store/store.js";
import AthleteAdd from "../components/AthleteAdd.vue";
import TeamEdit from "../components/TeamEdit.vue"
import DeleteConfirm from "../components/DeleteConfirm.vue";
import TeamNameEdit from "../components/TeamNameEdit.vue"
import PlanAssignment from "../components/PlanAssignment.vue"

const message = ref("");
const data = ref([]);
const teams = ref([])
const teamEditModal = ref(false)
const currentUser = ref(null)
const user_id = ref("")
const team_id = ref(null)
const team_name = ref(null)
const loadingUser = ref(true);
const userSession = computed(() => store.getters.getLoginUserInfo);

onMounted(async () => {
  console.log("onMounted ran")
  try {
    await getCurrentUser();
    await getTeams();
  } finally {
    loadingUser.value = false;
  }
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

async function getTeams(){
  try{
    const response = await teamServices.getAll();
    data.value = response.data;
    console.log(data)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

function toggleTeamCreate(){
    let modal = document.getElementById("teamCreate")
   modal.style.opacity = "100%"
   modal.style.top = "7%"
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

function changeTeamId(id, name){
  team_id.value = id;
  team_name.value = name;
  console.log(team_name)
   let modal = document.getElementById("athleteAdd")
   modal.style.opacity = "100%"
   modal.style.top = "7%"
}

const lists = ref([]);
const parsedList = ref([]);

function toggleTeamEdit(id, name){
   team_id.value = id;
  team_name.value = name;
    let modal = document.getElementById("teamEdit")
   modal.style.opacity = "100%"
   modal.style.top = "7%"
}

function toggleNameChange(id, name){
   team_id.value = id;
  team_name.value = name;
    let modal = document.getElementById("teamNameEdit")
   modal.style.opacity = "100%"
   modal.style.top = "7%"
}

function toggleDeleteConfirm(id, name){
    team_id.value = id;
  team_name.value = name;
    let modal = document.getElementById("deleteConfirm")
   modal.style.opacity = "100%"
   modal.style.top = "20%"
}
</script>

<template>  
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>Teams</p>
      </div>
    </v-toolbar>
    
    <div class="flex-row-search">
      <div class="normal-header">
        <p>Create a team:</p>
      </div>
      <button id="plus-icon" @click="toggleTeamCreate()">
        <plusIcon
          size="45" 
          color="#9d9e9d" 
          stroke-width="2"
        />
      </button>
      <input type="file" id="file-input" style="display:none;"/>
      <input type="text" class="inputBetter" v-model="input" placeholder="Search teams" />
    </div>
   
    <div class="flex-row-table">
      <div v-if="loadingUser">Loading...</div>
      <table v-else class="long-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody class="long-table">
          <tr v-for="item in data" :key="item.id" class="long-table">
            <td v-if="item.user_id == userSession?.userId">{{ item.name }}</td>
            <button v-if="item.user_id == userSession?.userId" @click="toggleTeamEdit(item.id, item.name)">View</button>
            <button v-if="item.user_id == userSession?.userId" @click="toggleNameChange(item.id, item.name)">Change Name</button>
            <button v-if="item.user_id == userSession?.userId" @click="changeTeamId(item.id, item.name)">Add to Team</button>
            <button v-if="item.user_id == userSession?.userId" @click="toggleDeleteConfirm(item.id, item.name)">remove</button>
          </tr>
        </tbody>
      </table> 

      <TeamCreate id="teamCreate" class="team_create_modal"
        teamName=""  
        :id="'teamCreate'"
      />
      <AthleteAdd id="athleteAdd" class="athlete_add_modal"
        :teamId="team_id"
        :teamName="team_name"          
      />
      <TeamEdit id="teamEdit" class="team_edit_modal"
        :teamId="team_id"
        :teamName="team_name"  
      />
      <DeleteConfirm class="delete_confirm" id="deleteConfirm"
        :objectId="team_id"
        :objectName="team_name"
      />
      <TeamNameEdit id="teamNameEdit" class="team_create_modal"
        :teamId="team_id"
        :teamName="team_name" 
      />
      <PlanAssignment id="planAssignment" class="plan_assignment_modal"
        :teamId="team_id"
        :teamName="team_name"
      />
    </div>
  </v-container>
</template>