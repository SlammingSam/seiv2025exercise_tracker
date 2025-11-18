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




const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Exercise Plans</p>
    </div>
    </v-toolbar>
    <div class="flex-row-home">
    <div class="left-header">
      <p>My Plans</p>
    </div>
</div>
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
      <button id = "plan-add" @click=" this.$router.push('/add-plan')">
         <PlusIcon/>
      </button>
        <input type="file" id="plan-file-input" style="display:none;"></input>
    <table class ="long-table">
      <tbody class ="long-table">
       
         <tr>
          <th>
            Plan name
          </th>
          <th>
            Description
          </th>
        </tr>
       
           <tr v-for="item in plans" :key="item.plan_id" class ="long-table">
            
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
        </tr>
      </tbody>
      </table>

      <div>
      <button id = "exercise-add" @click="this.$router.push('/add-plan')"
      >
         <PlusIcon/>
      </button>
        <input type="file" id="exercise-file-input" style="display:none;"></input>
       
      </div>
         <table class ="long-table">
      <tbody class ="long-table">
        <h3>Plan's Exercises</h3>
        <tr class ="long-table">
          <th>name</th>
            <th>sets</th>
            <th>reps</th>
            <th>status</th>
        </tr>
         <tr v-for="item in exercises" :key="item.exercise_id" class ="long-table">
          <td>{{ item.name }}</td>
            <td>{{ item.sets }}</td>
            <td>{{ item.reps }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>

</template>
