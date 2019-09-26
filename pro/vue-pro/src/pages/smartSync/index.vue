<template>
  <div>
    <header>
      <span>{{title}}</span>
      <span>header</span>
    </header>
    <div class="con">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axiox from "axios";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "我的项目"
    };
  },
  methods: {
    ...mapGetters(["getGroupList"]),
    ...mapMutations(["setGroup"]),
    setTitle(title) {
      this.title = title;
    },
    async setPageData() {
      await this.setGroupList();
      const groupId = this.$route.params.id;
      const group = this.getGroupList().find(group => group.id == groupId);
      if (group) {
        this.setTitle(group.name);
      } else {
        this.setTitle("我的项目");
      }
    },
    async setGroupList() {
      const groupList = await this.request("http://localhost:3003/groupList");
      this.setGroup(groupList);
    },
    async request(url) {
      return new Promise((resolve, reject) => {
        axiox.get(url).then(res => {
          resolve(res.data.groupList);
        });
      });
      //   return new Promise((resolve, reject) => {
      //     const xhr = new XMLHttpRequest();
      //     xhr.open("get", url);
      //     xhr.onreadystatechange = function(res) {
      //       if (xhr.readyState == 4 && xhr.status == 200) {
      //         var data = xhr.responseText;
      //         console.log(JSON.parse(data));
      //         resolve(data, this);
      //       } else {
      //         reject(xhr.responseText);
      //       }
      //     };
      //     xhr.send();
      //   });
    }
  },
  mounted() {
    this.setPageData();
    // const groupId = this.$route.params.id;
    // this.setTitle(groupId);
    // debugger;
  },
  watch: {
    ["$route.fullPath"](nr, or) {
      if (nr) {
        const groupId = nr.params.id;
        const group = this.getGroupList().find(group => group.id == groupId);
        if (group) {
          this.setTitle(group.name);
        } else {
          this.setPageData();
        }
      }
    }
  }
};
</script>

<style>
header {
  border-bottom: 1px solid;
  display: flex;
  height: 66px;
  justify-content: space-between;
  align-items: center;
}
</style>