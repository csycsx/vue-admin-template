<template>
  <div class="box">
    <div class="app-container">
    <!-- 表格 -->
    <div class="table">

       

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>{{ dept }}考勤记录</h3>
        </div>

         <!-- 搜索 -->
      <div class="search">
        <el-date-picker
          v-model="input"
          format="yyyy"
          value-format="yyyy"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </div>

        <el-table ref="filterTable" :data="tables" border style="width: 1000px">
          <el-table-column prop="gmtCreate" label="提交时间" :formatter="formatDate" width="180">
          </el-table-column>
          <el-table-column prop="year,month" label="所属年月" width="230">
            <template slot-scope="scope">
              {{scope.row.year}}年{{ scope.row.month }}月
            </template>
          </el-table-column>
          <el-table-column prop="department" label="院系" width="230">
          </el-table-column>
          <el-table-column prop="dpOfficerStatus" label="状态" width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.dpOfficerStatus === '0' ? 'danger'  : 'success'" disable-transitions>
                {{auditStatus[scope.row.dpOfficerStatus]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="showStatus" label="备注" width="150">
          </el-table-column>
          <el-table-column  label="操作" width="90">
            <template slot-scope="scope">
              <el-button @click=" submitListAudit(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      
       
      </el-card>
    </div>
    
  </div>

  </div>
  
</template>

<script type="text/ecmascript-6">
import StepInfo from "../components/StepInfo";
import { findHistoryAudit, singleHistoryAudit,getCurrentAuditMsg,findLeaveByDept} from "../../../api/audit";


export default {
  props: ['info'],
  components: { StepInfo },
  data () {
    return {

      auditStatus: ["未审核", "已审核"],
      tableData: [],
      input: '',
      id: "",

      userid: "",
      year:"",
      month:"",
      recommend:"",
      role:"",
      dept:"",

      check: {
        result: "",
        recomment: "",

      },
      // isShow: 0,
      // isFinish: 0,
      // value3: '',
      // result:"",
      // yuanxi: "",

      // active: 0,
      // step: 2,
      // activeNames: ['1'],
      // searchInfo: {
      //   department: "null",
      //   selectuserid: "null",
      //   status: "null",
      //   username: "null"
      // },
    }
  },
  created () {
    // 登录用户的一些数据
    this.role = this.$store.getters.role_num;
    // this.userid = this.$store.getters.id;
   },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    console.log("11111",this.$store.getters)
    this.attendanceList();
    // this.tryA();
    // this.tryB()


  },

  computed:{
    tables(){ 
      const input = this.input
      if (input) {
        // console.log("input输入的搜索内容：" + this.year)
        return this.tableData.filter(data => {
          // console.log("object:" + Object.keys(data))
          return Object.keys(data).some(key => {
            return String(data[key]).toUpperCase().indexOf(input) > -1

          })
        })
      }
      return this.tableData
    }
   },
  
  methods: {
    attendanceList () {
      findHistoryAudit({"userid": this.id}).then(res => {
        console.log(" getSchoolDepartment", res)
        if (res.code === 200) {
          this.tableData = res.data.records;
          let dpArray = this.tableData;
          dpArray.forEach((item, index) => {
            // console.log("item,index",item,index)
            this.year=item.year
            this.month=item.month
          })
          console.log("this.tableData",this.tableData)
        }
      })
    },

    tryB(){
      findLeaveByDept({
        "year": this.year,
        "month": this.month,
        "dept": this.dept 
      }).then(res => {
        if (res.code === 200) {
          console.log("findLeaveByDeptresres",res)
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

    tryA(){
      singleHistoryAudit({ 
        "userid": this.id,
        "dept":this.yuanxi,
        // "month": "6",
        "month":this.month,
        "recommend": this.check.recomment,
        "result":this.check.result,
        "role":this.role,
        "year": this.year,
      }).then(res =>{
        console.log("@@@@@@@@",res.data)
      })
    },

    submitListAudit(row){
      const attendanceDetail = JSON.stringify(row);
      console.log("@@@attendanceDetail",attendanceDetail)
      window.sessionStorage.setItem('attendanceDetail', attendanceDetail);
      //  路径/home对应我在router目录下index.js中定义的path属性值
          this.$router.push({
            name:'SummaryAudit'
          });
      },


     //改变年月显示格式 
     formatDate(row, column) {
          // 获取单元格数据
          let data = row[column.property]
          // console.log("data",data)
          if(data == null) {
              return null
          }
          let dt = new Date(data)
          return dt.getFullYear() + '年' + (dt.getMonth() + 1)+'月'+ dt.getDate()+'日'
          // return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
        },

   
  
  },
  components: {}
}
</script>

<style scoped>
.box {
  display: flex;
  background: #ffffff;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  flex-direction: column;
  align-items: center;
}
.app-container {
  margin: 30px;
}
.box-title {
  margin: 0;
  padding: 20px;
  text-align: center;
}

/* 搜索 */
.search {
  position: relative;
  width: 400px;
  top: -11px;
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

.check-box {
  width: 80%;
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
