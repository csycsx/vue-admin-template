<template>
  <div class="box">
    <div class="app-container">
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>{{  }}考勤汇总</h3>
        </div>
        <div class="search">
        <el-date-picker
          v-model="input"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </div>
        <el-table ref="filterTable" :data="tables" border >
          <el-table-column prop="gmtCreate" label="提交时间" :formatter="formatDate" width="180">
          </el-table-column>
          <el-table-column prop="year,month" label="所属年月" width="230">
            <template slot-scope="scope">
              {{scope.row.year}}年{{ scope.row.month }}月
            </template>
          </el-table-column>
          <el-table-column prop="department" label="院系" width="230">
          </el-table-column>
          <el-table-column prop="dpOfficerStatus" label="状态" width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.hrStatus === '0' ? 'danger'  : 'success'" disable-transitions>
                {{auditStatus[scope.row.hrStatus]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="" label="备注" width="150">
          </el-table-column>
          <el-table-column  label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click=" submitListAudit(scope.row)" type="text" size="small">查看</el-button>

            </template>
          </el-table-column>
        </el-table>
      
        <!-- <div class="block">
          <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div> -->
      </el-card>
    </div>
    
  </div>

  </div>
  
</template>

<script type="text/ecmascript-6">
import { getAuditLoadingDataByUserId, getRevokeAuditSelected,singleHistoryAudit,findHistoryAudit,findLeaveByDept } from "../../../api/audit";
import StepInfo from "../components/StepInfo";


export default {
  // props: ['info'],
  components: { StepInfo },
  data () {
    return {
      auditStatus: ["未审核", "已审核"],
      tableData: [],
      input: '',
      select: '',
      role: "",
      yuanxi: "",
      id: "",
      // currentPage: 1,
      // total: 0,
      // pageSize: 10,

      value3: '',
      info:{},
      active: 0,
      step: 2,
      userid: "",

      currentMonth:"",
      year:"",
      
      check: {
        result: "",
        recomment: "",

      },
      isShow: 0,
      isFinish: 0,
      activeNames: ['1'],
      showChangeTime: false,
      changeTime: "",

    }
  },
  created () {
    this.role = this.$store.getters.role_num;
    this.userid = this.$store.getters.id;
   },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    // this.init();
    this.info = JSON.parse(window.sessionStorage.getItem('departmentDetail'));

    this.attendanceList();


  },

  computed:{
    tables(){ 
      const input = this.input
      if (input) {
        console.log("input输入的搜索内容：" + this.year)
        return this.tableData.filter(data => {
          console.log("object:" + Object.keys(data))
          return Object.keys(data).some(key => {
            return String(data[key]).toUpperCase().indexOf(input) > -1

          })
        })
      }
      return this.tableData
    }
   },
  
  methods: {
    attendanceList () {
      findHistoryAudit({
        "userid": this.id,
        "dept":this.info.department
    }).then(res => {
        console.log("findHistoryAudit", res,this.id)
        if (res.code === 200) {
          this.tableData = res.data.records;
        }
      })
    },

    submitListAudit(row){
      const hAttendanceDetail = JSON.stringify(row);
      console.log("@@@hAttendanceDetail",hAttendanceDetail)

      window.sessionStorage.setItem('hAttendanceDetail', hAttendanceDetail);
    //  路径/home对应我在router目录下index.js中定义的path属性值
        this.$router.push({
          name:'SummaryAudit'
        });
    },

    // rowChick (row, event, column) {
    //   const leaveDetail = JSON.stringify(row);
    //   window.sessionStorage.setItem('leaveDetail', leaveDetail);
    //   this.$router.push({
    //     name: 'DetailLeave'
    //   })
    // },

    init () {
      let role = this.$store.getters.role_num;
      let userid = this.$store.getters.id;
      // let param=[]
      singleHistoryAudit({
        "dept": this.dept,
        "month":this.currentMonth,
        "recommend": this.check.recomment,
        "result": this.check.result,
        "role": role,
        "user_id": userid,
        // "year":this.year
      }).then(res => {
      console.log(" getSchoolDepartment", res.data)
        if (res.code === 200) {
          // this.tableData = res.data.records;
          // this.pageSize = res.data.size;
          // this.total = res.data.total;
        }
      })

    },

    //改变年月显示格式 
    formatDate(row, column) {
          // 获取单元格数据
          let data = row[column.property]
          console.log("data",data)
          if(data == null) {
              return null
          }
          let dt = new Date(data)
          return dt.getFullYear() + '年' + (dt.getMonth() + 1)+'月'+ dt.getDate()+'日'
          // return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
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

  
    // search () {
    //   this.searchInfo.username = "null";
    //   this.searchInfo.selectuserid = "null";
    //   if (this.select === "") {
    //     this.$notify({
    //       title: '警告',
    //       message: '请选择搜索类别',
    //       type: 'warning'
    //     });
    //   }
    //   else if (this.input === "") {
    //     this.$notify({
    //       title: '警告',
    //       message: '请填写搜索内容',
    //       type: 'warning'
    //     });
    //   }
    //   else {
    //     if (this.select === "1") {
    //       this.searchInfo.selectuserid = this.input;
    //     }
    //     else {
    //       this.searchInfo.username = this.input;
    //     }
    //     this.currentPage = 1;
    //     getRevokeAuditSelected({
    //       "department": this.searchInfo.department,
    //       "pageNum": this.currentPage,
    //       "selectuserid": this.searchInfo.selectuserid,
    //       "userid": this.id,
    //       "username": this.searchInfo.username
    //     }).then(res => {
    //       console.log(res);
    //       if (res.code === 200) {
    //         this.tableData = res.data.records;
    //         this.pageSize = res.data.size;
    //         this.total = res.data.total;
    //       }
    //     })
    //   }
    // },
    
    // handleCurrentChange (val) {
    //   if (this.searchInfo.department === "null" && this.searchInfo.username === "null" && this.searchInfo.selectuserid === "null") {
    //     getAuditLoadingDataByUserId({ "pageNum": val, "userid": this.id }).then(res => {
    //       console.log(res);
    //       if (res.code === 200) {
    //         this.tableData = res.data.records;
    //         this.pageSize = res.data.size;
    //         this.total = res.data.total;
    //       }
    //     })
    //   } else {
    //     getRevokeAuditSelected({
    //       "department": this.searchInfo.department,
    //       "pageNum": val,
    //       "selectuserid": this.searchInfo.selectuserid,
    //       "userid": this.id,
    //       "username": this.searchInfo.username
    //     }).then(res => {
    //       console.log(res);
    //       if (res.code === 200) {
    //         this.tableData = res.data.records;
    //         this.pageSize = res.data.size;
    //         this.total = res.data.total;
    //       }
    //     })
    //   }
    // }
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
  position: relative;
  width: 400px;
  top: -11px;
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
