import { createStore } from "vuex";
import Utils from "../config/utils";
import { ref } from 'vue';

const user = Utils.getStore('user');

const store = createStore({
  state: {
    loginUser: user || null,
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginUser = user ? { ...user } : null;//... is called the spread operator, it makes a shallow clone object of another object,
      if(user) Utils.setStore('user', user);      //    bit of a wierd fix since I just need vue to see a new object to trigger the watch function
      else Utils.removeItem('user');              //    otherwise the value of a nested object changing would not trigger the watch
    },
  },
  actions: {
    updateUserRole({ commit, getters }, newRole) {//apperently setters in not something I can add so this is in here
      const currentUser = getters.getUserInfo;
      const updatedUser = { ...currentUser, role: newRole };
      commit('setLoginUser', updatedUser);
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
      //console.log(state?.loginUser?.role);//role no longer returned here
      if(state?.loginUser?.email != null)
        return true;
      else
        return false;
  },
  },
});

export default store;
