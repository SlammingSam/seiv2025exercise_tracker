<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { computed, ref, onMounted } from "vue";
import teamServices from "../services/teamServices";
import userServices from "../services/userServices"
import plusIcon from "../components/plusIcon.vue";
import teamEdit from "../components/TeamEdit.vue";
import store from "../store/store.js";
const message = ref("");
const data = ref([]);
const teams = ref([])
const teamEditModal = ref(false)
const currentUser = ref(null)
const user_id = ref("")
const loadingUser = ref(true);
 const userSession = computed(() => store.getters.getLoginUserInfo);
//console.log("on goals page!");

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

function toggleTeamEdit(){
    let modal = document.getElementById("teamEdit")
   modal.style.opacity = "100%"
}

async function getCurrentUser(){
    //this guard is not needed, session works as intended.
    console.log('userSession.value:', userSession.value);
    if (!userSession.value || !userSession.value.userId) {
      console.log('No user session or userId');
      return;
    }
    const response = await userServices.get(userSession.value.userId);
    currentUser.value = response.data;
}




const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Teams</p>
    </div>
    </v-toolbar>
    
<div class = "flex-row-search">
 <div class = "normal-header">
  <p>Create a team:</p>
 </div>
 <button id="plus-icon" @click="toggleTeamEdit()">
<plusIcon
        size="45" 
        color="#9d9e9d" 
        stroke-width="2"
        />
 </button>
   
    <input type="file" id="file-input" style="display:none;"/>
    <input type="text"  class = inputBetter v-model="input" placeholder="Search teams" />
</div>
   
  <div class = flex-row-table>
    <div v-if="loadingUser">Loading...</div>
    <table v-else class ="long-table">
      <thead>
        <tr>
          <th>Name</th>
          <!-- This is the header for the list. -->
        </tr>
      </thead>
      <tbody class ="long-table">
        <!-- Here the type can be declared to represent the item, just like other languages.  -->
          <tr v-for="item in data" :key="item.id" class ="long-table">
            <td v-if="item.user_id == userSession?.userId">{{ item.name }}</td>
            <button v-if="item.user_id == userSession?.userId">Edit</button>
            <button v-if="item.user_id == userSession?.userId">Add to Team</button>
            <button v-if="item.user_id == userSession?.userId">remove</button>
        </tr>
      </tbody>
    </table> 
    <teamEdit id = "teamEdit" class = "team_edit_modal"
       />
  </div>
  </v-container>
</template>
