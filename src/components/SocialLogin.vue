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
      store.commit('setNewUser', response.data);
      //setUser(response.data);
      getCurrentUser(store.getters.getUserInfo);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

async function getCurrentUser(user){
  try {
    const response = await userServices.get(user.userId);
    //console.log(response.data);
    const backendUser = response.data;//does not include token for some reason
    const token = store.getters.getUserInfo?.token;//so get the token

    const reassembled_user = {//assemble the user with all of the pieces
      fName: response.data.fName,
      lName: response.data.lName,
      email: response.data.email,
      id: response.data.id,
      picture: response.data.picture,
      token: response.data.token,
      team_id: response.data.team_id,
      token: token,
      role: response.data.role,
    }
    //console.log(reassembled_user);
    store.commit('setNewUser', reassembled_user);//and put it in the store
    if(reassembled_user.role == "Unset")
    {
      //router.push({ name: "RoleSelect" });
      //console.log("Social Login Routed to RoleSelect"); //not needed because App.vue handles this
    }
    else
    {
      console.log("Social Login Routed to Home");
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
