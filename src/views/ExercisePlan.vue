<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import exercise_planServices from "../services/exercise_planServices.js";
import planServices from "../services/planServices.js"
import PlanView from "../components/PlanView.vue"
import { ref, onMounted, computed } from "vue";
import userServices from "../services/userServices.js";
import store from "../store/store.js";
const currentUser = ref(null)
const currentProgress = ref(75);
const plans = ref([])
const plan_id = ref(null)
const exercise_plan_id = ref(null)
const exercises = ref([])
const message = ref("");
const exercise_plans = ref([])
 const userSession = computed(() => store.getters.getLoginUserInfo);
onMounted(async () => {
  console.log("onMounted ran")
  await getPlans();
  await getExercisePlans();
  await getCurrentUser()
  let menu = document.getElementById("menu")
  menu.style.top = "-12vh"
   console.log("length of plans:" + plans.value.length)
   console.log("length of exercise plans:" + exercise_plans.value.length)
  
  
  // Use Vue lifecycle instead of DOMContentLoaded so elements from this component are present
});
import ExercisePlanView from "../components/ExercisePlanView.vue";
async function getExercisePlans(){
  try{
    const response = await exerciseServices.getAll();
    exercise_plans.value = response.data;
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
async function getCurrentUser(){
    //this guard is not needed, session works as intended.
    console.log('userSession.value:', userSession.value);
    if (!userSession.value || !userSession.value.userId) {
      console.log('No user session or userId');
      return;
    }
    const response = await userServices.get(userSession.value.userId);
    currentUser.value = response.data;
}

let input = ref("");
let arr = [];
let deptArr = [];


function togglePlanView(){
  plan_id.value = plan_id;
  exercise_plan_id.value = exercise_plan_id;
}
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
    <input type="text"  class = inputBetter v-model="input" placeholder="Search Plans..." />
</div>
   
  <div class = flex-row-table>
      <button id = "plan-add" @click=" this.$router.push('/add-plan')">
         <PlusIcon/>
      </button>
        <input type="file" id="plan-file-input" style="display:none;"/>
    <table class ="long-table">
      <tbody class ="long-table">
       <tr>
        <h2 v-if="plans?.value?.length < 1">Looks like you don't have any plans yet.</h2>
       </tr>
         <tr>
          <th>
            Plan name
          </th>
          <th>
            Description
          </th>
        </tr>
       <tr v-for="item in plans" :key="item.id" class ="long-table">
            <td>{{ item.name }}</td>
            <td >{{ item.description }}</td>
            <td><button @click="togglePlanView(item.id)">View</button></td>
        </tr>
  
      </tbody>
      </table>

      <div>
       
      </div>
 
  </div>
  </v-container>

 <PlanView id = "planView" class ="plan_view_modal"
 :exercisePlanId="exercise_plan_id"
 :planId ="plan_id"
 />

</template>
