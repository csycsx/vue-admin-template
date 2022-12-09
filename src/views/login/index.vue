<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">一网通办模拟登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="id"
          v-model="loginForm.id"
          placeholder="请输入工号"
          name="工号"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-button type="primary"  @click.native.prevent="handleLogin">登录成功</el-button>
      <el-button type="primary"  @click.native.prevent="handleLoginFail">登录失败</el-button>


    </el-form>
  </div>
</template>

<script>
import { getUserInfoById } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        id: '',
      },
      redirect: undefined
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  methods: {

    /**
     * 模拟获取一网通办获取数据失败
     * 
     * 2022.11.8 by spark chen 
     */
    handleLoginFail(){
      this.$message.error("一网通办数据获取失败");
    },
    /**
     * 点击登录时 利用 userInfo主键（暂时）获取数据库用户信息，若成功则将store中数据初始化，并跳转到dashboard页面
     * 
     * 2022.11.8 by spark chen 
     */
    handleLogin() {
      const data = {"username":this.loginForm.id,"password":123456}
      this.$store.dispatch('user/init_user_info', data).then(() => {
      this.$router.push('/dashboard')
      }).catch(() => {
        this.$message.error("获取数据失败！");
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
