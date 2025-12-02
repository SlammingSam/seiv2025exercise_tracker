<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store/store.js";
import RoleModal from "../components/RoleModal.vue";

const router = useRouter();
const user = store.getters.getLoginUserInfo;

onMounted(() => {
  console.log(user);
  let menu = document.getElementById("menu");
  menu.style.top = "-12vh";
});

const isModalVisible = ref(false);

function openModal() {
  isModalVisible.value = true;
  console.log("openModal ->", isModalVisible.value);
}
function closeModal() {
  isModalVisible.value = false;
  console.log("closeModal ->", isModalVisible.value);
}
</script>

<template>
  <v-container>
    <RoleModal :user="user" @close="closeModal" />
  </v-container>
</template>
