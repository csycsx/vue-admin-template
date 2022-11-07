<template>
<!-- xll -->
 <div class="app-container">
    <el-header>调休信息</el-header>
    <!-- 卡片视图 -->
    <el-card>
          <!-- 表单 -->
      <el-table 
        :data="adjustList"
        style="width: 100%">
    
        <el-table-column
          label="假期名称" 
          prop="holidayName"
        >
        </el-table-column>
        <el-table-column
          type="date"
          prop="holidayStartDate"
          label="开始日期" 
          :formatter="dateFormat"  
        >   
        </el-table-column>
            <el-table-column
          type="date"
          prop="holidayEndDate"
          label="结束日期"
          :formatter="dateFormat"    
        >    
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" >
      
      <!-- 修改按钮 -->
            <el-button size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
      
          </template>
        </el-table-column>
      </el-table>
      
    </el-card>
    
        <el-button @click="addVocationVisible = true" style="width:30%;margin:10px 500px">+</el-button>
 
     <!-- 对话框修改和新增 -->
      <!-- 修改信息 -->
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="25%"
      @close="editDialogClosed">
     <el-form>
      <el-form-item label="假期名称" >
        <el-input v-model="editForm.holidayName" ></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  >
      <el-input v-model="editForm.holidayStartDate" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-input v-model="editForm.holidayEndDate" type="date"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcalender()">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 新增信息 -->
    <el-dialog 
      title="新增假期" 
      :visible.sync="addVocationVisible"
      width="25%"
      @close="addDialogClose">
      <el-form>
     <el-form-item label="ID" >
        <el-input v-model="addForm.calenderId"></el-input>
      </el-form-item>
      <el-form-item label="假期名称" >
        <el-input v-model="addForm.holidayName"></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  >
      <el-input v-model="addForm.holidayStartDate" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-input v-model="addForm.holidayEndDate" type="date"></el-input>
      </el-form-item> 
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVocationVisible=false">取 消</el-button>
          <el-button type="primary" @click="addVocation">确 定</el-button>
        </div>
      </el-dialog>

  </div>
  
</template>

<script>
import axios from 'axios'
import { getcalenderList} from '@/api/admin'
export default {
  data() {
    return {
      //获取列表的参数对象
      adjustList:[
          {
          holidayStartDate: '2016-05-02',
          holidayEndDate: '2016-05-02',
          holidayName: '王小虎',
        },
         {
          holidayStartDate: '2016-05-02',
          holidayEndDate: '2016-05-02',
          holidayName: '王小虎',
        },
      ],
      editDialogVisible:false,
      addVocationVisible:false,
       addForm:{ 
        calenderId:"",
        holidayName:"",
        holidayStartDate:"",
        holidayEndDate:"",
      },
       editForm:{
        holidayName:"",
        holidayStartDate:"",
        holidayEndDate:"",   
      }, 
    }
  },
  created () {
    this.getcalenderList()
 
  },
  methods: {
    //获取全部数据     
    //   async getcalenderList(){
    //     const res = await axios.get('api/leave-attendance/calender/findAllCalender')
    //     console.log(res)
    //     this.calenderList=res.data.data
    //     calenderList.holidayStartDate=calenderList.holidayStartDate.substring(0,10)
    //   }, 
   //日期格式化
    dateFormat(row, column) {
        // 获取单元格数据
        let date = row[column.property]
        if (date == undefined) {
          return ''
        }
        let dt = new Date(date)
        return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
      },
       // 监听 修改用户状态
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      this.editForm = id;
    },
      //编辑
    editList() {
       let params={
        
        'holiday_name':this.editForm.holidayName,
        'holiday_start_date': this.editForm.holidayStartDate,
        'holiday_end_date':this.editForm.holidayEndDate,

      }
      updatecalenderForm(params)
        .then((res) => {
          console.log(res)
          if (res.data === 1) {
            this.editDialogVisible = false;
            this.getcalenderList();
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch((err) => {
          this.$message.error("修改异常");
          console.log(err);
        });
    },
   

  }
}
</script>
<style scoped>
.el-header{
   font-size: 30px !important;
   text-align: center;
   font-family: "Helvetica Neue";
}
::v-deep .el-tabs__item{
  
  font-size: 12px !important;
  width: 240px; 
  height: 80px;
  line-height: 80px;
  text-align: center;
 
}


.el-main{
  /* width: 100%; */
  /* height: 920px; */
  margin: 16px 17px;
  /* background-color: #f9fafc; */
  }

</style>