<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">请假申请审核进度</h2>
      <!-- 审核步骤 -->
      <div class="box-step">
        <el-steps :active=active finish-status="success" align-center>

          <el-step title="部门人事初审"></el-step>
          <el-step title="部门负责人审核"></el-step>
          <el-step v-if="step>2" title="人事处科员初审"></el-step>
          <el-step v-if="step>2" title="人事处负责人审核"></el-step>
          <el-step v-if="step>4" title="校领导审核"></el-step>
        </el-steps>
      </div>
      <!-- 请假信息表单 -->
      <div class="info-box">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>请假详细信息</h3>
          </div>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">工号：<span class="content-box">{{info.user.userId}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">姓名：<span class="content-box">{{info.user.userName}}</span></div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">学院：<span class="content-box">{{info.user.yuanXi}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">请假起始时间：<span class="content-box">{{info.leaveStartTime}}</span></div>
            </el-col>

          </el-row>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">请假类型：<span class="content-box">{{info.leaveType}}</span></div>
            </el-col>

            <el-col :span="12">
              <div class="name-box">请假结束时间：<span class="content-box">{{info.leaveEndTime}}</span></div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="24">
              <div class="name-box">请假原因：<span class="content-box">{{info.leaveReason}}</span></div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="24">
              <div class="name-box">证明文件：<span class="content-box" @click="downlode">{{info.leaveMaterial}}</span></div>
            </el-col>
          </el-row>

        </el-card>
      </div>
      <!-- 审核结果 -->
      <div class="check-box">
        <el-form ref="form" :model="check" label-width="80px" class="check-form">
          <el-form-item label="审核结果">
            <el-radio-group v-model="check.result">
              <el-radio label="通过"></el-radio>
              <el-radio label="不通过"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="check.recomment"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { init } from 'events';
import { SingleleaveAudit } from "../../api/audit";

export default {
  data () {
    return {
      role: "",
      userid: "",
      info: {},
      step: 2,
      active: 0,
      department_status: "",
      hr_status: "2022-3-5",
      school_stauts: "2022-2-22",
      check: {
        result: "",
        recomment: "",

      }

    }
  },
  created () {
    //let yuanxi = this.$store.getters.yuanxi
    let yuanxi = "校办公室"
    //let yuanxi = this.$store.getters.yuanxi
    this.role = "1";
    this.userid = "20222222";



  },
  mounted () {
    this.info = this.$route.params.info;
    console.log(this.info)
    this.init();
  },
  methods: {
    downlode () {
      let a = document.createElement('a');
      a.href = this.leave_material
      a.click();
    },
    onSubmit () {
      // let data = {
      //   "id": this.info.id,
      //   "recommend": this.check.recomment,
      //   "result": this.check.result,
      //   "role": this.role,
      //   "userid": this.userId
      // }
      // console.log(data);
      SingleleaveAudit({
        "id": this.info.id,
        "recommend": this.check.recomment,
        "result": this.check.result,
        "role": this.role,
        "userid": this.userid
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          console.log(res.data);
          this.$message({
            message: '审核成功',
            type: 'success'
          });
          if (this.role === "1" || this.role === "2") {
            this.$router.push({
              name: 'DpAuditList'
            });
          }
          else if (this.role === "3" || this.role === "4") {
            this.$router.push({
              name: 'HrAuditList'
            });
          }
          else {
            this.$router.push({
              name: 'ScAuditList'
            });
          }
        }
        else {
          this.$message.error(res.message);
        }
      })
    },

    init () {
      if (this.info.hrStatus !== "2") this.step += 2;
      if (this.info.schoolStatus !== "2") this.step += 1;
      console.log(this.step);
      // if(this.step===2){
      //   if(this.info.hrStatus)
      // }


    }
  },
}
</script>

<style scoped>
.container {
  background-color: #f5f7fa;
  padding: 16px;
}
.box {
  display: flex;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  flex-direction: column;
  align-items: center;
}
.box-title {
  margin: 0;
  padding: 20px;
  text-align: center;
}
.box-step {
  margin-top: 20px;
  width: 80%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card ::v-deep .el-card__header {
  border-bottom: 1.5px solid #ebeef5;
  width: 100%;
}

.box-card div h3 {
  font-size: 22px;
  font-weight: 700;
  color: #304156;
  margin: 0 auto;
  text-align: center;
}

.box-card ::v-deep .el-card__body {
  margin: 0 20px;
}
.info-box {
  width: 100%;
  padding: 20px;
}
.row-box {
  margin-bottom: 20px;
}

.name-box {
  font-size: 14px;
  font-weight: 600;
  margin-left: 200px;
}
.content-box {
  color: #5c5a5a;
  font-weight: 600;
}
.check-box {
  width: 80%;
}
</style>
