<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices";
import plusIcon from "../components/plusIcon.vue"
const currentProgress = ref(75);
const message = ref("");
const data = ref([]);
//console.log("on goals page!");

onMounted(() => {
  //console.log("onMounted ran")
  getGoals();
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

async function getGoals(){
  try{
    const response = await goalServices.getAll();
    data.value = response.data;
    console.log(data)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}




const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database


</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Goals</p>
    </div>
    </v-toolbar>
    
<div class = "flex-row-search">
 <div class = "normal-header">
  <p>Add a Goal:</p>
 </div>
 <button id="plus-icon" @click="this.$router.push('/add-goal')">
<plusIcon
        size="45" 
        color="#9d9e9d" 
        stroke-width="2"
        />
 </button>
   
    <input type="file" id="file-input" style="display:none;"/>
    <input type="text"  class = inputBetter v-model="input" placeholder="Search goals" />
</div>
   
  <div class = flex-row-table>
    <table class ="long-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <!-- This is the header for the list. -->
        </tr>
      </thead>
      <tbody class ="long-table">
        <!-- Here the type can be declared to represent the item, just like other languages.  -->
          <tr v-for="item in data" :key="item.goal_id" class ="long-table">
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>
</template>
