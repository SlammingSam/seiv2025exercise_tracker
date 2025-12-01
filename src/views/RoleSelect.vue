<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import store from "../store/store.js";
import userServices from "../services/userServices.js";

const router = useRouter()
const user = store.getters.getLoginUserInfo;

async function setRole(new_role){
    const new_user = {
        fName: user.fName,
          lName: user.lName,
          email: user.email,
          role: new_role
    }
    console.log("running Function")
    await userServices.update(user.userId, new_user)
     router.push({ name: "Home" });
}
onMounted(() => {
  console.log(user);
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});
</script>

<template>  
  <v-container>
    <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
        <div>
            <h2>Who are you?</h2>
                <button class = "role-button" @click ="setRole('Coach')">Coach</button>
                <button class = "role-button" @click ="setRole('Athlete')">Athlete</button>
        </div>
        <div>
        </div>
    </div>
  </div>

  </v-container>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}
button {
  margin: 0.5rem;
}
</style>