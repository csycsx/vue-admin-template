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
        </div>

        <el-table ref="filterTable" :data="tableData" border style="width: 100%" @row-click="rowChick">
          <el-table-column prop="user.userId" label="工号" width="100">
          </el-table-column>
          <el-table-column prop="user.userName" label="姓名" width="100">
          </el-table-column>
          <el-table-column prop="user.yuanXi" label="学院(部门)" width="150">
          </el-table-column>
          <el-table-column prop="leaveType" label="请假类型" width="100">
          </el-table-column>
          <el-table-column prop="leaveStartTime" label="起始时间" sortable>
          </el-table-column>
          <el-table-column prop="leaveEndTime" label="结束时间" sortable>
          </el-table-column>
          <el-table-column prop="showStatus" label="状态" width="100"
            :filters="[{ text: '待审核', value: '待审核' }, { text: '已审核', value: '已审核' },{ text: '未流经', value: '未流经' }]"
            :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.showStatus === '待审核' ? 'danger' : (scope.row.showStatus === '未流经' ? 'info' : 'success')"
                disable-transitions>
                {{scope.row.showStatus}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { resolve } from "path";
import { reject } from "q";
import { findLeaveFormByDeptAndUnfinishedSchool, findSchoolDepartmentById, findLeaveFormByUsernameInSchool, findLeaveFormByUseridInSchool } from "../../api/audit";
export default {
  data () {
    return {
      input: '',
      select: '',
      length: 0,
      yuanxi: "",


      tableData: [{
        id: '11111111',
        userid: '21000000',
        username: '张三',
        yuanxi: '计算机工程与科学',
        leave_type: '事假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '待审核'
      }, {
        id: '22222222',
        userid: '21000001',
        username: '李四',
        yuanxi: '计算机工程与科学',
        leave_type: '病假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '待审核'
      }, {
        id: '33333333',
        userid: '21000002',
        username: '王五',
        yuanxi: '通信学院',
        leave_type: '病假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '审核完成'
      }
      ]
    }
  },
  created () {
    //let yuanxi = this.$store.getters.yuanxi
    let id = "12340000"
    // this.getYuanxi(id)
    // console.log(this.yuanxi)
    this.init(id)
  },
  mounted () {
  },
  methods: {
    filterTag (value, row) {
      return row.showStatus === value;
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    //搜索接口
    search () {
      console.log(this.input);
      console.log(this.select);
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
        //调用后端接口
        if (this.select === "1") {
          findLeaveFormByUseridInSchool({
            "userid": this.input,
            "department": this.yuanxi
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.length = res.data.length;
              this.tableData = res.data
              for (let leave of res.data) {
                if (leave.schoolStatus === "0" && leave.hrStatus === "1") {
                  leave.showStatus = "待审核"
                } else if (leave.schoolStatus === "1") {
                  leave.showStatus = "已审核"
                } else {
                  leave.showStatus = "未流经"
                }
              }
              console.log(res.data)
            }
          })
        }
        else if (this.select === "2") {
          findLeaveFormByUsernameInSchool({
            "username": this.input,
            "department": this.yuanxi
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.length = res.data.length;
              this.tableData = res.data
              for (let leave of res.data) {
                if (leave.schoolStatus === "0" && leave.hrStatus === "1") {
                  leave.showStatus = "待审核"
                } else if (leave.schoolStatus === "1") {
                  leave.showStatus = "已审核"
                } else {
                  leave.showStatus = "未流经"
                }
              }

              console.log(res.data)
            }
          })
        }

      }
    },
    //页面初始化

    //点击某条信息，跳转详情页面
    rowChick (row, event, column) {
      console.log(row.id);
      this.$router.push({
        name: 'DetailLeave',
        params: {
          info: row,
          role: 2,
          yuanxi: "计算机",
        }
      })
    },

    getYuanxi (id) {
      console.log("id:", id);
      findSchoolDepartmentById({ "school_leader_id": id }).then(res => {
        console.log("res", res.data[0]);
        if (res.code === 200) {
          this.yuanxi = res.data[0].department;
          this.getInfo()
        }
      })
      console.log(this.yuanxi)

    },
    getInfo () {
      console.log(this.yuanxi)
      findLeaveFormByDeptAndUnfinishedSchool({ "department": this.yuanxi }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.length = res.data.length;
          this.tableData = res.data
          for (let leave of res.data) {
            if (leave.schoolStatus === "0" && leave.hrStatus === "1") {
              leave.showStatus = "待审核"
            } else if (leave.schoolStatus === "1") {
              leave.showStatus = "已审核"
            } else {
              leave.showStatus = "未流经"
            }
          }
          console.log(res.data)
        }
      })

    },

    init (id) {
      this.getYuanxi(id);

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
</style>