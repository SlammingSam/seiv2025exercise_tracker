<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
</script>

<template>  
   
  <v-container>
   
<div class="flex-row-profile">
    <div class="flex-column-right">
        <img class="image_pfp" src = "../public/oc-logo-white.png"> 
         <div class="pfp-header">
        <p class="pfp-table-header">(name)</p>
         </div>
     <div class="left-header">
      <p>Today's Workouts</p>
    </div>
   

        <v-progress-circular :model-value="currentProgress" :rotate="90" :size="140" :width="10" class="home-pro"><span class="profile-words">75%</span> 
  </v-progress-circular>
    </div>
<div class="flex-column-pfp">
     <div class="pfp-header">
        <p class="pfp-table-header">Goals</p>
         </div>
  <table class="pfp_table">
      <tbody class="pfp_table">
          <tr class="pfp_table">
            <td>Goals</td>
             <td><router-link :to="{ name: 'Goals' }"><button class="home-button">Exercise</button></router-link></td>
        </tr>
      </tbody>
    </table>   
</div>
    
   <div class="flex-column-pfp">
     <div class="pfp-header">
        <p class="pfp-table-header">Workouts</p>
         </div>
  <table class="pfp_table" >
      <tbody class="pfp_table">
          <tr class="pfp_table">
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr class="pfp_table">
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr class="pfp_table">
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr class="pfp_table">
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr>
      </tbody>
    </table>   
</div>
   
</div>  

  <router-link :to="{ name: 'Athletes' }"><button class="home-button">Athletes Button</button></router-link>
  </v-container>
</template>
