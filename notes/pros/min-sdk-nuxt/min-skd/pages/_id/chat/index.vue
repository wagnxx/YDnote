<template>
  <div>
    <h3>chat page</h3>
    <Button @click="login">登录</Button>
    <h3>
      本人信息:
      昵称:{{nick}}
      id:{{usrId?usrId:'还没创建,请先注册'}}
    </h3>
    <h3>chat list</h3>

    <div>
      <span>输入昵称</span>
      <input type="text" id="input" ref="input" v-model="nick" />
      <Button @click.native.stop="registerenterGroup">注册进群</Button>
      <Button @click="enterGroupChat">进入群聊</Button>
    </div>
    <div>
      <List header="user list (已注册,会加入默认大群)">
        <ListItem v-for="user of getRegisted" :key="user.id">nick:{{user.nick}} id:{{user.id}}</ListItem>
      </List>
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

      registerUsers: []
    };
  },
  computed: {
    getRegisted() {
      return this.registerUsers;
    },
    usrId() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    login() {
      this.$store.commit("setUserId", {
        id: window.socket.id,
        name: this.nick
      });
    },
    registerSuccess(msg) {
      console.log(msg);

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
    registerenterGroup() {
      let userObj = {};
      userObj.id = this.usrId;
      userObj.nick = this.nick;

      localforage.getItem("registerUsers").then(val => {
        if (!val || val.every(el => el.id !== userObj.id)) {
          this.$store.commit("setUserId", { id: window.socket.id });
          this.socket.emit("register", userObj);
        } else {
          alert("已注册");
        }
      });
    },
    enterGroupChat() {
      this.$router.push("/chat/chatDetail");
    },
    sendMsgSuccess(msg) {
      if (msg.id === this.usrId) {
        msg.me = true;
      }
      this.$store.commit("addChatList", msg);
    }
  },
  mounted() {
    let _this = this;
    import("socket.io-client")
      .then(so => {
        const socket = so.default();

        window.socket = this.socket = socket;
        socket.on("register-success", this.registerSuccess);
        socket.on("sendMsg-success", this.sendMsgSuccess);
        // socket.on("connection", msg=>{
        //   debugger
        // });
      })
      .then(() => {
        this.$nextTick(() => {
          configLocal(localforage);
          window.localforage = localforage;

          localforage.getItem("registerUsers").then(val => {
            this.registerUsers = val;
          });
        });
      });
  }
};
</script>

<style>
</style>