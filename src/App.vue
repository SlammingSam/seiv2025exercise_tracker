<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
import store from "./store/store.js";
import { computed, watch, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import userServices from "./services/userServices.js";

const router = useRouter();
const currentUser = ref(null);
const message = ref("");
const userSession = computed(() => store.getters.getUserInfo);
// the store now stores the session, not the user
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const role = computed(() => store.getters.getUserRole);
const isCoach = ref(false);
const loadingRole = ref(false);
const menuKey = ref(0);//variable of the menu, increment this to update the hamburger menu

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
    currentUser.value = payload;
    const role = (payload?.role ?? '').toString();
    store.dispatch('updateUserRole', role);//never used an action from the store before
    //console.log('Loaded user role:', role);
    isCoach.value = role.toLowerCase() === 'coach';
    // optional routing if role unset
    if (role === 'Unset') { 
      console.log("App Routed to RoleSelect");
      try { router.push({ name: 'RoleSelect' }); } catch(e) { /* ignore if router not ready */ }
    }
  } catch (error) {
    message.value = "Error: " + (error.code || error.response?.status) + ":" + (error.message || error.response?.data);
    console.log(error);
    isCoach.value = false;
  } finally {
    loadingRole.value = false;
  }
}

onMounted(() => {
  if (userSession.value) loadUserRole(userSession.value);
});

watch(role, (newRole) => {
    window.location.reload();
  }
);

watch(() => store.getters.getUserInfo?.id,(newId) => {//changed from the last version to only watch the id (fires when you login not when role changes)
    if (newId) 
      loadUserRole({ id: newId });
    else 
    {
      isCoach.value = false;
      currentUser.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-app>
    <MenuBar :key="$route.fullPath"
      size="45" 
      color="#9d9e9d" 
      stroke-width="3"
      />
      <div id = "menu" class = "accordion-menu" v-if="isLoggedIn && !isCoach">
       <h3><router-link :to="{ name: 'Home' }">Home</router-link></h3>
        <h3><router-link :to="{ name: 'ExercisePlan' }">Exercise Plans</router-link></h3>
         <h3><router-link :to="{ name: 'Goals' }">Goals</router-link></h3>
          <h3><router-link :to="{ name: 'Profile' }">Profile</router-link></h3>
           <h3><router-link :to="{ name: 'AthletePlan' }">Plans</router-link></h3>
            <h3><router-link :to="{ name: 'AddPlan' }">Add a plan</router-link></h3>
      </div>
      <div id = "menu" class = "accordion-menu" v-if="isLoggedIn && isCoach">
       <h3><router-link :to="{ name: 'Home' }">Home</router-link></h3>
        <h3><router-link :to="{ name: 'ExercisePlan' }">Exercise Plans</router-link></h3>
         <h3><router-link :to="{ name: 'Goals' }">Goals</router-link></h3>
          <h3><router-link :to="{ name: 'Profile' }">Profile</router-link></h3>
           <h3><router-link :to="{ name: 'Teams' }">My Teams</router-link></h3>
            <h3><router-link :to="{ name: 'AthletePlan' }">Athlete Plans</router-link></h3>
             <h3><router-link :to="{ name: 'AthletePlan' }">Plans</router-link></h3>
              <h3><router-link :to="{ name: 'AddPlan' }">Add a plan</router-link></h3>
      </div>
      <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>
