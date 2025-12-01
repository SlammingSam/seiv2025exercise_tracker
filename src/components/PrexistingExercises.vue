<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import planServices from "../services/planServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const plans = ref([])
const exercises = ref([])
const message = ref("");
onMounted(() => {
  console.log("onMounted ran")
  getPlans();
  getExercises();
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
    <div>
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
            <td><button>Add exercise</button></td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>

</template>
