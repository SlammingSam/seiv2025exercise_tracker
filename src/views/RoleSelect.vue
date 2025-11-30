<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { computed} from "vue";
import store from "../store/store.js";
import userServices from "../services/userServices.js";

const router = useRouter()
const user = computed(() => store.getters.getLoginUserInfo);

// while (!user || !user.userId) {//might need something like this in every single file now
//     console.warn("getCurrentUser called without a valid user:", user);
// }

async function setRole(new_role){
    const new_user = {
      fName: user.value.fName,
      lName: user.value.lName,
      email: user.value.email,
      role: new_role
    }
    console.log("running Function")
    await userServices.update(user.userId, new_user)
     router.push({ name: "Home" });
}
onMounted(() => {
  console.log(user.value);
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});
</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>
        First time?
      </p>
    </div>
    </v-toolbar>
    <br /><br />
    
    <div class="home-container">
    <p>looks like you're brand new. Select a role to get started!</p>
    </div>

     <button class = "role-button" @click ="setRole('Athlete')">
        Athlete
    </button>
    <button class = "role-button" @click ="setRole('Coach')">
        Coach
    </button>
  </v-container>
</template>
