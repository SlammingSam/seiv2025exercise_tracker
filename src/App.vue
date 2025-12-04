<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
import store from "./store/store.js";
import { computed, watch, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import userServices from "./services/userServices.js";

const router = useRouter();
const message = ref("");
const userSession = computed(() => store.getters.getLoginUserInfo);
// the store now stores the session, not the user
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const isCoach = ref(false);
const isAdmin = ref(false);
const loadingRole = ref(false);

async function loadUserRole(user) {
  if (!user) return;
  const id = user.userId ?? user.id;
  if (!id) return;
  loadingRole.value = true;
  try {
    //I will clean this up later. Problem I wanted to solve is that
    //App vue is always mounted, but you can't always request the role. some
    //of this error checking here is a bit too redundant for me. 
    const response = await userServices.get(id);
    const payload = response?.data ?? response;
    const role = (payload?.role ?? '').toString();
    console.log('Loaded user role:', role);
    isCoach.value = role.toLowerCase() === 'coach';
    isAdmin.value = role.toLowerCase() === 'admin';

    // optional routing if role unset
    if (role === 'Unset') {
      try { router.push({ name: 'RoleSelect' }); } catch(e) { /* ignore if router not ready */ }
    }
  } catch (error) {
    message.value = "Error: " + (error.code || error.response?.status) + ":" + (error.message || error.response?.data);
    console.log(error);
    // Do not set isAdmin to false on a failed load
  } finally {
    loadingRole.value = false;
  }
}

onMounted(() => {
  if (userSession.value) loadUserRole(userSession.value);
});

watch(userSession, (newUser) => {
  if (newUser) {
    loadUserRole(newUser);
  } else {
    isCoach.value = false;
    isAdmin.value = false;
  }
}, { immediate: true });
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
        <h3><router-link :to="{ name: 'Teams' }" v-if="isLoggedIn && (isCoach || isAdmin)">My Teams</router-link></h3>
         <h3><router-link :to="{ name: 'AdminPage' }" v-if="isLoggedIn && isAdmin">Admin</router-link></h3>
         <h3><router-link :to="{ name: 'AthletePlan' }" v-if="isLoggedIn && (isCoach|| isAdmin)">Athlete Plans</router-link></h3>
          <h3><router-link :to="{ name: 'AthletePlan' }" v-if="isLoggedIn">Plans</router-link></h3>
            <h3><router-link :to="{ name: 'AddPlan' }" v-if="isLoggedIn">Add a plan</router-link></h3>
    </div>
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>
