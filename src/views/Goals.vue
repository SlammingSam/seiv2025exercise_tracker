<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Goals</p>
    </div>
    </v-toolbar>
    
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
            <td>Goal Name</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
  <router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Back Button</button></router-link>
  <p></p>
  <router-link :to="{ name: 'Profile' }"><button class="home-button">Profile Button</button></router-link>
</template>
