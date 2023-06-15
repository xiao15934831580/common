<template>
  <div class="login-container">
    <el-form
      ref="formRef"
      :model="form"
      class="login-form"
      :rules="rules"
      :label-position="left"
      label-width="100px"
      style="max-width: 600px"
    >
      <div class="title-container">
        <h3 class="title">流动机械维修综合管理系统</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          class="w-50 m-2"
          v-model="form.username"
          :prefix-icon="avatar"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="w-50 m-2"
          :type="passwordType"
          v-model="form.password"
          :prefix-icon="lock"
          placeholder="密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click="handleLogin"
        >登录</el-button
      >
      <el-checkbox v-model="checked1" label="记住密码" size="large" />
    </el-form>
      <el-alert
    v-if="loginErr"
    title="用户名或密码错误"
    type="warning"
    center
    show-icon
  />
  </div>

</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Avatar, Lock } from "@element-plus/icons-vue";
const store = useStore();
const { proxy } = getCurrentInstance();
let form = ref({
  username: "",
  password: "",
});
const checked1 = ref(false);
const rules = ref({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});
const router = useRouter();
const formRef = ref(null);
const avatar = ref(Avatar);
const lock = ref(Lock);
const passwordType = ref("password");
onMounted(() => {
  getaccount(); //获取cookie的方法
  window.addEventListener('keydown',keydown)
});
const keydown = (e)=>{
  if(e.keyCode === 13){
    handleLogin()
  }
}
onUnmounted(()=>{
  window.removeEventListener('keydown', keydown, false)
})
const getaccount = () => {
  if (document.cookie.length >= 0) {
    form.value.username = getCookie("mobile");
    form.value.password = getCookie("password");
    checked1.value = true;
    console.log(form.username);
  }
};
const setCookie = (c_name, c_pwd, exdate) => {
  //账号，密码 ，过期的天数

  let date = new Date();

  console.log(c_name, c_pwd);

  date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * exdate); //保存的天数

  document.cookie =
    "mobile=" + c_name + ";path=/;expires=" + date.toLocaleString();

  document.cookie =
    "password=" + c_pwd + ";path=/;expires=" + date.toLocaleString();
};

const getCookie = (name) => {
  var arr = document.cookie.split(";");

  //["_ga=GA1.1.1756734561.1561034020", " mobile=123" password=456"]

  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split("="); // ["_ga", "GA1.1.1756734561.1561034020"]

    if (arr2[0].trim() == name) {
      return arr2[1];
    }
  }
};

const clearCookie = () => {
  setCookie("", "", -1); //清除cookie
};
const handleLogin = () => {
  console.log(store)
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log(form.value.username);
      if (checked1.value) {
        setCookie(form.value.username, form.value.password, 7);
      } else {
        clearCookie();
      }

      let obj = {
        username: form.value.username,
        // password: proxy.$md5(
        //   form.value.password + "b459dcbe8a3d46d49dfdc39c12df854e"
        // ),
        password: form.value.password
      };
      console.log(obj);
      store.dispatch("app/login", obj);
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;
@cursor: #fff;
/deep/.el-input__wrapper {
  display: flex;
  background-color: transparent;
  width: 260px;
}
.login-container {
  min-height: 100vh;
  background: url(../../../../assets/loginbgm.jpg) no-repeat;
//   background-size: cover;
  background-size:100% 100%;
  height:100%;
    width:100%;
    overflow: hidden;
  margin: 0;
  .login-form {
    position: absolute;
    width: 360px;
    max-width: 100%;
    padding: 24px 0;
    margin: 0 auto;
    margin-right: 10%;
    overflow: hidden;
    top: calc(50% - 153px);
    right: 0;
    border-radius: 20px;
    background-color: rgba(23,48,90,.5);
    /deep/ .el-form-item {
      margin-bottom: 24px;
    }
    /deep/ .el-form-item__label {
      color: #fff;
      line-height: 48px;
    }
    /deep/ .el-form-item__content {
      margin-left: 48px !important;
    }
    /deep/ .el-input {
      display: inline-block;
      height: 36px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: @light_gray;
        height: 30px;
        caret-color: @cursor;
      }
    }
    /deep/ .el-checkbox:last-of-type {
      margin-left: 48px;
      margin-top: 16px;
    }
    /deep/ .el-checkbox.el-checkbox--large .el-checkbox__label {
      color: #fff;
    }
    .login-button {
      width: 260px;
      margin-left: 48px;
      box-sizing: border-box;
    }
  }
  .login-form::after {
    background-color: rgba(69, 119, 203, 0.7);
    opacity: 0.7;
  }
  .tips {
    font-size: 16px;
    line-height: 28px;
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
    color: @dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: @light_gray;
      margin: 0px auto 24px auto;
      text-align: center;
      font-weight: bold;
    }

    /deep/ .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
