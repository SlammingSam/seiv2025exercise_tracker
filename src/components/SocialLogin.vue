<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import store from "../store/store.js";
import userServices from "../services/userServices.js";
const message = ref("")
const router = useRouter();
const currentUser = ref([])
//const user = ref({});

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  //console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  let token = {
    credential: response.credential,
  };
  await AuthServices.loginUser(token)
    .then((response) => {
      Utils.setStore("user", response.data);
      store.commit('setLoginUser', response.data);
      //setUser(response.data);
      getCurrentUser(store.getters.getLoginUserInfo);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

async function getCurrentUser(user){
  while (!user || !user.userId) {//might need something like this in every single file now
    console.warn("getCurrentUser called without a valid user:", user);
    getCurrentUser(store.getters.getLoginUserInfo);
  }
  try {
    const response = await userServices.get(user.userId);
    currentUser.value = response.data;
    console.log(currentUser.value)
      console.log(currentUser.value.role)
      if(currentUser.value.role == "Unset"){
        router.push({ name: "RoleSelect" });
      }
      else{
        router.push({ name: "Home" });
      }
  }
  catch(error){
    message.value = "Error: " + (error.code || error.response?.status) + ":" + (error.message || error.response?.data);
    console.log(error);
  }
}

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
