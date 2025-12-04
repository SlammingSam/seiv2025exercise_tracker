<script setup>
import { ref, onMounted, computed } from "vue";
import goalServices from "../services/goalServices.js";
import AddUserGoal from "../components/AddUserGoal.vue";
import store from "../store/store.js";

const goals = ref([]);
const currentUser = computed(() => store.getters.getLoginUserInfo);
const isAddModalVisible = ref(false);
const message = ref("");

onMounted(async () => {
  if (!currentUser.value || !currentUser.value.userId) return;

  try {
    const res = await goalServices.getAll();
    goals.value = res.data.filter(goal => goal.user_id === currentUser.value.userId);
  } catch (err) {
    console.error("Error loading goals:", err);
    message.value = "Failed to load goals.";
  }
   let menu = document.getElementById("menu")
  menu.style.top = "-20vh"
});

async function reloadGoals() {
  const res = await goalServices.getAll();
  goals.value = res.data.filter(goal => goal.user_id === currentUser.value.userId);
}

async function saveGoalStatus(goal) {
  try {
    await goalServices.update(goal.id, { status: goal.status });
    console.log("Goal status updated:", goal);
  } catch (err) {
    console.error("Error updating goal:", err);
  }
}


async function deleteGoal(goalId) {
  try {
    await goalServices.delete(goalId);
    goals.value = goals.value.filter(g => g.id !== goalId);
  } catch (err) {
    console.error("Error deleting goal:", err);
  }
}

function openAddGoal() {
  const modal = document.getElementById("addUserGoal");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}
</script>

<template>
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>{{ currentUser?.fName }}'s Goals</p>
      </div>
    </v-toolbar>

    <div class="flex-between mb-2">
      <h3>User Goals</h3>
      <button class="add-button" @click="openAddGoal()">
        + Add Goal
      </button>
    </div>

    <div class="flex-row-table">
      <table class="long-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="goal in goals" :key="goal.id">
            <td>{{ goal.name }}</td>
            <td>
              <select v-model="goal.status">
                <option value="not started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </td>
            <td>
              <button class="button-gradient-2" @click="saveGoalStatus(goal)">Save</button>
              <button class="button-gradient-2" @click="deleteGoal(goal.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddUserGoal
      class = "add_user_goal"
      id="addUserGoal"
      :userId="currentUser?.userId"
      @refresh="reloadGoals"
      
    />
  </v-container>
</template>
