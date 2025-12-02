<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { computed, watch  } from "vue";
import store from "../store/store.js";
import userServices from "../services/userServices.js";
import isCoach from "../App.vue";

const router = useRouter()
const user = computed(() => store.getters.getUserInfo);

async function setRole(new_role)
{
  if (!user.value) {//just a little error checking
    console.warn("User is not loaded yet.");
    return;
  }
  //const response = await userServices.get(user.value.userId);
  //console.log(response.value);
  //console.log(user.value);
  const new_user = {
    fName: user.value.fName,
    lName: user.value.lName,
    email: user.value.email,
    role: new_role
  }

  if(new_role == "Coach")//only one = is assignment people, == is for a question
  {
    //console.log("ran" + new_role);
    isCoach.value = true;
  }
  //console.log("running Function")
  await userServices.update(user.value.id, new_user)
  store.dispatch('updateUserRole', new_role);//this was missing, I really thought that it existed
  console.log("RoleSelect to Home");
  router.push({ name: "Home" });
}

onMounted(() => {
  if(user?.value?.role != null && user?.value?.role != "Unset")
  {
    console.log("RoleSelect Routed to Login");
    router.push({ name: "login" });//user sesssion does not exist
  }
  //console.log(user.value.role);
  //console.log(user?.value?.role != "Unset" && user?.value?.role != undefined);
  if(user?.value?.role != "Unset" && user?.value?.role != undefined)//wierd routing issue fix, if on this page with a role go to home
  {
    console.log("RoleSelect Routed to Home");
    router.push({ name: "Home" });
  }
  try //else try and modify the menu 
  {
    let menu = document.getElementById("menu");
    menu.style.top = "-12vh";
  }
  catch(e)//is menu does not exist the user is not logged in
  {
    //reroute to login screen
    //router.push({ name: "login" }); //not needed here because this is where the user sets their role
  }
});

watch(user, (newUser, oldUser) => {
  if (newUser) 
  {
    //console.log("watcher has updated the user");
  }
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
