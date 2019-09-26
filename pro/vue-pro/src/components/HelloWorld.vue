<template>
  <div class="page">
    <div class="tar">
      <Cascader width="100%" :data="data" :render-format="format"></Cascader>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          value: "zhejiang",
          label: "浙江",
          children: [
            {
              value: "hangzhou",
              label: "杭州",
              children: [
                {
                  value: "xihu",
                  label: "西湖",
                  code: 310000
                }
              ]
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "zhonghuamen",
                  label: "中华门",
                  code: 210000
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    format(labels, selectedData) {
      return labels[labels.length - 1];
      // debugger;
      const index = labels.length - 1;
      // const data = selectedData[index] || false;
      // if (data && data.code) {
      //   return labels[index] + " - " + data.code;
      // }
      // return labels[index];
      return "xx";
    }
  }
};
</script>
<style  scoped>
.page {
  width: 300px;
}
.tar {
  width: 60px;
  height: 33px;
  margin: 10%;
}
</style>