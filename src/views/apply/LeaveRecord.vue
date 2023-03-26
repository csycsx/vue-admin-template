<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" label-position="labelPosition" inline>
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
    </el-form>
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>个人历史申请列表</h3>
        </div>
        <el-table :data="tableData" border max-height="700px" style="width: 100%; height: auto; margin: 0px auto;">

          <el-table-column label="序号" prop="id" width="80" />
          <el-table-column label="提交时间" prop="gmtModified" width="160" />
          <el-table-column label="请假开始时间" prop="leaveStartTime" width="150" />
          <el-table-column label="请假结束时间" prop="leaveEndTime" width="150" />
          <el-table-column label="请假类型" prop="leaveType" width="140" />
          <el-table-column label="请假原因" prop="leaveReason" />
          <el-table-column label="状态" prop="status" width="140">
            <template slot-scope="scope">
              <el-tag
                :type="tableData[scope.$index].status == 2 ? 'danger' : tableData[scope.$index].status == 1 ? 'success' : 'primary'"
                disable-transitions>{{ auditStatus[tableData[scope.$index].status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="rowChick(scope.row)" type="text" size="small">查看</el-button>
              <el-button v-if="scope.row.status!='1'" @click="deleteRow(scope.row)" type="text"
                size="small">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="changePage" v-if="isShow" background layout="prev, pager, next" :total="total"
          :page-size="pageSize">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import { findLeaveFormByUserid, listLeaveByTimePeriodAndAuditStatus, quashLeaveById } from "@/api/apply"
export default {
  inject: ['reload'],
  data () {
    return {
      auditStatus: ["未审核", "审核通过", "审核不通过", "已撤销", "管理员补录"],
      // auditStatus: ["待学院初审", "待学院审核", "待人事处初审", "待人事处审核", "待校领导审核", "审核通过", "审核不通过", "已撤销", "管理员补录"],
      queryParams: {
        roleKey: '',
      },
      pickDateRange: '',
      queryStartTime: '',
      queryEndTime: '',
      queryAuditOption: '-1',
      auditOptions: [
        {
          value: '-1',
          label: '全部'
        },
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '审核已通过'
        },
        {
          value: '2',
          label: '审核不通过'
        },
        {
          value: '3',
          label: '已撤销'
        },
      ],
      isShow: false,      // 默认不显示分页
      tableData: [],
      total: 1,
      pageSize: 1,
      dateRange: '',
      labelPosition: 'left',
      userid: ''

      // value3: [new Date(2022, 10, 10, 10, 10), new Date(2022, 10, 11, 10, 10)],
    }
  },
  created () {
    this.userid = this.$store.getters.id;
    let param = { "userid": this.userid }
    findLeaveFormByUserid(param).then(res => {
      if (res.code === 200) {
        this.tableData = res.data.records;
        // 获取总记录数
        this.total = res.data.total;
        // 获取每页的条数
        this.pageSize = res.data.size;
        // 请求成功后判断总记录数，如少于11条则不做分页
        if (this.total > 10) {
          this.isShow = true;
        }
      }
    })
  },
  methods: {

    /**
     * 查询事件修改
     * */
    selectDate (val) {
      if (val) {
        this.queryStartTime = val[0];
        this.queryEndTime = val[1];
      } else {
        this.queryStartTime = "";
        this.queryEndTime = "";
      }

    },
    /**
     * 选择查询
     */
    queryByOptions () {
      let param = {
        "userId": this.userid,
        "status": this.queryAuditOption,
        "startTime": this.queryStartTime,
        "endTime": this.queryEndTime
      }
      console.log(param)
      listLeaveByTimePeriodAndAuditStatus(param).then(res => {
        console.log(res.data);
        this.tableData = res.data;
      })
    },
    // 分页事件控制
    changePage (pageNum) {
      let param = {
        "userid": this.userid,
        "pageNum": pageNum
      }
      findLeaveFormByUserid(param).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
        }
      });
    },

    //点击某条信息，跳转详情页面
    rowChick (row, event, column) {
      console.log(row);
      this.$router.push({
        name: 'DetailedLeave',    // 详情页传入行参数
        query: {
          id: row.id,
        }
      })
    },
    //撤销某条请假申请信息
    deleteRow (row, tableData) {
      console.log("将撤销：", row);
      this.$confirm('确认撤销请假申请？')
        .then(_ => {
          let param = {
            "leave-id": row.id
          }
          quashLeaveById(param).then(res => {
            if (res.code === 200) {
              this.$message.success("撤销成功");
              this.reload();
            } else {
              this.$message.error("撤销失败");
            }
          })
        })
        .catch(_ => { });

    },
  }

}
</script>

<style scoped>
.app-container {
  margin: 30px;
}

/* 表格 */
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
</style>
