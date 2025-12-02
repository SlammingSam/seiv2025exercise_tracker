import { createStore } from "vuex";
import Utils from "../config/utils";
import { ref } from 'vue';

const user = Utils.getStore('user');

const store = createStore({
  state: {
    loginUser: user || null,
  },
  mutations: {
    setNewUser(state, user) {
      state.loginUser = user ? { ...user } : null;//... is called the spread operator, it makes a shallow clone object of another object,
      if(user)                                    //    bit of a wierd fix since I just need vue to see a new object to trigger the watch function
        Utils.setStore('user', user);             //    otherwise the value of a nested object changing would not trigger the watch
      else 
        Utils.removeItem('user');
      //console.log("New user set: " + user.value);
    },
  },
  actions: {
    updateUserRole({ commit, getters }, newRole) {//apperently setters in not something I can add so this is in here
      const currentUser = getters.getUserInfo;
      const updatedUser = { ...currentUser, role: newRole };
      //console.log("triggered update");
      commit('setNewUser', updatedUser);
    }
  },
  getters: {
    getUserRole(state) 
    {
      return state.loginUser?.role || null;
    },
    getUserInfo(state) 
    {
      return state.loginUser;
    },
    isLoggedIn(state) 
    {
      if(state?.loginUser?.role == "Athlete" || state?.loginUser?.role == "Coach")
        return true;
      else
        return false;
    },
  },
});

export default store;
