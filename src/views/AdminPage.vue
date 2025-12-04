<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Admin Page</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Role</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.fName }} {{ user.lName }}</td>
              <td>{{ user.role }}</td>
              <td>
                <div v-if="user.role === 'Admin'">
                  <v-btn @click="changeRole(user, 'Coach')" color="secondary" class="mr-2">
                    Make Coach
                  </v-btn>
                  <v-btn @click="changeRole(user, 'Athlete')" color="secondary">
                    Make Athlete
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn @click="changeRole(user, 'Admin')" color="primary">
                    Make Admin
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userServices from "../services/userServices.js";
import store from "../store/store.js";
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  data() {
    return {
      users: [],
    };
  },
  setup() {
    const router = useRouter();
    const loggedInUser = computed(() => store.getters.getLoginUserInfo);
    return { router, loggedInUser };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await userServices.getAll();
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async changeRole(user, newRole) {
      const new_user = {
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: newRole,
      };
      try {
        await userServices.update(user.id, new_user);
        // Refresh the user list
        this.fetchUsers();
      } catch (error) {
        console.error(`Error changing role to ${newRole}:`, error);
      }
    },
  },
  created() {
    const user = store.getters.getLoginUserInfo;
    if (!user) {
      this.router.push({ name: 'Login' });
      return;
    }
    
    // Self-contained role check to prevent race conditions
    const id = user.userId ?? user.id;
    if (!id) {
        this.router.push({ name: 'Profile' });
        return;
    }

    userServices.get(id)
      .then(response => {
        const fullUser = response.data;
        if (fullUser.role !== 'Admin') {
          this.router.push({ name: 'Profile' });
        } else {
          // User is confirmed as an Admin, now fetch the list of users for the table
          this.fetchUsers();
        }
      })
      .catch(error => {
        console.error("Error verifying admin role:", error);
        this.router.push({ name: 'Profile' });
      });
  },
};
</script>
