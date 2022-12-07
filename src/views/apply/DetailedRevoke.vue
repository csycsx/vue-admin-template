<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">个人销假详情信息</h2>
      <el-card>
        <div class="top-down-container">
          <!--       请假信息表单-->
          <div class="down-container">
            <div class="info-box">
              <h2>请假信息</h2>
              <el-row class="row-box">
                <el-col :span="12">
                  <div class="name-box">请假类型：<span class="content-box">{{detailInfo.leave.leaveType}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="name-box">请假起始时间：<span class="content-box">{{detailInfo.leave.leaveStartTime}}时</span>
                  </div>
                </el-col>
              </el-row>
              <el-row class="row-box">
                <el-col :span="12">
                  <div class="name-box">请假原因：<span class="content-box">{{detailInfo.leave.leaveReason}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="name-box">请假结束时间：<span class="content-box">{{detailInfo.leave.leaveEndTime}}时</span></div>
                </el-col>
              </el-row>
              <el-row class="row-box">
                <el-col :span="24">
                  <div class="name-box">证明文件：<span class="content-box"
                      @click="downlode">{{detailInfo.leave.leaveMaterial}}</span></div>
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
                  <div class="name-box">返岗报道日期：<span class="content-box">{{detailInfo.revokeReportTime}}</span>
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
                  <div class="name-box">销假表提交日期：<span class="content-box">{{detailInfo.revokeSubmitTime}}</span></div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import { getRevokeDetailById } from "@/api/apply"
export default {
  data () {
    return {
      queryData: '',
      detailInfo: {},
      auditStatus: ["未审核", "审核通过", "无需审核", "审核不通过"],


    }
  },
  created () {

  },
  mounted () {
    this.queryData = this.$route.query;
    this.initDate();

  },
  methods: {
    downlode () {
      console.log("11")
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

    }
  }

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
}
</style>
