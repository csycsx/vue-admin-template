<template>
  <div class="app-container">
    <!-- zrj -->
    <!-- 卡片视图 -->
    <el-card >
      <!-- 搜索 -->
    <div class="search"> 
      <el-input placeholder="请输入内容" v-model="input" class="input" clearable @clear="getUserList">
        <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="工号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
        </el-select> -->
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>

      <!-- 表单 -->
          <!-- " -->
      <el-table
      ref="topic"
      :data="userlist"
      stripe
      border
      style="width: 100%; margin-top:20px;"
      @filter-change="filterChange"
       >
      <el-table-column type="index" label="#">
        </el-table-column>
      <!--  prop="id"  type="index" -->
      <!-- <el-table-column 
      prop="id"
      
      label="序号"
      width="90px"
      ></el-table-column> -->
      <el-table-column
      prop="userId"
      label="工号"
  
      >
      </el-table-column>
      <el-table-column
      prop="userName"
      label="姓名"
      >
      </el-table-column>
      <el-table-column
      prop="yuanXi"
      label="学院(部门)"
     >
      </el-table-column>
      <el-table-column
      prop="ptype"
      label="人员类别"
      >
      </el-table-column>
      <el-table-column
      :formatter="roleFormatter"
      prop="role"
      label="用户权限"
      sortable
      column-key="role"
      :filters="statusData"
      :filtered-value="['1','2','3','4','5']"
      filter-placement="bottom-end"
      >
            <!-- :filter-method="filterHandler" -->
      </el-table-column>
      <el-table-column
      prop="pstatus"
      label="人员状态"
      >
      </el-table-column>
      <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button
        size="mini"
        icon="el-icon-edit" 
        @click="showEditDialog(scope.row)">编辑</el-button>
        <!-- <el-button
        size="mini"
        type="danger"
        @click="deleteUsers(scope.row)">删除</el-button> -->
      </template>
      </el-table-column>
      </el-table>
  
     
          <!-- 分页框 -->
          <!-- <el-pagination
          style="margin-top:30px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :pagesize="6"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination> -->
           <el-pagination
           style="margin-top:30px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
           :current-page="queryInfo.pageNum"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="total">
         </el-pagination>
   
<!-- 新增用户信息弹窗  ref是下面表单的引用名称-->
      <!-- <el-dialog 
      title="用户信息" 
      :visible.sync="addUserVisible"
      @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" :inline="true">
          <el-form-item label="工号" prop="userid" :label-width="formLabelWidth">
            <el-input v-model="addForm.userid" style="width:200px" placeholder="请输入用户工号" ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="username" :label-width="formLabelWidth">
            <el-input v-model="addForm.username" autocomplete="off" style="width:200px" placeholder="请输入用户姓名" ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
            <el-select v-model="addForm.gender" placeholder="性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="院系" prop="yuanxi" :label-width="formLabelWidth">
            <el-select v-model="addForm.yuanxi" placeholder="请选择所属院系">
              <el-option label="区域一" ></el-option>
              <el-option label="区域二" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户权限" prop="role" :label-width="formLabelWidth">
            <el-select v-model="addForm.role"  placeholder="请选择用户权限">
              <el-option label="普通教师" value="0"></el-option>
              <el-option label="各部门人事干事" value="1"></el-option>
              <el-option label="各部门负责人" value="2"></el-option>
              <el-option label="人事处人事科人员" value="3"></el-option>
              <el-option label="人事处负责人" value="4"></el-option>
              <el-option label="校领导" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员类别" prop="ptype" :label-width="formLabelWidth">
            <el-select v-model="addForm.ptype" placeholder="请选择人员类别">
              <el-option label="教师" value="0"></el-option>
              <el-option label="学生" value="1"></el-option>
              <el-option label="工作人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员状态" prop="pstatus" :label-width="formLabelWidth">
            <el-select v-model="addForm.pstatus" placeholder="请选择人员状态">
              <el-option label="在编在岗" value="0"></el-option>
              <el-option label="在岗不在编" value="1"></el-option>
              <el-option label="在编不在岗" value="2"></el-option>
            </el-select>
          </el-form-item> -->
           <!-- <el-form-item label="创建时间" prop="gmt_create" :label-width="formLabelWidth">
            <el-date-picker
              v-model="addForm.gmt_create"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="修改时间" prop="gmt_modified"  :label-width="formLabelWidth">
            <el-date-picker
              v-model="addForm.gmt_modified"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>  -->
        <!-- </el-form> -->
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible=false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog> -->
    <!-- 修改用户信息 -->
      <el-dialog 
      title="修改用户信息" 
      :visible.sync="EditUserVisible"
      @close="editDialogClosed">
        <el-form :model="editForm"  ref="editFormRef" :inline="true">
          <el-form-item label="工号"  :label-width="formLabelWidth">
            <el-input v-model="editForm.userId" style="width:200px"  disabled ></el-input>
          </el-form-item>
          <el-form-item label="姓名"  :label-width="formLabelWidth" >
            <el-input v-model="editForm.userName" autocomplete="off" style="width:200px" disabled=true ></el-input>
          </el-form-item>
          <el-form-item label="院系"  :label-width="formLabelWidth">
            <el-select v-model="editForm.yuanXi"  disabled=true style="width:200px">
              <el-option label="计算机" ></el-option>
              <el-option label="微电子" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户权限" :label-width="formLabelWidth">
            <el-select v-model="editForm.role"  style="width:200px" >
              <el-option label="普通教师" value="0"></el-option>
              <el-option label="各部门人事干事" value="1"></el-option>
              <el-option label="各部门负责人" value="2"></el-option>
              <el-option label="人事处人事科人员" value="3"></el-option>
              <el-option label="人事处负责人" value="4"></el-option>
              <el-option label="校领导" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员类别" prop="ptype" :label-width="formLabelWidth">
            <el-select v-model="editForm.ptype"  disabled=true style="width:200px">
              <el-option label="教师" value="0"></el-option>
              <el-option label="人事处" value="1"></el-option>
              <el-option label="工作人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员状态" prop="pstatus" :label-width="formLabelWidth">
            <el-select v-model="editForm.pstatus"  disabled=true style="width:200px">
              <el-option label="在编在岗" value="0"></el-option>
              <el-option label="在岗不在编" value="1"></el-option>
              <el-option label="在编不在岗" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditUserVisible=false">取 消</el-button>
          <el-button type="primary" @click="editUsers()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>  
  </div>
</template>

<script>
import axios from 'axios'
import { findUserByUserid,findUserPageByRoleList,updateUsersForm } from '@/api/admin'
export default {
    data() {
      return {
        num:'12345',
        userlist:[],
        userlist1:[],
        userlist2:[],
        total:0,
        pagesize:1,
        tag:true,
        input: '',
        //获取用户列表的参数对象
        queryInfo:{
          pageNum:1,
          role:'',
          
         // pagesize:'',
        },
        statusData:[{text: '普通教师', value: '0'}, {text: '各部门人事干事', value: '1'}, {text: '各部门负责人', value: '2'}, {text: '人事处人事科人员', value: '3'}, 
      {text: '人事处负责人', value: '4'}, {text: '校领导', value: '5'}],
        // 控制弹窗信息的显示和隐藏
        addUserVisible: false,
        EditUserVisible:false,
        formLabelWidth: '120px',
        //  添加用户的表单数据
         addForm:{
          id:'',
          userid:'',
          username:'',
          gender:'',
          yuanxi:'',
          role:'',
          ptype:'',
          pstatus:'',
        },

        // 修改用户的表单数据
        editForm:{
          id:'',
          userId:'',
          userName:'',
          gender:'',
          yuanXi:'',
          role:'',
          ptype:'',
          pstatus:'',
      },
      //  添加表单验证规则对象
        // addFormRules:{
        //   userid:[
        //     {required:true,message:'请输入用户ID',trigger:'blur'},
        //     {min:3,max:10,massage:'长度需在3-10个字符之间',trigger:'blur'},
        //   ],
        //   username:[
        //     {required:true,message:'请输入用户姓名',trigger:'blur'},
        //     {min:3,max:10,massage:'长度需在3-10个字符之间',trigger:'blur'},
        //   ],
        //   role:[
        //     {required:true,message:'请选择用户权限',trigger:'blur'}
        //   ],
        // },
      }
    },


    created(){
     this.getUserList()
   //  this.filterChange()
      //this.exchange()
      // this.deleteUserFrom()
     // this.updateUsersForm()
    },

    mounted() {
     // this.$set(this.filtereds,0,this.$route.query.role)
    },

    methods: {
        //修改role字段
    
       //获取全部数据     
      async getUserList(){ 
          console.log(this.num)
        // console.log(this.filters,role[0])
            let params={
              'pageNum':this.queryInfo.pageNum,
              'roleList':this.num
              // 'roleList':filters.role.join('')
            }
            findUserPageByRoleList(params).then((res) => {
            console.log(res)
            this.userlist=res.data.records   
            this.total=res.data.total
            this.pagesize=res.data.size  
            }) 
      }, 
      //获取权限不为0的用户
      //  async getAdminUserList(){ 
      //       let params={
      //         'pageNum':this.queryInfo.pageNum
      //       }
      //       findAdminUserPagination(params).then((res) => {
      //       console.log(res)
      //       //console.log(res.data.size)
      //       this.userlist=res.data.records
      //       this.total=res.data.total
      //       this.pagesize=res.data.size  
      //       }) 
      // }, 
      roleFormatter(row, column){
				const role = row.role
      			if (role == 0) {
        			return '普通教师'
      			} else if (role == 1) {
        			return '各部门人事干事'
      			} else if (role == 2) {
        			return '各部门负责人'
      			} else if (role == 3) {
			        return '人事处人事科人员'
      			} else if (role == 4){
        			return '人事处负责人'
      			} else if (role == 5){
              return '校领导'
      			} 
			},

      //搜索接口
     async search () {
    //  console.log(this.input);
      this.userlist=[]
      if (this.input === "") {
        this.$Notice.error({
          title: "请输入搜索内容",  
        });
      }
      else {
        let params={
            'userid':this.input
          }
          findUserByUserid(params).then((res) => {
            console.log(res.data)   
            this.userlist1=res.data   
            this.userlist=this.userlist.concat(this.userlist1) 
         })
      }
    },
       //添加人员实现
      // async addUser(){
      //   this.userid = this.addForm.userid
      //   this.username = this.addForm.username
      //   this.yuanxi = this.addForm.yuanxi
      //   this.ptype = this.addForm.ptype
      //   this.pstatus = this.addForm.pstatus
      //   this.gender = this.addForm.gender
      //   // 前端往后端传递的数据格式都是json格式，key-value都是字符串类型
      //   let params={
      //     'userid':this.userid,
      //     'username':this.username,
      //     'yuanxi':this.yuanxi,
      //     'ptype':this.ptype,
      //     'pstatus':this.pstatus,
      //     'gender':this.gender
      //   }
      //   console.log(params)
      //   addUserTo(params).then(rest => {
      //     console.log(rest)
      //     this.getUserList()
      //     this.addUserVisible=false
      //   })
      // },
      // 编辑
      showEditDialog(row) {
        this.EditUserVisible= true;
        console.log(row);
        this.editForm = row;
      },
      //修改后提交
      async editUsers(){
        let params={
          'id':this.editForm.id,
          'userid':this.editForm.userId,
          'username':this.editForm.userName,
          'gender':this.editForm.gender,
          'yuanxi':this.editForm.yuanXi,
          'role':this.editForm.role,
          'ptype':this.editForm.ptype,
          'pstatus':this.editForm.pstatus
        }
        // console.log(params)
        updateUsersForm(params).then((res)=>{
          console.log(res)
           if (res.code == 200) {
             this.EditUserVisible = false;
             this.getAdminUserList();
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
      //修改后关闭窗口
    editDialogClosed(){
     this.EditUserVisible=false
     this.$nextTick(()=>{
          this.$refs.editForm.resetFields();
     })                              
   },

      // 监听添加用户对话框的关闭事件 关闭后清除表单内容
      // addDialogClose(){
      //   this.$refs.addFormRef.resetFields()
      // },


      //监听pagesize改变事件
      handleSizeChange(newSize) {
        //console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize=newSize
        this.getUserList()
      },
      //监听页码值改变事件
      handleCurrentChange(newPage) {
      //  console.log(`当前页: ${val}`);
      this.queryInfo.pageNum=newPage
       this.getUserList()
        // if(this.tag==true)
        // {
        //     this.queryInfo.pageNum=newPage
        //     this.getAdminUserList()
        // }
        // else if(this.tag==false)
        // {
        //   this.queryInfo.pageNum=newPage
        //   this.getUserList()
        // }
      
      },

      //用户权限筛选
      resetDateFilter() {
        this.$refs.filterTable.clearFilter('role');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
        
      },
      // // 筛选状态变化时调用查询全部用户的接口
      // filterChange() {
      //   //调用接口
      // //  this.getUserList();
      //   console.log(this.tag)
      //   this.tag=!this.tag;
      //   //console.log(this.tag)
      //   if(this.tag==false)
      //   {
      //     this.getUserList();
      //   }
      //   else if(this.tag==true)
      //   {
      //     this.getAdminUserList()
      //   }
      // },
        // 筛选状态
    filterChange(filters) {
      filters.role.sort((a,b)=>{
        return a-b;
      })
      this.num=filters.role.join('')
      this.getUserList()
    //  console.log(this.num)
     // console.log(filters.role.length)
    //  for(let i=0;i<filters.role.length;i++)
    //  {
    //      this.num.push(filters.role[i])
         
    //  }
 
     //  console.log(filters.role[0])
          // if(filters.role){
          //   this.queryInfo.role = filters.role[0]
          //   this.getUserList()
          // }
      }
    
    // 修改传给后端接口的参数，并重新调用接口
      // this..role = filter.role.join(',')
      // 
    
      
    },


}
</script>
<style scoped>
.app-container{
  width: 100%;
}
::v-deep .el-tabs__item{
  
  font-size: 10px !important;

  line-height: 80px;
  text-align: center;
 
}
::v-deep .cell{
  font-size: 14px;
  width: 400px;
}
   .search {
  width: 400px;
}
.el-select {
  width: 100px;
}
</style>
