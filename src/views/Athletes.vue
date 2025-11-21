<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js"
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


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>My Athletes</p>
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
          <td>{{ item.fName }}</td>
           <td >{{ item.email }}</td>
            <!-- i'll need to write this today. -->
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
</template>
