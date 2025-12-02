<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import planServices from "../services/planServices.js"
import exercise_dayServices from "../services/exercise_dayServices.js";
import { watch, ref, onMounted } from "vue";
const currentProgress = ref(75);
const plans = ref([])
const exercises = ref([])
const exercise_days = ref([])
const message = ref("");

const props = defineProps({
  exercisePlanId: { type: [Number, String]},
  planName: { type: [Number, String]}
})
watch(
  () => props.exercisePlanId,
  async (newId) => {
    if (newId) {
      console.log("Prop available:", newId);
      await getExerciseDays(newId);
      console.log("Exercise days:", exercise_days.value);
    }
  },
  { immediate: true } // run now AND when prop changes
);
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
async function getExerciseDays(id){
  const response = await exercise_dayServices.get(id);
  exercise_days.value = response.data
  
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
  function hideModal(){
      let modal = document.getElementById("planView")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
  }
const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   
  <div id = "planViewContainer">
    <v-toolbar>
      <div class="home-header">
      <p>{{ props.planName }}</p>
    </div>
    </v-toolbar>
      <button @click="hideModal()">cancel</button>
         <table class ="long-table">
      <tbody class ="long-table">
        <h3>Exercises</h3>
        <tr class ="long-table">
          <th>name</th>
            <th>sets</th>
            <th>reps</th>
        </tr>
         <tr v-for="item in exercise_days" :key="item.id" class ="long-table">
          <td>{{ item.exercise.name }}</td>
            <td>{{ item.exercise.sets }}</td>
            <td>{{ item.exercise.reps }}</td>
            </tr>
      </tbody>
    </table> 
 
  </div>



</template>
