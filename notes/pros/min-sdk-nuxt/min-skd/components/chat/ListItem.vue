<template>
  <div class="chat__list__item" :class="[chat.me?'chat__list__item--me':'']">
    <span class="chat__list__item__avatar" v-if="!chat.me">
      <Avatar shape="square" icon="ios-person" />
    </span>
    <span class="chat__list__item__content">
      <span v-for="item of chat.content" :key="item.time">{{item.text}}</span>
    </span>
    <span class="chat__list__item__avatar" v-if="chat.me">
      <Avatar shape="square" icon="ios-person" />
    </span>
  </div>
</template>

<script>
export default {
  props: ["chat"]
};
</script>


<style>
.chat__list__item {
  display: flex;
  /* flex-flow: wrap; */
  margin: 10px 0;
}
.chat__list__item--me {
  justify-content: flex-end;
}
.chat__list__item__content {
  border: 1px solid #ddd;
  max-width: calc(100% - 40px);
  box-sizing: border-box;
}
.chat__list__item--me .chat__list__item__content {
  margin-left: 0;
  margin-right: 5px;
  background: chartreuse;
}

.chat__list__item .chat__list__item__content {
  margin-left: 5px;
}
.chat__list__item__avatar {
  width: 35px;
}
</style>