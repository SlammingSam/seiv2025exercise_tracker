<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close'])
const emitClose = () => emit('close')

const props = defineProps({
    users: {
        type: Array,
        default: () => []
    }
})

// Checkbox selections
// Do I need to change how this is formatted?
// Once Julian gets assigning users to teams working, I can complete this implementation.
const selectedUserIds = ref([])
// Only show users with role "athlete"
const athletes = computed(() => {
    return props.users.filter(
        user => user.role.toLowerCase() === 'athlete' && user.team_id === null
    )
})

console.log(athletes.value);
</script>

<template>
    <div class="backdrop" @click.self="emitClose">
        <div class="modal">
            <h2>Assign Athletes</h2>
            <table v-if="athletes.length > 0">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="user in athletes" :key="user.id">
                        <td>
                            <input type="checkbox" :value="user.id" v-model="selectedUserIds" />
                        </td>
                        <td>{{ user.fName }} {{ user.lName }}</td>
                        <td>{{ user.email }}</td>
                    </tr>
                </tbody>
            </table>

            <p v-else>No athletes found.</p>

            <div style="margin-top: 20px;">
                <button @click="assignSelected">Assign Selected</button>
            </div>
            <div style="margin-top: 20px;">
                <button @click="emitClose">Close</button>
            </div>

        </div>
    </div>
</template>

<!-- Probrably put this in CSS-->
<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 400px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
}
</style>
