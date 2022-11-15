<template>
  <el-main>
    <!-- xll -->
  <el-header>请假类型时长设置</el-header>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 表单 -->
      <el-table border
        :data="timeLimitList"
        style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
      
        <el-table-column
          label="请假类型" 
          prop="type"
        >
        </el-table-column>
        <el-table-column
          prop="limitTime"
          label="最长时限(天)"  
        >    
        </el-table-column>
       
        <el-table-column label="操作">
          <div slot-scope="scope" >
   
      <!-- 修改按钮 -->
            <el-button  icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
      <!-- 删除按钮 -->
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button> -->
          </div>
        </el-table-column>
      </el-table>
    </el-card>
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
     >
      <el-form :model="editForm" label-width="80px">
     
      <el-form-item label="请假类型" >
        <el-input v-model="editForm.type" ></el-input>
      </el-form-item>
      
      <el-form-item label="最长时限">
        <!-- 这里试着改一下 -->
        <el-input v-model="editForm.limitTime" ></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLimitTime()">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
  
</template>

<script>
import axios from 'axios'
import {findAllLimitTimeByRoleId ,UpdateLimitTimeById} from '@/api/admin'
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
      timeLimitList:[],
      // timeLimitList1:[],
      // timeLimitList2:[],
      editDialogVisible:false,
      editForm:{
        id:"",
        type:"",
        limitTime:"",
      },
        
    }
  },
  created () {
    this.getLimitList()
   // this.UpdateLimitTimeById()
  },
  methods: {
    //获取数据
       async getLimitList(){ 
        let params={'role_id':1,}
        findAllLimitTimeByRoleId(params).then((res) => {
            console.log(res)
            this.timeLimitList=res.data
         }) 
            
      }, 
   // 监听 修改用户状态
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      this.editForm = id;
    },
    //修改信息后提交
    editLimitTime(){
       let params={
        'id':this.editForm.id,
        'limittime':this.editForm.limitTime,
        'type':this.editForm.type,
      }
       UpdateLimitTimeById(params)
        .then((res) => {
          console.log(res)
          if (res.data === 1) {
            this.editDialogVisible = false;
            this.getLimitList();
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