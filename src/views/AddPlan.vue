<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
import { reactive } from 'vue'
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices"
import planServices from "../services/planServices";

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
async function addExercisePlan(){
  console.log("plan name " +form.name)
 const plan_response = await planServices.create({
      name: form.name,
      description: form.description
    })
    console.log(plan_response)
   const response = await exercise_planServices.create({
    plan_id:plan_response.data.plan_id,
    goal_id:"1"

   });
   console.log(response)
    
     for(let i = 0; i < form.values.length; i++){
    exercisesServices.create({
      name: form.values[i].name,
      sets: form.values[i].sets,
      reps: form.values[i].reps,
      exercise_plan_id: response.data.exercise_plan_id
    })
  
  }

   this.$router.push('/home');
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
    <button class="save-button" @click="addExercisePlan()">Save</button>
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
