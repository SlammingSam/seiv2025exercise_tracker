<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import { computed, ref, onMounted } from "vue";
import teamServices from "../services/teamServices";
import userServices from "../services/userServices";
import plusIcon from "../components/plusIcon.vue";
import TeamCreate from "../components/TeamCreate.vue";
import store from "../store/store.js";
import AthleteAdd from "../components/AthleteAdd.vue";
import TeamEdit from "../components/TeamEdit.vue";
import DeleteConfirm from "../components/DeleteConfirm.vue";
import TeamNameEdit from "../components/TeamNameEdit.vue";
import PlanAssignment from "../components/PlanAssignment.vue";
import AthleteView from "../components/AthleteView.vue";
import AddGoal from "../components/AddGoal.vue";

const selectedUserId = ref(null);

const message = ref("");
const data = ref([]);
const teams = ref([]);
const teamEditModal = ref(false);
const current_athlete = ref(null);
const currentUser = ref(null);
const user_id = ref("");
const team_id = ref(null);
const team_name = ref(null);
const loadingUser = ref(true);
const userSession = computed(() => store.getters.getLoginUserInfo);

onMounted(async () => {
  console.log("onMounted ran");
  try {
    await getCurrentUser();
    await getTeams();
  } finally {
    loadingUser.value = false;
  }
  let menu = document.getElementById("menu");
  menu.style.top = "-20vh";
});

async function getTeams() {
  try {
    const response = await teamServices.getAll();
    data.value = response.data;
    console.log("All Teams ", data.value);
  } catch (error) {
    message.value = "Error: " + error.code + ":" + error.message;
    console.log(error);
  }
}

function toggleTeamCreate() {
  let modal = document.getElementById("teamCreate");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

async function getCurrentUser() {
  console.log("userSession.value:", userSession.value);
  if (!userSession.value || !userSession.value.userId) {
    console.log("No user session or userId");
    return;
  }
  const response = await userServices.get(userSession.value.userId);
  currentUser.value = response.data;
}

function changeTeamId(id, name) {
  team_id.value = id;
  team_name.value = name;
  console.log(team_name);
  let modal = document.getElementById("athleteAdd");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

const lists = ref([]);
const parsedList = ref([]);

function toggleTeamEdit(id, name) {
  team_id.value = id;
  team_name.value = name;
  let modal = document.getElementById("teamEdit");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

function toggleNameChange(id, name) {
  team_id.value = id;
  team_name.value = name;
  let modal = document.getElementById("teamNameEdit");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}

function toggleDeleteConfirm(id, name) {
  team_id.value = id;
  team_name.value = name;
  let modal = document.getElementById("deleteConfirm");
  modal.style.opacity = "100%";
  modal.style.top = "20%";
}

function openAthleteProfile(id) {
  console.log("id selected: " + id);
  selectedUserId.value = id;

  const modal = document.getElementById("athleteView");
  modal.style.opacity = "100%";
  modal.style.top = "7%";
}
</script>

<template>
  <v-container>
    <v-toolbar>
      <div class="home-header">
        <p>Teams</p>
      </div>
    </v-toolbar>

    <div class="flex-row-search">
      <div class="normal-header"></div>
      <button id="plus-icon" @click="toggleTeamCreate()">
        <plusIcon size="45" color="#9d9e9d" stroke-width="2" />
      </button>
      <input type="file" id="file-input" style="display: none" />
      <input
        type="text"
        class="inputBetter"
        v-model="input"
        placeholder="Search teams"
      />
    </div>

    <div class="flex-row-table">
      <div v-if="loadingUser">Loading...</div>
      <table v-else class="my-table">
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <!-- This is the header for the list. -->
          </tr>
        </thead>
        <tbody>
          <!-- Here the type can be declared to represent the item, just like other languages.  -->
          <tr v-for="item in data" :key="item.id">
            <td
              class="padding-team"
              v-if="
                item.user_id == userSession?.userId ||
                currentUser.role.toLowerCase() == 'admin'
              "
            >
              {{ item.name }}
            </td>
            <td class="centerTable">
              <button
                class="button-gradient"
                v-if="
                  item.user_id == userSession?.userId ||
                  currentUser.role.toLowerCase() == 'admin'
                "
                @click="toggleTeamEdit(item.id, item.name)"
              >
                View
              </button>
            </td>
            <td class="centerTable">
              <button
                class="button-gradient"
                v-if="
                  item.user_id == userSession?.userId ||
                  currentUser.role.toLowerCase() == 'admin'
                "
                @click="toggleNameChange(item.id, item.name)"
              >
                Change Name
              </button>
            </td>
            <td class="centerTable">
              <button
                class="button-gradient"
                v-if="
                  item.user_id == userSession?.userId ||
                  currentUser.role.toLowerCase() == 'admin'
                "
                @click="changeTeamId(item.id, item.name)"
              >
                Add to Team
              </button>
            </td>
            <td class="centerTable">
              <button
                class="button-gradient"
                v-if="
                  item.user_id == userSession?.userId ||
                  currentUser.role.toLowerCase() == 'admin'
                "
                @click="toggleDeleteConfirm(item.id, item.name)"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <TeamCreate
        id="teamCreate"
        class="team_create_modal"
        teamName=""
        :id="'teamCreate'"
      />
      <AthleteAdd
        id="athleteAdd"
        class="athlete_add_modal"
        :teamId="team_id"
        :teamName="team_name"
      />
      <!-- I intended on using this for multiple things, but thats ok. Thats why the props are named different. -->
      <DeleteConfirm
        class="delete_confirm"
        id="deleteConfirm"
        :objectId="team_id"
        :objectName="team_name"
      />
      <TeamNameEdit
        id="teamNameEdit"
        class="team_create_modal"
        :teamId="team_id"
        :teamName="team_name"
      />

      <TeamCreate
        id="teamCreate"
        class="team_create_modal"
        teamName=""
        :id="'teamCreate'"
      />
      <AthleteAdd
        id="athleteAdd"
        class="athlete_add_modal"
        :teamId="team_id"
        :teamName="team_name"
      />
      <TeamEdit
        id="teamEdit"
        class="team_edit_modal"
        :teamId="team_id"
        :teamName="team_name"
        @select-user="openAthleteProfile"
      />
      <DeleteConfirm
        class="delete_confirm"
        id="deleteConfirm"
        :objectId="team_id"
        :objectName="team_name"
      />
      <TeamNameEdit
        id="teamNameEdit"
        class="team_create_modal"
        :teamId="team_id"
        :teamName="team_name"
      />
      <PlanAssignment
        id="planAssignment"
        class="plan_assignment_modal"
        :teamId="team_id"
        :teamName="team_name"
      />
      <AthleteView
        id="athleteView"
        class="athlete_view_modal"
        :currentAthlete="selectedUserId"
      />
      <AddGoal id="addGoal" class="add_goal_modal" :teamId="team_id" />
    </div>
  </v-container>
</template>
