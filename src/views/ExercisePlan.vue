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
const plan_name = ref(null)
const exercise_plan_id = ref(null)
const exercises = ref([])
const message = ref("");
const exercise_plans = ref([])
 const userSession = computed(() => store.getters.getLoginUserInfo);
onMounted(async () => {
  console.log("onMounted ran")
  await getCurrentUser()
  await getPlans(currentUser.value.id)
  let menu = document.getElementById("menu")
   menu.style.top = "-20vh"
  
  // Use Vue lifecycle instead of DOMContentLoaded so elements from this component are present
});

async function getPlans(id){
  try{
    const response = await planServices.get(id);
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


function togglePlanView(id, name){
  exercise_plan_id.value = id;
  plan_name.value = name;
      let modal = document.getElementById("planView")
   modal.style.opacity = "100%"
   modal.style.top = "7%"
   console.log("id selected: " + exercise_plan_id.value)
}
  
async function deletePlan(planId) {
  try {
    // Call backend to delete the plan
    await planServices.delete(planId);

    // Remove the plan from the local plans array so the UI updates immediately
    plans.value = plans.value.filter(plan => plan.id !== planId);

    console.log(`Plan ${planId} deleted successfully.`);
  } catch (err) {
    console.error("Failed to delete plan:", err);
  }
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
            <td><button class="button-gradient" @click="togglePlanView(item.exercise_plans[0].id, item.name)">View</button></td>
            <td><button class="button-gradient" @click="deletePlan(item.id)">Delete</button></td>
        </tr>
  
      </tbody>
      </table>

      <div>
       
      </div>
 
  </div>
  </v-container>

 <PlanView id = "planView" class ="plan_view_modal"
 :exercisePlanId="exercise_plan_id"
 :planName="plan_name"
 />

</template>
