<template>
  <div class="app-container">
    <!-- zrj -->
    <!-- 卡片视图 -->
    <el-card style="background-color:#f9fafc">
      <!-- 直接进行搜索 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.id">
            <el-button 
            slot="append" 
            icon="el-icon-search"
            @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <!-- <el-button 
          type="primary" 
          @click="addUserVisible = true">+ 添加人员</el-button> -->
        </el-col>
      </el-row>
     

      <!-- 表单 -->
      <el-table
      :data="userlist"
      stripe
      border
      style="width: 100%; margin-top:20px;">
      <!--  prop="id"  type="index" -->
      <el-table-column 
      prop="id"
      
      label="序号"
      width="90px"
      ></el-table-column>
      <el-table-column
      prop="userId"
      label="工号"
      width="170">
      </el-table-column>
      <el-table-column
      prop="userName"
      label="姓名"
      width="170">
      </el-table-column>
      <el-table-column
      prop="yuanXi"
      label="学院(部门)"
      width="200">
      </el-table-column>
      <el-table-column
      prop="role"
      label="用户权限"
      sortable
      column-key="date"
      :filters="[{text: '普通教师', value: '0'}, {text: '各部门人事干事', value: '1'}, {text: '各部门负责人', value: '2'}, {text: '人事处人事科人员', value: '3'}, 
      {text: '人事处负责人', value: '4'}, {text: '校领导', value: '5'}]"
      :filter-method="filterHandler"
      :filtered-value="['1','2','3','4','5']"
      width="200">
      </el-table-column>
      <el-table-column
      prop="ptype"
      label="人员类别"
      width="200">
      </el-table-column>
      <el-table-column
      prop="pstatus"
      label="人员状态"
      width="170">
      </el-table-column>
      <el-table-column
      label="操作"
      width="200px">
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
  
      <el-row gutter="20">
        <el-col :span="7">
          <!-- 分页框 -->
          <el-pagination
          style="margin-top:30px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            <!-- 这里要换一下动态绑定 -->
          </el-pagination>
        </el-col>
        <el-col :span="4">
          
        </el-col>
      </el-row>
<!-- 新增用户信息弹窗  ref是下面表单的引用名称-->
<el-dialog 
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
          </el-form-item>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible=false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      
      <el-dialog 
      title="修改用户信息" 
      :visible.sync="EditUserVisible"
      @close="addDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" :inline="true">
          <el-form-item label="工号"  :label-width="formLabelWidth">
            <el-input v-model="editForm.userId" style="width:200px"  disabled ></el-input>
          </el-form-item>
          <el-form-item label="姓名"  :label-width="formLabelWidth" >
            <el-input v-model="editForm.userName" autocomplete="off" style="width:200px" disabled=true ></el-input>
          </el-form-item>
          <el-form-item label="院系"  :label-width="formLabelWidth">
            <el-select v-model="editForm.yuanXi"  disabled>
              <el-option label="计算机" ></el-option>
              <el-option label="微电子" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户权限" :label-width="formLabelWidth">
            <el-select v-model="editForm.role"  >
              <el-option label="普通教师" value="0"></el-option>
              <el-option label="各部门人事干事" value="1"></el-option>
              <el-option label="各部门负责人" value="2"></el-option>
              <el-option label="人事处人事科人员" value="3"></el-option>
              <el-option label="人事处负责人" value="4"></el-option>
              <el-option label="校领导" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员类别" prop="ptype" :label-width="formLabelWidth">
            <el-select v-model="editForm.ptype"  disabled=true>
              <el-option label="教师" value="0"></el-option>
              <el-option label="人事处" value="1"></el-option>
              <el-option label="工作人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员状态" prop="pstatus" :label-width="formLabelWidth">
            <el-select v-model="editForm.pstatus"  disabled=true>
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
import { getUser, addUserTo, deleteUserFrom,updateUsersForm } from '@/api/admin'
export default {
    data() {
      return {
        userlist:[],
        total:0,
        //获取用户列表的参数对象
        queryInfo:{
          id:'',
          query:'',
          pagenum:'',
          pagesize:'',
        },

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
        addFormRules:{
          userid:[
            {required:true,message:'请输入用户ID',trigger:'blur'},
            {min:3,max:10,massage:'长度需在3-10个字符之间',trigger:'blur'},
          ],
          username:[
            {required:true,message:'请输入用户姓名',trigger:'blur'},
            {min:3,max:10,massage:'长度需在3-10个字符之间',trigger:'blur'},
          ],
          role:[
            {required:true,message:'请选择用户权限',trigger:'blur'}
          ],
        },
      }
    },


    created(){
      this.getUserList()
      // this.deleteUserFrom()
      this.updateUsersForm()
    },

    mounted() {
      this.$set(this.filtereds,0,this.$route.query.role)
    },

    methods: {

      //获取用户数据
      async getUserList(){
        const res = await axios.get('api/leave-attendance/user/findAllUser',{
          // params:this.queryInfo
        }).then((res)=>{
          console.log(res)
          this.userlist=res.data.data
          this.id=res.data.data.id
          console.log(this.id)
        })
      },

       //添加人员实现
      async addUser(){
        this.userid = this.addForm.userid
        this.username = this.addForm.username
        this.yuanxi = this.addForm.yuanxi
        this.ptype = this.addForm.ptype
        this.pstatus = this.addForm.pstatus
        this.gender = this.addForm.gender
        // 前端往后端传递的数据格式都是json格式，key-value都是字符串类型
        let params={
          'userid':this.userid,
          'username':this.username,
          'yuanxi':this.yuanxi,
          'ptype':this.ptype,
          'pstatus':this.pstatus,
          'gender':this.gender
        }
        console.log(params)
        addUserTo(params).then(rest => {
          console.log(rest)
          this.getUserList()
          this.addUserVisible=false
        })
      },
     
          //删除用户
    //       async deleteUsers(id){
    //   const confirmResult = await this.$confirm(
    //     "此操作将永久删除该用户, 是否继续?",
    //     "提示",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     }
    //   ).catch((err) => {
    //     return err;
    //   });
    //   if (confirmResult == "confirm") {
    //   deleteUserFrom(id).then((res)=>{
    //     console.log(res)
    //     if (res.code == 200) {
    //       this.userlist.splice(id,1);
    //           this.$message({
    //             message: "删除成功",
    //             type: "success",
    //           });
    //           this.getUserList();
    //         } else {
    //           this.$message.error("删除失败");
    //         }
    //       })
    //       .catch((err) => {
    //         this.$message.error("删除异常");
    //         console.log(err);
    //       });
    //     }
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
             this.getUserList();
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
        console.log(`当前页: ${val}`);
        this.queryInfo.pagenum=newPage
        this.getUserList()
      },

      //用户权限筛选
      resetDateFilter() {
        this.$refs.filterTable.clearFilter('role');
      },
      // clearFilter() {
      //   this.$refs.filterTable.clearFilter();
      // },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }
    

     //切换页实现

     
     
    },

}
</script>
<style scoped>

</style>
