<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" label-position="labelPosition" inline>
      <el-row>
        <el-form-item label="选择时间范围">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker v-model="pickDateRange" type="datetimerange" range-separator="至" @input="selectDate"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="roleKey">
          <el-select v-model="queryAuditOption" placeholder="请选择">
            <el-option v-for="item in auditOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryByOptions">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form> -->
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>个人历史销假申请列表</h3>
        </div>
        <el-table :data="tableData" border max-height="700px" style="width: 100%; height: auto; margin: 0px auto;">
          <el-table-column label="序号" prop="id" width="50" />
          <el-table-column label="请假开始时间" prop="leave.leaveStartTime" width="150" />
          <el-table-column label="请假结束时间" prop="leave.leaveEndTime" width="150" />
          <el-table-column label="请假类型" prop="leave.leaveType" width="100" />
          <el-table-column label="请假原因" prop="leave.leaveReason" />
          <el-table-column label="返岗报道时间" prop="revokeReportTime" width="160" />
          <el-table-column label="销假提交时间" prop="revokeSubmitTime" width="160" />
          <el-table-column label="状态" prop="status" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="tableData[scope.$index].status == 2 ? 'danger' : tableData[scope.$index].status == 1 ? 'success' : 'primary'"
                disable-transitions>{{ auditStatus[tableData[scope.$index].status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="rowChick(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">撤销 </el-button>
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
import { getRevokeListByUserId,undoRevoke } from "@/api/apply"
export default {
  inject:['reload'],
  data () {
    return {
      auditStatus: ["未审核", "审核通过", "审核不通过", "已撤销"],
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      userid: ''
    }
  },
  created () {
    this.userid = this.$store.getters.id;
    let param = { "user_id": this.userid, "pageNum": this.currentPage }
    getRevokeListByUserId(param).then(res => {
      if (res.code === 200) {
        this.tableData = res.data.records;
        this.pageSize = res.data.size;
        this.total = res.data.total;
      }
    })
  },
  methods: {
    handleCurrentChange (val) {
      let param = { "user_id": this.userid, "pageNum": val }
      getRevokeListByUserId(param).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      })

    },

    //点击某条信息，跳转详情页面
    rowChick (row, event, column) {
      this.$router.push({
        name: 'DetailedRevoke',    // 详情页传入行参数
        query: {
          id: row.id,
          flag: "apply"
        }
      })
    },
    //撤销某条销假申请
    deleteRow(row) {
      this.$confirm('确认撤销请假申请？')
        .then(_ => {
          let param = {
            "revoke_form_id": row.id
          }
          undoRevoke(param).then(res => {
            if (res.code === 200) {
              this.$message.success("撤销成功");
              this.reload();
            } else {
              this.$message.error("撤销失败");
            }
          })
        })
        .catch(_ => { });
    }
  }
}

</script>
  
<style scoped>
.table {
  height: 70%;
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
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.line {
  text-align: center;
}
.block {
  margin-top: 15px;
}
</style>