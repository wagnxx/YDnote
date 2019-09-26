<template>
  <div>
    <h3>我的文件列表</h3>
    <div>
      <span>选择的id为：</span>
      <span>{{groupId}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupId: null
    };
  },
  mounted() {
    this.groupId = this.$route.params.id;
  }
};
</script>

<style>
</style>