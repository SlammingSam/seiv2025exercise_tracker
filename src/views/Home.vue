<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import BurgerIcon from "../components/BurgerIcon.vue";
//import RolePicker from "../components/RolePicker.vue";
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices.js";
import store from "../store/store.js";
import { computed, watch } from "vue";

const exercises = ref([])

onMounted(() => {
  //console.log("onMounted ran")
  getExercises();
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

async function getExercises(){
  try{
    const response = await exercisesServices.getAll();
    exercises.value = response.data;
    console.log(exercises.value)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

const name = ref("");

const user = computed(() => store.getters.getLoginUserInfo);
console.log(user.value);

if(user)
{
  name.value = user.fName;
}
const currentProgress = ref(75);
</script>

<template>  
   
  <role-picker/>

  <v-container>
    <v-toolbar>
      
      <div class="home-header">
      <p>Welcome, {{ name }}!</p>
    </div>
    </v-toolbar>
    <div class="flex-row-home">
    <div class="left-header">
      <p>Today's Workouts</p>
    </div>
    <div class="right-header">
      <p>Progress</p>
    </div> 
</div>

    <div class="flex-row-home">
   <table class="home_table">
      <tbody>
          <tr  v-for="item in exercises" :key="item.exercise_id" class="pfp_table">
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table> 
    <v-progress-circular :model-value="currentProgress" :rotate="90" :size="320" :width="20" class="home-pro"><span class="progress-words">75%</span> 
  </v-progress-circular>
  </div>
  </v-container>
</template>
