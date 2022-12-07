<template>
  <div>
    <el-row class="row-box">
      <el-col :span="12">
        <div>审核人工号：<span>{{stepInfo.id}}</span></div>
      </el-col>
      <!-- <el-col :span="12">
        <div>审核人姓名：<span>测试人</span></div>
      </el-col> -->
    </el-row>
    <el-row class="row-box">
      <el-col :span="12">
        <div>审核人结果：<span>{{stepInfo.result}}</span></div>
      </el-col>
      <el-col :span="12">
        <div>审核时间：<span>{{stepInfo.time}}</span></div>
      </el-col>
    </el-row>
    <el-row class="row-box">
      <el-col :span="24">
        <div>审核人意见：<span>{{stepInfo.recommend}}</span></div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  name: "StepInfo",
  props: ["stepInfo"],
  watch: {

  },
  data () {
    return {
      step: ""
    }
  },
  mounted () {
    console.log(this.stepInfo)

  },
  methods: {
    getStepInfo () {

    }

  }



}
</script>

<style>
.row-box {
  margin-bottom: 20px;
}
</style>