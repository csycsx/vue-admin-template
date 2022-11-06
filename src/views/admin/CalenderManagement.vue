<template>
  <el-main>
    <!-- 搜索和添加 -->
    <el-row gutter="11">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryInfo.data" clearable @clear="getcalenderList()">
        <el-button slot="append" icon="el-icon-search" @click="getcalenderList()"></el-button>
          </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">添加</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 表单 -->
      <el-table border
        :data="calenderList"
        style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
          <el-table-column
          label="管理员" 
          prop="adminId"
        >
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
        >   
        </el-table-column>
            <el-table-column
          type="date"
          prop="holidayEndDate"
          label="结束日期"  
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
      <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
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
    </el-card>
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed">
      <el-form :model="editForm" label-width="80px">
      <el-form-item label="管理员">
      <el-input v-model="editForm.adminId" disabled=true></el-input>
      </el-form-item>
      <el-form-item label="假期名称" >
        <el-input v-model="editForm.holidayName" disabled=trueb ></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  >
      <el-input v-model="editForm.holidayStartDate" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-input v-model="editForm.holidayEndDate" type="date"></el-input>
      </el-form-item>
        <el-form-item label="描述信息">
        <el-input v-model="editForm.description"  disabled=true></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcalender()">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
  
</template>

<script>
import axios from 'axios'
import { getcalenderList,deletecalenderFrom,updatecalenderForm } from '@/api/admin'
export default {
  data() {
    return {
      //获取列表的参数对象
      queryInfo:{
        data:"",
        pagenum:1,
        pagesize:2
      },
      total:0,
      calenderList:[],
      editDialogVisible:false,
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
  },
  methods: {
    //获取数据
          
      async getcalenderList(){
        const res = await axios.get('api/leave-attendance/calender/findAllCalender')
        console.log(res)
        this.calenderList=res.data.data
      }, 
   // 监听 修改用户状态
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      this.editForm = id;
    },
    //修改信息后提交
    editcalender() {
      updatecalenderForm(this.editForm)
        .then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            this.editDialogVisible = false;
            this.getcalenderList();
            this.$message({
              message: "修改用户成功",
              type: "success",
            });
          } else {
            this.$message.error("修改用户失败");
          }
        })
        .catch((err) => {
          this.$message.error("修改用户异常");
          console.log(err);
        });
    },
    //  editInfo(){
    //    /*  const { data: res } = await this.$http.delete("limits/" + this.editForm.id,{
    //        leave_type:this.editForm.leave_type,
    //        max_limit_days:this.editForm.max_limit_days
    //      })
    //     */
    //     if (res.meta.status !== 200) {
    //     return this.$message.error("更新失败");
    //   } 
    //   //关闭对话框
    //      this.editDialogVisible=false;
    //      this.getcalenderList();
    //      this.$message.success("更新信息成功");
    //   } ,  
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
  
  font-size: 18px !important;
  width: 240px; 
  height: 80px;
  line-height: 80px;
  text-align: center;
 
}

.el_input{
  width: 300px;
  height: 80px;
  font-size: 20px;
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