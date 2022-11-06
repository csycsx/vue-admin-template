<template>
  <div>
    <el-row class="row-box">
      <el-col :span="12">
        <div>审核人工号：<span>20220000</span></div>
      </el-col>
      <el-col :span="12">
        <div>审核人姓名：<span>测试人</span></div>
      </el-col>
    </el-row>
    <el-row class="row-box">
      <el-col :span="12">
        <div>审核人结果：<span>通过</span></div>
      </el-col>
      <el-col :span="12">
        <div>审核时间：<span>2022-10-30</span></div>
      </el-col>
    </el-row>
    <el-row class="row-box">
      <el-col :span="24">
        <div>审核人意见：<span>准许</span></div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  name: "StepInfo",
  props: ["step"],
  watch: {
    step () {
      this.stepNum = this.step
      console.log(this.stepNum)
    }
  },
  data () {
    return {
      stepNum: "",
      stepInfo: ""
    }
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