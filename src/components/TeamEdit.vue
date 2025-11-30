<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const users = ref([])
const message = ref("")
const props = defineProps({
  teamId: { type: [Number, String]},
  teamName: { type: [Number, String]}
})
onMounted(() => {
  console.log(props.teamName)
  console.log("onMounted ran")
  getUsers();
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

async function getUsers(){
  try{
    const response = await userServices.getAll();
    users.value = response.data;
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}


async function addToTeam(user_id){
  userServices.update(user_id, {
      team_id: props.teamId
  })
}
  function hideModal(){
      let modal = document.getElementById("teamEdit")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
  }

</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>{{ props.teamName }}'s Athletes</p>
    </div>
    
    </v-toolbar>
   
<div class = "flex-row-search">
  <button @click="hideModal()">Back</button>
    <input type="text"  class = inputBetter v-model="input" placeholder="Search Athletes..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
           <th> First Name</th>
           <th> Last Name</th>
        </tr>
        <tr v-for="item in users" :key="item.user_id" class ="long-table">
          <td v-if="item.role == 'Athlete' && item.team_id == props.teamId">{{ item.fName }}</td>
          <td v-if="item.role == 'Athlete' && item.team_id == props.teamId">{{ item.lName }}</td>
            <!-- i'll need to write this today. -->
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
</template>
