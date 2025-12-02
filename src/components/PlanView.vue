<script setup>
import exercise_dayServices from "../services/exercise_dayServices.js";
import { watch, ref, computed } from "vue";

const exercise_days = ref([]);            // working copy
const originalExerciseDays = ref([]);     // backup for cancel
const allExercises = ref([]);             // <--- NEW fixed exercise list
const draggedItem = ref(null);

const props = defineProps({
  exercisePlanId: { type: [Number, String] },
  planName: { type: [Number, String] }
});

// Days of the week
const weekDays = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

watch(
  () => props.exercisePlanId,
  async (newId) => {
    if (newId) {
      await getExerciseDays(newId);
    }
  },
  { immediate: true }
);

//resetting the schedule... hope it works!
async function resetSchedule() {
  if (!confirm("This will clear your current schedule. Are you sure?")) return;

 
  exercise_days.value.forEach(ex => {
    ex.day = "Unset";
  });


  const seen = new Set();
  exercise_days.value = exercise_days.value.filter(ex => {
    if (seen.has(ex.exercise_id)) return true; // keep first occurrence
    seen.add(ex.exercise_id);
    return true; // keep first, remove duplicates? Actually first is kept above
  });


  try {
    await exercise_dayServices.reset(props.exercisePlanId);
    alert("Schedule reset. You can start redragging now!");
  } catch (err) {
    console.error(err);
    alert("Failed to reset schedule on server.");
  }
}


// LOAD DATA
async function getExerciseDays(id) {
  const response = await exercise_dayServices.get(id);

  originalExerciseDays.value = JSON.parse(JSON.stringify(response.data)); 
  exercise_days.value = JSON.parse(JSON.stringify(response.data));

  // ---------------------------
  // BUILD FIXED UNIQUE LIST ONCE
  // ---------------------------
  const map = new Map();
  for (const entry of response.data) {
    if (!map.has(entry.exercise_id)) {
      map.set(entry.exercise_id, entry.exercise);
    }
  }

  allExercises.value = [...map.values()];
}

// =============================
// UNIQUE EXERCISE LIST (LEFT)
// ALWAYS UNIQUE, NEVER DUPLICATES
// =============================
const uniqueExercises = computed(() => allExercises.value);

// DRAG START
function onDragStart(item) {
  draggedItem.value = item;
}

// DROP -> Add or modify entries
function onDrop(day) {
  if (!draggedItem.value) return;

  const original = draggedItem.value;

  const exists = exercise_days.value.some(
    ex =>
      ex.exercise_id === original.id && // FIXED
      ex.exercise_plan_id === original.exercise_plan_id &&
      ex.day === day
  );

  if (exists) {
    draggedItem.value = null;
    return;
  }

  // CASE 1: Exercise is in an "Unset" existing row
  const unsetRow = exercise_days.value.find(
    ex => ex.exercise_id === original.id && ex.day === "Unset"
  );

  if (unsetRow) {
    unsetRow.day = day;
  } else {
    // CASE 2: Create a NEW exercise_day entry
    exercise_days.value.push({
      id: null,
      exercise_id: original.id,
      exercise_plan_id: props.exercisePlanId,
      day: day,
      exercise: original  // IMPORTANT FIX
    });
  }

  draggedItem.value = null;
}


// SAVE
async function saveSchedule() {
  try {
    for (const ex of exercise_days.value) {
      if (ex.id == null) {
        await exercise_dayServices.create({
          exercise_id: ex.exercise_id,
          exercise_plan_id: ex.exercise_plan_id,
          day: ex.day
        });
      } else {
        await exercise_dayServices.update(ex.id, { day: ex.day });
      }
    }

    alert("Weekly schedule saved!");
    await getExerciseDays(props.exercisePlanId); // reload fresh
  } catch (err) {
    console.error(err);
    alert("Error saving schedule");
  }
}

// CANCEL → restore from original backup
function cancelChanges() {
  exercise_days.value = JSON.parse(JSON.stringify(originalExerciseDays.value));
}

// Close modal
function hideModal() {
  cancelChanges();
  let modal = document.getElementById("planView");
  modal.style.opacity = "0%";
  modal.style.top = "-100%";
}
</script>




<template>
  <div id="planViewContainer">
    <v-toolbar>
      <div class="home-header">
        <p>{{ props.planName }}</p>
      </div>
    </v-toolbar>

    <button @click="hideModal">Cancel</button>

    <!-- ==== UNIQUE DRAGGABLE EXERCISE LIST ==== -->
    <table class="long-table">
      <tbody class="long-table">
        <h3>Exercises</h3>
        <tr class="long-table">
          <th>Name</th>
          <th>Sets</th>
          <th>Reps</th>
        </tr>

        <tr
          v-for="item in uniqueExercises"
          :key="item.id"
          class="long-table"
          draggable="true"
          @dragstart="onDragStart(item)"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.sets }}</td>
          <td>{{ item.reps }}</td>
        </tr>
      </tbody>
    </table>

    <!-- ==== WEEKLY SCHEDULE GRID ==== -->
    <h3>Weekly Schedule</h3>

    <div class="week-grid">
      <div
        v-for="day in weekDays"
        :key="day"
        class="day-cell"
        @dragover.prevent
        @drop="onDrop(day)"
      >
        <strong>{{ day }}</strong>

        <div
          class="day-item"
          v-for="ex in exercise_days.filter(e => e.day === day)"
          :key="ex.exercise_id + '-' + ex.day"
        >
          {{ ex.exercise.name }}
        </div>
      </div>
    </div>

    <button @click="saveSchedule">Save</button>
    <button @click="resetSchedule">Reset</button>
  </div>
</template>
