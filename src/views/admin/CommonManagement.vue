<template>
<el-main>
<el-tabs  v-model="activeName"  @tab-click="handleClick">
<!-- <el-input placeholder="请输入内容" v-model="input" clearable class="el_input"></el-input> -->
<!-- <el-button type="primary" icon="el-icon-search" class="el_button">搜索</el-button> -->
<el-tab-pane label="请假时长"  name="first"> 
  <el-row gutter="20">
    <el-col :span="7">
       <el-input placeholder="请输入内容" v-model="quaryInfo.quary" clearable @clear="getlimitList">
       <el-button slot="append" icon="el-icon-search" @click="getlimitList"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary">添加</el-button>
    </el-col>
  </el-row>
  <el-card>
  <el-table border
    :data="limitList"
    style="width: 100%">
    <el-table-column type="index" label="#">
    </el-table-column>
    <el-table-column
      label="请假类型" 
      prop="leave_type"
    >
    </el-table-column>
    <el-table-column
      prop="max_limit_days"
      label="最长时限（天）"  
    >
       
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope" >
  <!-- 修改按钮 -->
        <el-button type="primary"  size="mini" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
  <!-- 删除按钮 -->
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
  
      </template>

    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="quaryInfo.pagenum"
      :page-sizes="[1, 2, 5,10]"
      :page-size="quaryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
</el-tab-pane>
<el-tab-pane label="人事处审核" name="third">
  <el-row gutter="20">
    <el-col :span="7">
       <el-input placeholder="请输入内容" v-model="quaryInfo.quary" clearable @clear="getlimitList">
       <el-button slot="append" icon="el-icon-search" @click="getlimitList"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary">添加</el-button>
    </el-col>
  </el-row>
  <el-card>
  <el-table border
    :data="limitList"
    style="width: 100%">
    <el-table-column type="index" label="#">
    </el-table-column>
    <el-table-column
      label="请假类型" 
      prop="leave_type"
    >
    </el-table-column>
    <el-table-column
      prop="hr_limit_days"
      label="审核条件天数"  
    >
       
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope" >
  <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
  <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
  
      </template>

    </el-table-column>
  </el-table>
    </el-card>
</el-tab-pane>
<el-tab-pane label="校领导审核" name="fourth">
    <el-row gutter="20">
    <el-col :span="7">
       <el-input placeholder="请输入内容" v-model="quaryInfo.quary" clearable @clear="getlimitList">
       <el-button slot="append" icon="el-icon-search" @click="getlimitList"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary">添加</el-button>
    </el-col>
  </el-row>
  <el-card>
  <el-table border
    :data="limitList"
    style="width: 100%">
    <el-table-column type="index" label="#">
    </el-table-column>
    <el-table-column
      label="请假类型" 
      prop="leave_type"
    >
    </el-table-column>
    <el-table-column
      prop="school_limit_days"
      label="审核条件天数"  
    >
       
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope" >
  <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
  <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
  
      </template>

    </el-table-column>
  </el-table>
    </el-card>
</el-tab-pane>
</el-tabs>
<el-dialog
  title="修改信息"
  :visible.sync="editDialogVisible"
  width="30%"
  @close="editDialogClosed">
  <el-form ref="editFormRef" :model="editForm" label-width="80px">
  <el-form-item label="请假类型">
    <el-input v-model="editForm.leave_type"></el-input>
  </el-form-item>
  <el-form-item label="最长时限">
    <el-input v-model="editForm.max_limit_days"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editInfo()">确 定</el-button>
  </span>
</el-dialog>
</el-main>

</template>

<script>
export default {
  data() {
    return {
      editVisible: false ,
      delVisible: false,
      activeName: 'first',
      input: '',
      num: 1,
      editDialogVisible:false,
      //查询到的修改信息数据
      editForm:{},
      //修改表单的验证规则对象

      //获取列表的参数对象
      quaryInfo:{
        quary:'',
        pagenum:1,
        pagesize:2

      },
   
       
        // value: '',
        value1: '',
      tableData1: [{    
        }, ],
          tableData2: [
        ],
        tableData3: [{
           order:1,
          condition: '事假单次超过30天，',
        }, {
           order:2,
          condition: '事假当年累计超过60天',
        }
        ],
        calenderList:[1,2],
        limitList:[1,2],
        total:0
    }
  },
  created () {
    this.getlimitList()
    this.getcalenderList()
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
      },
      
      //编辑用户的对话框
      async handleEdit(id){
       /* const {data:res} = await this.$http.get('limit/'+id)//接口
        if (res.meta.status !== 200) {
        return this.$message.error("查询信息失败！");
      }
       this.editForm =res.data;*/
        this.editDialogVisible = true;
        
      },
       handleChange(value) {
        console.log(value);
      },
     editDialogClosed(){
      // const ref: any = this.$refs.editFormRef.resetFields();
     },
     //修改信息后提交
     editInfo(){
       /*  const { data: res } = await this.$http.delete("limits/" + this.editForm.id,{
           leave_type:this.editForm.leave_type,
           max_limit_days:this.editForm.max_limit_days
         })
        */
          if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      } 
      //关闭对话框
         this.editDialogVisible=false;
         this.getlimitList();
         this.$message.success("更新信息成功");
      } ,     
      async handleDelete(id) {
     
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
      if (confirmResult !== "confirm") {
        return this.$message("取消删除");
      }
      const { data: res } = await this.$http.delete("limits/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getlimitList();
    },
    async getcalenderList(){
       const {data:res}=await this.$http.get("接口");
       if(res.meta.status!==200){
         return this.$message.error("读取数据失败");
       }
       this.calenderList=res.data;
       console.log(this.calenderList)
    }
  },
 async getlimitList(){
       const {data:res}=await this.$http.get("接口",{params:this.quaryInfo});
       if(res.meta.status!==200){
         return this.$message.error("读取数据失败");
       }
       this.limitList=res.data;
       this.total =res.data.tota;
       console.log(this.limitList)
    },
    //监听Pagesize改变的事件
 handleSizeChange(newSize){
   console.log(newSize);
   this.quaryInfo.pagesize=newSize;
   this.getlimitList();
 },
 //监听页码值改变
 handleCurrentChange(){

 }
      // handleDelete(index, row) {
      //   console.log(index, row);
   
			
      // },
     
				

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
::v-deep .el-tabs__nav{
    margin-top: -20px;
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
  height: 920px;
  margin: 16px 17px;
  background-color: #f9fafc;
   }

</style>