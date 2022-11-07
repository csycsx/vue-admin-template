<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="input" class="input">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="工号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>申请列表</h3>
        </div>

        <el-table ref="filterTable" :data="tableData" border style="width: 100%" @row-click="rowChick">
          <el-table-column prop="userid" label="工号" width="100">
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="100">
          </el-table-column>
          <el-table-column prop="yuanxi" label="院系" width="150">
          </el-table-column>
          <el-table-column prop="leave_type" label="请假类型" width="100">
          </el-table-column>
          <el-table-column prop="leave_start_time" label="起始时间">
          </el-table-column>
          <el-table-column prop="leave_end_time" label="结束时间">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100"
            :filters="[{ text: '待审核', value: '待审核' }, { text: '审核完成', value: '审核完成' }]" :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '待审核' ? 'danger' : 'success'" disable-transitions>
                {{scope.row.status}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

      </el-card>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      select: '',


      tableData: [{
        id: '11111111',
        userid: '21000000',
        username: '张三',
        yuanxi: '计算机工程与科学',
        leave_type: '事假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '待审核'
      }, {
        id: '22222222',
        userid: '21000001',
        username: '李四',
        yuanxi: '计算机工程与科学',
        leave_type: '病假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '待审核'
      }, {
        id: '33333333',
        userid: '21000002',
        username: '王五',
        yuanxi: '通信学院',
        leave_type: '病假',
        leave_start_time: '2022-10-13',
        leave_end_time: '2022-10-22',
        status: '审核完成'
      }
      ]
    }
  },
  created () {
    let param = {
      id: this.$store.getters.id, // 获取 store中的 id
      role: this.$store.getters.role, // 获取 store中的 role
      yuanxi: this.$store.getters.yuanxi, // 获取 store中的 yuanxi 院系
    };
    this.init(param);

  },
  mounted () { },
  methods: {
    filterTag (value, row) {
      return row.status === value;
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    //搜索接口
    search: async function () {
      console.log(this.input);
      console.log(this.select);
      if (this.select === "") {
        this.$Notice.error({
          title: "请选择搜索类型",
          duration: 2
        });
      }
      else if (this.input === "") {
        this.$Notice.error({
          title: "请输入搜索内容",
          duration: 2
        });
      }
      else {
        //调用后端接口

      }
    },
    //页面初始化

    //点击某条信息，跳转详情页面
    rowChick (row, event, column) {
      console.log(row.id);
      this.$router.push({
        name: 'DetailLeave',
        params: {
          id: row.id,
          role: 2,
          yuanxi: "计算机",
        }
      })
    },

    init: async function (params) {


    }




  }
}
</script>

<style scoped>
.app-container {
  margin: 30px;
}

/* 搜索 */
.search {
  width: 400px;
}
.el-select {
  width: 100px;
}

/* 表格 */
.table {
  margin-top: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card ::v-deep .el-card__header {
  border-bottom: 1.5px solid #ebeef5;
  width: 100%;
}

.box-card div h3 {
  font-size: 22px;
  font-weight: 700;
  color: #304156;
  margin: 0 auto;
  text-align: center;
}

.box-card ::v-deep .el-card__body {
  margin: 0 20px;
}
</style>