<script setup>
import { reactive } from "vue";
import goalServices from "../services/goalServices.js";
const emit = defineEmits(["refreshes"]);
const props = defineProps({
  teamId: { type: [Number, String], required: true }
});

const form = reactive({
  name: '',
  status: 'not started'
});

async function addGoal() {
  const res = await goalServices.create({
    name: form.name,
    status: form.status,
    teamId: props.teamId,
    user_id: null      // team goal, not per-athlete
  });
  console.log(res);
  emit("refreshes")
  document.getElementById("name").value = " ";
  hideModal()

  // Close modal or navigate
}

function hideModal() {
  let modal = document.getElementById("addGoal");
  modal.style.opacity = "0%";
  modal.style.top = "-100%";
}

</script>

<template>
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>Add Team Goal</p>
      </div>
    </v-toolbar>

    <div class="flex-column">
      <div class="flex-row-add">
        <button class="home-button" @click = "hideModal()">Cancel</button>
        <button class="save-button" @click="addGoal()">Save</button>
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
