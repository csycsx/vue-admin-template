<template>
  <div>

  </div>
</template>

<script>
import { loginOauth } from "../../api/user"
export default {
  name: "LoginRedirect",
  data() {
    return {
        code: ""
    };
  },
  mounted() {
    let that  = this; 
    this.code = this.$route.query.code;
    var param = {
        "code": this.code
    };
    console.log(param);
    loginOauth(param).then(res => {
        if (res.data.code === 200) {
            console.log(res.data);
            var userId = res.data.data.user.basic.userId;
            const data = {"username": userId, "password":123456}
            this.$store.dispatch('user/init_user_info', data).then(() => {
                this.$router.push('/dashboard');
            }).catch(() => {
                this.$message.error("获取数据失败！");
            })
        } else {
            this.$message.error("网络错误");
        }
    })
  }
};
</script>
<style lang="scss" scoped>
</style>