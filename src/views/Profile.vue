<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices";
import exercise_planServices from "../services/exercise_planServices";
import exercisesServices from "../services/exercisesServices";
import store from "../store/store.js";
import { computed, watch } from "vue";

const goals = ref([])
const exercises = ref([])
const message = ref("")
const currentProgress = ref(75);
const user = computed(() => store.getters.getUserInfo);
const picture = ref("../public/oc-logo-white.png");
const name = ref("");

onMounted(() => {
  //console.log("onMounted ran")
  getGoals();
  getExercises();
  if(user.value)
  {
    picture.value = user.value.picture;
    let temp = user.value.fName;
    name.value = temp + "'s Progress";
  }
  try
  {
    let menu = document.getElementById("menu");
    menu.style.top = "-12vh";
  }
  catch(e)
  {
    //reroute to login screen
    router.push({ name: "login" });
  }
});

//console.log(user.value.picture);

async function getGoals(){
  try{
    const response = await goalServices.getAll();
    goals.value = response.data;
    console.log("Goals: " + goals.value)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

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

async function getPlans(){
  try{
    const response = await planServices.getAll();
    plans.value = response.data;
    console.log(plans)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}
</script>

<template>  
   
  <v-container>
   
<div class="flex-row-profile">
    <div class="flex-column-right">
        <img class="image_pfp" :src="picture"/> 
         <div class="pfp-header">
        <p class="pfp-table-header">{{ name }}</p>
         </div>
     <div class="left-header">
      <p>Today's Workouts</p>
    </div>
        <v-progress-circular :model-value="currentProgress" :rotate="90" :size="140" :width="10" class="home-pro"><span class="profile-words">75%</span> 
  </v-progress-circular>
    </div>
<div class="flex-column-pfp">
     <div class="pfp-header">
        <p class="pfp-table-header">Goals</p>
         </div>
  <table class="pfp_table">
      <tbody class="pfp_table">
          <tr v-for="item in goals" :key="item.goal_id" class="pfp_table">
            <td>{{ item.name }}</td>
             <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>   
</div>
    
   <div class="flex-column-pfp">
     <div class="pfp-header">
        <p class="pfp-table-header">Workouts</p>
         </div>
  <table class="pfp_table" >
      <tbody class="pfp_table">
          <tr  v-for="item in exercises" :key="item.exercise_id" class="pfp_table">
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>   
</div>
   
</div>  

  
  </v-container>
</template>
