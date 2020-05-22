<template>
  <div class="chatDetailPage">
    <div class="chatList">
      <ChatList :chatList="chatList" />
    </div>
    <div class="footerInput">
      <Input type="text" v-model="val"  @on-enter="sendMsg" />
      <Button type="primary" @click="sendMsg">提交</Button>
    </div>
    <!-- <Affix :offset-bottom="0"> 
    </Affix>-->
  </div>
</template>

<script>
import ChatList from "@/components/chat/ChatList";
export default {
  components: {
    ChatList
  },
  data() {
    return {
      val: ""
      // chatList: this.$store.state.chatList
    };
  },
  computed: {
    getId() {
      return this.$store.state.user.id;
    },
    chatList() {
      return this.$store.state.chatList;
    }
  },
  methods: {
    sendMsg() {
      let chat = {};
      chat.content = [{ text: this.val, time: new Date() }];
      chat.id = this.getId;
      chat.name = this.$store.state.user.name;

      window.socket.emit("sendMsg", chat);
      console.log("send ", chat);
      this.val = "";
    }
  }
};
</script>

<style scoped>
.chatDetailPage {
  height: 100%;
  position: relative;
}
.footerInput {
  /* border:1px solid; */
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
}
.footerInput input {
  /* margin-right: 19px; */
}
.chatList {
  height: calc(100% - 36px);
  overflow-y: auto;
}
</style>