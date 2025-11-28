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
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
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
    <p>Cringe ahh setting
    </p>
    </div>
    <br /><br />
    <br /><br /> 
    <div class="quote">
    <p>“Best Training Platform for those who want to take the next step in fitness” -Someguy</p>
    </div>
  </v-container>
</template>
