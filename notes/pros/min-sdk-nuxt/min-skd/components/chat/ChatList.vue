<template>
  <div class="chat__list">
    <ListItem v-for="(chat,index) of chatList" :key="chat.id+'_'+index" :chat="chat" />
  </div>
</template>

<script>
import ListItem from "./ListItem";
export default {
  props: ["chatList"],
  components: {
    ListItem
  }
};
</script>
