<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
  <v-app>
    <MenuBar :key="$route.fullPath" 
        size="45" 
        color="#9d9e9d" 
        stroke-width="3"
        />
        <div id = "menu" class = "accordion-menu">
    <h3><router-link :to="{ name: 'Home' }">Home</router-link></h3>
     <h3><router-link :to="{ name: 'ExercisePlan' }">Exercise Plans</router-link></h3>
      <h3><router-link :to="{ name: 'Goals' }">Goals</router-link></h3>
       <h3><router-link :to="{ name: 'Profile' }">Profile</router-link></h3>
        <h3><router-link :to="{ name: 'Athletes' }">Athletes</router-link></h3>
        <h3><router-link :to="{ name: 'AthletePlan' }">Athlete Plans</router-link></h3>
         <h3><router-link :to="{ name: 'AddPlan' }">Add a plan</router-link></h3>
</div>
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>
