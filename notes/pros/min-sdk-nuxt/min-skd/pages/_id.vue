
<template>
  <div class="container">
    <!-- <h1 class="subtitle">min-skd</h1> -->
    <div class="content">
      <nuxt-child />
    </div>
    <Affix :offset-bottom="0">
      <div class="links">
        <router-link class="links__item" active-class="links__item--active"  to="/about">about</router-link>
        <router-link class="links__item" active-class="links__item--active"  to="/user">user</router-link>
        <router-link class="links__item" active-class="links__item--active"  to="/perfomance">perfomance</router-link>
        <router-link class="links__item" active-class="links__item--active"  to="/chat">chat</router-link>
      </div>
    </Affix>
  </div>
</template>



<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  /* padding: 0 14px; */
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  /* padding-top: 15px; */
  display: flex;
  justify-content: space-around;
  align-content: center;
  /* max-width: 400px; */
  border: 1px solid #ddd;
  background: #fff;
}
.links .links__item{
  padding: 8px 0;
  color: #333;
}
.links .links__item.links__item--active{
  padding: 8px 0;
  color: yellowgreen;
  text-decoration: underline;
}
.content {
  padding: 8px;
  height: calc(100vh - 36px);
  overflow-y: auto;
  border:1px solid #f00;
}
</style>

