<script setup>
import { ref, onMounted, computed, watch } from "vue";
import planAssignmentServices from "../services/planAssignmentServices.js";
import exercisePlanServices from "../services/exercise_planServices.js";
import exercise_dayServices from "../services/exercise_dayServices.js";
import planServices from "../services/planServices.js";
import store from "../store/store.js";

const props = defineProps({
  teamId: { type: [Number, String], required: true },
  teamName: { type: [Number, String], required: true }
});

const userSession = computed(() => store.getters.getLoginUserInfo);
const message = ref("");
const planAssignments = ref([]);
const selectedPlanId = ref(null);
const startDate = ref("");
const endDate = ref("");
const availablePlans = ref([]);
const calendarData = ref([]);
const loading = ref(true);

onMounted(async () => {
  console.log("PlanAssignment component mounted for team:", props.teamId);
  try {
    await loadAvailablePlans();
    await loadPlanAssignments();
  } catch (error) {
    console.error("Error in onMounted:", error);
    message.value = "Error loading data: " + error.message;
  } finally {
    loading.value = false;
  }
  
  let menu = document.getElementById("menu");
  if (menu) menu.style.top = "-12vh";
});

watch(() => props.teamId, async (newTeamId, oldTeamId) => {
  console.log("Team ID changed from", oldTeamId, "to", newTeamId);
  if (newTeamId) {
    await loadPlanAssignments();
  }
});

async function loadAvailablePlans() {
  try {
    const plansResponse = await planServices.get(userSession.value.userId);
    const plans = plansResponse.data;
    
    availablePlans.value = plans.flatMap(plan => {
      return plan.exercise_plans.map(ep => ({
        exercise_plan_id: ep.id,
        plan_id: plan.id,
        plan_name: plan.name,
        plan_description: plan.description,
        goal_id: null 
      }));
    });
    
    console.log("Available plans loaded:", availablePlans.value);
  } catch (error) {
    console.error("Error loading plans:", error);
    message.value = "Error loading plans: " + error.message;
  }
}

async function loadPlanAssignments() {
  try {
    if (!props.teamId) {
      console.log("Team ID not set yet, skipping load");
      return;
    }
    
    const response = await planAssignmentServices.getAll();
    console.log("All plan assignments from API:", response.data);
    console.log("Looking for team_id:", props.teamId, "Type:", typeof props.teamId);
    
    planAssignments.value = response.data.filter(
      pa => Number(pa.team_id) === Number(props.teamId)
    );
    console.log("Plan assignments loaded for team:", props.teamId, planAssignments.value);
    
    if (planAssignments.value.length > 0) {
      await buildCalendarData();
    } else {
      console.log("No plan assignments found for this team");
      calendarData.value = [];
    }
  } catch (error) {
    console.error("Error loading assignments:", error);
    message.value = "Error loading assignments: " + error.message;
  }
}

async function assignPlan() {
  if (!selectedPlanId.value || !startDate.value || !endDate.value) {
    message.value = "Please fill in all fields";
    return;
  }

  const startTimestamp = Math.floor(new Date(startDate.value).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(endDate.value).getTime() / 1000);

  if (startTimestamp >= endTimestamp) {
    message.value = "End date must be after start date";
    return;
  }

  try {
    const payload = {
      team_id: props.teamId,
      exercise_plan_id: selectedPlanId.value,
      start_date: startTimestamp,
      end_date: endTimestamp
    };
    
    console.log("Creating plan assignment with payload:", payload);
    
    await planAssignmentServices.create(payload);

    message.value = "Plan assigned successfully!";
    selectedPlanId.value = null;
    startDate.value = "";
    endDate.value = "";
    await loadPlanAssignments();
  } catch (error) {
    message.value = "Error assigning plan: " + error.message;
    console.error("Error creating assignment:", error);
  }
}

async function buildCalendarData() {
  const calendar = [];

  for (const assignment of planAssignments.value) {
    try {
  
      const response = await exercise_dayServices.get(assignment.exercise_plan_id);
      const exerciseDays = response.data;
      
      console.log(`Exercise days for plan ${assignment.exercise_plan_id}:`, exerciseDays);


      const start = new Date(assignment.start_date * 1000);
      const end = new Date(assignment.end_date * 1000);
      
      console.log(`Date range: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

        const dayExercises = exerciseDays
          .filter(ed => ed.day === dayName && ed.exercise)
          .map(ed => ({
            id: ed.exercise.id,
            name: ed.exercise.name,
            sets: ed.exercise.sets,
            reps: ed.exercise.reps,
            exercise_day_id: ed.id
          }));

        if (dayExercises.length > 0) {
          calendar.push({
            date: new Date(date),
            exercises: dayExercises,
            assignment_id: assignment.id,
            plan_id: assignment.exercise_plan_id
          });
        }
      }
    } catch (error) {
      console.error("Error building calendar for assignment:", assignment.id, error);
    }
  }

  // Sort by date
  calendar.sort((a, b) => a.date - b.date);
  calendarData.value = calendar;
  console.log("Calendar data built:", calendarData.value);
}

const groupedByWeek = computed(() => {
  const weeks = [];
  let currentWeek = [];

  calendarData.value.forEach((item, index) => {
    currentWeek.push(item);

    const isLastItem = index === calendarData.value.length - 1;
    const nextItemNewWeek = !isLastItem && 
      item.date.getDay() === 6; // Saturday

    if (nextItemNewWeek || isLastItem) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return weeks;
});

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

function hideModal() {
  let modal = document.getElementById("planAssignment");
  if (modal) {
    modal.style.opacity = "0%";
    modal.style.top = "-100%";
  }
}

async function removePlanAssignment(assignmentId) {
  try {
    await planAssignmentServices.delete(assignmentId);
    message.value = "Plan assignment removed";
    await loadPlanAssignments();
  } catch (error) {
    message.value = "Error removing assignment: " + error.message;
    console.error(error);
  }
}

async function toggleExerciseStatus(exerciseDayId, currentStatus) {
  try {
    console.log("Toggling status for exercise_day_id:", exerciseDayId, "Current status:", currentStatus);
    
    const newStatus = currentStatus === 'complete' ? 'not started' : 'complete';
    
    console.log("Sending update request with new status:", newStatus);
    
    const response = await exercise_dayServices.update(exerciseDayId, {
      status: newStatus
    });
    
    console.log("Update response:", response);
    console.log(`Successfully updated exercise_day ${exerciseDayId} status to ${newStatus}`);
    
    await buildCalendarData();
    
    message.value = `Status updated to ${newStatus}`;
    setTimeout(() => {
      message.value = "";
    }, 2000);
  } catch (error) {
    console.error("Error updating status:", error);
    console.error("Error details:", error.response?.data);
    message.value = "Error updating status: " + error.message;
  }
}

function getPlanName(exercisePlanId) {
  const plan = availablePlans.value.find(p => p.exercise_plan_id == exercisePlanId);
  return plan ? plan.plan_name : `Plan #${exercisePlanId}`;
}
</script>

<template>
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>{{ props.teamName }}'s Training Calendar</p>
      </div>
    </v-toolbar>

    <div class="flex-row-search">
      <button @click="hideModal()">Back</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else>
      <div class="assignment-form">
        <h3>Assign New Plan</h3>
        <div class="form-group">
          <label>Select Plan:</label>
          <select v-model="selectedPlanId">
            <option :value="null">-- Select a Plan --</option>
            <option v-for="plan in availablePlans" :key="plan.exercise_plan_id" :value="plan.exercise_plan_id">
              {{ plan.plan_name }} 
              <span v-if="plan.plan_description"> - {{ plan.plan_description }}</span>
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Start Date:</label>
          <input type="date" v-model="startDate" />
        </div>

        <div class="form-group">
          <label>End Date:</label>
          <input type="date" v-model="endDate" />
        </div>

        <button @click="assignPlan()">Assign Plan</button>
        <p v-if="message" class="message">{{ message }}</p>
      </div>

      <div class="calendar-container">
        <h3>Training Schedule</h3>

        <div v-if="calendarData.length === 0" class="no-data">
          No plans assigned yet. Create an assignment above to get started.
        </div>

        <div v-else class="calendar-weeks">
          <div v-for="(week, weekIndex) in groupedByWeek" :key="weekIndex" class="calendar-week">
            <div v-for="day in week" :key="day.date.toISOString()" class="calendar-day">
              <div class="day-header">
                {{ formatDate(day.date) }}
              </div>
              <div class="exercises-list">
                <div v-for="exercise in day.exercises" :key="exercise.exercise_day_id" class="exercise-item">
                  <strong>{{ exercise.name }}</strong>
                  <span>{{ exercise.sets }} sets × {{ exercise.reps }} reps</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="planAssignments.length > 0" class="assignments-list">
          <h4>Active Plan Assignments</h4>
          <table class="long-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assignment in planAssignments" :key="assignment.id">
                <td>{{ getPlanName(assignment.exercise_plan_id) }}</td>
                <td>{{ new Date(assignment.start_date * 1000).toLocaleDateString() }}</td>
                <td>{{ new Date(assignment.end_date * 1000).toLocaleDateString() }}</td>
                <td>
                  <button @click="removePlanAssignment(assignment.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </v-container>
</template>

