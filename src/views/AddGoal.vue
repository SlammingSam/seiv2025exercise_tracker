<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
import { reactive } from 'vue'
import goalServices from "../services/goalServices.js"

const form = reactive({
  name: '',
})

async function addGoal(){
   const response = await goalServices.create({
    name:form.name
   })
   console.log(response)
   this.$router.push('/goals')
  }


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Add Goal</p>
    </div>
    </v-toolbar>
    <div class="flex-column">
     <div class = flex-row-add>
   <router-link :to="{ name: 'Goals' }"><button class="home-button">Cancel</button></router-link>
    <button class="save-button" @click="addGoal()">Save</button>
</div>
<div class="flex-row-form">
    <div class="form-container">
    <div class="form-grid">
      <div class="form-left">
        <div class="form-field">
          <label for="name">Goal Name:</label>
          <input v-model="form.name" id="name" type="text" placeholder="Enter name" />
        </div>

      </div>
  
</div>
  </div>
  </div>
  </div>

  </v-container>
  
</template>
