<template>
  <div>
    <h3>perfomance</h3>
    <List border size="small">
      <ListItem v-for="(val, key, index) in timing" :key="index">
        <strong>{{val[0]}}</strong>
        <span style="margin:0 5px">:</span>
        <em>{{val[1]}}</em>
      </ListItem>

      <div slot="header">
        <span>
          已上传
          <span>4</span>
          次 (一天最多上传{{count}}次)
        </span>
        <Button type="primary" @click="uploadInfo">Force upload</Button>
      </div>
    </List>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timing: [],
      count: 5
    };
  },
  methods: {
    uploadInfo() {
      let _this = this;
      this.$Modal.confirm({        
        title:'温馨提示',
        content: "确定要上传吗，一天只有5次提交机会哦！",
        onOk:()=>{
          this.$Message.info("开始上传");
          next();
        },
        render:h=>{
          return h('div',{style:'color:red'},'请确定好以下列表信息无误')
        }
      });

      function next() {
        // begin 
        setTimeout(()=>{
          _this.$Message.info("上传完成");
        },2000)
        
      }
    }
  },
  mounted() {
    let timing = performance.timing;
    // Object.keys(tim).forEach(k=>{
    //   this.timing[k] = tim[k];
    // });
    // this.$set(this.timing, "timing", tim);
    for (let item in timing) {
      if (typeof timing[item] != "function")
        this.timing.push([item, timing[item]]);
    }
    // this.timing = tim;
  }
};
</script>