<script setup>
import SocialLogin from "../components/SocialLogin.vue";
import userServices from "../services/userServices.js"
import teamServices from "../services/teamServices.js"
import { ref, onMounted } from "vue";
const currentProgress = ref(75);
const users = ref([])
const message = ref("")
const response = ref([])

const props = defineProps({
  objectId: { type: [Number, String]},
  objectName: { type: [Number, String]}
})
  function hideModal(){
      let modal = document.getElementById("deleteConfirm")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
  }
async function removeTeam(){
response.value = await teamServices.delete(props.objectId)
console.log(response)
 let modal = document.getElementById("deleteConfirm")
   modal.style.opacity = "0%"
   modal.style.top = "-100%"
}
</script>

<template>  
   
  <v-container>
    <h3>Remove {{ props.objectName }} ?</h3>
            <button @click = "removeTeam()">Remove</button>
     <button @click="hideModal()">Cancel</button>
  </v-container>
  
</template>
