<template>
  <div class="app-container home">
    <table style="width: 100%">
      <tr>
        <td style="vertical-align: top">
          <el-col style="padding-left: 10px; float: left">
            <el-row :gutter="10">
              <el-col :span="6" v-for="(item, index) in departmentMap" :key="index" style="margin-top: 10px;">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <div :class="(index%2==0)?'title1':'title2'">{{ item.department }}历史请假记录</div>
                  <div class="content" style="height: 450px">
                    <el-tabs type="border-card">
                      <el-tab-pane label="请假历史" style="height:315px;">
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
                      </el-tab-pane>
                      <el-tab-pane label="图表分析" style="height:315px;">图表分析</el-tab-pane>
                      <el-tab-pane label="部门详细信息" style="height:315px;">
                        <div style="padding: 0 20px; font-weight: 300">
                          <h3>分管部门校领导：{{ item.leaderUser.userName }}</h3>
                          <div>
                            校领导工号：{{ item.leaderUser.userId }}<br>
                            校领导所属部门：{{ item.leaderUser.yuanXi }}
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                    <div style="text-align:center; margin-top: 10px; color: blue;">
                      <a @click="jumpToDetail(item)">查看{{ item.department }}详情→</a>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
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
  getHistoryRecordByOneDate,
  getAllSchoolDeptMsg
} from "@/api/history";
export default {
  name: "hrLeaveHistory",
  components: {
    Calendar,
  },
  data() {
    return {
      // 版本号
      version: "3.3.0",
      date: "",
      week: "",
      departmentMap: {},
      length: 0,
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

    };
  },
  created() {
    var now = new Date();
    this.date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    this.week = this.arr_week[day];
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
    // 获取全校校领导与部门对应关系
    getAllSchoolDeptMsg().then(res => {
      console.log(res.data);
      this.departmentMap = res.data;
    })
  },
  mounted() {
    this.yuanxi = this.department;
    this.role = this.$store.getters.role_num;
    this.id = this.$store.getters.id;
    this.loading();
  },
  methods: {
    jumpToDetail(leader) {
      this.$router.push({
        name: 'DetailHistory',    // 详情页传入行参数
        query: {
          leaderUser: leader
        }
      })
    },
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
    },
    changeDate(data) {
      //左右点击切换月份
    },
    clickToday(data) {
      // 跳到了本月（轮询）
      console.log(data);
    },
    loading() {
    }

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
.title1 {
  width: 100%;
  line-height: 43px;
  background-color: #0069e5;
  color: white;
  padding-left: 10px;
  text-align: center;
  font-size: large;
  overflow: hidden;
  white-space: nowrap;
}
.title2 {
  width: 100%;
  line-height: 43px;
  background-color: #946af7;
  color: white;
  padding-left: 10px;
  text-align: center;
  font-size: large;
  overflow: hidden;
  white-space: nowrap;
}
.content {
  padding: 5px;
  height: 70px;
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
.el-tabs__content {
  height:320px;
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
  background-color: transparent;
  font-weight: bold;
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
