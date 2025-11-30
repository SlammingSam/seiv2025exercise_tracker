<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js"
import teamServices from "../services/teamServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const users = ref([])
const plans = ref([])
const message = ref("")

onMounted(() => {
  console.log("onMounted ran")
  getUsers();
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

async function getUsers(){
  try{
    const response = await userServices.getAll();
    users.value = response.data;
    console.log(data)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

async function addToTeam(user_id){
    userServices.update(user_id, {
      
    })
}


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Add Athletes to your team!</p>
    </div>
    </v-toolbar>
   
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
           <th> Name</th>
           <th> email</th>
        </tr>
        <tr v-for="item in users" :key="item.user_id" class ="long-table">
          <td v-if="item.role == 'Athlete'">{{ item.fName }}</td>
           <td v-if="item.role == 'Athlete'">{{ item.email }}</td>
           <button v-if="item.role == 'Athlete'">Add to Team</button>
            <!-- i'll need to write this today. -->
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
</template>
