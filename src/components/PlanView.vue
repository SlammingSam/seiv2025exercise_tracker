<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import planServices from "../services/planServices.js"
import exercise_dayServices from "../services/exercise_dayServices.js";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const plans = ref([])
const exercises = ref([])
const exerciseDays = ref([])
const message = ref("");

const props = defineProps({
  exercise_plan_id: { type: [Number, String]},
  planName: { type: [Number, String]}
})

onMounted(() => {
  console.log("onMounted ran")
  getPlans();
  getExercises();
  getExerciseDays();
  let menu = document.getElementById("menu")
  menu.style.top = "-12vh"
  
  // Use Vue lifecycle instead of DOMContentLoaded so elements from this component are present
});
async function getExercises(){
  try{
    const response = await exerciseServices.getAll();
    exercises.value = response.data;
    console.log(exercises)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}
async function getExerciseDays(){
  const response = await exercise_dayServices.getAll();
  exerciseDays.value = response.data
  
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

const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>{{ props.planName }}</p>
    </div>
    </v-toolbar>

         <table class ="long-table">
      <tbody class ="long-table">
        <h3>Exercises</h3>
        <tr class ="long-table">
          <th>name</th>
            <th>sets</th>
            <th>reps</th>
            <th>status</th>
        </tr>
         <tr v-for="day in exercises_days" :key="day.id" class ="long-table">
          <tr v-for="item in exercises" :key="item.id" class ="long-table">
          <td v-if="props.exercise_plan_id == day.exercise_plan_id && item.id == day.exercise_id">{{ item.name }}</td>
            <td>{{ item.sets }}</td>
            <td>{{ item.reps }}</td>
            <td>{{ item.status }}</td>
            </tr>
        </tr>
      </tbody>
    </table> 
 
  </v-container>



</template>
