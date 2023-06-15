<template>
<div>
        <div class="header">
        <div class="headleft">
            <!-- <span class="headerimg"></span> -->
            <span class="name">{{message}}</span>
        </div>
        <div class="headright">
            <!-- <el-icon class="icon"><Bell /></el-icon> -->
            <span class="headpig"></span>
            
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{nickname}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="lookinfo">查看个人信息</el-dropdown-item>
                        <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- 修改密码 -->
    <div class="lz-dialog">
        <el-dialog
        ref="posswordRef"
        :model-value="dialogPasswordVisible"
        title="修改密码"
        :before-close="closePassword"
        width="40%"
        :close-on-click-modal ="false"
        draggable
        >
            <div>
                <el-form
                :model="formPassword"
                :inline="true"
                label-width="80px"
                :rules="rules"
                ref="passwordform"
                require-asterisk-position="left"
                size="default"
                scroll-to-error="true"
            >
                <el-form-item label="原始密码" prop="original" required>
                    <el-input
                        placeholder="请输入原始密码"
                        type="password"
                        v-model="formPassword.original"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="新密码" prop="new" required>
                    <el-input
                        placeholder="请输入新密码"
                        type="password"
                        show-password
                        v-model="formPassword.new"
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm" required>
                    <el-input
                        placeholder="请输入原始密码"
                        type="password"
                        v-model="formPassword.confirm"
                        show-password
                    />
                </el-form-item>
            </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="btn-mixins-clear-default" @click="closePassword"
                    >返回</el-button>
                <el-button class="btn-mixins-clear-default" @click="savePassword(passwordform)"
                    >确定</el-button>
                
                </span>
        </template>
        </el-dialog>
    </div>
    <!-- 查看个人信息 -->
    <div class="lz-dialog">
        <el-dialog
            ref="infoRef"
            :model-value="dialogInfoVisible"
            title="查看个人信息"
            :before-close="closeInfo"
            width="40%"
            :close-on-click-modal ="false"
            draggable
            >
            <div>
                <div class="showinfo">
                    <p class="showstyle">姓名：{{ info.realname }}</p>
                    <p class="showstyle">用户名：{{ info.username }}</p>
            </div>
            <div class="showinfo">
                    <p class="showstyle">昵称：{{ info.nickname }}</p>
                    <p class="showstyle">性别：{{ info.sexString }}</p>
            </div>
            <div class="showinfo">
                <p class="showstyle">手机号码：{{ info.phone }}</p>
                <p class="showstyle">角色：{{ info.rolename }}</p>
            </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="btn-mixins-clear-default" @click="closeInfo">返回</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</div>

</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from 'vuex';
import { reactive, ref, getCurrentInstance ,onMounted} from "vue";
import store from '@/store'
import { ElNotification } from "element-plus";
import { loginOut as exit} from '@/api/index'
import {resetPasswords as resetPasswords, findMyInformation as findMyInformation } from '@/api/user'
// import mitt from 'mitt';
// const emitter = mitt();
    const message = '港口流动机械维修保养综合管理数字化平台'
    const {proxy} = getCurrentInstance();
    const passwordform = ref('');
    let dialogPasswordVisible  = ref(false);
    let dialogInfoVisible = ref(false);
    const router = useRouter();
    let nickname =  ref('');
    nickname.value = JSON.parse(localStorage.getItem('userData')).nickname
    const rules = reactive({
        original:[{ required: true, message: '请输入原始密码', trigger: 'blur' },],
        new:[{ required: true, message: '请输入新密码', trigger: 'blur' },],
        confirm:[{ required: true, message: '请输入确认密码', trigger: 'blur' },],
        
    })
     let userData = JSON.parse(localStorage.getItem('userData'))
    const formPassword = reactive({
        original:'',
        new:'',
        confirm:''
    })
    let info = ref({
            // "id": "",
            // "username": "",
            // "loginClientLbl": '',
            // "nickname": "",
            // "sexLbl": "",
            // "phoneNum": "",
            // "statusLbl": "",
            // "roleLbl": ""
    })
    const loginOut=()=>{
        exit(userData.username).then((res)=>{
            if(res.code === 200){
                store.dispatch('app/logout')
            }else {
                ElNotification({
                    title: 'Warning',
                    message: res.message?res.message:'服务器异常',
                    type: 'warning',
                })
                if(res.code === 100007 ||  res.code === 100008){
                        store.dispatch('app/logout')
                }
            }
            
        })
    }
    onMounted(() => {

            window.addEventListener('setItemEvent', function(e) {
                    if (e.key === 'userData') {
                        console.log('##', e.newValue)
                        nickname.value = JSON.parse(e.newValue).nickname
                    }
                })
    });
    const changePassword = ()=>{
        dialogPasswordVisible.value = true;
    }
    const savePassword = (passwordform)=>{
        if(!passwordform) return
         passwordform.validate(async(valid) => {
            if(valid){
                // let userData = JSON.parse(JSON.stringify(store.getters.userData))
               let obj = {
                    "confirmPassword": formPassword.confirm,
                    "newPassword": formPassword.new,
                    "oldPassword":  formPassword.original,
                    "userName":userData.username
                }
                resetPasswords(obj).then((res)=>{
                    if(res.code === 200){
                        closePassword()
                    }else{
                        ElNotification({
                            title: 'Warning',
                            message: res.message?res.message:'服务器异常',
                            type: 'warning',
                            })
                        if(res.code === 100007 ||  res.code === 100008){
                                store.dispatch('app/logout')
                            }
                    }
                })
               
            }else{
                return;
            }
        })
    }
    const closePassword = ()=>{
        passwordform.value.resetFields();
        dialogPasswordVisible.value = false;
    }
    const lookinfo = ()=>{
        findMyInformation(userData.username).then((res)=>{
            if(res.code === 200){
                info.value = res.body
                dialogInfoVisible.value = true;
            }else{
                ElNotification({
                    title: 'Warning',
                    message: res.message?res.message:'服务器异常',
                    type: 'warning',
                    })
                        if(res.code === 100007 ||  res.code === 100008){
                                store.dispatch('app/logout')
                            }
            }
            
            
        })
        
    }
    const closeInfo = ()=>{
        dialogInfoVisible.value = false;
    }
</script>

<style lang='less' scoped>
.lz-dialog {
  .dia-suc {
    margin-left: 16px !important;
  }
  .basictitle {
    font-size: 18px;
    margin: 16px 0 24px;
    color: #333333;
  }
  .basicinfo {
    font-size: 18px;
    margin: 16px 0 24px;
    color: #333333;
    border-bottom: 1px solid #cccccc;
    span {
      color: #333333;
      font-size: 20px;
      height: 40px;
      width: 100px;
      border-bottom: 4px solid #409eff;
      display: block;
    }
  }
  :deep(.el-dialog__footer) {
    padding-top: 16px;
  }
  :deep(.el-dialog__body ){
    padding: 0;
    max-height: 550px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #cccccc;
    padding: 0;
    margin-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  :deep(.el-dialog__title) {
    color: #409eff;
    font-size: 20px;
    height: 40px;
    width: 120px;
    border-bottom: 4px solid #409eff;
  }
  :deep(.el-dialog) {
    padding: 24px;
  }
  :deep(.el-dialog__headerbtn) {
    position: static;
    top: 0px;
    right: 0;
    padding: 0;
    width: auto;
    height: auto;
  }
}
.header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    background-color: #ffff;
}
.headerimg{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    background-color: #333;
    float: left;
    margin-top: 12px;
}
:deep(.el-form--inline .el-form-item){
    margin-left: 20%;
}
.showinfo {
    display: flex;
    margin: 16px 32px;
}
.showstyle {
  margin-right: 24px;
  width: 250px;
}
.name{
    float: right;
    line-height: 56px;
    // margin-left: 16px;
    font-weight: bolder;
}
.headright{
    height: 100%;
    .el-icon{
        margin-top: 24px;
    }
}
.headpig{
    width: 30px;
    height: 30px;
    background-color: sandybrown;
    border-radius: 50%;
    display: block;
    float: left;
    margin-top: 10px;
    margin: 16px;
}

.admin{
    float: right;
    line-height: 48px;
    position: relative;
}
.icon{
    float: left;
    line-height: 48px;
}
.el-dropdown-link{
    cursor: pointer;
}
</style>