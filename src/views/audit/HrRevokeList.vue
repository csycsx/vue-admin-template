<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="input" class="input">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="工号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="部门" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>申请列表</h3>
        </div>
        <el-table ref="filterTable" :data="tableData" border style="width: 100%" @row-click="rowChick">
          <el-table-column prop="id" label="序号" width="100">
          </el-table-column>
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
          <el-table-column prop="hrStatus" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.hrStatus === '0' ? 'danger'  : 'success'" disable-transitions>
                {{auditStatus[scope.row.hrStatus]}}
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

<script type="text/ecmascript-6">
import { getAuditLoadingDataByUserId } from "../../api/audit";
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
    }
  },
  created () { },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    this.init();
  },
  methods: {
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
      if (row.hrStatus === "0") isShow = 1;
      this.$router.push({
        name: 'DetailRevoke',    // 详情页传入行参数
        query: {
          id: row.id,
          isShow: isShow
        }
      })
    },
    handleCurrentChange (val) {
      getAuditLoadingDataByUserId({ "pageNum": val, "userid": this.id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      })
    }
  },
  components: {}
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
