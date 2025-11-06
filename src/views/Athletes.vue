<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>My Athletes</p>
    </div>
    </v-toolbar>
   
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
           <td>Athlete name</td>
             <td><router-link :to="{ name: 'AthletePlan' }"><button class="home-button">View Plan</button></router-link></td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
  <router-link :to="{ name: 'Home' }"><button class="home-button">Home Page Button</button></router-link>
  <p></p>
  <router-link :to="{ name: 'Goals' }"><button class="home-button">Goal Button</button></router-link>
</template>
