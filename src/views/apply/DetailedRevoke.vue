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
            <el-button class="button-box" type="primary" v-if="detailInfo.status==1" @click="exportWord">导出文档
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import { getRevokeDetailById, getCurrentRevokeAuditMsg } from "@/api/apply"
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
export default {
  data () {
    return {
      queryData: '',
      detailInfo: {},
      auditStatus: ["未审核", "审核通过", "无需审核", "审核不通过"],
      stepInfo: {},


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
      });
      getCurrentRevokeAuditMsg({ "revoke_id": this.queryData.id }).then(res => {
        if (res.code === 200) {
          this.stepInfo = res.data;
        }
      });
    },
    initStatus () {
      if (this.detailInfo.status === "2") {
        if (this.detailInfo.departmentStatus === "0") this.detailInfo.departmentStatus = "3";
        else this.detailInfo.hrStatus = "3";
      }
    },
    getWordData () {
      let data = {};
      data.id = this.$store.getters.id;
      data.department = this.$store.getters.yuanxi;
      data.name = this.$store.getters.name;
      data.p_type = this.$store.getters.p_type;
      data.leaveType = this.detailInfo.leave.leaveType;
      data.sY = this.detailInfo.leave.leaveStartTime.substring(0, 4);
      data.sM = this.detailInfo.leave.leaveStartTime.substring(5, 7);
      data.sD = this.detailInfo.leave.leaveStartTime.substring(8, 10);
      data.eY = this.detailInfo.leave.leaveEndTime.substring(0, 4);
      data.eM = this.detailInfo.leave.leaveEndTime.substring(5, 7);
      data.eD = this.detailInfo.leave.leaveEndTime.substring(8, 10);
      data.bY = this.detailInfo.revokeReportTime.substring(0, 4);
      data.bM = this.detailInfo.revokeReportTime.substring(5, 7);
      data.bD = this.detailInfo.revokeReportTime.substring(8, 10);
      data.leaveReason = this.detailInfo.leave.leaveReason;
      if (this.detailInfo.departmentStatus !== "2" && this.stepInfo.departmentAuditMsg !== "尚未进行部门审核") {
        data.departmentResult = this.stepInfo.departmentAuditMsg.dpLeaderResult + ',' + this.stepInfo.departmentAuditMsg.dpLeaderRecommend;
      }
      if (this.detailInfo.hrStatus !== "2" && this.stepInfo.hrAuditMsg !== "尚未进行人事处审核") {
        data.hrResult = this.stepInfo.hrAuditMsg.hrLeaderResult + ',' + this.stepInfo.hrAuditMsg.hrLeaderRecommend;
      }
      console.log('111' + data);
      return data;
    },
    //导出文档
    exportWord () {
      let data = this.getWordData();
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent("上海大学教职工销假申请表模板.docx", function (error, content) {
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
        saveAs(out, "上海大学教职工销假申请表.docx");
      });
    },
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
.button-box {
  float: right;
}
</style>
