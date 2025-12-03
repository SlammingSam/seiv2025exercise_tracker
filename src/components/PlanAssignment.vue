<script setup>
import { ref, onMounted, computed, watch } from "vue";
import planAssignmentServices from "../services/planAssignmentServices.js";
import exercisePlanServices from "../services/exercise_planServices.js";
import exerciseDayServices from "../services/exercise_dayServices.js";
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

// Watch for changes to teamId and reload data when it changes
watch(() => props.teamId, async (newTeamId, oldTeamId) => {
  console.log("Team ID changed from", oldTeamId, "to", newTeamId);
  if (newTeamId) {
    await loadPlanAssignments();
  }
});

async function loadAvailablePlans() {
  try {
    // Get all plans for this user (includes nested exercise_plans with their IDs)
    const plansResponse = await planServices.get(userSession.value.userId);
    const plans = plansResponse.data;
    
    // Build available plans from the nested exercise_plans data
    availablePlans.value = plans.flatMap(plan => {
      // Each plan has an array of exercise_plans with their IDs
      return plan.exercise_plans.map(ep => ({
        exercise_plan_id: ep.id,
        plan_id: plan.id,
        plan_name: plan.name,
        plan_description: plan.description,
        goal_id: null // We don't have goal_id in this response, but it's in the exercise_plan
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
    // Don't try to load if teamId is not set yet
    if (!props.teamId) {
      console.log("Team ID not set yet, skipping load");
      return;
    }
    
    const response = await planAssignmentServices.getAll();
    console.log("All plan assignments from API:", response.data);
    console.log("Looking for team_id:", props.teamId, "Type:", typeof props.teamId);
    
    // Convert both to numbers for comparison
    planAssignments.value = response.data.filter(
      pa => Number(pa.team_id) === Number(props.teamId)
    );
    console.log("Plan assignments loaded for team:", props.teamId, planAssignments.value);
    
    // Only build calendar if we have assignments
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

  // Convert to Unix timestamp in SECONDS (not milliseconds)
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
      // Use the service's get method - it already handles the route structure
      const response = await exerciseDayServices.get(assignment.exercise_plan_id);
      const exerciseDays = response.data;
      
      console.log(`Exercise days for plan ${assignment.exercise_plan_id}:`, exerciseDays);

      // Convert Unix timestamps (in SECONDS) to dates by multiplying by 1000
      const start = new Date(assignment.start_date * 1000);
      const end = new Date(assignment.end_date * 1000);
      
      console.log(`Date range: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`);

      // Iterate through each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

        // Find exercises scheduled for this day of week
        const dayExercises = exerciseDays
          .filter(ed => ed.day === dayName && ed.exercise)
          .map(ed => ({
            id: ed.exercise.id,
            name: ed.exercise.name,
            sets: ed.exercise.sets,
            reps: ed.exercise.reps,
            status: ed.exercise.status,
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
                <div v-for="exercise in day.exercises" :key="exercise.id" class="exercise-item">
                  <strong>{{ exercise.name }}</strong>
                  <span>{{ exercise.sets }} sets × {{ exercise.reps }} reps</span>
                  <span class="status" :class="exercise.status.replace(/ /g, '-')">{{ exercise.status }}</span>
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

<style scoped>
.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

.assignment-form {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.form-group {
  margin: 15px 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.calendar-container {
  margin-top: 30px;
}

.calendar-weeks {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.calendar-day {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.day-header {
  background: #4CAF50;
  color: white;
  padding: 10px;
  font-weight: bold;
  text-align: center;
}

.exercises-list {
  padding: 10px;
}

.exercise-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin: 5px 0;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 0.9em;
}

.exercise-item strong {
  color: #333;
}

.exercise-item span {
  color: #666;
  font-size: 0.85em;
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75em;
  margin-top: 4px;
  display: inline-block;
  width: fit-content;
}

.status.complete {
  background: #4CAF50;
  color: white;
}

.status.in-progress {
  background: #FFC107;
  color: black;
}

.status.not-started {
  background: #9E9E9E;
  color: white;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

.assignments-list {
  margin-top: 30px;
}

.message {
  margin-top: 10px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 4px;
}
</style>