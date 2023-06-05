<template>
  <div class="box">
    <div class="app-container">
    <h2 class="box-title">考勤审核进度</h2>
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
    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="input" class="input">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="工号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>考勤汇总表</h3>
        </div>
        <el-table ref="filterTable" :data="tableData" border style="width: 100%">
          <!-- <el-table-column prop="id" label="序号" width="100">
          </el-table-column> -->
          <el-table-column prop="leave.user.userId" label="工号" width="100">
          </el-table-column>
          <el-table-column prop="leave.user.userName" label="姓名" width="150">
          </el-table-column>
          <el-table-column prop="leave.user.yuanXi" label="学院(部门)" width="200">
          </el-table-column>
          <el-table-column prop="revokeReportTime" label="返岗报道日期：">
          </el-table-column>
          <el-table-column prop="revokeSubmitTime" label="销假表提交日期：">
          </el-table-column>
          <el-table-column prop="departmentStatus" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.departmentStatus === '0' ? 'danger'  : 'success'" disable-transitions>
                {{auditStatus[scope.row.departmentStatus]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-button @click="rowChick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
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
import { getAuditLoadingDataByUserId, getRevokeAuditSelected } from "../../../api/audit";
import StepInfo from "../components/StepInfo";
import { SingleleaveAudit, getCurrentAuditMsg } from "../../../api/audit";


export default {
  data () {
    return {
      auditStatus: ["未审核", "已审核"],
      tableData: [],
      input: '',
      select: '',
      role: "",
      yuanxi: "",
      id: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,

      active: 0,
      step: 2,
      
      isShow: 0,
      isFinish: 0,


      searchInfo: {
        department: "null",
        selectuserid: "null",
        status: "null",
        username: "null"
      },
    }
  },
  created () { },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    this.init();
    this.initTry();

  },
  methods: {
    initTry () {
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
    init () {
      getAuditLoadingDataByUserId({ "pageNum": this.currentPage, "userid": this.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      })

    },
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
