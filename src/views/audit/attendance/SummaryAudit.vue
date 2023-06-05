<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">请假申请审核进度</h2>
      <!-- 审核步骤 -->
      <div class="box-step">
        <el-steps :active=active finish-status="success" align-center>
          <el-step title="部门初审"></el-step>
          <el-step title="部门审核"></el-step>
          <el-step v-if="step>2" title="人事处初审"></el-step>
          <el-step v-if="step>2" title="人事处审核"></el-step>
          <el-step v-if="step>4" title="校领导审核"></el-step>
        </el-steps>
      </div>
      <!-- 请假信息表单 -->
   <!-- 表格 -->
   <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>考勤记录</h3>
        </div>
        <div class="kaoqing">
          <el-table :data="gridData"  border style="">            
            <el-table-column label="姓名" property="name"  ></el-table-column>
            <el-table-column label="工号" prop="userid"   ></el-table-column>
            <el-table-column label="事假" prop="shijia"  ></el-table-column>
            <el-table-column label="病假" prop="bingjia"   ></el-table-column>
            <el-table-column label="婚假" prop="hunjia"  ></el-table-column>
            <el-table-column label="生育假" prop="shengyujia" ></el-table-column>
            <el-table-column label="探亲假" prop="tanqinjia" ></el-table-column>
            <el-table-column label="丧假" prop="sangjia" ></el-table-column>
            <el-table-column label="工伤假" prop="gonshangjia" ></el-table-column>
            <el-table-column label="公差" prop="gongcha"  ></el-table-column>
            <el-table-column label="旷工" prop="kuanggong"  ></el-table-column>
            <el-table-column label="其它" prop="qita" ></el-table-column>
            <el-table-column label="备注" prop="tip" ></el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
      <!-- 审核结果 -->
      <div class="check-box" v-if="isShow ">
        <el-form ref="form" :model="check" label-width="80px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="check.result">
              <el-radio label="通过"></el-radio>
              <el-radio label="不通过"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="check.recomment" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="check-notice" v-if="isFinish===0 && isShow===0  ">
        <i class="el-icon-warning"></i>
        温馨提示：由于还有未完成的审核流程，因此目前还无需您审核。
      </div>
      <div class="check-finish" v-if="isFinish===1 ">
        <i class="el-icon-success"></i>
        温馨提示：您已完成审核，无需再审核！
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { SingleleaveAudit, getCurrentAuditMsg } from "../../../api/audit";
import StepInfo from "../components/StepInfo";
export default {
  props: ['info'],
  components: { StepInfo },
  data () {
    return {
      role: "",
      userid: "",
      //info: {},
      step: 2,
      active: 0,
      check: {
        result: "",
        recomment: "",

      },
      isShow: 0,
      isFinish: 0,
      dialogVisible: false,
      stepInfo1: {},
      stepInfo2: {},
      stepInfo3: {},
      stepInfo4: {},
      stepInfo5: {},
      showChangeTime: false,
      changeTime: "",


      currentPage: 1,
      total: 0,
      pageSize: 10,

      gridData: [
          {
          name: '王小虎',
          },  {
          name: '王小虎',
          },  {
          name: '王小虎',
          },  {
          name: '王小虎',
          }, {
          name: '王小虎',
          },],

    }
  },
  created () {
    let yuanxi = this.$store.getters.yuanxi
    // let yuanxi = "校办公室"
    //let yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num;
    this.userid = this.$store.getters.id;



  },
  mounted () {
    this.info = JSON.parse(window.sessionStorage.getItem('leaveDetail'));;
    console.log(this.info, this.role)
    if (this.info.leaveType === "产假" && this.role == 3) {
      this.showChangeTime = true
    }
    this.init();
  },
  methods: {
    handleChange (val) {
      console.log(val);
    },
    handleClose (done) {
      this.dialogVisible = false;
    },
  
    onSubmit () {
      if (this.check.result === "不通过" && this.check.recomment === "") {
        this.$notify.error({
          title: '错误',
          message: '审核不通过请填写理由'
        });
      }
      else {
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

      }


    },

    init () {
      //判断需要几步
      if (this.info.hrStatus !== "2") this.step += 2;
      if (this.info.schoolStatus !== "2") this.step += 1;
      console.log(this.step);
      //判断是否能审核
      if (this.info.showStatus === "待审核") this.isShow = 1;
      if (this.info.showStatus === "已审核") this.isFinish = 1;

      //判断当前正在第几步
      if (this.info.departmentStatus === "0") this.active = 0;
      else if (this.info.departmentStatus === "3") this.active = 1;
      else if (this.info.departmentStatus === "1") {
        if (this.info.hrStatus === "2") { this.active = 2; this.isFinish = 1; }
        else if (this.info.hrStatus === "0") { this.active = 2; }
        else if (this.info.hrStatus === "3") { this.active = 3; }
        else {
          if (this.info.schoolStatus === "2") { this.active = 4; this.isFinish = 1; }
          else if (this.info.schoolStatus === "0") this.active = 4;
          else this.active = 5;
        }
      }
      this.getDetail()

    },
    getDetail () {
      getCurrentAuditMsg({ "leave_id": this.info.id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          if (res.data.departmentAuditMsg !== "尚未进行部门审核") {
            this.stepInfo1.id = res.data.departmentAuditMsg.dpOfficerId;
            this.stepInfo1.name = res.data.departmentAuditMsg.dpOfficerName;
            this.stepInfo1.result = res.data.departmentAuditMsg.dpOfficerResult;
            this.stepInfo1.recommend = res.data.departmentAuditMsg.dpOfficerRecommend;
            this.stepInfo1.time = res.data.departmentAuditMsg.dpOfficerTime;
            this.stepInfo2.id = res.data.departmentAuditMsg.dpLeaderId;
            this.stepInfo2.name = res.data.departmentAuditMsg.dpLeaderName;
            this.stepInfo2.result = res.data.departmentAuditMsg.dpLeaderResult;
            this.stepInfo2.recommend = res.data.departmentAuditMsg.dpLeaderRecommend;
            this.stepInfo2.time = res.data.departmentAuditMsg.dpLeaderTime;
          }
          if (this.step > 2 && res.data.hrAuditMsg !== "尚未进行人事处审核") {
            this.stepInfo3.id = res.data.hrAuditMsg.hrOfficerId;
            this.stepInfo3.name = res.data.hrAuditMsg.hrOfficerName;
            this.stepInfo3.result = res.data.hrAuditMsg.hrOfficerResult;
            this.stepInfo3.recommend = res.data.hrAuditMsg.hrOfficerRecommend;
            this.stepInfo3.time = res.data.hrAuditMsg.hrOfficerTime;
            this.stepInfo4.id = res.data.hrAuditMsg.hrLeaderId;
            this.stepInfo4.name = res.data.hrAuditMsg.hrLeaderName;
            this.stepInfo4.result = res.data.hrAuditMsg.hrLeaderResult;
            this.stepInfo4.recommend = res.data.hrAuditMsg.hrLeaderRecommend;
            this.stepInfo4.time = res.data.hrAuditMsg.hrLeaderTime;
          }
          if (this.step > 4 && res.data.schoolAuditMsg !== "尚未进行校领导审核") {
            this.stepInfo5.id = res.data.schoolAuditMsg.scOfficerId;
            this.stepInfo5.name = res.data.schoolAuditMsg.scLeaderName;
            this.stepInfo5.result = res.data.schoolAuditMsg.scOfficerResult;
            this.stepInfo5.recommend = res.data.schoolAuditMsg.scOfficerRecommend;
            this.stepInfo5.time = res.data.schoolAuditMsg.scOfficerTime;
          }
        }
      })
    },
    handleCurrentChange (val) {
      if (this.searchInfo.department === "null" && this.searchInfo.username === "null" && this.searchInfo.selectuserid === "null") {
        getAuditLoadingDataByUserId({ "pageNum": val, "userid": this.id }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      } else {
        getRevokeAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": val,
          "selectuserid": this.searchInfo.selectuserid,
          "userid": this.id,
          "username": this.searchInfo.username
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      }
    }
  },
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
.box-step {
  margin-top: 20px;
  width: 80%;
}
.kaoqing{
  position: relative;
  left: -92px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.table {
  margin-top: 20px;
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

.check-notice {
  width: 80%;
  color: red;
}
.check-finish {
  width: 80%;
  color: #67c23a;
}
.detail-box::v-deep .el-dialog__title {
  font-weight: 700;
}
.el-collapse::v-deep .el-collapse-item__header {
  font-weight: 700;
}
.el-collapse::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
