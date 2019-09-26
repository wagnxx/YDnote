import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    groupList: []
  },
  getters: {
    getGroupList(state) {
      return state.groupList;
    }
  },
  mutations: {
    setGroup(state, payload) {
      state.groupList = payload;
    }
  }
});

export default store;
