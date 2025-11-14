<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import { onBeforeMount } from "vue";
import goalServices from "../services/goalServices";
const currentProgress = ref(75);

const lists = ref([]);

async function getGoals(){
  try{
    const response = await goalServices.getAll();
    lists.value = response.data;
    message.value = "";
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}


onBeforeMount(() => {
  getGoals();
});
</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Goals</p>
    </div>
    </v-toolbar>
    
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr v-for="item in lists" :key="lists.goal_id" :list=list class ="long-table">
            <td>{{ lists.name }}</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
</template>
