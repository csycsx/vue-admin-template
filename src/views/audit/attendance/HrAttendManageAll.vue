<template>
  <div class="box">
    <div class="app-container">
    <!-- <h2 class="box-title">考勤记录</h2> -->
   
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>各学院考勤汇总</h3>
        </div>
    <!-- 搜索 -->
        <div class="search">
          <el-input v-model="input" placeholder="请输入查询内容" ></el-input>
        </div>

        <el-table ref="filterTable" :data="tables" border style="width: 1000px">
          <el-table-column prop="id" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="department" label="院系" width="300">
          </el-table-column>
          <!-- <el-table-column prop="" label="最后一次审核申请提交时间" width="200">
          </el-table-column> -->
          <el-table-column prop="" label="备注" width="230">
          </el-table-column>
          <el-table-column  label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click=" rowChick(scope.row)" type="text" size="small">查看</el-button>
            </template>
            
            </el-table-column>
        </el-table>
      </el-card>
    </div>
    
  </div>

  </div>
  
</template>

<script type="text/ecmascript-6">
import { getAuditLoadingDataByUserId, getRevokeAuditSelected,updateSchoolDepartment,} from "@/api/audit";
import StepInfo from "../components/StepInfo";
import { getSchoolDepartment ,SingleleaveAudit, getCurrentAuditMsg } from "@/api/audit";


export default {
  props: ['info'],
  components: { StepInfo },
  data () {
    return {

      tableData:[],
      input: '',
      select: '',
      role: "",
      yuanxi: "",
      id: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,


      dept:[],
      

      active: 0,
      step: 2,
      userid: "",
      
      check: {
        result: "",
        recomment: "",

      },
      isShow: 0,
      isFinish: 0,
      // stepInfo1: {},
      // stepInfo2: {},
      // stepInfo3: {},
      // stepInfo4: {},
      // stepInfo5: {},
      showChangeTime: false,
      changeTime: "",




      searchInfo: {
        department: "null",
        selectuserid: "null",
        status: "null",
        username: "null"
      },
    }
  },
  created () {
    this.role = this.$store.getters.role_num;
    this.userid = this.$store.getters.id;


    // let param = { 
    //     "year": this.year,
    //     "month": this.month,
    //     "dept": this.dept 
    //   }
    // updateSchoolDepartment(param).then(res => {
    //   console.log("res",res);
    //   // this.gridData = res.data.records
    // })
  },
  mounted () {
    this.yuanxi = this.$store.getters.yuanxi
    this.role = this.$store.getters.role_num
    this.id = this.$store.getters.id
    this.SchoolDp();
    // this.info = JSON.parse(window.sessionStorage.getItem('leaveDetail'));
    // console.log(this.info, this.role)
  },
  

 
  // 搜索
  computed:{
    tables(){ 
      const input = this.input
      if (input) {
        // console.log("input输入的搜索内容：" + this.input)
        return this.tableData.filter(data => {
          console.log("object:" + Object.keys(data))
          return Object.keys(data).some(key => {
            return String(data[key]).toUpperCase().indexOf(input) > -1

          })
        })
      }
      return this.tableData
    }
   },
   

  methods: {
    
    submitListAudit(){
    //  路径/home对应在router目录下index.js中定义的path属性值
        this.$router.push({
          name:'HrAttendManageTry'
          // name:'AttendanceAuditTry'

        });
    },
    
    

    SchoolDp () {
      getSchoolDepartment({}).then(res => {
      console.log(" getSchoolDepartment", res.data)
        if (res.code === 200) {
        // this.tableData = res.data;
        let dpArray = res.data;
          dpArray.forEach((item, index) => {
            let obj = {
              id: index+1,
              department: item
            }
          this.tableData.push(obj);
          })
          console.log("tableData", this.tableData);
        }
      })
    },


    rowChick (row, event, column) {
      console.log("departmentDetail",row)

      // let isShow = 0;
      // if (row.departmentStatus === "0") isShow = 1;
      const departmentDetail = JSON.stringify(row);
      console.log("departmentDetail",departmentDetail)
      window.sessionStorage.setItem('departmentDetail', departmentDetail);
      this.$router.push({
        name: 'HrAttendManageTry',    // 详情页传入行参数
        // query: {
        //   id: row.id,
        //   isShow: isShow
        // }
      })
    },
    search () {
      this.searchInfo.username = "null";
      this.searchInfo.selectuserid = "null";
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
        if (this.select === "1") {
          this.searchInfo.selectuserid = this.input;
        }
        else {
          this.searchInfo.username = this.input;
        }
        this.currentPage = 1;
        getRevokeAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": this.currentPage,
          "selectuserid": this.searchInfo.selectuserid,
          "userid": this.id,
          "username": this.searchInfo.username
        }).then(res => {
          console.log("getRevokeAuditSelected",res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      }
    },

    handleCurrentChange (val) {
      if (this.searchInfo.department === "null" && this.searchInfo.username === "null" && this.searchInfo.selectuserid === "null") {
        getAuditLoadingDataByUserId({ "pageNum": val, "userid": this.id }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      } else {
        getRevokeAuditSelected({
          "department": this.searchInfo.department,
          "pageNum": val,
          "selectuserid": this.searchInfo.selectuserid,
          "userid": this.id,
          "username": this.searchInfo.username
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.pageSize = res.data.size;
            this.total = res.data.total;
          }
        })
      }
    }
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
  width: 400px;
  position: relative;
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
