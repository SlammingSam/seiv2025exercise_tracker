<script setup>
//this is a duplicate component!!! I want to get something that works
//so I made this. I wanted to reuse TeamCreate for changing names but It was
//getting extrememly buggy when I tried to do that. 
//well now that I think this is good. 
import { computed, ref, onMounted, watch } from "vue";
import { reactive } from 'vue'
import teamServices from "../services/teamServices.js"
import userServices from "../services/userServices.js"
import store from "../store/store.js";
const currentUser = ref("")
const props = defineProps({
  teamName: { type: [Number, String]},
  teamId: { type: [Number, String]},
})

const form = reactive({
  name: ''
})

// Initialize form.name from prop when prop changes
//This watcher wasn't added by me. 
watch(() => props.teamName, (newName) => {
  if (newName) form.name = String(newName);
});

async function updateTeam(id){
   const response = await teamServices.update(id, {
    name:form.name
   })
       let modal = document.getElementById("teamNameEdit")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
   console.log(response)
  }
  function hideModal(){
      let modal = document.getElementById("teamNameEdit")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
  }
  async function getCurrentUser(){
  let userSession = computed(() => store.getters.getLoginUserInfo);
    const response = await userServices.get(userSession.value.userId);
 

    currentUser.value = response.data;
  }
  


  onMounted( async() => {
  console.log("onMounted ran")
  await getCurrentUser()
  console.log(currentUser.value.id)
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});
</script>

<template>
 <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Change Team Name</p>
    </div>
    </v-toolbar>
    <div class="flex-column">
     <div class = flex-row-add>
  <button class="home-button" @click = "hideModal()">Cancel</button>
    <button class="save-button" @click=updateTeam(props.teamId)>Save</button>
</div>
<div class="flex-row-form">
    <div class="form-container">
    <div class="form-grid">
      <div class="form-left">
        <div class="form-field">
          <label for="name">Team name:</label>
          <input v-model="form.name" id="name" type="text" />
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