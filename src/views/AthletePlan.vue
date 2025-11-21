<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const currentProgress = ref(75);

onMounted(() => {
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});
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
      <p>Current Athlete: (name)</p>
    </div>
</div>
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <tbody class ="long-table">
          <tr class ="long-table">
            <td>Workout Name</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
  
</template>
