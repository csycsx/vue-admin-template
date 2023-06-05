<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">详细信息</h2>
      <!-- 请假信息表单 -->
      <div class="info-box">
        <el-card class="box-card">
          <!-- <div slot="header" class="clearfix">
            <h3>详细信息</h3>
          </div> -->
          <h2>请假信息</h2>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">请假类型：<span class="content-box">{{detailInfo.leave.leaveType}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">请假起始时间：<span class="content-box">{{detailInfo.leave.leaveStartTime}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">请假原因：<span class="content-box">{{detailInfo.leave.leaveReason}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">请假结束时间：<span class="content-box">{{detailInfo.leave.leaveEndTime}}</span></div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">证明文件：
                <el-button type="primary" @click="downlode">预览证明材料</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">请假时长：<span class="content-box">{{leaveTime}}</span></div>
            </el-col>
          </el-row>
          <h2>销假信息</h2>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">部门审核情况：<span class="content-box">
                  <el-tag
                    :type="detailInfo.departmentStatus == 2 ? 'info' : detailInfo.departmentStatus == 1 ? 'success' : detailInfo.departmentStatus == 3 ? 'danger' :'primary'"
                    disable-transitions>{{  auditStatus[detailInfo.departmentStatus] }}</el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">返岗报到日期：<span class="content-box">{{detailInfo.revokeReportTime}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="12">
              <div class="name-box">人事处审核情况：<span class="content-box">
                  <el-tag
                    :type="detailInfo.hrStatus == 2 ? 'info' : detailInfo.hrStatus == 1 ? 'success' : detailInfo.hrStatus == 3 ? 'danger' :'primary'"
                    disable-transitions>{{  auditStatus[detailInfo.hrStatus] }}</el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="name-box">销假提交日期：<span class="content-box">{{detailInfo.revokeSubmitTime}}</span></div>
            </el-col>
          </el-row>

        </el-card>
      </div>
      <div class="check-box" v-if="queryData.isShow">
        <el-form ref="form" :model="audit" label-width="80px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="audit.result">
              <el-radio label="通过"></el-radio>
              <el-radio label="不通过"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="audit.recomment"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="check-finish" v-else>
        <i class="el-icon-success"></i>
        温馨提示：您已完成审核，无需再审核！
      </div>

    </div>

  </div>

</template>

<script type="text/ecmascript-6">
import { init } from 'events';
import { getRevokeDetailById } from "../../api/apply"
import { addRevokeAudit } from "../../api/audit"
import { getReferenceLeaveDay } from "@/api/apply"
export default {
  data () {
    return {
      queryData: '',
      detailInfo: {},
      auditStatus: ["未审核", "审核通过", "无需审核", "审核不通过"],
      audit: {
        result: "",
        recomment: "",
      },
      leaveTime: ""


    }
  },
  created () {
    this.queryData = this.$route.query;
    //  this.initDate();

  },
  mounted () {
    this.detailInfo = JSON.parse(window.sessionStorage.getItem('revokeDetail'));
    this.getTime();
    this.initStatus();

  },
  methods: {
    downlode () {
      var url = this.detailInfo.leave.leaveMaterial.replace("/leaveMaterial", "")
      window.open(url);


    },
    getTime () {
      console.log("111111Time");
      getReferenceLeaveDay({
        "leave_start_time": this.detailInfo.leave.leaveStartTime,
        "leave_end_time": this.detailInfo.leave.leaveEndTime,
        "leave_type": this.detailInfo.leave.leaveType
      }).then(res => {
        if (res.code === 200) {
          this.leaveTime = res.data + '天';
        }
      })

    },
    initDate () {
      getRevokeDetailById({ "revoke_id": this.queryData.id }).then(res => {
        if (res.code === 200) {
          this.detailInfo = res.data;
          this.initStatus();
        }
      })
    },
    initStatus () {
      if (this.detailInfo.status === "2") {
        if (this.detailInfo.departmentStatus === "0") this.detailInfo.departmentStatus = "3";
        else this.detailInfo.hrStatus = "3";
      }
    },
    onSubmit () {
      console.log("点击提交")
      let role = this.$store.getters.role_num;
      let userid = this.$store.getters.id;
      addRevokeAudit({
        "id": this.detailInfo.id,
        "recommend": this.audit.recomment,
        "result": this.audit.result,
        "role": role,
        "user_id": userid
      }).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          this.$message({
            message: '审核成功',
            type: 'success'
          });
          if (role === "1" || role === "2") {
            this.$router.push({
              name: 'DpRevokeList'
            });
          }
          else if (role === "3" || role === "4") {
            this.$router.push({
              name: 'HrRevokeList'
            });
          }
        }
        else {
          this.$message.error(res.message);
        }
      })
    },
  }

}
</script>

<style scoped>
.container {
  /* background-color: #f5f7fa; */
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
  padding-left: 10rem;
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
}
.content-box {
  color: #5c5a5a;
  font-weight: 600;
}
.check-box {
  width: 80%;
}

.check-finish {
  width: 80%;
  color: #67c23a;
}
</style>
