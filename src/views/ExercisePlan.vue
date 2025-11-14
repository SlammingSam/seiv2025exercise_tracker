<script setup>
import PlusIcon from "../components/plusIcon.vue";
import SocialLogin from "../components/SocialLogin.vue";
import exerciseServices from "../services/exercisesServices.js"
import planServices from "../services/planServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const plans = ref([])
const exercises = ref([])
const message = ref("");
onMounted(() => {
  console.log("onMounted ran")
  getPlans();
  getExercises();
  // Use Vue lifecycle instead of DOMContentLoaded so elements from this component are present
  addListener();
  addExerciseListener();
});
async function getExercises(){
  try{
    const response = await exerciseServices.getAll();
    exercises.value = response.data;
    console.log(exercises)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}
async function getPlans(){
  try{
    const response = await planServices.getAll();
    plans.value = response.data;
    console.log(plans)
  }
  catch(error){
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}




const lists = ref([]);//list for the page display
const parsedList = ref([]);//list to send to the database

function addListener() {
  const customButton = document.getElementById("plan-add");
  const fileInput = document.getElementById("plan-file-input");

  if (!customButton || !fileInput) {
    console.warn('addListener: required element(s) not found', { customButton, fileInput });
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
                plans.value = displayContents(lines);//the ref version and the array version need the info
                addPlans(plans)
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

function addExerciseListener() {
  const customButton = document.getElementById("exercise-add");
  const fileInput = document.getElementById("exercise-file-input");

  if (!customButton || !fileInput) {
    console.warn('addExerciseListener: required element(s) not found', { customButton, fileInput });
    return;
  }

  // dataset might be undefined on some elements; guard it
  if (!customButton.dataset) customButton.dataset = {};

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
        exercises.value = displayContents(lines);//the ref version and the array version need the info
        addExercises(exercises)
        //console.log(lists);
      };

      reader.onerror = (e) => 
      {
        console.error("Error reading file:", e.target.error);
        const header = document.getElementById("header");
        if (header) header.innerText = "Error reading file.";
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

async function addPlans(parsedList)
{
  // remember to use .value for promises...
  console.log(parsedList.value.length)
    if(parsedList.value.length != 0)
    {
        console.log("Adding goals:", parsedList.value);
        for(const list of parsedList.value)
        {
            let parts = list;
            console.log("Sending:", {name: parts[0]});
            const response = await planServices.create({
                name:parts[0],
                description:parts[1]
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

async function addExercises(parsedList)
{
  // remember to use .value for promises...
  console.log(parsedList.value.length)
    if(parsedList.value.length != 0)
    {
        console.log("Adding goals:", parsedList.value);
        for(const list of parsedList.value)
        {
            let parts = list;
            console.log("Sending:", {name: parts[0], sets:parts[1],
                reps:parts[2],
                exercise_plan_id:parts[3]});
            const response = await exerciseServices.create({
                name:parts[0],
                sets:parts[1],
                reps:parts[2],
                exercise_plan_id:parts[3]
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

document.addEventListener('DOMContentLoaded', addExerciseListener);
document.addEventListener('DOMContentLoaded', addListener);

</script>

<template>  
   
  <v-container>
    <v-toolbar>
      <div class="home-header">
      <p>Exercise Plans</p>
    </div>
    </v-toolbar>
    <div class="flex-row-home">
    <div class="left-header">
      <p>My Plans</p>
    </div>
</div>
<div class = "flex-row-search">
    <input type="text"  class = inputBetter v-model="input" placeholder="Search workouts..." />
</div>
   
  <div class = flex-row-table>
      <button id = "plan-add">
         <PlusIcon/>
      </button>
        <input type="file" id="plan-file-input" style="display:none;"></input>
    <table class ="long-table">
      <tbody class ="long-table">
       
         <tr>
          <th>
            Plan name
          </th>
          <th>
            Description
          </th>
        </tr>
       
           <tr v-for="item in plans" :key="item.plan_id" class ="long-table">
            
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
        </tr>
      </tbody>
      </table>

      <div>
      <button id = "exercise-add">
         <PlusIcon/>
      </button>
        <input type="file" id="exercise-file-input" style="display:none;"></input>
       
      </div>
         <table class ="long-table">
      <tbody class ="long-table">
        <h3>Plan's Exercises</h3>
        <tr class ="long-table">
          <th>name</th>
            <th>sets</th>
            <th>reps</th>
            <th>status</th>
        </tr>
         <tr v-for="item in exercises" :key="item.exercise_id" class ="long-table">
          <td>{{ item.name }}</td>
            <td>{{ item.sets }}</td>
            <td>{{ item.reps }}</td>
            <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table> 
 
  </div>
  </v-container>

</template>
