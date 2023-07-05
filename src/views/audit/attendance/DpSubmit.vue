<template>
  <div class="contains">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>添加考勤</h3>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="90px">
          <el-row type="flex" style="height: 62px; margin-bottom: 10px">
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="name" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工号" prop="userid">
                <el-input v-model="userid" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所在部门" prop="department" style="height: 62px; margin-bottom: 10px">
                <el-input v-model="dept" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="考勤人工号" prop="userid">
                <!-- <el-select
                    v-model="form.id"
                    filterable
                    placeholder="请输入工号"
                    @change="getDateArr"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.userId"
                      :label="item.userId"
                      :value="item.userId"
                    >
                      <span style="float: left">{{ item.userId }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.userName }}</span
                      >
                    </el-option>
                  </el-select> -->
                <el-input v-model="form.id" placeholder="请输入补录用户的工号" @change="changeUserIdInput"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺勤类型">
                <el-select v-model="form.region" placeholder="请选择缺勤类型">
                  <el-option v-for="item in options2" :key="item.leave_type" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="cal-box">
        <div class="week-box">{{ week }}</div>
        <Calendar v-on:choseDay="clickDay" v-on:changeMonth="changeDate" :markDateMore="selectDate">
        </Calendar>
      </div>
      <div class="button-box">
        <el-button type="primary" @click="addAttend">添加考勤</el-button>
        <el-button type="primary" @click="submitAttend()">提交考勤汇总</el-button>
      </div>
      <div class="table">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>考勤列表</h3>
          </div>
          <el-date-picker v-model="value2" style="float: left;bottom: 5px;" type="month" :placeholder="defaultdate"
            @change="dateChange">
          </el-date-picker>

          <el-table :data="tableData" border max-height="700px" style="width: 100%; height: auto; margin: 0px auto;">
            <el-table-column label="提交时间" prop="gmtModified" width="170" />
            <el-table-column label="请假开始时间" prop="leaveStartTime" width="170" />
            <el-table-column label="请假结束时间" prop="leaveEndTime" width="170" />
            <el-table-column label="请假类型" prop="leaveType" width="150" />
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
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="changePage" v-if="isShow" background layout="prev, pager, next" :total="total"
            :page-size="pageSize">
          </el-pagination>
        </el-card>
      </div>

    </el-card>
  </div>
</template>
  
  <script type="text/ecmascript-6">
import Calendar from "vue-calendar-component";
import { checkTeachingDate } from "@/api/apply";
import { getMonthByUserId, findUserByUserid, addAdminLeaveForm } from "@/api/audit";
import { findLeaveFormByUserid, findLeaveByDept, quashLeaveById } from "@/api/apply"

export default {
  inject: ['reload'],

  components: {
    Calendar,
  },
  data () {
    return {
      dept: "",
      name: "",
      userid: "",
      week: "",
      selectDay: "",
      selectDate: [], //选中的日期
      form: {},
      dateArr: [],
      userList: [],

      isShow: false,      // 默认不显示分页
      tableData: [],
      total: 1,
      pageSize: 1,
      dateRange: '',
      labelPosition: 'left',
      userid: '',
      auditStatus: ["未审核", "审核通过", "审核不通过", "已撤销", "管理员录入"],


      attendanceSummaryTable: false,

      value1: '',
      value2: '',
      defaultdate: '',


      options2: [
        {
          value: "事假",
          label: "事假",
        },
        {
          value: "病假",
          label: "病假",
        },
        {
          value: "婚假",
          label: "婚假",
        },
        {
          value: "生育假",
          label: "生育假",
        },
        {
          value: "探亲假",
          label: "探亲假",
        },
        {
          value: "丧假",
          label: "丧假",
        },
        {
          value: "因公出差",
          label: "因公出差",
        },
        {
          value: "工伤假",
          label: "工伤假",
        },
        {
          value: "旷工",
          label: "旷工",
        },
      ],
    };
  },
  created () {
    var date = new Date();
    this.year = date.getFullYear(); //获取当前完整年份
    this.month = date.getMonth() + 1; //获取当前月份

    if (this.month < 10) {
      this.month = "0" + this.month;
    }
    this.defaultdate = this.year + '-' + this.month;
    this.userid = this.$store.getters.id;
    this.dept = this.$store.getters.yuanxi;
    this.name = this.$store.getters.name;

    let param = {
      "year": this.year,
      "month": this.month,
      "dept": this.dept
    }

    var myDate = new Date(); //创建Date对象
    var nowDate = this.changeDateFormat(myDate);
    checkTeachingDate({ checking_date: nowDate }).then((res) => {
      if (res.code === 200) {
        this.week = res.data.dateIndex;
      }
    });
    console.log(param)
    findLeaveByDept(param).then(res => {
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
  mounted () { },
  methods: {
    //输入用户数据后提示当前是否存在该用户或是否为空
    changeUserIdInput () {
      if (this.form.id == null) {
        this.$message.error("补录用户工号不能为空！");
      } else {
        findUserByUserid({ userid: this.form.id });
      }
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


    resetSelect () {
      //重置选中的日期
      this.selectDate = [];
    },
    clickDay (today) {
      //选中日期
      var nowDate = this.changeDateFormat(today);
      //日历组件左上角“教学周”显示
      checkTeachingDate({ checking_date: nowDate }).then((res) => {
        if (res.code === 200) {
          this.week = res.data.dateIndex;
        }
      });
      // today格式为2020/8/7 改为 20200807
      console.log("当前选中日期===>", today);
      let existDate = this.selectDate;
      let isExist = true;
      for (var i = 0; i < existDate.length; i++) {
        if (existDate[i].date === today) {
          console.log("当前日期存已在===>", today);
          this.selectDate.splice(i, 1);
          isExist = false;
        }
      }
      if (isExist) {
        //当前日期存在移除
        console.log("不存在-添加===>");
        let tempDate = { date: today, className: "mark1" };
        this.selectDate.push(tempDate);
      }
      console.log("this.selectDate===>", JSON.stringify(this.selectDate));
    },
    changeDate (data) {
      //左右点击切换月份
      var nowDate = this.changeDateFormat(data);
      this.selectDay = nowDate;
      var Y = this.selectDay.substring(0, 4); //获取当前完整年份
      var M = this.selectDay.substring(5, 7); //获取当前月份
      if (this.form.id) {
        this.showMarkedCalendar(Y, M, this.form.id);
      }
    },
    getDateArr (val) {
      var Y = this.selectDay.substring(0, 4); //获取当前完整年份
      var M = this.selectDay.substring(5, 7); //获取当前月份
      this.showMarkedCalendar(Y, M, val);
    },
    showMarkedCalendar (year, month, val) {
      //左右切换时更新标记的日期
      let params = {
        year: year,
        month: month,
        userId: val,
      };
      getMonthByUserId(params).then((res) => {
        if (res.data.resultCode == "0") {
          return;
        } else {
          let resultArr = res.data.result;
          let resDateList = [];
          for (var i = 0; i < resultArr.length; i++) {
            var strList = String(resultArr[i]).split("-");
            resDateList.push(
              (strList[0] + "/" + strList[1] + "/" + strList[2]).split("T")[0]
            );
          }
          this.dateArr = resDateList;
          console.log(this.dateArr);
        }
      });
    },
    addAttend () {
      if (this.form.id == null || this.form.region == null) {
        this.$message.error("补录考勤工号或补录请假类型为空！");
      } else {
        this.$confirm('确认添加考勤？添加后将无法撤销！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var flag = true;//全部补录信息标志位
          for (var i = 0; i < this.selectDate.length; i++) {
            var leaveStartTime =
              this.changeDateFormat(this.selectDate[i]["date"]) + " 00";
            var leaveEndTime =
              this.changeDateFormat(this.selectDate[i]["date"]) + " 23";
            let param = {
              adminId: this.userid,
              "leave-start-time": leaveStartTime,
              "leave-end-time": leaveEndTime,
              "leave-type": this.form.region,
              userid: this.form.id,
            };
            console.log(param);
            addAdminLeaveForm(param).then(res => {
              if (res.code != 200) {
                flag = false;
              }
            })
          }
          if (flag) {
            this.$message.success("补录信息成功。");
          } else {
            this.$message.error("补录信息失败！")
          }

        }).catch(() => {

        });

      }
    },
    submitTable () {
      this.$confirm('当前表格内容将提交下一级审核，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    exportTable () {
      this.$confirm('当前表格内容将导出，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '导出成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        });
      });
      var url = this.info.leaveMaterial.replace("/leaveMaterial", "")
      window.open(url);
    },
    // submitAttend(){
    //   this.attendanceSummaryTable = true
    // },
    /**
 * 选择查询
 */
    // 分页事件控制
    changePage (pageNum) {
      let param = {
        "year": this.year,
        "month": this.month,
        "dept": this.dept,
        "pageNum": pageNum
      }
      findLeaveByDept(param).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
        }
      });
    },

    dateChange (value) {
      console.log("====", value, this.value2)
      var date = new Date(value);
      this.year = date.getFullYear(); //获取当前完整年份
      this.month = date.getMonth() + 1; //获取当前月份
      if (this.month < 10) {
        this.month = "0" + this.month;
      }
      let param = {
        "year": this.year,
        "month": this.month,
        "dept": this.dept
      }
      findLeaveByDept(param).then(res => {
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

    //点击某条信息，跳转详情页面
    submitAttend () {
      //  路径/home对应我在router目录下index.js中定义的path属性值
      this.$router.push({
        name: 'SummaryDetail'
      });
    },
    rowChick (row, event, column) {
      const leaveDetail = JSON.stringify(row);
      window.sessionStorage.setItem('leaveDetail', leaveDetail);
      this.$router.push({
        name: 'DetailLeave'
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
  },
};
  </script>
  
  <style lang="scss">
.table {
  height: 70%;
  margin-top: -307px;
}
.contains {
  margin: 30px;
}
.el-card__header {
  padding: 18px 40px;
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

/** 选中后的信息标记 */
.mark1 {
  color: white !important;
  background: #1890ff !important;
  border-radius: 50%;
  user-select: none;
}

.mark2 {
  color: white !important;
  background: #616468 !important;
  border-radius: 50%;
  user-select: none;
}

.dialog-box {
  width: 500px;
}

.cal-box {
  width: 368px;
  position: relative;
  top: -345px;
  right: -787px;
  .week-box {
    font-size: 15px;
    color: #f56c6c;
    position: absolute;
    left: 25px;
    top: 15px;
  }
  .wh_container {
    .wh_content_all {
      /*主体*/
      background-color: #ffffff;
      // border: 1px silver solid;
      // border-radius: 5px;
      .wh_jiantou1 {
        /*左箭头*/
        border-top: 2px solid #909399;
        border-left: 2px solid #909399;
        width: 7px;
        height: 7px;
      }
      .wh_jiantou2 {
        /*右箭头*/
        border-top: 2px solid #909399;
        border-right: 2px solid #909399;
        width: 7px;
        height: 7px;
      }
      .wh_top_changge {
        display: flex;
        width: 50%;
        margin-left: 43%;
        .wh_content_li {
          font-family: Helvetica;
        }
      }
      .wh_top_changge li {
        /*当前年月标题*/
        color: #f56c6c;
        font-size: 15px;
      }
      .wh_item_date {
        width: 35px !important;
        height: 35px !important;
      }
      .wh_content_item {
        margin-top: 5px;
        .wh_top_tag {
          /*星期标题*/
          color: #000000;
        }
        .wh_item_date {
          /*当前月*/
          color: #000000;
        }
        .wh_item_date:hover {
          //悬浮
          color: #1890ff;
          background: #ffffff;
          border-radius: 50%;
        }
        .wh_other_dayhide {
          /*上月和下月时间*/
          color: #bfbfbf;
        }

        .wh_chose_day {
          //选中
          background: #ffffff;
          color: #000000;
        }
        .wh_isToday {
          /*当前天*/
          /*background: #33ad53;*/
          background: #00d985;
          color: #fff;
        }
      }
    }
  }
}
.button-box {
  position: relative;
  left: 51%;
  bottom: 342px;
}

// ::v-deep .wh_content_all {
//   background-color: #ffffff;
//   /* border: 1px silver solid; */
//   /* border-radius: 5px; */
// }
// ::v-deep .wh_top_changge li {
//   color: #f56c6c;
//   font-size: 15px;
// }
// ::v-deep .wh_content_item,
// ::v-deep .wh_content_item_tag {
//   color: #303133;
// }
// ::v-deep .wh_content_item .wh_isToday {
//   background: #00d985;
//   color: #fff;
// }

// ::v-deep .wh_content_item .wh_chose_day {
//   background: #409eff;
//   color: #ffff;
// }
// ::v-deep .wh_item_date {
//   width: 30px !important;
//   height: 30px !important;
// }

// ::v-deep .wh_content_item > .wh_isMark {
//   color: #ffff !important;
//   border-radius: 90px;
//   background: rgb(189, 189, 189);
//   z-index: 2;
// }

// ::v-deep .wh_item_date:hover {
//   background: rgb(217, 236, 255) !important;
//   border-radius: 100px !important;
//   color: rgb(102, 177, 255) !important;
// }

// ::v-deep .wh_jiantou1[data-v-2ebcbc83] {
//   border-top: 2px solid #909399;
//   border-left: 2px solid #909399;
//   width: 7px;
//   height: 7px;
// }

// ::v-deep .wh_jiantou2[data-v-2ebcbc83] {
//   border-top: 2px solid #909399;
//   border-right: 2px solid #909399;
//   width: 7px;
//   height: 7px;
// }

// ::v-deep .wh_top_tag[data-v-2ebcbc83] {
//   color: #409eff;
//   border-top: 1px solid rgba(227, 227, 227, 0.6);
//   border-bottom: 1px solid rgba(227, 227, 227, 0.6);
// }

// ::v-deep .wh_container[data-v-2ebcbc83] {
//   max-width: 280px;
// }

// ::v-deep .wh_top_changge[data-v-2ebcbc83] {
//   display: flex;
//   width: 50%;
//   margin-left: 43%;
// }

// ::v-deep .wh_top_changge .wh_content_li[data-v-2ebcbc83] {
//   font-family: Helvetica;
// }
</style>
  