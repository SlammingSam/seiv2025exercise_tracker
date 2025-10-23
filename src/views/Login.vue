<script setup>
import SocialLogin from "../components/SocialLogin.vue";
</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Welcome!</p>
    </div>
    </v-toolbar>
    <br /><br />
    
    <div class="home-container">
    <p>Not your first time? Login to get back in the grind. First time? Sign up with us to get started!</p>
    </div>
    <br /><br />
    <SocialLogin />
    <br /><br /> 
    <div class="quote">
    <p>“Best Training Platform for those who want to take the next step in fitness” -Someguy</p>
    </div>
  </v-container>
  <router-link :to="{ name: 'Home' }"><button class="home-button">Home Page Button</button></router-link>
</template>
