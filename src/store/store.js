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
      state.loginUser = user;
      if (user) Utils.setStore('user', user);
      else Utils.removeItem('user');
    },
  },
  actions: {},
  getters: {
    getLoginUserInfo(state) {
      return state.loginUser;
    },
  },
});

export default store;
