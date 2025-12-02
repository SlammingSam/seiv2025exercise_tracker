<script setup>
import { computed, ref, onMounted } from "vue";
import { reactive } from 'vue'
import teamServices from "../services/teamServices.js"
import userServices from "../services/userServices.js"
import store from "../store/store.js";
const currentUser = ref("")
const props = defineProps({

})

const form = reactive({
  name: ''
})

async function addTeam(){
   const response = await teamServices.create({
    user_id: currentUser.value.id,
    name:form.name
   })
   console.log(response)
  }
  function hideModal(){
      let modal = document.getElementById("teamEdit")
   modal.style.opacity = "0%"
  }
  async function getCurrentUser(){
  let userSession = computed(() => store.getters.getUserInfo);
    const response = await userServices.get(userSession.value.userId);

    currentUser.value = response.data;
  }
  
  onMounted( async() => {
  console.log("onMounted ran")
  await getCurrentUser()
  console.log(currentUser.value.id)
  try
   {
      let menu = document.getElementById("menu");
      menu.style.top = "-12vh";
   }
   catch(e)
   {
      //reroute to login screen
      router.push({ name: "login" });
   }
});
</script>

<template>
 <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Add Team</p>
    </div>
    </v-toolbar>
    <div class="flex-column">
     <div class = flex-row-add>
  <button class="home-button" @click = "hideModal()">Cancel</button>
    <button class="save-button" @click="addTeam()">Save</button>
</div>
<div class="flex-row-form">
    <div class="form-container">
    <div class="form-grid">
      <div class="form-left">
        <div class="form-field">
          <label for="name">Team name:</label>
          <input v-model="form.name" id="name" type="text" placeholder="Enter name" />
        </div>

      </div>
  
</div>
  </div>
  </div>
  </div>

  </v-container>
</template>




<style scoped>

</style>