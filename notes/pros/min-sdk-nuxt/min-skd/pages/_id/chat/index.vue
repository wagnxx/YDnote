<template>
  <div>
    <h3>chat page</h3>
    <h3>chat list</h3>

    <div>
      <span>输入昵称</span>
      <input type="text" id="input" ref="input" v-model="nick" />
      <Button @click="enterGroup">注册进群</Button>
      <Button @click="enterGroupChat">进入群聊</Button>
    </div>
    <div>
      <h3>user list (已注册,会加入默认大群)</h3>
      <p v-for="user of getRegisted" :key="user.id">nick:{{user.nick}} id:{{user.id}}</p>
    </div>
  </div>
</template>

<script>
import { configLocal } from "./configLocal";
import localforage from "localforage";
export default {
  data() {
    return {
      msgs: [],
      nick: "",
      socket: null,
      usrId: null,
      registerUsers: []
    };
  },
  computed: {
    getRegisted() {
      return this.registerUsers;
    }
  },
  methods: {
    registerSuccess(msg) {
      configLocal(localforage);
      window.localforage = localforage;
      console.log(msg);
      this.$store.commit("setUserId", msg.id);
      localforage.getItem("registerUsers").then(val => {
        let users = val;
        if (users) {
          users = [...users, msg];
        } else {
          users = [msg];
        }
        localforage.setItem("registerUsers", users);
        this.registerUsers = users;
      });
    },
    createId18Bit() {
      let str =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
      let result = "";
      for (let i = 0; i < 18; i++) {
        result += str.charAt(Math.floor(str.length * Math.random()));
      }
      return result;
    },
    enterGroup() {
      let userObj = {};
      userObj.id = this.createId18Bit();
      userObj.nick = this.nick;
      this.usrId = userObj.id;
      this.socket.emit("register", userObj);
    },
    enterGroupChat() {
      this.$router.push("/chat/chatDetail");
    },
    sendMsgSuccess(msg) {
      if(msg.id === this.usrId) {
        msg.me = true;
      }
      this.$store.commit("addChatList",msg);
    }
  },
  mounted() {
    import("socket.io-client").then(so => {
      const socket = so.default();
      window.socket = this.socket = socket;
      socket.on("register-success", this.registerSuccess);
      socket.on("sendMsg-success", this.sendMsgSuccess);
    });

    localforage.getItem("registerUsers").then(val => {
      this.registerUsers = val;
    });
  }
};
</script>

<style>
</style>