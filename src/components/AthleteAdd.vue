<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const users = ref([])
const message = ref("")

const emit = defineEmits(["refreshed"]);
const props = defineProps({
  teamId: { type: [Number, String]},
  teamName: { type: [Number, String]}
})
defineExpose({
getUsers
});

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
  await userServices.update(user_id, {
      team_id: props.teamId
  })
  emit("refreshed")
  hideModal()
}
  function hideModal(){
      let modal = document.getElementById("athleteAdd")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
   emit("refreshed")
  }

</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Add Athletes to {{ props.teamName }}</p>
    </div>
    
    </v-toolbar>
   
<div class = "flex-row-search">
  <button class="button-gradient-2" @click="hideModal()">Cancel</button>
    <input type="text"  class = inputBetter v-model="input" placeholder="Search Athletes..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
           <th> First Name</th>
           <th> Last Name</th>
           <th> email</th>
        </tr>
        <tr v-for="item in users" :key="item.user_id" class ="long-table">
          <td v-if="item.role == 'Athlete' && item.team_id == null">{{ item.fName }}</td>
          <td v-if="item.role == 'Athlete' && item.team_id == null">{{ item.lName }}</td>
           <td v-if="item.role == 'Athlete' && item.team_id == null">{{ item.email }}</td>
           <button class="button-gradient-2" v-if="item.role == 'Athlete' && item.team_id == null" @click="addToTeam(item.id)">Add to Team</button>
            <!-- i'll need to write this today. -->
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
</template>
