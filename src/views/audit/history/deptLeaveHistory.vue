<template>
  <div class="app-container home">
    <table style="width: 100%">
      <tr>
        <td style="vertical-align: top">
          <el-col style="padding-left: 10px; float: left">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <!-- <div class="title">标题</div> -->
                  <div class="content" style="height: 250px">
                    <el-tabs value="first">
                      <el-tab-pane label="请假类型" name="first">
                        <div
                          id="leaveType"
                          style="width: 100%; height: 200px"
                        ></div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <!-- <div class="title">标题</div> -->
                  <div class="content" style="height: 250px">
                    <el-tabs value="first">
                      <el-tab-pane label="请假时长" name="first"
                        ><div
                          id="leaveTime"
                          style="width: 100%; height: 200px"
                        ></div
                      ></el-tab-pane>
                    </el-tabs>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <!-- <div class="title">标题</div> -->
                  <div class="content" style="height: 250px">
                    <el-tabs value="first">
                      <el-tab-pane label="请假频率" name="first"
                        ><div
                          id="leaveFrequency"
                          style="width: 100%; height: 200px"
                        ></div
                      ></el-tab-pane>
                    </el-tabs>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px" :gutter="10">
              <el-col :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <h3>{{ department }}历史请假记录</h3>
                  </div>
                  <div class="search">
                    <el-input placeholder="根据工号或姓名查询" v-model="input" class="input" clearable>
                      <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="工号" value="1"></el-option>
                        <el-option label="姓名" value="2"></el-option>
                      </el-select>
                      <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input>
                  </div>
                  <el-table
                    ref="filterTable"
                    :data="tableData"
                    border
                    style="width: 100%;"
                    @row-click="rowChick"
                  >
                    <el-table-column prop="id" label="序号" width="100">
                    </el-table-column>
                    <el-table-column
                      prop="user.userId"
                      label="工号"
                      width="100"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="user.userName"
                      label="姓名"
                      width="200"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="user.yuanXi"
                      label="学院(部门)"
                      width="200"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="leaveType"
                      label="请假类型"
                      width="100"
                    >
                    </el-table-column>
                    <el-table-column prop="leaveStartTime" label="起始时间">
                    </el-table-column>
                    <el-table-column prop="leaveEndTime" label="结束时间">
                    </el-table-column>
                  </el-table>
                  <div class="block">
                    <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="total"
                    >
                    </el-pagination>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </td>
        <td style="width: 20%; vertical-align: top">
          <el-col style="padding-left: 5px; float: left">
            <!-- <el-card
              shadow="hover"
              style="height: 260px; padding: 0px"
              :body-style="{ padding: '0px' }"
            >
              <div id="he-plugin-standard"></div>
            </el-card> -->

            <el-card
              shadow="hover"
              style="margin-top: 5px"
              :body-style="{ padding: '0px' }"
            >
              <div class="title">日期选择</div>
              <div class="con">
                <div class="now-data-myself">
                  <div class="now-data-myself-time">{{ date }}</div>
                  <div class="now-data-myself-week">{{ week }}</div>
                </div>
                <Calendar
                  v-on:choseDay="clickDay"
                  v-on:changeMonth="changeDate"
                  v-on:isToday="clickToday"
                  :markDate="arr"
                >
                </Calendar>
              </div>
            </el-card>

            <el-card
              shadow="hover"
              style="height: 200px; margin-top: 15px"
              :body-style="{ padding: '0px' }"
            >
              <div class="title">操作提示</div>
              <div style="padding: 0 20px; font-weight: 300">
                <p style="text-indent: 2em">
                  <span
                    >您可以通过点击日历上的日期来筛选当日缺勤的记录列表（请假时间包含所选中的日期）<br
                  /></span>
                </p>
                <p style="text-indent: 2em">
                  <span
                    >灰色标记区域为当日存在请假记录的日期，绿色区域为当前日期。</span
                  >
                </p>
              </div>
            </el-card>
          </el-col>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Calendar from "vue-calendar-component";
import {
  getMonthDeptAbsenceDate,
  getDeptHistoryLeaveTypeCount,
  getDeptHistoryLeaveDays,
  getDeptMemberFrequencyList,
  getHistoryLoadingList,
  getHistoryRecordByOneDate
} from "@/api/history";
import { getAuditSelected } from "@/api/audit";
export default {
  name: "deptLeaveHistory",
  components: {
    Calendar,
  },
  data() {
    return {
      // 版本号
      version: "3.3.0",
      date: "",
      week: "",
      input: "",
      select: "",
      length: 0,
      tableData: [],
      arr: [],
      arr_week: new Array(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ),
      role: "",
      yuanxi: "",
      id: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,
      department: this.$store.getters.yuanxi,
      leaveTypeOption: {},
      leaveTimeOption: {},
      leaveFrequencyOption: {},
    };
  },
  created() {
    var now = new Date();
    this.date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    this.week = this.arr_week[day];
    var that = this;
    let params = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      dept: that.$store.getters.yuanxi,
    };
    // console.log(params);
    getMonthDeptAbsenceDate(params).then((res) => {
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
        that.arr = resDateList;
        console.log(that.arr);
      }
    });
    //和风天气插件调用
    window.WIDGET = {
      CONFIG: {
        layout: "2",
        width: 300,
        height: 270,
        background: "1",
        dataColor: "FFFFFF",
        key: "1e6a2ab779504068bc84d42a4fc53885",
      },
    };
    (function (d) {
      var c = d.createElement("link");
      c.rel = "stylesheet";
      c.href =
        "https://widget.qweather.net/standard/static/css/he-standard.css?v=1.4.0";
      var s = d.createElement("script");
      s.src =
        "https://widget.qweather.net/standard/static/js/he-standard.js?v=1.4.0";
      var sn = d.getElementsByTagName("script")[0];
      sn.parentNode.insertBefore(c, sn);
      sn.parentNode.insertBefore(s, sn);
      s.onload = () => {
        //自动宽度
        setInterval(() => {
          try {
            document.getElementById("he-plugin-standard").style.width = "100%";
            document.getElementById("he-plugin-standard").style.backgroundSize =
              "100% 100%";
            document.getElementsByClassName("wv-lt-refresh")[0].style.display =
              "none";
            //document.getElementsByClassName("wv-lt-location")[0].getElementsByTagName("a")[0].style.display="none";
            //document.getElementsByClassName("wv-lt-location")[0].getElementsByTagName("span")[0].style.display="none";
            var local = document
              .getElementsByClassName("wv-lt-location")[0]
              .getElementsByTagName("span")[0].innerText;
            document.getElementsByClassName("wv-lt-col-7")[0].innerHTML =
              "<div class='wv-lt-location' style='font-size:15px;'><span>" +
              local +
              "</span></div>";
          } catch (e) {}
        }, 500);
      };
    })(document);
  },
  mounted() {
    this.yuanxi = this.department;
    this.role = this.$store.getters.role_num;
    this.id = this.$store.getters.id;
    this.loading();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    clickDay(data) {
      //选中某天并改变日期
      console.log(data);
      var now = new Date(data);
      this.date = now.getDate();
      this.week = this.arr_week[now.getDay()];
      this.selectedDate = data.split("/")[0] + "-" + data.split("/")[1] + "-" + data.split("/")[2];
      getHistoryRecordByOneDate({
        pageNum: this.currentPage,
        dept: this.department,
        nowDate: this.selectedDate
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      })
    },
    changeDate(data) {
      //左右点击切换月份
      var that = this;
      console.log(data);
      let params = {
        year: data.split("/")[0],
        month: data.split("/")[1],
        dept: this.$store.getters.yuanxi,
      };
      getMonthDeptAbsenceDate(params).then((res) => {
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
          that.arr = resDateList;
          console.log(that.arr);
        }
      });
    },
    clickToday(data) {
      // 跳到了本月（轮询）
      console.log(data);
    },
    statusChange(value) {
      this.radio = value;
      if (value === "全部") {
        this.searchInfo.status = "null";
      } else {
        this.searchInfo.status = value;
      }
      this.currentPage = 1;
      console.log();
      getAuditSelected({
        department: this.searchInfo.department,
        pageNum: this.currentPage,
        selectuserid: this.searchInfo.selectuserid,
        status: this.searchInfo.status,
        userid: this.id,
        username: this.searchInfo.username,
      }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      });
    },
    loading() {
      getHistoryLoadingList({
        pageNum: this.currentPage,
        dept: this.department,
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        }
      });
      // 以下全局，我引入echarts属性（若是多个页面需要引入echarts的话，一定要在main.js中引入
      var leaveTypeChart = this.$echarts.init(
        document.getElementById("leaveType")
      );
      var leaveTimeChart = this.$echarts.init(
        document.getElementById("leaveTime")
      );
      var leaveFrequencyChart = this.$echarts.init(
        document.getElementById("leaveFrequency")
      );
      // 请假类型统计饼状图图表
      getDeptHistoryLeaveTypeCount({
        dept: this.department,
      }).then((res) => {
        leaveTypeChart.setOption({
          title: {
            text: this.department + "各请假类型统计（次）",
          },
          tooltip: {},
          grid: {
            top: "18%",
            left: "10%", // grid布局设置适当调整避免X轴文字只能部分显示
            right: "10%", // grid布局设置适当调整避免X轴文字只能部分显示
            bottom: "15%",
          },
          series: [
            {
              type: "pie",
              data: res.data,
              radius: "50%",
            },
          ],
        });
      });
      // 请假时长统计条状图图表
      getDeptHistoryLeaveDays({
        dept: this.department,
      }).then((res) => {
        // 对最大的一列单独设置样式
        var max = res.data[0]; // 最大值
        var idx = 0; // 最大值索引
        for (var i = 1; i < res.data.length; i++) {
          if (max < res.data[i]) {
            max = res.data[i];
            idx = i;
          }
        }
        (res.data[idx] = {
          value: res.data[idx],
          // 设置单个柱子的样式
          itemStyle: {
            color: "#91cc75",
            shadowColor: "#91cc75",
            borderType: "dashed",
            opacity: 0.5,
          },
        }),
          // 设置表单样式
          leaveTimeChart.setOption({
            title: {
              text: this.department + "请假时长统计（天）",
            },
            tooltip: {},
            grid: {
              top: "18%",
              left: "10%", // grid布局设置适当调整避免X轴文字只能部分显示
              right: "10%", // grid布局设置适当调整避免X轴文字只能部分显示
              bottom: "15%",
            },
            xAxis: {
              type: "category",
              splitNumber: 6,
              interval: 0, // 坐标轴刻度标签的显示间隔，在类目轴中有效；默认会采用标签不重叠的策略间隔显示标签；
              rotate: -60, // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠；旋转的角度从-90度到90度
              boundaryGap: true, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样,设置false x轴与网格线对齐
              data: [
                "事假",
                "病假",
                "婚假",
                "产假/陪产假",
                "丧假",
                "因公出差",
                "工伤假",
              ],
            },
            yAxis: {},
            series: [
              {
                type: "bar",
                data: res.data,
              },
            ],
          });
      });
      // 请假频率统计折线图图表
      getDeptMemberFrequencyList({
        year: new Date().getFullYear(),
        dept: this.department,
      }).then((res) => {
        leaveFrequencyChart.setOption({
          title: {
            text: this.department + "个人请假频率统计（次/年）",
          },
          tooltip: {},
          grid: {
            top: "18%",
            left: "25%", // grid布局设置适当调整避免X轴文字只能部分显示
            right: "10%", // grid布局设置适当调整避免X轴文字只能部分显示
            bottom: "15%",
          },
          xAxis: {
            max: "dataMax",
          },
          yAxis: {
            type: "category",
            data: res.data.nameList,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 4, // only the largest 3 bars will be displayed
          },
          series: [
            {
              name: "教师姓名",
              type: "bar",
              data: res.data.numList,
              label: {
                show: true,
                position: "right",
                valueAnimation: true,
              },
            },
          ],
        });
      });

      // 使用刚指定的配置项和数据显示图表。
      leaveTypeChart.setOption(this.leaveTypeOption);
      leaveTimeChart.setOption(this.leaveTimeOption);
      leaveFrequencyChart.setOption(this.leaveFrequencyOption);
    },
    handleCurrentChange(val) {
      getHistoryLoadingList({ pageNum: val, dept: this.department }).then(
        (res) => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        }
      );
    },
    //点击某条信息，跳转详情页面
    rowChick(row, event, column) {
      const leaveDetail = JSON.stringify(row);
      window.sessionStorage.setItem("leaveDetail", leaveDetail);
      this.$router.push({
        name: "DetailLeave",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  overflow-y: auto;
  height: calc(100vh - 36px);
  background-color: #f6f9f9;
  padding-bottom: 10px;
  padding-right: 10px;
}
.title {
  width: 100%;
  line-height: 43px;
  background-color: #0069e5;
  color: white;
  padding-left: 10px;
}
.content {
  padding: 5px;
  height: 70px;
}
.search {
  width: 400px;
  margin-bottom: 10px;
}
.box-card ::v-deep .el-card__header {
  border-bottom: 1.5px solid #ebeef5;
  width: 100%;
  height: 70%;
}

.box-card div h3 {
  font-size: 22px;
  font-weight: 700;
  color: #304156;
  margin: 0 auto;
  text-align: center;
}

.el-card {
  border-radius: 1px;
}
::v-deep .now-data-myself {
  width: 40%;
  position: absolute;
  border-right: 1px solid rgba(227, 227, 227, 0.6);
}

.el-card-define {
  min-height: 100%;
  height: 100%;
  width: 300px;
  margin: 0px auto;
}

::v-deep .con {
  position: relative;
  max-width: 280px;
  margin: 20px auto;
}

::v-deep .con .wh_content_all {
  background: transparent !important;
}

::v-deep .wh_top_changge li {
  color: #f56c6c !important;
  font-size: 15px !important;
}

::v-deep .wh_content_item,
::v-deep .wh_content_item_tag {
  color: #303133 !important;
}

::v-deep .wh_content_item .wh_isToday {
  background: #00d985 !important;
  color: #fff !important;
}

::v-deep .wh_content_item .wh_chose_day {
  background: #409eff !important;
  color: #ffff !important;
}

::v-deep .wh_item_date {
  width: 30px !important;
  height: 30px !important;
}

::v-deep .wh_content_item > .wh_isMark {
  color: #ffff !important;
  border-radius: 90px;
  background: rgb(189, 189, 189);
  z-index: 2;
}

::v-deep .wh_item_date:hover {
  background: rgb(217, 236, 255) !important;
  border-radius: 100px !important;
  color: rgb(102, 177, 255) !important;
}

::v-deep .wh_jiantou1[data-v-2ebcbc83] {
  border-top: 2px solid #909399;
  border-left: 2px solid #909399;
  width: 7px;
  height: 7px;
}

::v-deep .wh_jiantou2[data-v-2ebcbc83] {
  border-top: 2px solid #909399;
  border-right: 2px solid #909399;
  width: 7px;
  height: 7px;
}

::v-deep .wh_top_tag[data-v-2ebcbc83] {
  color: #409eff;
  border-top: 1px solid rgba(227, 227, 227, 0.6);
  border-bottom: 1px solid rgba(227, 227, 227, 0.6);
}

::v-deep .wh_container[data-v-2ebcbc83] {
  max-width: 280px;
}

::v-deep .wh_top_changge[data-v-2ebcbc83] {
  display: flex;
  width: 50%;
  margin-left: 43%;
}

::v-deep .now-data-myself-time {
  color: #f56c6c;
  font-size: 23px;
  height: 30px;
  font-family: "Helvetica Neue";
  padding-left: 10px;
}

::v-deep .now-data-myself-week {
  font-size: 10px;
  color: #909399;
  padding-left: 10px;
}

::v-deep .wh_top_changge .wh_content_li[data-v-2ebcbc83] {
  font-family: Helvetica;
}
</style>
