<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import store from "../store/store.js";

const router = useRouter()
const user = store.getters.getLoginUserInfo;

onMounted(() => {
  //console.log(user);
  if(user) //if a user is already logged in go to their home page
   router.push({ name: "Home" });
  let menu = document.getElementById("menu");
  menu.style.top = "-9vh";
});
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
</template>
