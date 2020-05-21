import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    chatList: [
      { id: 1, content: [{ time: "33", text: "hello !!" }], me: false },
      { id: 2, content: [{ time: "33", text: "hello word !!" }], me: false },
      { id: 3, content: [{ time: "33", text: "hello everyone !!" }], me: true }
    ],
    user: {
      id: null
    }
  },
  mutations: {
    addChatList(state, paylod) {
      state.chatList = [...state.chatList, { ...paylod }];
    },
    setUserId(state, paylod) {
      state.user.id = paylod;
    }
  }
});

export default () => store;
