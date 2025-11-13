<script setup>
import ocLogo from "../public/oc-logo-white.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from 'vue-router';
import store from "../store/store.js";
import { computed, watch } from "vue";
import BurgerIcon from "./BurgerIcon.vue";

const props = defineProps({
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: [Number, String], default: 2 }
})



const router = useRouter()
const user = computed(() => store.getters.getLoginUserInfo);
const title = ref("Exercise Tracker");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const email = ref("")
const isLoggedIn = computed(() => store.getters.isLoggedIn);

const resetMenu = () => {
  if(user.value)//stops the menu from erroring when the below problem exists
  {
    //console.log(user);//null if you dont import user from the store as above
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
    email.value = user.value.email;
  }
  else
  {
    //console.log("no user");
  }
};

watch(user, (newUser, oldUser) => 
{
  if (newUser && !oldUser) 
  {
    //console.log("User data loaded after mount");
    resetMenu();
  }
});

const logout = () => 
{
  //console.log(user.value);
  if(!user.value)//this does trigger correctly, catches null users which should not be an issue anymore
  {
    window.location.reload();
  }
  else
  {
    AuthServices.logoutUser(user.value)
      .then(() => {
        //pushes correctly but on error its not reloading the bar
        Utils.removeItem('token');//needed?
        //Utils.removeItem("user");
        store.commit('setLoginUser', null);
        //setUser(null);
        router.push({ name: "login" });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};
let toggle = false;
function showMenu(){
  if(!toggle){
    const menu = document.getElementById("menu")
    menu.style.top ="7%";
    toggle = true;
    return;
  }
  else{
      const menu = document.getElementById("menu")
  menu.style.top ="-55%";
  toggle = false
  }

}
onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu(); //was a problem, has been erroring out because is recieves incorrect information, but now that is fixed
});
</script>

<template>
  <div>
    <v-app-bar app>
      <div id = "hamburger-icon-container" @click="showMenu()">
        <svg class = "hamburger-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <path d="M4 18L20 18" :stroke="color" :stroke-width="strokeWidth" stroke-linecap="round"/>
    <path d="M4 12L20 12" :stroke="color" :stroke-width="strokeWidth" stroke-linecap="round"/>
    <path d="M4 6L20 6" :stroke="color" :stroke-width="strokeWidth" stroke-linecap="round"/>
  </svg>

      </div>
      
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          :transition="false"
          contain
        ></v-img>
  
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="isLoggedIn">
        <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="isLoggedIn">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">
                  {{ initials }}
                </span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
