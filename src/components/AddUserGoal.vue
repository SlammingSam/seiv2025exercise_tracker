<script setup>
import { reactive } from "vue";
import goalServices from "../services/goalServices.js";
const emit = defineEmits(["refresh"]);
const props = defineProps({
  userId: { type: [Number, String], required: true }
});

const form = reactive({
  name: '',
  status: 'not started'
});

async function addGoal() {
  try {
    await goalServices.create({
      name: form.name,
      status: form.status,
      team_id: null,       // user goal, not team
      user_id: props.userId
    });
   
    hideModal();
  } catch (err) {
    console.error("Error adding user goal:", err);
  }
}

function hideModal() {
   let modal = document.getElementById("addUserGoal");
  modal.style.opacity = "0%";
  modal.style.top = "-100%"; 
  emit("refresh");
}
</script>

<template>
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>Add User Goal</p>
      </div>
    </v-toolbar>

    <div class="flex-column">
      <div class="flex-row-add">
        <button class="home-button" @click="hideModal">Cancel</button>
        <button class="save-button" @click="addGoal">Save</button>
      </div>

      <div class="flex-row-form">
        <div class="form-container">
          <div class="form-grid">
            <div class="form-left">
              <div class="form-field">
                <label for="name">Goal Name:</label>
                <input v-model="form.name" id="name" type="text" placeholder="Enter goal name" />
              </div>

              <div class="form-field">
                <label>Status:</label>
                <select v-model="form.status">
                  <option value="not started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </v-container>
</template>
