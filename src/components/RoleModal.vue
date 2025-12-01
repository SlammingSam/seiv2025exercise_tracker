<script setup>
import { useRouter } from "vue-router";
import setRole from "./SetRole.js";

const props = defineProps({
  user: { type: Object, default: null }, // User prop that is passed in
});

const emit = defineEmits(["select", "close"]);
const router = useRouter();

async function select(role) {
  // function to handle role selecting
  if (props.user) {
    try {
      await setRole(router, role, props.user);
    } catch (e) {
      console.error("RoleModal: setRole failed", e); // log if there was an error
    }
  }
  emit("select", role);
  emit("close");
}

function close() {
  // close, self explanatory
  emit("close");
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Choose Role:</h2>
      <button @click="select('Coach')">Coach</button>
      <button @click="select('Athlete')">Athlete</button>
    </div>
  </div>
</template>

<!-- Putting things in a style here because I'm lazy
 -S -->
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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
