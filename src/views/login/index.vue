<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" class="login-form valid_form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">向导管理平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>

import commonUrl from '../../utils/common';
import { URLSearchParams } from 'url';
import qs from 'qs';
import { setToken } from '../../utils/auth.js';
import store from '../../store'
import router, {
  resetRouter
} from '../../router'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '100008',
        password: '123456'
      },
      loginFormRules:{
        username:[
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    //  点击登录
    async handleLogin() {
      if(this.m_valid_addForm('loginForm')){
          let param = {
          username:this.loginForm.username,
          password:this.$md5(this.loginForm.password),
        }
        this.loading = true
        console.log(param)
        const res = await this.$http.post(`${commonUrl.baseUrl}/web/login`, qs.stringify(param));
        console.log(res);

        debugger
        if(res.data.code == '0000'){
          console.log(res)

          // cun
          // 存name customid
          store.commit('user/SET_REALNAME', res.data.data.traveler.name)
          localStorage.setItem('pp_real_name',res.data.data.traveler.name)
          store.commit('user/SET_USERID', res.data.data.traveler.customid)
          localStorage.setItem('pp_userId',res.data.data.traveler.customid)
          // 1写死token 2存roles 3存用户信息
          // token
          let authorization = 'token'
          store.commit('user/SET_TOKEN', authorization)
          setToken(authorization) // 存到cookie里面
          // roles
          store.commit('user/SET_ROLES', ['admin'])
          localStorage.setItem('roles',JSON.stringify(['admin']))
          // 用户信息
          store.commit('user/SET_NAME', 'editor')
          store.commit('user/SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif') //头像
          const accessRoutes = await store.dispatch('permission/generateRoutes', []) // 为什么是数组呢？只有数组才能实现递归
          router.addRoutes(accessRoutes)


          this.loading = false
          this.$router.push({path: '/'}) //这里 这么写 ？
        } else {
          this.loading = false
          this.m_message(res.data.msg, 'warning')
        }
      }

    },
     // 校验
    m_valid_addForm(formName) {
      let  flag  = false ;
      this.$refs[formName].validate((valid) => {
          if (valid) {
          flag = true;
          return true
          } else {
          flag = false;
          return false;
          }
      });
      return flag;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message,type){
      this.$message({
        message,
        type
      })
    },
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
