<template>
  <div class="container">
    <div class="box">
      <h2 class="box-title">请假申请审核进度</h2>
      <!-- 审核步骤 -->
      <div class="box-step">
        <el-steps :active=active finish-status="success" align-center>
          <el-step v-if="step>1" title="部门审核"></el-step>
          <el-step v-if="step>2" title="人事处初审"></el-step>
          <!-- <el-step v-if="step>1" title="人事处审核"></el-step> -->
        </el-steps>
      </div>
      <!-- 请假信息表单 -->
   <!-- 表格 -->
   <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>{{ this.dept }} {{this.month}}月考勤记录</h3>
        </div>
        <div class="kaoqing">
          <el-table :data="tableData"  border style="">   
            <el-table-column label="编号" property="id"  ></el-table-column>
            <el-table-column label="工号" prop="user.id"   ></el-table-column>
            <el-table-column label="事假" prop="shijiaDays"  ></el-table-column>
            <el-table-column label="病假" prop="bingjiaDays"   ></el-table-column>
            <el-table-column label="婚假" prop="hunjiaDays"  ></el-table-column>
            <el-table-column label="生育假" prop="shengyujiaDays" ></el-table-column>
            <el-table-column label="探亲假" prop="tanqinjiaDays" ></el-table-column>
            <el-table-column label="丧假" prop="sangjiaDays" ></el-table-column>
            <el-table-column label="公差" prop="gongchaiDays"  ></el-table-column>
            <el-table-column label="旷工" prop="kuanggongDays"  ></el-table-column>
            <el-table-column label="其它" prop="inactiveDays" ></el-table-column>
            <el-table-column label="备注" prop="leaveReason" ></el-table-column>
          </el-table>
        </div>
        <!-- <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div> -->
      </el-card>
    </div>
     <!-- 审核详情 -->
      <div class="detail-box">
        <!-- <el-button type="text" @click="dialogVisible = true">点击查看审核详情</el-button> -->
        <el-dialog title="审核详情" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="部门人事初审信息" name="1" v-if="active>0">
              <StepInfo :step-info="stepInfo1" />
            </el-collapse-item>
            <el-collapse-item title="部门负责人审核信息" name="2" v-if="active>0">
              <StepInfo :step-info="stepInfo2" />
            </el-collapse-item>
            <el-collapse-item title="人事处科员初审信息" name="3" v-if="active>2">
              <StepInfo :step-info="stepInfo3" />
            </el-collapse-item>
            <el-collapse-item title="人事处负责人审核信息" name="4" v-if="active>3">
              <StepInfo :step-info="stepInfo4" />
            </el-collapse-item>
            <!-- <el-collapse-item title="校领导审核信息" name="4" v-if="active>4">
              <StepInfo :step-info="stepInfo5" />
            </el-collapse-item> -->
          </el-collapse>

        </el-dialog>
      </div>
      <!-- 审核结果 -->
      <div class="check-box" v-if="isShow === 0">
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
      <div class="check-finish" v-if="isFinish===1 ">
        <i class="el-icon-success"></i>
        温馨提示：您已完成审核，无需再审核！
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { singleHistoryAudit, getCurrentAuditMsg } from "../../../api/audit";
import StepInfo from "../components/StepInfo";
import { getLeaveHistoryByDept, singleHistoryAudit } from '@/api/history'
import { checkTeachingDate } from "@/api/apply";


export default {
  // props: ['info'],
  components: { StepInfo },
  data () {
    return {
      role: "",
      userid: "",
      info: {},
      step: 2,
      active: 0,
      check: {
        result: "",
        recomment: "",
      },
      
      isShow: 0,
      isFinish: 0,
      dialogVisible: false,
      activeNames: ['1'],
      stepInfo1: {},
      stepInfo2: {},
      stepInfo3: {},
      stepInfo4: {},
      stepInfo5: {},
      showChangeTime: false,
      // changeTime: "",
      leaveTime: "",

      year:"",
      month:"",
      dept:"",

      tableData:[],

      currentPage: 1,
      total: 0,
      pageSize: 10,

    }
  },
  created () {
    let yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num;

    this.userid = this.$store.getters.id;
    this.name = this.$store.getters.name;
    // this.dept = this.$store.getters.yuanxi;
    console.log("this.$store.getters",this.$store.getters)
    // this.year = "2023";
    // this.month = "5"  
     

  },
  mounted () {
    this.info = JSON.parse(window.sessionStorage.getItem('attendanceDetail'));
    console.log("@@@info&role",this.info, this.role)

    this.info1 = JSON.parse(window.sessionStorage.getItem('hAttendanceDetail'));

    this.getDeptList();
    this.init();
  },
  methods: {
   
    getDeptList(){
      this.year=this.info.year
        this.month=this.info.month
        this.dept=this.info.department
      getLeaveHistoryByDept({
        "year": this.year,
        "month": this.month,
        "dept": this.dept 
      }).then(res => {
        console.log(" getLeaveHistoryByDeptres",res);
        this.tableData = res.data.records
        console.log("this.info.year",this.info.year);

        
      })

  },
  mounted () {
    this.info = JSON.parse(window.sessionStorage.getItem('summaryDetail'));
    console.log(this.info)
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
      console.log("this.check.result",this.check.result)
      if (this.check.result === "不通过" && this.check.recomment === "") {
        this.$notify.error({
          title: '错误',
          message: '审核不通过请填写理由'
        });
      }
      else {
        let formData = new FormData();
          formData.append("year", this.year);
          formData.append("month", this.month);
          formData.append("dept", this.$store.getters.yuanxi);
          formData.append("userid", this.$store.getters.id);
          formData.append("role", "2");
          formData.append("result", this.check.result);
          formData.append("recommend", this.check.recomment);
          singleHistoryAudit(formData).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.$router.push({
                name: 'DpAttendanceAudit'
              })
            }
          })
      }
    },

    init () {
      //判断是否能审核
      console.log("showStatus", this.info.showStatus)
      if (this.info.showStatus === "已审核") {
        this.isShow = 1;
        this.isFinish = 1;
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
          // if (this.step > 4 && res.data.schoolAuditMsg !== "尚未进行校领导审核") {
          //   this.stepInfo5.id = res.data.schoolAuditMsg.scOfficerId;
          //   this.stepInfo5.name = res.data.schoolAuditMsg.scLeaderName;
          //   this.stepInfo5.result = res.data.schoolAuditMsg.scOfficerResult;
          //   this.stepInfo5.recommend = res.data.schoolAuditMsg.scOfficerRecommend;
          //   this.stepInfo5.time = res.data.schoolAuditMsg.scOfficerTime;
          // }
        }
      })
    },
     handleChange (val) {
      console.log(val);
    },
        handleClose (done) {
      this.dialogVisible = false;
    },
  
    changeDateFormat (date) {
        var myDate = new Date(date);
        var Y = myDate.getFullYear(); //获取当前完整年份
        var M = myDate.getMonth() + 1; //获取当前月份
        var D = myDate.getDate(); //获取当前日1-31
        if (M < 10) {
          M = "0" + M;
        }
        if (D < 10) {
          D = "0" + D;
        }
        var nowDate = Y + "-" + M + "-" + D;
        return nowDate;
      },
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
