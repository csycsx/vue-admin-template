<template>
  <el-main> 
    <!-- 卡片视图 -->
    <el-card>
       <header class="title">
        <h2>请假类型时长设置</h2>
       </header>
        <!-- 表单 -->
      <el-table border
        :data="timeLimitList"
        style="width: 100%">
        <!-- <el-table-column type="index" label="#">
        </el-table-column> -->
        <el-table-column
          label="#" 
          prop="id"
          width="50%"
        >
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
      <!-- 导出按钮 -->
      <!-- <div class="botmBtnContainer">
      <el-button @click="exportWord" size="small" type="primary">导出word</el-button>
      </div> -->
    </el-card>
      <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
     >
      <el-form :model="editForm" label-width="80px">
      <!-- <el-form-item label="管理员工号" >
        <el-input v-model="editForm.adminId" disabled=true></el-input>
      </el-form-item> -->
      <el-form-item label="请假类型" >
        <el-input v-model="editForm.type" :disabled=true></el-input>
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
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
    
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
        adminId:this.$store.getters.id,
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
   // 点击导出word
     // 点击导出word
  // exportWord: function() {
  //    let that = this;
  //   // 读取并获得模板文件的二进制内容
  //   JSZipUtils.getBinaryContent("时限管理.docx", function(error, content) {
  //     // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
  //     // 抛出异常
  //     if (error) {
  //       throw error;
  //     }

  //     // 创建一个PizZip实例，内容为模板的内容
  //     let zip = new PizZip(content);
  //     // 创建并加载docxtemplater实例对象
  //     let doc = new docxtemplater().loadZip(zip);
  //     // 设置模板变量的值
  //     doc.setData({
  //       name:'各类型请假时长',
  //       table: that.timeLimitList
  //     });

  //     try {
  //       // 用模板变量的值替换所有模板变量
  //       doc.render();
  //     } catch (error) {
  //       // 抛出异常
  //       let e = {
  //         message: error.message,
  //         name: error.name,
  //         stack: error.stack,
  //         properties: error.properties
  //       };
  //       console.log(JSON.stringify({ error: e }));
  //       throw error;
  //     }

  //     // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
  //     let out = doc.getZip().generate({
  //       type: "blob",
  //       mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //     });
  //     // 将目标文件对象保存为目标类型的文件，并命名
  //     saveAs(out, "导出文件.docx");
  //   });
  // }

  }

    

  }


</script>

<style scoped>
.title{
   text-align: center;
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
.botmBtnContainer{
  text-align: center;
  margin-top: 20px;
}

</style>