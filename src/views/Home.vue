<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import BurgerIcon from "../components/BurgerIcon.vue";
import exercisesServices from "../services/exercisesServices";
import exercise_planServices from "../services/exercise_planServices.js";
import store from "../store/store.js";
import userServices from "../services/userServices.js";
import RolePicker from "../components/RolePicker.vue"

const exercises = ref([])
const showRolePicker = ref(false);

const user = store.getters.getLoginUserInfo;
const name = ref("");
const role = ref("");
const testUser = ref(null);
const message = ref("");


async function fetchUser(userId){
  try{
    const response = await userServices.get(userId);
    testUser.value = response.data; 
    role.value = testUser.value?.role || "";
    name.value = testUser.value?.fName || "";
    if (role.value === 'Unset') {
      showRolePicker.value = true;
    }
  }
  catch(error){
    console.log("Error fetching user: " + error);
  }
}

async function handleRoleSelected(selectedRole) {
  if (selectedRole !== 'Done') {
    try {
      const updatedUser = { ...testUser.value, role: selectedRole };
      await userServices.update(user.userId, updatedUser);
      store.commit('setLoginUser', updatedUser);
      role.value = selectedRole;
      showRolePicker.value = false;
      location.reload();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  } else {
    showRolePicker.value = false;
  }
}

function closeRolePicker() {
  showRolePicker.value = false;
}

onMounted(async () => {
  console.log("onMounted ran");
  await getExercises();
  if (user?.userId) {
    await fetchUser(user.userId);
    console.log("fetched user:", testUser.value, "role:", role.value);
  }
});

async function getExercises(){
  try{
    const response = await exercisesServices.getAll();
    exercises.value = response.data;
    console.log(exercises)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

if(user)
{
  name.value = user.fName;
}


const currentProgress = ref(75);

console.log(role.value);
</script>

<template>  
   
  <role-picker v-if="showRolePicker" @select="handleRoleSelected" @close="closeRolePicker" />

  <v-container>
    <v-toolbar>
      
      <div class="home-header">
      <p>Welcome, {{ name }}!</p>
      
    </div>
    </v-toolbar>
    <div class="flex-row-home">
    <div class="left-header">
      <p>Today's Workouts</p>
    </div>
    <div class="right-header">
      <p>Progress</p>
    </div> 
</div>

    <div class="flex-row-home">
   <table class="home_table">
      <tbody>
          <tr  v-for="item in exercises" :key="item.exercise_id" class="pfp_table">
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table> 
    <v-progress-circular :model-value="currentProgress" :rotate="90" :size="320" :width="20" class="home-pro"><span class="progress-words">75%</span> 
  </v-progress-circular>
  </div>
  </v-container>
</template>
