<template>
  <div id="app">
    <ul class="sider">
      <router-link to="/relation">多级联动</router-link>
      <router-link to="/smartSync">smartSync</router-link>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  display: flex;
}
.sider {
  width: 140px;
  border-right: 1px solid #ddd;
  text-align: center;
  padding-top: 20px;
  height: 100vh;
}
.content {
  flex: 1;
}
</style>
