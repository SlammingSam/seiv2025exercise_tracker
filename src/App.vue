<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
import store from "./store/store.js";
import { computed, watch, ref } from "vue";

const user = computed(() => store.getters.getLoginUserInfo);
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const isCoach = ref(false);

watch(user, (newUser, oldUser) => 
{
  if (newUser && !oldUser) 
  {
    //console.log("User data loaded after mount");
    if(user.role == "Coach")
      isCoach.value = true;
  }
});
</script>

<template>
  <v-app>
    <MenuBar :key="$route.fullPath" 
        size="45" 
        color="#9d9e9d" 
        stroke-width="3"
        />
        <div id = "menu" class = "accordion-menu">
    <h3><router-link :to="{ name: 'Home' }" v-if="isLoggedIn">Home</router-link></h3>
     <h3><router-link :to="{ name: 'ExercisePlan' }" v-if="isLoggedIn">Exercise Plans</router-link></h3>
      <h3><router-link :to="{ name: 'Goals' }" v-if="isLoggedIn">Goals</router-link></h3>
       <h3><router-link :to="{ name: 'Profile' }" v-if="isLoggedIn">Profile</router-link></h3>
        <h3><router-link :to="{ name: 'Athletes' }" v-if="isLoggedIn && isCoach.value">Athletes</router-link></h3>
        <h3><router-link :to="{ name: 'AthletePlan' }" v-if="isLoggedIn && isCoach.value">Athlete Plans</router-link></h3>
        <h3><router-link :to="{ name: 'AthletePlan' }" v-if="isLoggedIn">Plans</router-link></h3>
         <h3><router-link :to="{ name: 'AddPlan' }" v-if="isLoggedIn">Add a plan</router-link></h3>
</div>
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>
