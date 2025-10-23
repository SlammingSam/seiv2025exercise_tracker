<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
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
      <p>Plan</p>
    </div>
</div>

   <input type="text" v-model="input" placeholder="Search workouts..." />
  <div class = flex-row>
    <table>
      <tbody>
          <tr>
            <td>Workout Name</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
  <router-link :to="{ name: 'Home' }"><button class="home-button">Home Page Button</button></router-link>
</template>
