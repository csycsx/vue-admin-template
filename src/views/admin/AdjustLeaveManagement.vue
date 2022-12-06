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
          prop="adjustName"
        >
        </el-table-column>
        <el-table-column
          type="date"
          prop="adjustStartDate"
          label="开始日期" 
          :formatter="dateFormat"  
        >   
        </el-table-column>
        <el-table-column
          type="date"
          prop="adjustEndDate"
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
    
        <!-- <el-button @click="addVocationVisible = true" style="width:30%;margin:10px 500px">+</el-button> -->
 
     <!-- 对话框修改和新增 -->
      <!-- 修改信息 -->
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed">
     <el-form>
        <el-form-item label="ID" :label-width="formLabelWidth">
        <el-input v-model="editForm.id" ></el-input>
      </el-form-item>
       <el-form-item label="校历ID" :label-width="formLabelWidth">
        <el-input v-model="editForm.calenderId" ></el-input>
      </el-form-item>
      <el-form-item label="假期名称" :label-width="formLabelWidth" >
        <el-input v-model="editForm.adjustName" ></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  :label-width="formLabelWidth">
      <el-input v-model="editForm.adjustStartDate" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束日期" :label-width="formLabelWidth">
        <el-input v-model="editForm.adjustEndDate" type="date"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editList()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增信息 -->
    <!-- <el-dialog 
      title="新增假期" 
      :visible.sync="addVocationVisible"
      width="30%"
      @close="addDialogClose">
      <el-form v-model="addForm" ref="addForm" :model="addForm">
     <el-form-item label="校历ID" >
        <el-input v-model="addForm.calenderId"></el-input>
      </el-form-item>
      <el-form-item label="假期名称" >
        <el-input v-model="addForm.adjustName"></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  >
      <el-input v-model="addForm.adjustStartDate" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-input v-model="addForm.adjustEndDate" type="date"></el-input>
      </el-form-item> 
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVocationVisible=false">取 消</el-button>
          <el-button type="primary" @click="addVocation()">确 定</el-button>
        </div>
      </el-dialog> -->

  </div> 
</template>

<script>
import axios from 'axios'
import { findAdjustById,updateCalenderAdjust} from '@/api/admin'
export default {
  data() {
    return {
      //获取列表的参数对象
      formLabelWidth:'80px',
      adjustList:[],
      editDialogVisible:false,
      // addVocationVisible:false,
      //  addForm:{ 
      //   calenderId:"",
      //   adjustName:"",
      //   adjustStartDate:"",
      //   adjustEndDate:"",
      // },
       editForm:{
       id:"",
       calenderId:"",
       adjustName:"", 
       adjustStartDate:"",
       adjustEndDate:"",   
      }, 
    }
  },
  created () {
   this. getadjustList()
  },
  methods: {
     async getadjustList(){ 
       //console.log(this.$route.params.id)
        let params={
            'id':this.$route.params.id,
       }
           console.log(this.$route.params.id)
        findAdjustById(params).then((res) => {
            console.log(res)
            this.adjustList=res.data
        })  
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
       // 监听 修改用户状态
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      this.editForm = id;
    },
      //编辑
    editList() {
       let params={
        'id':this.editForm.id,
        'calenderid':this.editForm.calenderId,
        'adjust_name':this.editForm.adjustName,
        'adjust_start_date': this.editForm.adjustStartDate,
        'adjust_end_date':this.editForm.adjustEndDate,
      }
      updateCalenderAdjust(params)
        .then((res) => {
          console.log(res)
          if (res.data === 1) {
            this.editDialogVisible = false;
            this.getadjustList();
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
    //关闭编辑，清除内容
     editDialogClosed(){
     this.editDialogVisible=false
     this.$nextTick(()=>{
          this.$refs.editForm.resetFields();
     })                              
   },
   //新增数据
    
  //   //添加
  //   async addVocation(){
  //     this.ad=this.this.$route.params.id,
  //     this.hn=this.addForm.adjustName
  //     this.hs=this.addForm.adjustStartDate
  //     this.he=this.addForm.adjustEndDate
  //     let params={
  //       'calenderid':this.ad,
  //       'adjust_name':this.hn,
  //       'adjust_start_date': this.hs,
  //       'adjust_end_date':this.he,
  //     }
  //     console.log(params)
  //     addCalenderAdjust(params).then(rest =>{
  //       console.log(rest)
  //       this.getadjustList()
  //       this.addVocationVisible=false
  //     })
  //   },
  //   //关闭弹窗并重置数据
  //  addDialogClose(){
  //    this.addVocationVisible=false
  //    this.$nextTick(()=>{
  //         this.$refs.addForm.resetFields();
  //    })                               
  //  },
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