<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
        <div>
            <h2>Who are you?</h2>
            <button @click="select('Coach')">Coach</button>
            <button @click="select('Athlete')">Athlete</button>
            <button @click="select('Other')">Other</button>
        </div>
        <div>
            <button @click="select('Done')">Done</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['close', 'select'])

function close() {
  emit('close')
}

function select(role) {
  emit('select', role)
}
</script>

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