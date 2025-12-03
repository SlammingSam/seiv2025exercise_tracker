<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices";
import exercise_planServices from "../services/exercise_planServices";
import exercisesServices from "../services/exercisesServices";
import userServices from "../services/userServices.js";
import store from "../store/store.js";
import { computed, watch } from "vue";

const currentAthlete = ref(null);
const goals = ref([])
const exercises = ref([])
const message = ref("")
const currentProgress = ref(75);
const user = ref(null)
const picture = ref("../public/oc-logo-white.png");
const name = ref("");
const props = defineProps({
  currentAthlete: { type: [Number, String] }
})

defineExpose({
  currentAthlete
})
onMounted(async () => {
  //console.log("onMounted ran")
  await getGoals();
  await getExercises();
  await getUser(props.currentAthlete);
  if(user.value)
  {
    picture.value = user.value.picture;
    let temp = user.value.fName;
    name.value = temp + "'s Progress";
  }
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
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

async function getUser(id){
  try{
    const response = await userServices.get(id);
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
