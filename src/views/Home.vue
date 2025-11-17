<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import BurgerIcon from "../components/BurgerIcon.vue";
import store from "../store/store.js";

const name = ref("");

const user = store.getters.getLoginUserInfo;
//console.log(user);

if(user)
{
  name.value = user.fName;
}
const currentProgress = ref(75);
</script>

<template>  
   
  <role-picker/>

  <v-container>
    <v-toolbar>
      
      <div class="home-header">
      <p>Welcome, {{ name }}!</p>
    </div>
    </v-toolbar>
    <div class="flex-row-home">
    <div class="left-header">
      <p>Today's Workouts</p>
    </div>
    <div class="right-header">
      <p>Progress</p>
    </div> 
</div>

    <div class="flex-row-home">
   <table class="home_table">
      <tbody>
          <tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr><tr>
            <td>Workouts</td>
             <td><router-link :to="{ name: 'ExercisePlan' }"><button class="home-button">Exercise</button></router-link></td>
        </tr>
      </tbody>
    </table> 
    <v-progress-circular :model-value="currentProgress" :rotate="90" :size="320" :width="20" class="home-pro"><span class="progress-words">75%</span> 
  </v-progress-circular>
  </div>
  </v-container>
</template>
