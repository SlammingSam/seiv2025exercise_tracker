<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import store from "../store/store.js";

const user = store.getters.getLoginUserInfo;
const router = useRouter();
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
      router.push({ name: "Home" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

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
