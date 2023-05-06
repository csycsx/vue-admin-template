<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">个人请假详情信息</h2>

      <el-card>
        <div class="top-down-container">

          <!-- 所需审核步骤 -->
          <div class="box-step top-container">
            <el-steps :active="currentStep" :process-status="stepFinishStep" finish-status="success" align-center>
              <el-step title="部门初审" description="" v-if="totalStep>0"></el-step>
              <el-step title="部门审核" description="" v-if="totalStep>0"></el-step>
              <el-step title="人事处初审" description="" v-if="totalStep>2"></el-step>
              <el-step title="人事处审核" description="" v-if="totalStep>2"></el-step>
              <el-step title="校领导审核" description="" v-if="totalStep>4"></el-step>

            </el-steps>
          </div>

          <!--       请假信息表单-->
          <div class="down-container">

            <div class="info-box">

              <el-row class="row-box">
                <el-col :span="12">
                  <div class="name-box">请假类型：<span class="content-box">{{detailInfo.leaveType}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="name-box">请假起始时间：<span class="content-box">{{detailInfo.leaveStartTime}}时</span></div>
                </el-col>
              </el-row>

              <el-row class="row-box">

                <el-col :span="12">
                  <div class="name-box">请假原因：<span class="content-box">{{detailInfo.leaveReason}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="name-box">请假结束时间：<span class="content-box">{{detailInfo.leaveEndTime}}时</span></div>
                </el-col>
              </el-row>
              <el-row class="row-box">
                <el-col :span="12">
                  <div class="name-box">证明材料：<el-button type="primary" @click="downlode">预览证明材料</el-button></div>
                  <!-- <div class="name-box">证明材料：<span class="content-box">{{detailInfo.leaveMaterial}}</span></div> -->
                </el-col>
                <!-- <el-col :span="12">
                  <div class="name-box">
                    <el-button type="primary" @click="downlode">预览证明材料</el-button>
                  </div>
                </el-col> -->
              </el-row>
            </div>
            <el-button class="button-box" type="primary" v-if="detailInfo.status==1" @click="exportWord">导出文档
            </el-button>
          </div>
        </div>
      </el-card>
      <div class="revoke-box" v-if="detailInfo.status==1">
        <el-form ref="form" :model="revoke" label-width="80px">
          <el-form-item label="销假时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="revoke.revoke_report_time">
            </el-date-picker>
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
import { getLeaveDetail, addRevokeRecord, findRevokeByLeaveId } from "@/api/apply"
import { getCurrentAuditMsg } from "../../api/audit";
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

export default {
  data () {
    return {
      queryData: '',
      detailInfo: {},
      totalStep: 0,
      currentStep: 0,
      stepFinishStep: 'success',
      revoke: {
        revoke_report_time: "",
      },
      revokeStatus: '',
      revokeInfo: '',
      stepInfo: {},

    }
  },
  created () {

  },
  mounted () {
    this.queryData = this.$route.query;
    this.initData();
  },
  methods: {
    /**
     * 网络请求详情信息
     */
    initData () {
      getLeaveDetail(this.queryData).then(res => {
        if (res.code === 200) {
          this.detailInfo = res.data;
          console.log(this.detailInfo)
          this.initAuditFlow();
        }
      })
      findRevokeByLeaveId({ "leave_id": this.queryData.id }).then(res => {
        if (res.code === 200) {
          this.revokeStatus = res.data.resultCode;
          this.revokeInfo = res.data.result;
        }
      })
      getCurrentAuditMsg({ "leave_id": this.queryData.id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.stepInfo = res.data;
        }
      })
    },


    /**
     * 判断审核流程，有几个阶段，处于什么阶段
     */
    initAuditFlow () {
      this.judgeDepartAuditFlow();
      this.judgeHrAuditFlow();
      this.judgeSchoolAuditFlow();
      this.judgeTotalStatus();
    },

    /**
     * 判断部门审核当前进度状态
     */
    judgeDepartAuditFlow () {
      let departStatus = this.detailInfo.departmentStatus;
      if (departStatus == 2) {
        this.totalStep = 0;
      } else {
        this.totalStep = 2;
      }

      if (departStatus == 0) {
        this.currentStep = 0;
      } else if (departStatus == 3) {
        this.currentStep = 1;
      } else if (departStatus == 1) {
        this.currentStep = 2;
      }
    },

    /**
     * 判断Hr审核当前进度状态
     */
    judgeHrAuditFlow () {
      let hrStatus = this.detailInfo.hrStatus;
      if (hrStatus != 2) {
        this.totalStep = 4;
      } else {
        return;
      }

      if (hrStatus === 3) {
        this.currentStep = 3;
      } else if (hrStatus == 1) {
        this.currentStep = 4;
      }
    },

    /**
     * 判断School审核当前进度状态
     */
    judgeSchoolAuditFlow () {
      let schoolStatus = this.detailInfo.schoolStatus;
      if (schoolStatus != 2) {
        this.totalStep = 5;
      } else {
        return;
      }
      if (schoolStatus == 1) {
        this.currentStep = 5;
      }
    },

    /**
     * 判断总体状态，是否被拒绝
     */
    judgeTotalStatus () {
      let totalStatus = this.detailInfo.status;
      if (totalStatus == 2) {
        this.stepFinishStep = 'error'
      } else if (totalStatus == 3) {
        this.stepFinishStep = 'error'
      } else {
        this.stepFinishStep = 'finish'
      }
    },

    downlode () {
      var url = this.detailInfo.leaveMaterial.replace("/leaveMaterial", "")

      window.location.href = url

    },
    getDate (myDate) {
      var Y = myDate.getFullYear();   //获取当前完整年份
      var M = myDate.getMonth() + 1;  //获取当前月份
      var D = myDate.getDate();   //获取当前日1-31
      var H = myDate.getHours();  //获取当前小时
      var i = myDate.getMinutes();    //获取当前分钟
      var s = myDate.getSeconds();    //获取当前秒数
      // 月份不足10补0
      if (M < 10) {
        M = '0' + M;
      }
      // 日不足10补0
      if (D < 10) {
        D = '0' + D;
      }
      // 小时不足10补0
      if (H < 10) {
        H = '0' + H;
      }
      // 分钟不足10补0
      if (i < 10) {
        i = '0' + i;
      }
      // 秒数不足10补0
      if (s < 10) {
        s = '0' + s;
      }
      var date = Y + '-' + M + '-' + D + ' ' + H + ':' + i + ':' + s;
      return date;

    },

    onSubmit () {
      if (this.revokeStatus == 0) {
        let nowDate = new Date();
        let revoke_submit_time = this.getDate(nowDate);
        let revoke_report_time = this.getDate(this.revoke.revoke_report_time);
        let user_id = this.$store.getters.id;
        console.log(revoke_submit_time);
        addRevokeRecord({
          "leave_id": this.detailInfo.id,
          "revoke_report_time": revoke_report_time,
          "revoke_submit_time": revoke_submit_time,
          "user_id": user_id,
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            console.log(res.data);
            this.$message({
              message: '销假申请成功',
              type: 'success'
            });
            this.$router.push({
              name: 'RevokeRecord'
            })
          }
          else {
            this.$message.error(res.message);
          }
        })
      }
      else if (this.revokeStatus == 1) {
        this.$message({
          message: '您已提交过销假申请',
          type: 'warning'
        });
        this.$router.push({
          name: 'DetailedRevoke',    // 详情页传入行参数
          query: {
            id: this.revokeInfo.id,
          }
        })

      }

    },
    getWordData () {
      let data = {};
      data.id = this.$store.getters.id;
      data.department = this.$store.getters.yuanxi;
      data.name = this.$store.getters.name;
      data.p_type = this.$store.getters.p_type;
      data.leaveType = this.detailInfo.leaveType;
      data.sY = this.detailInfo.leaveStartTime.substring(0, 4);
      data.sM = this.detailInfo.leaveStartTime.substring(5, 7);
      data.sD = this.detailInfo.leaveStartTime.substring(8, 10);
      data.eY = this.detailInfo.leaveEndTime.substring(0, 4);
      data.eM = this.detailInfo.leaveEndTime.substring(5, 7);
      data.eD = this.detailInfo.leaveEndTime.substring(8, 10);
      data.leaveReason = this.detailInfo.leaveReason;
      if (this.detailInfo.departmentStatus !== "2" && this.stepInfo.departmentAuditMsg !== "尚未进行部门审核") {
        data.departmentResult = this.stepInfo.departmentAuditMsg.dpLeaderResult + ',' + this.stepInfo.departmentAuditMsg.dpLeaderRecommend;
      }
      if (this.detailInfo.hrStatus !== "2" && this.stepInfo.hrAuditMsg !== "尚未进行人事处审核") {
        data.hrResult = this.stepInfo.hrAuditMsg.hrLeaderResult + ',' + this.stepInfo.hrAuditMsg.hrLeaderRecommend;
      }
      if (this.detailInfo.schoolStatus !== "2" && this.stepInfo.schoolAuditMsg !== "尚未进行校领导审核") {
        data.scResult = this.stepInfo.schoolAuditMsg.scLeaderResult + ',' + this.stepInfo.schoolAuditMsg.scLeaderRecommend;
      }
      console.log('111' + data);
      return data;
    },
    //导出文档
    exportWord () {
      let that = this;
      let data = that.getWordData();
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent("上海大学教职工请假申请表模板.docx", function (error, content) {
        // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new docxtemplater().loadZip(zip);
        // 设置模板变量的值

        doc.setData(data);
        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, "上海大学教职工请假申请表.docx");
      });
    }

  },
}
</script>

<style scoped>
.container {
  background-color: #f5f7fa;
  padding: 16px;
  margin-left: 20px;
  margin-right: 20px;
}

.top-down-container {
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.top-container {
  width: 80%;
  margin: 0 auto;
  flex: 1;
  padding-top: 10px;
}

.down-container {
  width: 80%;
  margin: 0 auto;
  padding-top: 26px;
  flex: 1;
}

.box-title {
  margin: 0;
  padding: 20px;
  text-align: center;
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

.box-card ::v-deep .el-card__body {
  margin: 0 20px;
}

.info-box {
  /*width: 100%;*/
  padding: 20px;
}

.row-box {
  margin-bottom: 20px;
}

.name-box {
  font-size: 14px;
  font-weight: 600;
  /*margin-left: 200px;*/
}

.content-box {
  color: #5c5a5a;
  font-weight: 600;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.button-box {
  float: right;
}

.revoke-box {
  padding: 20px 0 0 20px;
  width: 80%;
}
</style>
