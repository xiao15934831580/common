<template>
  <div class="lz-dialog">
    <el-dialog
      ref="ruleFormRef"
      :model-value="dialogFormVisible"
      :title="titile"
      :before-close="close"
      :width="formLabelWidth"
      :close-on-click-modal="false"
      draggable
    >
      <div>
        <!-- 基础信息 -->
        <div>
          <el-form
            :model="formInline"
            :inline="true"
            label-width="120px"
            :rules="rules"
            ref="addform"
            require-asterisk-position="left"
            size="default"
            scroll-to-error="true"
          >
            <div class="basicstyle">
              <el-form-item label="用户名" prop="username" required>
                <el-input
                  placeholder="请输入用户名"
                  :disabled="titile === '编辑'"
                  v-model="formInline.username"
                />
              </el-form-item>
              <el-form-item label="姓名" prop="realname" required>
                <el-input
                  placeholder="请输入姓名"
                  :disabled="titile === '编辑'"
                  v-model="formInline.realname"
                />
              </el-form-item>
              <el-form-item label="昵称" prop="nickname" required>
                <el-input
                  placeholder="请输入昵称"
                  v-model="formInline.nickname"
                />
              </el-form-item>
              <el-form-item label="性别" prop="sex" required >
                <el-select
                  v-model="formInline.sex"
                  placeholder="请选择性别"
                >
                  <el-option v-for="item in sexDropdown" :key="item.label" :label="item.label" :value="item.value" required>
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone" required>
                <el-input
                  placeholder="请输入手机号码"
                  v-model="formInline.phone"
                />
              </el-form-item>
              <el-form-item label="角色" prop="roleId" required>
                <el-select
                  v-model="formInline.roleId"
                  placeholder="请选择角色"
                >
                  <el-option v-for="item in roleDropdown.value" :key="item.id" :label="item.rolename" :value="item.id" required>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <p class="remarkStyle">备注：创建的新用户初始密码默认为：123456,为了您的账户安全请尽快修改密码</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-mixins-clear-default" @click="close"
            >取消</el-button
          >
          <el-button class="btn-mixins dia-suc" @click="success(addform)"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script  setup>
import { defineProps, ref } from "vue";
import { reactive, watch, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { operateAdminUser as operateAdminUser,getRoleList as getRoleList } from '@/api/user'
import { ElNotification } from "element-plus";
import store from '@/store'
const emits = defineEmits(['update:modelValue','inituserlist']);
const addform = ref();
const formLabelWidth = "40%";
let props = defineProps({
  dialogFormVisible: {
    type: Boolean,
  },
  dialogTitile: {
    type: String,
  },
  dialogTableValue: {
    type: Object,
    default: () => {},
  },
  dropdownValue:{
    type: Object,
    default: () => {},
  },
  inituserlist:{
    type:Boolean
  }
});
const checkIphone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入电话号码"));
  } else if (!/^[0-9]*$/.test(value)) {
    callback(new Error("电话号码只能输入数字"));
  } else if(!/^1\d{10}$/.test(value)){
    callback(new Error('电话号码输入不正确'));
  }else{
    callback()
  }
};
const sexDropdown = reactive([
  {
    label: '女',
    value: 0
  },
    {
    label: '男',
    value:1
  }
])
const roleDropdown = reactive([])
const rules = reactive({
  realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
  sex:[{ required: true, message: "请选择性别", trigger: "change" }],
  phone: [{ validator: checkIphone, trigger: "blur" },],
});

let titile = ref("");
const imageUrl = ref("");
let dowpdown = props.dropdownValue.value
let formInline = reactive({
    id:'',
    "phone": "",
    "roleId": "",
    "sex": "",
    "realname": "",
    username:'',
    nickname:'',
    password:'123456'
});
watch(
  () => props,
  () => {
    titile.value = props.dialogTitile;
    if (titile.value === "编辑" ){
      formInline = props.dialogTableValue.value;
    }
     getRoleList().then((res)=>{
       if(res.code === 200){
         roleDropdown.value = res.body;
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
  },
  { deep: true, immediate: true }
);
const close = () => {
  addform.value.resetFields();
  emits("update:modelValue", false);
};
const success = (addform) => {
  if (!addform) return;
  addform.validate(async (valid) => {
    if (valid) {
      operateAdminUser(JSON.parse(JSON.stringify(formInline)))
        .then((res)=>{
          if(res.code ===200){
            //当编辑的是当前登录账号时
            if(formInline.username === JSON.parse(localStorage.getItem('userData')).username){
                  let obj = JSON.parse(localStorage.getItem('userData'));
                  obj.nickname = JSON.parse(JSON.stringify(formInline)).nickname
                  localStorage.setItem('userData',JSON.stringify(obj))
                  console.log(JSON.parse(JSON.stringify(formInline)).nickname)
            }
            close()
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
    } else {
      // props.dialogTitile==='添加用户' ? ElMessage.error('"添加失败'):ElMessage.success("修改失败")
      return false;
    }
  });
};

</script>



<style lang = 'less' scoped>
.lz-dialog {
  .dia-suc {
    margin-left: 16px !important;
  }
    :deep(.el-input){
    width: 200px;
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
  :deep(.el-dialog__footer ){
    padding-top: 16px;
  }
  :deep(.el-dialog__body ){
    padding: 0;
    max-height: 550px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  :deep(.el-dialog__header ){
    border-bottom: 1px solid #cccccc;
    padding: 0;
    margin-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  :deep(.el-dialog__title ){
    color: #409eff;
    font-size: 20px;
    height: 40px;
    width: 100px;
    border-bottom: 4px solid #409eff;
  }
  :deep(.el-dialog ){
    padding: 24px;
  }
  :deep(.el-dialog__headerbtn ){
    position: static;
    top: 0px;
    right: 0;
    padding: 0;
    width: auto;
    height: auto;
  }
}
:deep(.el-form-item__label) {
  font-size: 14px;
}
:deep(.el-form) {
  position: relative;
}
.imgstyle {
  position: absolute;
  right: 0;
  top: 0;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
:deep(.el-form-item__content) {
  width: 200px;
}
:deep(.el-input__inner ){
  width: 156px;
}
.address {
  :deep(.el-form-item__content ){
    width: 350px;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 150px;
  text-align: center;
}
.uploadimg {
  text-align: center;
  background-color: rgba(64, 158, 255, 0.1);
  span {
    color: #409eff;
  }
}

/* .basicstyle {
  width: 83%;
} */
.imgstyle {
  width: 15%;
  :deep(.el-form-item ){
    margin: 0;
  }
  :deep(.el-form-item__content ){
    width: 100%;
  }
  :deep(.el-icon ){
    width: 120px;
  }
}
.idinfo {
  position: relative;
  .removeidinfo {
    margin-left: 24px;
    font-size: 20px;
    position: absolute;
    margin-top: 5px;
  }
}
.remarkStyle{
  color: #8c939d;
    margin-left: 36px;
    margin-top: 24px;
}
</style>
