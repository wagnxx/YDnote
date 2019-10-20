<template>
  <div class="hello">
    <div class="block">
      <span class="demonstration">默认</span>
      <el-date-picker
        v-model="value6"
        type="daterange"
        range-separator="- "
        :start-placeholder="ps|dateFormatC"
        :end-placeholder="pe|dateFormatC"
        format="yyyy 年 MM 月 dd 日"
        :default-value="[Date.now()]"
        value-format="yyyy/MM/dd"
        @change="changeHandler"
      ></el-date-picker>
    </div>
    <div>
      <h3>time list</h3>
      <ul>
        <li v-for="(item ,idx) in getProByTime" :key="idx">
          {{item.name}}
          -----
          {{item.time}}
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    const today = new Date();
    const y=today.getFullYear();
    const m=today.getMonth();
    const d=today.getDate();
    return {
      value6: "",
      ps: new Date(y,m,d-7),
      pe: new Date(y,m,d+7),
      // ps:Date.now() -7*24*60*60*1000,
      // pe:(Number(Date.now()) +7*24*60*60*1000),
      proList:[
        {name:'item1',time:'2019-4-10'},
        {name:'item2',time:'2019-5-10'},
        {name:'item3',time:'2019-6-10'},
        {name:'item4',time:'2019-7-10'},
        {name:'item5',time:'2019-8-22'},
        {name:'item6',time:'2019-9-10'},
        {name:'item7',time:'2019-10-10'},
        {name:'item8',time:'2019-11-10'},
      ]
    };
  },
  filters: {
    dateFormatC(v) {
      let date = new Date(v);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      return `${y}-${m}-${d}`;
    }
  },
  computed:{
    getProByTime(){
      return this.proList.filter(item=>{
        let time=item.time;
        if(this.value6=='') return item;
        let [start,end] = this.value6;
        if( this.compaireDate(time,start)&&this.compaireDate(end,time)){
          return item;
        }
      });
    }
  },
  methods: {
    changeHandler(v1, v2) {
      console.log(v1, v2);
      console.log(this.value6)
    },
    compaireDate(s1, s2) {
      const start = new Date(s1);
      const end = new Date(s2);
      if (!(start instanceof Date)) {
        console.warn("s1参数必须是date类型");
        return;
      }
      if (!(end instanceof Date)) {
        console.warn("s2参数必须是date类型");
        return;
      }

      return start > end;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
