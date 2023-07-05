<template>
  <div class="box">
    <div class="app-container">
    <!-- <h2 class="box-title">考勤记录</h2> -->
    <!-- 搜索 -->
    <!-- <div class="search">
      <el-input placeholder="请输入内容" v-model="input" class="input">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="院系" value="1"></el-option>
          <el-option label="月度" value="2"></el-option>
          <el-option label="审核状态" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div> -->
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>各学院考勤汇总</h3>
        </div>
        <el-table ref="filterTable" :data="tableData" border style="width: 1000px">
          <el-table-column prop="id" label="序号" width="100">
          </el-table-column>
          <!-- prop的内容先这样之后记得换 -->
          <!-- <el-table-column prop="leave.user.userId" label="提交时间" width="150">
          </el-table-column> -->
          <!-- <el-table-column prop="leave.user.userName" label="名称(月度及学院名)" width="200">
          </el-table-column> -->
          <!-- <el-table-column prop="leave.user.userName" label="院系" width="200">
          </el-table-column>
          <el-table-column prop="leave.user.userName" label="最后一次审核申请提交时间" width="200">
          </el-table-column>
          <el-table-column prop="" label="备注" width="180">
          </el-table-column> -->
          <el-table-column prop="[0]" label="院系" width="200">
          </el-table-column>
          <!-- <el-table-column prop="leave.user.userName" label="最后一次审核申请提交时间" width="200">
          </el-table-column> -->
          <el-table-column prop="" label="备注" width="180">
          </el-table-column>
          <el-table-column  label="操作" width="120">
              <el-button @click=" submitListAudit()" type="text" size="small">查看</el-button>
          </el-table-column>
        </el-table>
      
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
    
  </div>

  </div>
  
</template>

<script type="text/ecmascript-6">
import { getAuditLoadingDataByUserId, getRevokeAuditSelected,updateSchoolDepartment,} from "@/api/audit";
import StepInfo from "../components/StepInfo";
import { getSchoolDepartment ,SingleleaveAudit, getCurrentAuditMsg } from "@/api/audit";


export default {
  props: ['info'],
  components: { StepInfo },
  data () {
    return {

      tableData: [],
      input: '',
      select: '',
      role: "",
      yuanxi: "",
      id: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,

      dept:"",
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

      active: 0,
      step: 2,
      userid: "",

      
      check: {
        result: "",
        recomment: "",

      },
      isShow: 0,
      isFinish: 0,
      // stepInfo1: {},
      // stepInfo2: {},
      // stepInfo3: {},
      // stepInfo4: {},
      // stepInfo5: {},
      showChangeTime: false,
      changeTime: "",


      searchInfo: {
        department: "null",
        selectuserid: "null",
        status: "null",
        username: "null"
      },
    }
  },
  created () {
    this.role = this.$store.getters.role_num;
    this.userid = this.$store.getters.id;


    // let param = { 
    //     "year": this.year,
    //     "month": this.month,
    //     "dept": this.dept 
    //   }
    // updateSchoolDepartment(param).then(res => {
    //   console.log("res",res);
    //   // this.gridData = res.data.records
    // })
  },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    // this.init();
    this.SchoolDp();
    // this.initTry();
    this.info = JSON.parse(window.sessionStorage.getItem('leaveDetail'));;
    console.log(this.info, this.role)
    // if (this.info.leaveType === "产假" && this.role == 3) {
    //   this.showChangeTime = true
    // }

  },
  
  methods: {

    submitListAudit(){
    //  路径/home对应在router目录下index.js中定义的path属性值
        this.$router.push({
          name:'HrAttendManageTry'
        });
    },
    // initTry () {
    //   //判断需要几步
    //   if (this.info.hrStatus !== "2") this.step += 2;
    //   if (this.info.schoolStatus !== "2") this.step += 1;
    //   console.log(this.step);
    //   //判断是否能审核
    //   if (this.info.showStatus === "待审核") this.isShow = 1;
    //   if (this.info.showStatus === "已审核") this.isFinish = 1;

    //   //判断当前正在第几步
    //   if (this.info.departmentStatus === "0") this.active = 0;
    //   else if (this.info.departmentStatus === "3") this.active = 1;
    //   else if (this.info.departmentStatus === "1") {
    //     if (this.info.hrStatus === "2") { this.active = 2; this.isFinish = 1; }
    //     else if (this.info.hrStatus === "0") { this.active = 2; }
    //     else if (this.info.hrStatus === "3") { this.active = 3; }
    //     else {
    //       if (this.info.schoolStatus === "2") { this.active = 4; this.isFinish = 1; }
    //       else if (this.info.schoolStatus === "0") this.active = 4;
    //       else this.active = 5;
    //     }
    //   }
    //   this.getDetail()
    // },
    // init () {
    //   getAuditLoadingDataByUserId({ "pageNum": this.currentPage, "userid": this.id }).then(res => {
    //     console.log("getAuditLoaidng",res)
    //     if (res.code === 200) {
    //       this.tableData = res.data.records;
    //       this.pageSize = res.data.size;
    //       this.total = res.data.total;
    //     }
    //   })

    // },

    SchoolDp () {
      getSchoolDepartment({}).then(res => {
        console.log(" getSchoolDepartment",res.data)
        console.log("code",res.code)
        if (res.code === 200) {
          console.log("tazhixingle ")
          this.tableData = res.data;
          console.log("tazhixingle2 ")

          console.log("tableData",tableData);
        }
      })

    },

    // getDetail () {
    //   getCurrentAuditMsg({ "leave_id": this.info.id }).then(res => {
    //     console.log(res);
    //     if (res.code === 200) {
    //       if (res.data.departmentAuditMsg !== "尚未进行部门审核") {
    //         this.stepInfo1.id = res.data.departmentAuditMsg.dpOfficerId;
    //         this.stepInfo1.name = res.data.departmentAuditMsg.dpOfficerName;
    //         this.stepInfo1.result = res.data.departmentAuditMsg.dpOfficerResult;
    //         this.stepInfo1.recommend = res.data.departmentAuditMsg.dpOfficerRecommend;
    //         this.stepInfo1.time = res.data.departmentAuditMsg.dpOfficerTime;
    //         this.stepInfo2.id = res.data.departmentAuditMsg.dpLeaderId;
    //         this.stepInfo2.name = res.data.departmentAuditMsg.dpLeaderName;
    //         this.stepInfo2.result = res.data.departmentAuditMsg.dpLeaderResult;
    //         this.stepInfo2.recommend = res.data.departmentAuditMsg.dpLeaderRecommend;
    //         this.stepInfo2.time = res.data.departmentAuditMsg.dpLeaderTime;
    //       }
    //       if (this.step > 2 && res.data.hrAuditMsg !== "尚未进行人事处审核") {
    //         this.stepInfo3.id = res.data.hrAuditMsg.hrOfficerId;
    //         this.stepInfo3.name = res.data.hrAuditMsg.hrOfficerName;
    //         this.stepInfo3.result = res.data.hrAuditMsg.hrOfficerResult;
    //         this.stepInfo3.recommend = res.data.hrAuditMsg.hrOfficerRecommend;
    //         this.stepInfo3.time = res.data.hrAuditMsg.hrOfficerTime;
    //         this.stepInfo4.id = res.data.hrAuditMsg.hrLeaderId;
    //         this.stepInfo4.name = res.data.hrAuditMsg.hrLeaderName;
    //         this.stepInfo4.result = res.data.hrAuditMsg.hrLeaderResult;
    //         this.stepInfo4.recommend = res.data.hrAuditMsg.hrLeaderRecommend;
    //         this.stepInfo4.time = res.data.hrAuditMsg.hrLeaderTime;
    //       }
    //       if (this.step > 4 && res.data.schoolAuditMsg !== "尚未进行校领导审核") {
    //         this.stepInfo5.id = res.data.schoolAuditMsg.scOfficerId;
    //         this.stepInfo5.name = res.data.schoolAuditMsg.scLeaderName;
    //         this.stepInfo5.result = res.data.schoolAuditMsg.scOfficerResult;
    //         this.stepInfo5.recommend = res.data.schoolAuditMsg.scOfficerRecommend;
    //         this.stepInfo5.time = res.data.schoolAuditMsg.scOfficerTime;
    //       }
    //     }
    //   })
    // },
    // onSubmit () {
    //   if (this.check.result === "不通过" && this.check.recomment === "") {
    //     this.$notify.error({
    //       title: '错误',
    //       message: '审核不通过请填写理由'
    //     });
    //   }
    //   else {
    //     SingleleaveAudit({
    //       "id": this.info.id,
    //       "recommend": this.check.recomment,
    //       "result": this.check.result,
    //       "role": this.role,
    //       "userid": this.userid
    //     }).then(res => {
    //       console.log(res);
    //       if (res.code === 200) {
    //         console.log(res.data);
    //         this.$message({
    //           message: '审核成功',
    //           type: 'success'
    //         });
    //         if (this.role === "1" || this.role === "2") {
    //           this.$router.push({
    //             name: 'DpAuditList'
    //           });
    //         }
    //         else if (this.role === "3" || this.role === "4") {
    //           this.$router.push({
    //             name: 'HrAuditList'
    //           });
    //         }
    //         else {
    //           this.$router.push({
    //             name: 'ScAuditList'
    //           });
    //         }
    //       }
    //       else {
    //         this.$message.error(res.message);
    //       }
    //     })

    //   }


    // },
    rowChick (row, event, column) {
      let isShow = 0;
      if (row.departmentStatus === "0") isShow = 1;
      const leaveDetail = JSON.stringify(row);
      window.sessionStorage.setItem('revokeDetail', leaveDetail);
      this.$router.push({
        name: 'DetailRevoke',    // 详情页传入行参数
        query: {
          id: row.id,
          isShow: isShow
        }
      })
    },
    search () {
      this.searchInfo.username = "null";
      this.searchInfo.selectuserid = "null";
      if (this.select === "") {
        this.$notify({
          title: '警告',
          message: '请选择搜索类别',
          type: 'warning'
        });
      }
      else if (this.input === "") {
        this.$notify({
          title: '警告',
          message: '请填写搜索内容',
          type: 'warning'
        });
      }
      else {
        if (this.select === "1") {
          this.searchInfo.selectuserid = this.input;
        }
        else {
          this.searchInfo.username = this.input;
        }
        this.currentPage = 1;
        getRevokeAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": this.currentPage,
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
  components: {}
}
</script>

<style scoped>
.box {
  display: flex;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  flex-direction: column;
  align-items: center;
}
.app-container {
  margin: 30px;
}
.box-title {
  margin: 0;
  padding: 20px;
  text-align: center;
}

/* 搜索 */
.search {
  width: 400px;
}
.el-select {
  width: 100px;
}

/* 表格 */

.el-card__header {
  padding: 18px 40px;
}
.table {
  margin-top: 20px;
}

.check-box {
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

.status-card {
  display: inline;
  float: right;
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

.block {
  margin-top: 15px;
}
</style>
