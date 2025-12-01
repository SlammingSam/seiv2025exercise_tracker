import Utils from "../config/utils.js";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import store from "../store/store.js";
import userServices from "../services/userServices.js";

export default async function setRole(router, new_role, user){
    const new_user = {
        fName: user.fName,
          lName: user.lName,
          email: user.email,
          role: new_role
    }
    console.log("setRole.js - updating user role to: " + new_role);
    await userServices.update(user.userId, new_user)
     router.push({ name: "Home" });
}