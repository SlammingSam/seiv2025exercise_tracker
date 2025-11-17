<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices";
import plusIcon from "../components/plusIcon.vue"
const currentProgress = ref(75);
const message = ref("");
const data = ref([]);
console.log("on goals page!")
onMounted(() => {
  console.log("onMounted ran")
  getGoals();
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

function addGoalListener() {
    const customButton = document.getElementById("plus-icon");
    const fileInput = document.getElementById("file-input");
      if (!customButton || !fileInput) {
    console.warn('addExerciseListener: required element(s) not found', { customButton, fileInput });
    return;
  }


    if (!customButton.dataset.listenerAdded) {
        customButton.dataset.listenerAdded = "true";

        customButton.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (event) => {
            const userFile = event.target.files[0];
            if (!userFile) return;

            const reader = new FileReader();

            reader.onload = (e) => 
            {
                const fileContents = e.target.result;

                const lines = fileContents.split("\n");
                lists.value = displayContents(lines);//the ref version and the array version need the info
                addGoals(lists)
                //console.log(lists);
            };

            reader.onerror = (e) => 
            {
                console.error("Error reading file:", e.target.error);
                document.getElementById("header").innerText = "Error reading file.";
            };

            reader.readAsText(userFile);
    
        });
    }

  
}

function displayContents(data)
{
    let array = [];

    data.forEach(line => 
    {
        line = line.trim(); // Remove whitespace
        if (line.length === 0) return; // Skip empty lines
        let parts = line.split(",").map(part => part.trim()); // Trim each part
        array.push(parts);
        console.log(parts); // Log for debugging
    });
    console.log(array); // Log full array
    parsedList.value = array;
    return array;
}

document.addEventListener('DOMContentLoaded', addGoalListener);

async function addGoals(parsedList)
{
  // remember to use .value for promises...
  console.log(parsedList.value.length)
    if(parsedList.value.length != 0)
    {
        console.log("Adding goals:", parsedList.value);
        for(const list of parsedList.value)
        {
            let parts = list;
            console.log("Sending:", {name: parts[1], status: parts[2]});
            const response = await goalServices.create({
                name:parts[0],
                status:parts[1]
            });
            console.log("Response:", response);
        } 
        location.reload() // reload the page to go back home (Because it doesnt do it automatically)
    }
    else
    {
        console.log("No data to add");
    }
}


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
  <p>Add via file:</p>
 </div>
 <button>
<plusIcon id="plus-icon"
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
