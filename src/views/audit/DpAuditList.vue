<template>
  <div class="app-container">
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
          <h3>申请列表</h3>
          <div class="status-card">
            <el-radio-group v-model="radio" @input="statusChange">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="待审核"></el-radio-button>
              <el-radio-button label="已审核"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <el-table ref="filterTable" :data="tableData" border style="width: 100%" @row-click="rowChick">
          <el-table-column prop="id" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="user.userId" label="工号" width="100">
          </el-table-column>
          <el-table-column prop="user.userName" label="姓名" width="150">
          </el-table-column>
          <el-table-column prop="user.yuanXi" label="学院(部门)" width="200">
          </el-table-column>
          <el-table-column prop="leaveType" label="请假类型" width="100">
          </el-table-column>
          <el-table-column prop="leaveStartTime" label="起始时间">
          </el-table-column>
          <el-table-column prop="leaveEndTime" label="结束时间">
          </el-table-column>
          <el-table-column prop="showStatus" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.showStatus === '待审核' ? 'danger' :  'success'" disable-transitions>
                {{scope.row.showStatus}}
              </el-tag>
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
  </div>
</template>

<script>
import { getAuditSelected, getAuditLoadingDataByUserid } from "../../api/audit";

export default {

  data () {
    return {
      input: '',
      select: '',
      length: 0,
      tableData: [],
      role: "",
      yuanxi: "",
      id: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,
      searchInfo: {
        department: "null",
        selectuserid: "null",
        status: "null",
        username: "null"
      },
      radio: "全部"
    }
  },
  created () {

  },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    this.init();
  },
  methods: {
    statusChange (value) {
      this.radio = value;
      if (value === "全部") {
        this.searchInfo.status = "null";
      } else {
        this.searchInfo.status = value;
      }
      this.currentPage = 1;
      console.log()
      getAuditSelected({
        "department": this.searchInfo.department,
        "pageNum": this.currentPage,
        "selectuserid": this.searchInfo.selectuserid,
        "status": this.searchInfo.status,
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
    },
    //搜索接口
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
        getAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": this.currentPage,
          "selectuserid": this.searchInfo.selectuserid,
          "status": this.searchInfo.status,
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
    //页面初始化

    //点击某条信息，跳转详情页面
    rowChick (row, event, column) {
      const leaveDetail = JSON.stringify(row);
      window.sessionStorage.setItem('leaveDetail', leaveDetail);
      this.$router.push({
        name: 'DetailLeave'
      })
    },

    init () {
      getAuditLoadingDataByUserid({ "pageNum": this.currentPage, "userid": this.id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      })

    },
    handleCurrentChange (val) {
      if (this.searchInfo.department === "null" && this.searchInfo.status === "null" && this.searchInfo.username === "null" && this.searchInfo.selectuserid === "null") {
        getAuditLoadingDataByUserid({ "pageNum": val, "userid": this.id }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      } else {
        getAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": val,
          "selectuserid": this.searchInfo.selectuserid,
          "status": this.searchInfo.status,
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




  }
}
</script>

<style scoped>
.app-container {
  margin: 30px;
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