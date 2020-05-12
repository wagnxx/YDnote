
<template>
  <div class="container">
    <div>
      <h1 class="subtitle">min-skd</h1>

      <div class="links">
        <router-link to="/about">about</router-link>
        <router-link to="/user">user</router-link>
        <router-link to="/perfomance">perfomance</router-link>
      </div>
      <div class="content">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>



<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  padding: 0 14px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
  display: flex;
  justify-content: space-around;
  align-content: center;
  max-width: 400px;
  border: 1px solid #ddd;
}
.content{
  padding: 10px;
}
</style>


 
<script>
// export default {
//   validate({ params }) {
//     // 必须是number类型
//     // return /^\d+$/.test(params.id)
//     return true;
//   }
// };
//
</script>
