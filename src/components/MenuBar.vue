<script setup>
import ocLogo from "../public/oc-logo-white.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from 'vue-router';
import store from "../store/store.js";

const router = useRouter()
//const localUser = ref(Utils.getStore('user')); //need to import this here
//const store = useStore();
const user = store.getters.getLoginUserInfo;
const title = ref("Exercise Tracker");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const email = ref("")

const resetMenu = () => {
  if (user) {
    console.log(user);//null if you dont import user from the store as above
    initials.value = user.fName[0] + user.lName[0];
    name.value = user.fName + " " + user.lName;
    email.value = user.email;
  }
};

const logout = () => {
  console.log(user);
  if (!user.value) //needed this too in case of session mismatch
  {
    user.value = null;
    Utils.removeItem('token');
    store.commit('setLoginUser', null);
    router.push({ name: 'login' });
    return;
  }
  AuthServices.logoutUser(user.value)
    .then((response) => {
      //pushes correctly but its not reloading the bar?
      user.value = null;
      Utils.removeItem('token');
      //Utils.removeItem("user");
      store.commit('setLoginUser', null);
      //setUser(null);
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu(); //was a problem, has been erroring out because is recieves incorrect information, but now that is fixed
});
</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'tutorials' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          :transition="false"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user?.fName">
        <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="user?.fName">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">
                  {{ initials }}
                </span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
