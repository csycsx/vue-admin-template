<template>
<!-- xll -->
 <div class="app-container">
    <el-card>
    <!-- 搜索和添加 -->
    <el-row gutter="11">
      <el-col :span="7">
        <el-input placeholder="请输入内容"
         v-model="data" 
         clearable @clear="getcalenderList()">
          <el-button 
          slot="append" icon="el-icon-search" 
          @click="getcalenderList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button 
        type="primary"
        @click="addVocationVisible = true">添加</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图 -->
    
        <!-- 表单 -->
      <el-table border
        :data="calenderList"
        style="width: 100%">
        <el-table-column type="index" label="#">
        <!-- </el-table-column>
          <el-table-column
          label="管理员" 
          prop="adminId"
        > -->
        </el-table-column>
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
            <el-table-column
          prop="description"
          label="描述信息"  
        >    
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" >
      
      <!-- 修改按钮 -->
            <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
      <!-- 删除按钮 -->
            <el-button type="danger"  size="mini" @click="removeById(scope.row)">删除</el-button>
          <!-- 调休 -->
            <el-button type="info" size="mini" @click="Route">调休</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCu
        rrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="9">
      </el-pagination>
    <!-- 修改信息 -->
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"

      @close="editDialogClosed">
     <el-form :inline="true">
      <el-form-item label="ID" :label-width="formLabelWidth">
        <el-input v-model="editForm.id" disabled=true ></el-input>
      </el-form-item>
      <el-form-item label="管理员 " :label-width="formLabelWidth">
        <el-input v-model="editForm.adminId" disabled=true></el-input>
      </el-form-item>
      <el-form-item label="假期名称" :label-width="formLabelWidth">
        <el-input v-model="editForm.holidayName" disabled=true></el-input>
      </el-form-item>
     <el-form-item label="描述信息"  :label-width="formLabelWidth">
        <el-input v-model="editForm.description" disabled=true></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  :label-width="formLabelWidth1" >
      <el-input v-model="editForm.holidayStartDate" type="date"  style="width: 108%"></el-input>
      </el-form-item>
      <el-form-item label="结束日期"  :label-width="formLabelWidth1">
        <el-input v-model="editForm.holidayEndDate" type="date"  style="width: 108%"></el-input>
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

      @close="addDialogClose">
      <el-form :model="addForm"  :inline="true">
         <el-form-item label="管理员" :label-width="formLabelWidth"  >
        <el-input v-model="addForm.adminId" ></el-input>
      </el-form-item>
      <el-form-item label="假期名称" :label-width="formLabelWidth" >
        <el-input v-model="addForm.holidayName"></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  :label-width="formLabelWidth">
      <el-input v-model="addForm.holidayStartDate" type="date" style="width: 108%"></el-input>
      </el-form-item>
      <el-form-item label="结束日期" :label-width="formLabelWidth2">
        <el-input v-model="addForm.holidayEndDate" type="date" style="width: 108%"></el-input>
      </el-form-item>
        <el-form-item label="描述信息" :label-width="formLabelWidth">
        <!-- <el-input v-model="editForm.description"  ></el-input> -->
         <el-select v-model="addForm.description" style="width:95%">
              <el-option label="法定节假日" value="法定节假日"></el-option>
              <el-option label="寒暑假" value="寒暑假"></el-option>
              <el-option label="调休" value="调休"></el-option>
         </el-select>
      </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVocationVisible=false">取 消</el-button>
          <el-button type="primary" @click="addVocation">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
  
</template>

<script>
import axios from 'axios'
import { getcalenderList,deletecalenderFrom,updatecalenderForm,addVocationTo } from '@/api/admin'
export default {
  data() {
    return {
      //获取列表的参数对象
      queryInfo:{
        data:"",
        pagenum:1,
        pagesize:2
      },
      formLabelWidth:'120px',
      formLabelWidth1:'125px',
       formLabelWidth2:'130px',
      total:0,
      calenderList:[],
      editDialogVisible:false,
      addVocationVisible:false,
      addForm:{
        
        adminId:"",
        holidayName:"",
        holidayStartDate:"",
        holidayEndDate:"",
        description:"",
      },
        editForm:{
        id:"",
        adminId:"",
        holidayName:"",
        holidayStartDate:"",
        holidayEndDate:"",
        description:"",
      }, 
    }
  },
  created () {
    this.getcalenderList()
    this.deletecalenderFrom()
    this.updatecalenderForm()
    this.addVocationTo()
  },
  methods: {
    //获取全部数据     
      async getcalenderList(){
        const res = await axios.get('api/leave-attendance/calender/findAllCalender')
        console.log(res)
        this.calenderList=res.data.data
        calenderList.holidayStartDate=calenderList.holidayStartDate.substring(0,10)
      }, 
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

    //添加
    async addVocation(){
     //  this.getcalenderList()
      this.ad=this.addForm.adminId
      this.hn=this.addForm.holidayName
      this.hs=this.addForm.holidayStartDate
      this.he=this.addForm.holidayEndDate
      this.des=this.addForm.description
      let params={
        'adminid':this.ad,
        'holiday_name':this.hn,
        'holiday_start_date': this.hs,
        'holiday_end_date':this.he,
        'description':this.des
      }
      console.log(params)
      addVocationTo(params).then(rest =>{
         console.log(rest)
        this.getcalenderList()
        this.addVocationVisible=false
      })
    },

     // 监听 修改用户状态
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      this.editForm = id;
    },
    //修改信息后提交
    editcalender() {
       let params={
        'id':this.editForm.id,
        'adminid':this.editForm.adminId,
        'holiday_name':this.editForm.holidayName,
        'holiday_start_date': this.editForm.holidayStartDate,
        'holiday_end_date':this.editForm.holidayEndDate,
        'description':this.editForm.description
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
   
  //删除数据
      async removeById(id) {
        const confirmResult = await this.$confirm(
          "此操作将永久删除该数据, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => {
          return err;
        });
        // 确认删除，则返回值为字符串confirm
        // 确认取消，则返回值为字符串cancel
        if (confirmResult == "confirm") {
          //删除用户
          deletecalenderFrom(id)
            .then((res) => {
             console.log(res)
              if (res.data === 1) {
                this.calenderList.splice(id,1);
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.getcalenderList();
              } else {
               // console.log(res)
                this.$message.error("删除失败");
              }
            })
            .catch((err) => {
              this.$message.error("删除异常");
              console.loge(err);
            });
        }

 
    },
    Route(){
        this.$router.push('/admin/adjustleave')
    },
  
   //监听pagesize改变事件
      handleSizeChange(newSize) {
        //console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize=newSize
        this.getcalenderList()
      },
      //监听页码值改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.num = newPage
        this.getcalenderList()
      }

  }
}
</script>
<style scoped>
::v-deep .el-tabs__item{
  
  font-size: 12px !important;
  width: 240px; 
  height: 80px;
  line-height: 80px;
  text-align: center;
 
}

.el_input{
  width: 300px;
  height: 80px;
  font-size: 10px;
  margin-right: 50px;
}
.el_button{
  width: 200px;
  height: 60px;
  font-size: 20px;

}
.el-tabs{
  margin:16px 0px;


}
.el-row{
  margin-bottom: 15px;
}
::v-deep .cell{
  font-size: 15px;
  width: 400px;
}
.el-main{
  /* width: 100%; */
  /* height: 920px; */
  margin: 16px 17px;
  /* background-color: #f9fafc; */
  }

</style>