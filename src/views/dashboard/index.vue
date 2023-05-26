<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">工号: {{ id }}</div>
    <div class="dashboard-text">姓名: {{ name }}</div>
    <div class="dashboard-text">部门: {{ yuanxi }}</div> -->
    <div>请点击以下链接，阅读学校请假和考勤相关规定：</div>
    <div class="foot" style="color:#f0000f">
      <a href="https://hr.shu.edu.cn/info/1042/4217.htm" slot="reference">上海大学教职工请假和考勤制度的规定</a>
    </div>
    <h3>业务说明</h3>
    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" type="flex">

        <p>1. 请假类型包括：事假、病假、婚假、产假、丧假、因公出差、工伤假</p>
        <p>2. 事假包含因私出国（境）</p>
        <p>3. 产假包含男方配偶陪产假</p>
        <p>4. 因公出差包含因公外借、挂职锻炼、公派出国。公派出国需在系统关联PIM中已完成的因公出国（境）申请流程</p>
        <p>5. 中层干部及其他报备人员仍在PIM系统提交:</p>
        <p>→中层干部及其他报备人员因私出国(境)审批流程</p>
        <a href="https://pim.shu.edu.cn/infoplus/form/ZZBYinSiChuGuo/start"
          style="text-decoration:underline">(https://pim.shu.edu.cn/infoplus/form/ZZBYinSiChuGuo/start)</a>
        <p>→二级单位主要负责同志外出请假流程</p>
        <a href="https://pim.shu.edu.cn/infoplus/form/DBErJiDanWeiWaiChuQingJia/start"
          style="text-decoration:underline">(https://pim.shu.edu.cn/infoplus/form/DBErJiDanWeiWaiChuQingJia/start)</a>
      </el-col>
    </el-row>
    <!-- <div class="dashboard-text">身份权限: {{ role }}</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { example } from '@/api/example'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'id',
      'name',
      'yuanxi'
    ])
  },
  created () {
    /*
      data 对象是存储在前端的数据，一般请求的时候需要这个信息做验证查验，
      example调用的接口是get，所以没有传回后端
    */
    var data = {
      id: this.$store.getters.id, // 获取 store中的 id
      name: this.$store.getters.name, // 获取 store中的 name
      gender: this.$store.getters.gender, // 获取 store中的 gender
      role: this.$store.getters.role, // 获取 store中的 role
      yuanxi: this.$store.getters.yuanxi, // 获取 store中的 yuanxi 院系
      zyjszw: this.$store.getters.zyjszw,
      zyjsdj: this.$store.getters.zyjsdj,
      xzzj: this.$store.getters.xzzj,
      glgwzw: this.$store.getters.glgwzw,
      gw: this.$store.getters.gw
    }
    console.log("这里存储的是用户信息")
    console.log(data)
    // this.$store.commit('user/SET_NAME',"修改名字")
    // 调用 src/api/example.js 中写好的接口
    // example().then(response => {
    //   console.log("后端传回的数据")
    //   console.log(response)
    // })

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  // text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.foot {
  height: 20px;
  margin: 10px auto;
  font-size: 1.5em;
  text-decoration: underline;
  font-weight: bold;
  margin-bottom: 25px;
}
</style>
