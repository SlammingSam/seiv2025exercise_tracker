<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted, computed } from "vue";
const currentProgress = ref(75);
import { reactive } from 'vue'
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices"
import planServices from "../services/planServices";
import exercise_dayServices from "../services/exercise_dayServices";
import userServices from "../services/userServices";
import { useRouter } from 'vue-router'
import store from "../store/store.js";
 const userSession = computed(() => store.getters.getLoginUserInfo);
const currentUser = ref(null)

const form = reactive({
  name: '',
  description: '',
  values: [{ name: '', sets: '', reps: '' }]
})

function addRow() {
  form.values.push({ name: '', sets: '', reps: '' })
  console.log(form.values)
}

function removeRow(index) {
  form.values.splice(index, 1)
}

const router = useRouter()

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

async function addExercisePlan(){
  try{
    console.log("plan name " + form.name)
    const plan_response = await planServices.create({
      name: form.name,
      description: form.description
    })
    console.log("plan_response.data:", plan_response.data)

    // accept multiple possible id field names depending on backend
    const planId = plan_response?.data?.plan_id ?? plan_response?.data?.id ?? plan_response?.data?.planId
    console.log("user id before making plan: " + currentUser.value.id)
    const exercisePlanResp = await exercise_planServices.create({
      plan_id: planId,
      user_id: currentUser?.value?.id
    })
    console.log("exercisePlanResp.data:", exercisePlanResp.data)
    const exercisePlanId = exercisePlanResp?.data?.exercise_plan_id ?? exercisePlanResp?.data?.id ?? exercisePlanResp?.data?.exercisePlanId

    for(let i = 0; i < form.values.length; i++){
      const ex = form.values[i]
      const exercise_response = await exercisesServices.create({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      })
      console.log("exercise_response.data:", exercise_response.data)
      const exerciseId = exercise_response?.data?.exercise_id ?? exercise_response?.data?.id ?? exercise_response?.data?.exerciseId

      const exercise_day_response = await exercise_dayServices.create({
        exercise_id: exerciseId,
        exercise_plan_id: exercisePlanId
      })
      console.log("exercise_day_response.data:", exercise_day_response.data)
    }
  } catch (err) {
    console.error('addExercisePlan error', err)
    throw err
  }
}

async function savePlan(){
  await addExercisePlan()
  router.push({ name: 'ExercisePlan' })
}

onMounted(async () => {
  await getCurrentUser()
  console.log(currentUser)
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

function togglePrexistingModal(){

}

</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Add Plan</p>
    </div>
    </v-toolbar>
    <div class="flex-column">
     <div class = flex-row-add>
  <router-link :to="{ name: 'AthletePlan' }"><button class="home-button">Cancel</button></router-link>
   <button class="save-button" @click="savePlan">Save</button>
</div>
<div class="flex-row-form">
    <div class="form-container">
    <div class="form-grid">
      <div class="form-left">
        <div class="form-field">
          <label for="name">Plan Name:</label>
          <input v-model="form.name" id="name" type="text" placeholder="Enter name" />
        </div>

        <div class="form-field">
          <label for="description">Description:</label>
          <textarea
            v-model="form.description"
            id="description"
            placeholder="Enter description"
            rows="6"
             class="no-resize"
          ></textarea>
        </div>
      </div>

      <!-- Right column: Table -->
      <div class="form-right">
        <h3>Exercises</h3>
        <table class="value-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Sets</th>
              <th>Reps</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in form.values" :key="index">
              <td>{{ index + 1 }}</td>
              <td><input class = "add-plan-input" v-model="row.name" placeholder="Name" /></td>
              <td><input class = "add-plan-input" v-model="row.sets" placeholder="Sets" /></td>       
              <td><input class = "add-plan-input" v-model="row.reps" placeholder="Reps" /></td>
              <td><button @click="removeRow(index)">Delete</button></td>
            </tr>
          </tbody>
        </table>

        <button class="add-btn" @click="addRow">+ Add Row</button>
      </div>
    </div>

  

  </div>
  </div>
  </div>

  </v-container>
  
</template>
