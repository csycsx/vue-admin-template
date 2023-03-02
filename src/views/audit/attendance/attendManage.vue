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
              <el-form-item
                label="所在部门"
                prop="department"
                style="height: 62px; margin-bottom: 10px"
              >
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
                  <el-option
                    v-for="item in options2"
                    :key="item.leave_type"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="cal-box">
        <div class="week-box">{{ week }}</div>
        <Calendar
          v-on:choseDay="clickDay"
          v-on:changeMonth="changeDate"
          :markDate="dateArr"
          :markDateMore="selectDate"
        >
        </Calendar>
      </div>
      <el-button type="primary" @click="addAttend">添加考勤</el-button>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import Calendar from "vue-calendar-component";
import { checkTeachingDate } from "@/api/apply";
import { getMonthByUserId, findUserByUserid, addAdminLeaveForm } from "@/api/audit";
export default {
  components: {
    Calendar,
  },
  data() {
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
  created() {
    var myDate = new Date(); //创建Date对象
    var nowDate = this.changeDateFormat(myDate);
    checkTeachingDate({ checking_date: nowDate }).then((res) => {
      if (res.code === 200) {
        this.week = res.data.dateIndex;
      }
    });
    // findAllUser().then((res) => {
    //   if (res.code === 200) {
    //     this.userList = res.data;
    //   }
    // });
    // this.selectDay = nowDate;
    // this.userid = this.$store.getters.id;
    // this.name = this.$store.getters.name;
    // this.dept = this.$store.getters.yuanxi;
  },
  mounted() {},
  methods: {
    //输入用户数据后提示当前是否存在该用户或是否为空
    changeUserIdInput() {
      if (this.form.id == null) {
        this.$message.error("补录用户工号不能为空！");
      } else {
        findUserByUserid({userid: this.form.id});
      }
    },
    changeDateFormat(date) {
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
    resetSelect() {
      //重置选中的日期
      this.selectDate = [];
    },
    clickDay(today) {
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
    changeDate(data) {
      //左右点击切换月份
      var nowDate = this.changeDateFormat(data);
      this.selectDay = nowDate;
      var Y = this.selectDay.substring(0, 4); //获取当前完整年份
      var M = this.selectDay.substring(5, 7); //获取当前月份
      if (this.form.id) {
        this.showMarkedCalendar(Y, M, this.form.id);
      }
    },
    getDateArr(val) {
      var Y = this.selectDay.substring(0, 4); //获取当前完整年份
      var M = this.selectDay.substring(5, 7); //获取当前月份
      this.showMarkedCalendar(Y, M, val);
    },
    showMarkedCalendar(year, month, val) {
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
    addAttend() {
      if (this.form.id == null || this.form.region == null) {
        this.$message.error("补录考勤工号或补录请假类型为空！");
      } else {
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
      }
    },
  },
};
</script>

<style lang="scss">
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

.cal-box {
  width: 300px;
  position: relative;
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

        .wh_chose_day { //选中
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
