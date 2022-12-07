<template>
  <div class="app-container">
    <div class="title">
      <div class="word">教师请假申请表</div>
    </div>
    <div class="body">
      <el-form style="height: 510px; padding: 0px auto;" ref="queryRef" label="left" label-width="184px"
        label-position="labelPosition">
        <el-row type="flex" style="height: 62px; margin-bottom: 10px;">
          <el-col :span="8">
            <el-form-item label="申请人姓名" prop="name">
              <el-input id="input1" v-model="name" :disabled="true" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工号" prop="userid">
              <el-input id="input2" v-model="userid" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在部门" prop="department" style="height: 62px; margin-bottom: 10px;">
              <el-input id="input3" v-model="dept" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="选择请假类型" prop="type" style="height: 62px; margin-bottom: 10px;">
              <el-select v-model="leave_type" placeholder="请选择请假类型" @change="detectSelect">
                <el-option v-for="item in options2" :key="item.leave_type" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-popover placement="right" title="当前年度累计" width="200" trigger="hover" :content="historyContent">
                <i class="el-icon-warning-outline" slot="reference" style="margin-left: 50px;"></i>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否出境" prop="child" v-if="leave_type == '事假'">
              <el-select v-model="leave_type1.child" placeholder="请选择是否出境">
                <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否出境" prop="child" v-if="leave_type == '因公出差'">
              <el-select v-model="leave_type1.child" placeholder="请选择是否出境">
                <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="child" v-if="leave_type1.child == '是' & leave_type == '因公出差'">
              需在请假系统关联PIM中已完成的因公出国（境）申请流程
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="选择请假时间" style="height: 62px; margin-bottom: 10px;">
          <el-date-picker :picker-options="pickerOptions" v-model="start_end_time" type="datetimerange"
            format="yyyy 年 MM 月 dd 日 HH 时" value-format="yyyy-MM-dd HH" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="handleTimePicker">
          </el-date-picker>
          <!-- <el-popover placement="right" title="当前系统判定实际请假天数共" width="200" trigger="hover"
            :content="leaveRealDaysContent">
            <i class="el-icon-warning-outline" slot="reference" style="margin-left: 50px;"></i>
          </el-popover> -->
          <div style="display:flex;">
            <div style="margin-left:80px">{{start}}</div>
            <div style="margin-left:80px">{{end}}</div>
          </div>
        </el-form-item>

        <el-row style="height: 62px; margin-bottom: 10px;">
          <el-col :span="8">
            <el-form-item label="请假事由说明" prop="explain" v-if="leave_type1.child == '是' & leave_type == '事假'">
              <div style="display: flex;" class="inputDeep">
                <div class="left">
                  <p style="display: inline;">赴</p>
                </div>
                <el-input v-model="country"></el-input>
                <div class="left">
                  <p style="display: inline;">国家、地区</p>
                </div>
                <el-input v-model="reason"></el-input>
                <div class="left">
                  <p style="display: inline;">事由</p>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="请假事由说明" prop="explain" v-if="leave_type != '事假'">
              <el-input v-model="leave_reason" placeholder="请输入请假事由具体说明" style="width: 500px;" />
            </el-form-item>
            <el-form-item label="请假事由说明" prop="explain" v-if="leave_type1.child == '否' & leave_type == '事假'">
              <el-input v-model="leave_reason" placeholder="请输入请假事由具体说明" style="width: 500px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="height: 62px; margin-bottom: 10px;">
          <el-col :span="8">
            <el-form-item label="文件上传" prop="leave_matrial">
              <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
                accept=".jpg,.png,.pdf" multiple :limit="5" :name="leave_matrial" :on-exceed="handleExceed"
                :on-change="handleChange" :on-preview="handlePreview" :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload" :file-list="fileList" :auto-upload="true" :show-file-list="true">
                <el-popover placement="right" width="200" trigger="hover" content="只能上传jpg/png/pdf文件，且不超过2MB">
                  <el-button slot="reference" size="medium" type="primary">选取文件
                    <i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </el-popover>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center; margin-top: 20px;">
        <el-button type="primary" style="margin-right: 120px;" size="medium" @click="submit()">提交</el-button>

        <el-button type="primary" size="medium">重置</el-button>
      </div>
      <div class="foot" style="color:#f0000f">
        <a href="https://hr.shu.edu.cn/info/1042/4217.htm">@上海大学教职工请假和考勤制度的规定</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoById, addTeacherLeaveFormMsg, getSystemMaxLimitTime, checkTeachingDate } from "@/api/apply"
import { getSumLeaveTypeDays, getCurrentLeaveDays, getReferenceLeaveDay } from "@/api/apply"

export default {
  data () {
    return {
      labelPosition: "left",
      dept: "",
      name: "",
      userid: "",
      leave_reason: "",
      leave_type: "",
      leave_matrial: "",
      start_end_time: "",
      fileList: [],
      country: "",
      reason: "",
      options2: [
        {
          value: "事假",
          label: "事假",
        },
        {
          value: "病假",
          label: "病假",
        },
        {
          value: "婚假",
          label: "婚假",
        },
        {
          value: "产假",
          label: "产假",
        },
        {
          value: "陪产假",
          label: "陪产假",
        },
        {
          value: "丧假",
          label: "丧假",
        },
        {
          value: "因公出差",
          label: "因公出差",
        },
        {
          value: "工伤假",
          label: "工伤假",
        },
      ],
      leave_type1: {

        child: '否',

      },
      leave_reason: '',
      rules: {
        child: [{ required: true, message: '必填项不可为空！' },],
      },
      options3: [
        {
          value: "是",
          label: "是",
        },
        {
          value: "否",
          label: "否",
        },
      ],
      dataConstrain: {},
      historyContent: '',
      leaveRealDaysContent: '',
      selectData: '',
      nowDate: '',    // 当前事件（）
      pickerOptions: {
        // 点击时，选择的是开始时间，也就是minDate
        onPick: ({ maxDate, minDate }) => {
          this.selectData = minDate.getTime()
          if (maxDate) {
            // 解除限制
            this.selectData = ''
          }
        },
        disabledDate: (time) => {
          // 是否限制的判断条件
          if (!this.isNull(this.selectData)) {
            var date = new Date(this.selectData)
            const day = this.dataConstrain[this.leave_type] * 24 * 3600 * 1000;
            const dateRegion = date.getTime() + day;
            // 这里就是限制的条件，这里为大于或者小于本月的日期被禁用(尽量不使用这种方法，因为其他年份的本月也能进行选择，具体限制日期参考情况2)
            // return date.getMonth() > new Date(time).getMonth() || date.getMonth() < new Date(time).getMonth()
            return new Date(time).getTime() > dateRegion || new Date(time).getTime() < date.getTime();
          } else {
            return false
          }
        }
      },
      start: '',
      end: '',
      allDay: '',
    };
  },

  created () {
    // 设置默认的开始时间
    this.start_end_time = new Date().getFullYear().toString();
    // 在页面加载时读取后端系统请假类型时间条件
    getSystemMaxLimitTime().then(res => {
      this.systemTimeConstrain = res.data;
      // 将后端返回的数组转换成键值对的形式
      for (var i = 0; i < this.systemTimeConstrain.length; i++) {
        this.dataConstrain[String(this.systemTimeConstrain[i].type)] = parseInt(this.systemTimeConstrain[i].limitTime);
      }
      console.log(this.dataConstrain);
    })

    // 在页面加载时首先加载当前登录的用户信息（暂时以查询单个用户信息代替）
    this.userid = this.$store.getters.id;
    this.name = this.$store.getters.name;
    this.dept = this.$store.getters.yuanxi;
  },

  methods: {
    // 检查是否为空
    isNull (value) {
      if (value) {
        return false
      }
      return true
    },
    beforeAvatarUpload (file) {
      console.log(file.type)
      const isJPG = file.type === 'image/png';
      const isPNG = file.type === 'image/jpeg';
      const isPDF = file.type === 'pdf';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PDF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 文件上传获取文本框内本地文件路径
    handleChange (file, fileLists) {
      // 本地电脑路径
      console.log(document.getElementsByClassName("el-upload__input")[0].value);
      var path = document.getElementsByClassName("el-upload__input")[0].value;
      // 对用户提交的文件材料进行重命名，命名格式为：时间-工号-xx假证明材料.jpg/png/pdf
      let path_arr = path.split(".");
      var id_str = this.userid;
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth() + 1;//得到月份
      // month = month + 1;
      var date = now.getDate();//得到日期
      var hour = now.getHours();//得到小时
      var minu = now.getMinutes();//得到分钟
      this.leave_matrial = path_arr[0] + year + month + date + hour + minu + "-" + id_str + "." + path_arr[1];
      console.log(this.leave_matrial);
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 处理时间选择器变化事件
    handleTimePicker () {
      console.log("当前选择的起止时间分别为：", this.start_end_time[0], this.start_end_time[1]);
      checkTeachingDate({ "checking_date": this.start_end_time[0].substring(0, 10) }).then(res => {
        if (res.code === 200) {
          this.start = res.data.dateIndex;
        }
      })
      checkTeachingDate({ "checking_date": this.start_end_time[1].substring(0, 10) }).then(res => {
        if (res.code === 200) {
          this.end = res.data.dateIndex;
        }
      })

    },
    // 下拉列表变化时的方法
    detectSelect () {
      // 查询当前用户本年度对应请假类型的总天数
      var nowDate = new Date();
      var params = {
        "userid": this.userid,
        "type": this.leave_type,
        "year": nowDate.getFullYear()
      };
      console.log(params);
      getSumLeaveTypeDays(params).then(res => {
        console.log("本年度累计", this.leave_type, "总天数：", res.data);
        this.historyContent = "本年度累计" + this.leave_type + "总天数：" + res.data + "天";
      });
      // console.log("当前选择的请假类型：", this.leave_type);
      if (this.dataConstrain[this.leave_type] != "") {
        console.log("当前请假类型对应的最大请假期限：", this.dataConstrain[this.leave_type]);
      }

    },
    showMsg () {
      this.leave_reason = '赴' + this.country + this.reason;
      console.log(this.leave_reason);
    },

    submitLeave () {
      this.$confirm(this.allDay, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this = this;
        if (this.leave_matrial == "") {
          this.leave_matrial = "暂无证明材料"
        }
        if (this.leave_type == "事假" && this.leave_type1.child == '是') {
          this.showMsg();   //选择事假类型则进行文本框字符串拼接
          console.log("当前请假事由：", this.leave_reason);
        }
        let param = {
          "userid": this.userid,
          "leave-type": this.leave_type,
          "leave-start-time": this.start_end_time[0],
          "leave-end-time": this.start_end_time[1],
          "leave-reason": this.leave_reason,
          "leave-material": this.leave_matrial
        };
        console.log(param);
        addTeacherLeaveFormMsg(param).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '申请成功!'
            });
            this.$router.push({
              name: 'LeaveRecord'
            })

          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交请假申请'
        });
      });
    },

    submit () {
      let leave_start_time = this.start_end_time[0] + ':00:00';
      let leave_end_time = this.start_end_time[1] + ':00:00';
      getReferenceLeaveDay({
        "leave_start_time": leave_start_time,
        "leave_end_time": leave_end_time,
        "leave_type": this.leave_type
      }).then(res => {
        if (res.code === 200) {
          this.allDay = '系统计算您的请假天数为：' + res.data + '天，具体判定以人事处为准。'
          this.submitLeave();
        }
      })
    }

  },
};
</script>

<style scoped>
.app-container {
  width: auto;
  height: 1000px;
  margin: 20px;
  border-radius: 4px 4px 4px 4px;
  background-color: #ffffff;
}

.line {
  text-align: center;
}

.body {
  width: 100%;
  height: 80%;
  /* background: #ffffff; */
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
}

.word {
  width: 336px;
  height: 70px;
  font-size: 48px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #000000;
  line-height: 70px;

  margin: 0 auto;
}

.title {
  width: 100%;
  height: 10%;
  /* background: #ffffff; */
  /* border-radius: 4px 4px 4px 4px; */
  opacity: 1;
  margin-top: 20px;
  margin-bottom: 20px;
}

.input1 {
  width: 113px;
}

.input2 {
  width: 113px;
}

.foot {
  width: 300px;
  height: 20px;
  margin: 30px auto;
  text-decoration: underline;
  font-style: italic;
}

.inputDeep >>> .el-input__inner {
  width: 100px;
  height: 30px;
  border-radius: 0;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  border-color: black;
}

.el-input {
  width: 200px;
  position: relative;
  font-size: 14px;
  display: inline-block;
}

.el-range-editor.el-input__inner {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 3px 10px;
  width: 500px;
}

.left p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
