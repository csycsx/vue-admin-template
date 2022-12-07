<template>
<!-- xll -->
 <div class="app-container">
    <el-card>
    <!-- 搜索和添加 -->
     <header class="title">
        <div>校历信息列表</div>
    </header>
    <nav class="right">
        <el-button 
        type="primary"
        @click="addVocationVisible = true">+添加</el-button>
    </nav>
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
            <el-button type="info" size="mini" @click="Route(scope.row)">调休</el-button>
          </template>
        </el-table-column>
      </el-table>

     
    <!-- 修改信息 -->
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed">
     <el-form :inline="true" ref="editForm" :model="editForm">
      <el-form-item label="ID" :label-width="formLabelWidth" prop='ID'>
        <el-input v-model="editForm.id" disabled=true style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="管理员 " :label-width="formLabelWidth" prop='adminId'>
        <el-input v-model="editForm.adminId" disabled=true style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="假期名称" :label-width="formLabelWidth"  prop='holidayName'>
        <el-input v-model="editForm.holidayName" disabled=true style="width:200px"></el-input>
      </el-form-item>
     <el-form-item label="描述信息"  :label-width="formLabelWidth" prop='description'>
        <el-input v-model="editForm.description" disabled=true style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="开始日期"  :label-width="formLabelWidth" prop="holidayStartDate">
      <el-input v-model="editForm.holidayStartDate" type="date"  style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="结束日期"  :label-width="formLabelWidth" prop="holidayEndDate">
        <el-input v-model="editForm.holidayEndDate" type="date"  style="width: 200px"></el-input>
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
      width=30%
      >
      <el-form  v-model="addForm" ref="addForm" :model="addForm">
      <el-form-item label="管理员"  prop='adminId' :label-width="formLabelWidth">
        <el-input v-model="addForm.adminId" style="width: 200px"></el-input>
      </el-form-item>
      
        <el-form-item label="描述信息" prop='description' :label-width="formLabelWidth">
           <el-select
              style="width:200px"
              v-model="addForm.description"
              placeholder=""
              class ="select-update1"
            >
            <el-option
            v-for="item in regionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
          </el-select>

      </el-form-item>
      <el-form-item label="假期名称"  prop='holidayName' :label-width="formLabelWidth">
        <el-select
          style="width:200px"
          v-model="addForm.holidayName"
          placeholder=""
          class ="select-update2"
          @change ="areaChange1"
        >
        <span v-if="addForm.description">
        <span v-for="item in regionList" :key="item.value">
        <span v-if="item.value === addForm.description">
        <el-option
        v-for="item1 in item.child"
        :key="item1.value"
        :label="item1.label"
        :value="item1.value"
        >
        </el-option>
        </span>
        </span>
        </span>
        </el-select>
         
      </el-form-item>
      <el-form-item label="开始日期"   prop='holidayStartDate' :label-width="formLabelWidth">
      <el-input v-model="addForm.holidayStartDate" type="date" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="结束日期"  prop='holidayEndDate' :label-width="formLabelWidth">
        <el-input v-model="addForm.holidayEndDate" type="date" style="width: 200px"></el-input>
      </el-form-item>
      </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
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
      // queryInfo:{
      //   data:"",
      //   pagenum:1,
      //   pagesize:2
      // },
      formLabelWidth:'120px',
   
     // total:0,
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
      regionList:[
        {
          lable:"法定节假日",
          value:"法定节假日",
          child:[
            {
                lable:"国庆节假期",
                value:"国庆节假期",
            },
            {
                lable:"中秋节假期",
                value:"中秋节假期",
            },
          ]
        },
        {
           lable:"寒暑假",
           value:"寒暑假",
           child:[
             {
               lable:"寒假",
               value:"寒假",
             },
            {
               lable:"暑假",
               value:"暑假",
             }
           ]
        },
          {
           lable:"教学周",
           value:"教学周",
           child:[
             {
               lable:"秋季学期",
               value:"秋季学期",
             },
            {
               lable:"冬季学期",
               value:"冬季学期",
             },
             {
               lable:"春季学期",
               value:"春季学期",
             }
           ]
        },
      ]
    
    }
  },
  created () {
    this.getcalenderList()
  //  this.editcalender()
    //this.removeById(id)
    //this.deletecalenderFrom()
    //this.updatecalenderForm()
   // this.addVocationTo()
   // this.getdescriptionlist()
  },
  methods: {
    //获取全部数据     
      async getcalenderList(){ 
        getcalenderList().then((res) => {
            console.log(res)
            this.calenderList=res.data
         })
        //console.log(calenderList)    
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
    //搜索
     //搜索接口
    
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
  //关闭编辑弹窗并重置数据
   addDialogClose(){
     this.addVocationVisible=false
    // if (this.$refs.addForm !== undefined) {
    //         this.$refs.addForm.resetFields();
    // }
     this.$nextTick(()=>{
          this.$refs.addForm.resetFields();
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
  //关闭编辑弹窗并重置数据
    editDialogClosed(){
        this.editDialogVisible=false
        this.$nextTick(()=>{
              this.$refs.editForm.resetFields();
        })                              
   },
  //删除数据 
      async removeById(id){
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
    //控制调休信息是否展示
    Route(id){
        console.log(id)

        // let params={
        //         'id':id.id,
        //         'adjust_name':'中秋节调休'
        //    }
        // findAdjustById(params).then((res) => {
        //     console.log(res)
        //     this.adjustList=res.data
        // })
        if(id.description=="法定节假日")
        {
           
            // this.$router.push('/admin/adjustleave')
            this.$router.push({
              name:'AdjustLeaveManagement',
              params:{
                'id':id.id
              },
            })
           
        }
        else{
          const h = this.$createElement;
          this.$notify({
          title: id.description,
          message: h('i', { style: 'color: teal'}, '无调休信息')
        });
      }
          //  this.$message({
          //        // message: "无调休信息",
          //         // type: "success",
                 
          //       });
        } ,
      // 描述信息。二级联动
  areaChange1(){
  // console.log(2)
  this.$forceUpdate()//强制更新
    },
  getdescriptionlist() {
      let data = [
        {
          id: 1,
          name: "法定节假日",
        },
        {
          id: 2,
          name: "寒暑假",
        },
        {
          id: 3,
          name: "教学周",
        },
      ];
      //赋给部门下拉框
      this.descriptionlist = data;
      console.log(this.descriptionlist)
    },
   
  },
}

</script>
<style scoped>
.title{
   text-align: center;
   float: left;
   font-size: 22px;
   line-height: 50px;
   /* font-family: "Helvetica Neue"; */
}
.right{
  float: right;
  margin: 10px auto;
}
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
  font-size: 14px;
  width: 400px;
}
.el-main{
  /* width: 100%; */
  /* height: 920px; */
  margin: 16px 17px;
  /* background-color: #f9fafc; */
  }

</style>