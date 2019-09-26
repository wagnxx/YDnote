<template>
  <div>
    <h1>group list</h1>
    <div class="list" v-if="getGroupList.length>0">
      <div
        class="item"
        v-for="(group,idx) in getGroupList"
        :key="idx"
        @click="enterMYPRO(group)"
      >{{group.name}}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["getGroupList"])
  },
  methods: {
    enterMYPRO(group) {
      // this.$parent.setTitle(group.id);
      this.$router.push({ name: "myPro", params: { id: group.id } });
    }
  },
  mounted() {
    // console.log(this.$store.state.groupList);
    // this.groupList = this.$parent.getGroupList();
  }
};
</script>

<style>
.list {
  border: 1px solid #ddd;
  padding: 3%;
  display: flex;
}
.item {
  margin: 10px;
  width: 100px;
  height: 200px;
  border: 1px solid #ddd;
}
</style>