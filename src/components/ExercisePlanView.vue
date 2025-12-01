<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import planServices from "../services/planServices.js"
import exercise_dayServices from "../services/exercise_dayServices.js";
import { ref, onMounted, watch } from "vue";
const currentProgress = ref(75);
const plan = ref(null)
const exercises = ref([])
const message = ref("");
const exerciseDays = ref([])
const props = defineProps({
  planId: { type: [Number, String]},
  exercisePlanId: { type: [Number, String]}
})

onMounted(() => {
  console.log("onMounted ran")
  getExercises();
  getExerciseDays();
  let menu = document.getElementById("menu")
  if (menu) menu.style.top = "-12vh"
});

watch(() => props.planId, (newPlanId) => {
  if (newPlanId) {
    getPlans();
  }
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
async function getPlans(){
  try{
    const response = await planServices.getAll();
   plan.value = response.data;
    console.log(plans)
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

let input = ref("");
let arr = [];
let deptArr = [];

function filteredList() {
  arr = [];
  deptArr = [];

  for (let name in plans.value) {
    arr.push(plans.value[name]);
    console.log(plans.value[name]);
  } 

  for (let el in arr) {
    if(arr[el].name.toUpperCase().includes(input.value.toUpperCase())){
      deptArr.push(arr[el]);
    }
  }
  
  if(input.value.toUpperCase() == ""){
  return arr;
  }else{ 
    return deptArr;
  }
}


const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>{{ plan.value.name }}</p>
    </div>
    
    </v-toolbar>
   </v-container>
  <v-container>
    <div id = "editExercisePlanDiv">
         <table class ="long-table">
      <tbody class ="long-table">
        <h3>Exercises</h3>
        <tr class ="long-table">
          <th>name</th>
            <th>sets</th>
            <th>reps</th>
        </tr>
       
          <tr v-for="item in exercises" :key="item.exercise_id" class ="long-table">
          <td>{{ item.name }}</td>
            <td>{{ item.sets }}</td>
            <td>{{ item.reps }}</td>
        </tr>
         
        
      </tbody>
    </table> 
 
  </div>
  </v-container>

</template>
