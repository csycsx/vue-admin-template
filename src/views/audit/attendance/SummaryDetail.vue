<template>
    <div class="contains">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>考勤汇总</h3>
          <el-date-picker
            v-model="pickMonthRange"
            style="float: left;bottom: 5px;"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button style="float: right; padding: 3px 0 8px 0" type="text" @click="exportTable">导出汇总表</el-button>
          <el-table :data="tableData"  border style="">
            <el-table-column label="起始日期" property="gmtCreate"  :formatter="formatDate"></el-table-column>
            <el-table-column label="结束日期" property="gmtModified" :formatter="formatDate" ></el-table-column>
            <!-- <el-table-column label="编号" property="id"  ></el-table-column> -->
            <el-table-column label="工号" prop="user.id"   ></el-table-column>
            <el-table-column label="事假" prop="shijiaDays"  ></el-table-column>
            <el-table-column label="病假" prop="bingjiaDays"   ></el-table-column>
            <el-table-column label="婚假" prop="hunjiaDays"  ></el-table-column>
            <el-table-column label="生育假" prop="shengyujiaDays" ></el-table-column>
            <el-table-column label="探亲假" prop="tanqinjiaDays" ></el-table-column>
            <el-table-column label="丧假" prop="sangjiaDays" ></el-table-column>
            <el-table-column label="公差" prop="gongchaiDays"  ></el-table-column>
            <el-table-column label="旷工" prop="kuanggongDays"  ></el-table-column>
            <el-table-column label="其它" prop="inactiveDays" ></el-table-column>
            <el-table-column label="备注" prop="leaveReason" ></el-table-column>
            
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitTable">提 交</el-button>
            <el-button type="primary" @click="cancelSubmit">返回考勤页</el-button>

          </div>
        </div>
        <div class="table">
        
        </div>


      </el-card>
    </div>
  </template>
  
  <script type="text/ecmascript-6">
  import Calendar from "vue-calendar-component";
  import { checkTeachingDate } from "@/api/apply";
  import JSZipUtils from 'jszip-utils'
  import PizZip from 'pizzip'
  import docxtemplater from 'docxtemplater'
  import { saveAs } from 'file-saver'

  import { getMonthByUserId, findUserByUserid, addAdminLeaveForm } from "@/api/audit";
  import { findLeaveFormByUserid, listLeaveByTimePeriodAndAuditStatus, quashLeaveById } from "@/api/apply"
  import { getLeaveHistoryByDept, singleHistoryAudit } from '@/api/history'

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

        info:{},
        isShow: false,      // 默认不显示分页
        tableData: [],
        total: 1,
        pageSize: 1,
        dateRange: '',
        labelPosition: 'left',
        userid: '',
        auditStatus: ["未审核", "审核通过", "审核不通过", "已撤销", "管理员录入"],



        pickerOptions: {
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        pickMonthRange: '',
    

      };
    },
    created () {

      var myDate = new Date(); //创建Date对象
      var nowDate = this.changeDateFormat(myDate);
      checkTeachingDate({ checking_date: nowDate }).then((res) => {
        if (res.code === 200) {
          this.week = res.data.dateIndex;
        }
      });
      this.userid = this.$store.getters.id;
      this.name = this.$store.getters.name;
      this.dept = this.$store.getters.yuanxi;
      this.year = "2023";
      this.month = "5"  

      let param = { 
        "year": this.year,
        "month": this.month,
        "dept": this.dept 
      }

      getLeaveHistoryByDept(param).then(res => {
        console.log("resresres",res);
        this.info=res.data.records
        this.tableData = res.data.records
      })
    },
    mounted () {

     },
    methods: {

      submitTable() {
        this.$confirm('当前表格内容将提交下一级审核，是否确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let param = {
          //   year: this.year,
          //   month: this.month,
          //   dept: this.$store.getters.yuanxi,
          //   userid: this.$store.getters.id,
          //   role: "1",
          //   result: "通过",
          //   recommend: "无"
          // }
          let formData = new FormData();
          formData.append("year", this.year);
          formData.append("month", this.month);
          formData.append("dept", this.$store.getters.yuanxi);
          formData.append("userid", this.$store.getters.id);
          formData.append("role", "1");
          formData.append("result", "通过");
          formData.append("recommend", "无");
          singleHistoryAudit(formData).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.$router.push({
                name: 'DpAuditList'
              })
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });          
        });
      },

      cancelSubmit(){
        this.$confirm('当前表格内容还未提交下一级审核，是否确认返回考勤页？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '返回!'
          // });
          this.$router.push({
                name: 'DpSubmit'
              })   
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消返回'
          });     
           
        });
      },
      getWordData () {
        console.log("getWordDatainfo",this.info)
        let data = this.info;
        let table=this.info;
        console.log("@@@getWordDatainfo",data)

        // let data = this.tableData;
          data.forEach((info, index) => {
            console.log("item,index",info,index)
            data.nowyear = info.year;
            data.nowmonth = info.month;
            data.department = info.department;
            data.year = info.year;
            data.month = info.month;
            data.day = info.gmtCreate.substring(8,10);
            data.username = info.user.userName;
            // table.a = info.shijiaDays;
            data.b = info.bingjiaDays;
            data.c = info.hunjiaDays;
            data.d = info.shengyujiaDays;
            data.e = info.tanqinjiaDays;
            data.f = info.sangjiaDays;
            data.g = info.gongshangjiaDays;
            data.h = info.gongchaiDays;
            data.i = info.kuanggongDays;
            console.log("@@@",data.department,table.a,data.b)
            table.forEach((info,index)=>{
              table.a = info.shijiaDays;
              console.log("##",table.a)
            })
          })
        // if (this.detailInfo.departmentStatus !== "2" && this.stepInfo.departmentAuditMsg !== "尚未进行部门审核") {
        //   data.departmentResult = this.stepInfo.departmentAuditMsg.dpLeaderResult + ',' + this.stepInfo.departmentAuditMsg.dpLeaderRecommend;
        // }
        // if (this.detailInfo.hrStatus !== "2" && this.stepInfo.hrAuditMsg !== "尚未进行人事处审核") {
        //   data.hrResult = this.stepInfo.hrAuditMsg.hrLeaderResult + ',' + this.stepInfo.hrAuditMsg.hrLeaderRecommend;
        // }
        // if (this.detailInfo.schoolStatus !== "2" && this.stepInfo.schoolAuditMsg !== "尚未进行校领导审核") {
        //   data.scResult = this.stepInfo.schoolAuditMsg.scLeaderResult + ',' + this.stepInfo.schoolAuditMsg.scLeaderRecommend;
        // }
        console.log('111' + data);
        return data;
      },
      exportTable () {
        console.log("@@@this.info",this.info);

      let that = this;
      let data = that.getWordData();
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent("/考勤汇总表.docx", function (error, content) {
        // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new docxtemplater().loadZip(zip);
        // 设置模板变量的值

        doc.setData(data);
        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, "考勤汇总表.docx");
      });
    },
      exportTable0(){
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


       //改变年月显示格式 
       formatDate(row, column) {
          // 获取单元格数据
          let data = row[column.property]
          console.log("data",data)
          if(data == null) {
              return null
          }
          let dt = new Date(data)
          return dt.getFullYear() + '-' + (dt.getMonth() + 1) 
          // return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
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
      // clickDay (today) {
      //   //选中日期
      //   var nowDate = this.changeDateFormat(today);
      //   //日历组件左上角“教学周”显示
      //   checkTeachingDate({ checking_date: nowDate }).then((res) => {
      //     if (res.code === 200) {
      //       this.week = res.data.dateIndex;
      //     }
      //   });
      //   // today格式为2020/8/7 改为 20200807
      //   console.log("当前选中日期===>", today);
      //   let existDate = this.selectDate;
      //   let isExist = true;
      //   for (var i = 0; i < existDate.length; i++) {
      //     if (existDate[i].date === today) {
      //       console.log("当前日期存已在===>", today);
      //       this.selectDate.splice(i, 1);
      //       isExist = false;
      //     }
      //   }
      //   if (isExist) {
      //     //当前日期存在移除
      //     console.log("不存在-添加===>");
      //     let tempDate = { date: today, className: "mark1" };
      //     this.selectDate.push(tempDate);
      //   }
      //   console.log("this.selectDate===>", JSON.stringify(this.selectDate));
      // },
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
    
    
      // submitAttend(){
      // },
        /**
     * 选择查询
     */
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

  .dialog-footer{
    position: relative;
    right: -89%;
    top: 8px;
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

  .dialog-box{
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
  .button-box{
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
  