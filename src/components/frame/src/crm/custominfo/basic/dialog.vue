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
        <p class="basictitle">客户基本信息</p>
        <div>
          <div class="showinfo">
            <p class="showstyle">姓名：{{ formInline.data.userName }}</p>
            <p class="showstyle">性别：{{ formInline.data.sexString }}</p>
            <p class="showstyle">民族：{{ formInline.data.nation }}</p>
            <p class="showstyle">手机号码：{{ formInline.data.phoneNumber }}</p> 
          </div>
          <div class="showinfo">
            <p class="showstyle">证件类型：{{ formInline.data.idType }}</p>
            <p class="showstyle">证件号码：{{ formInline.data.idNumber }}</p>
            <p class="showstyle">客户等级：{{ formInline.data.customerLevelStr }}</p> 
            <p class="showstyle">婚姻状态：{{ formInline.data.maritalStatus }}</p>
          </div>
          <div class="showinfo">
            <p class="showstyle">教育程度：{{ formInline.data.educationLevel }}</p>
            <p class="showstyle">职业：{{ formInline.data.occupation }}</p>
            <p class="showstyle">经济：{{ formInline.data.economy }}</p>
            <p class="showstyle">资产：{{ formInline.data.property }}</p>
          </div>
          <div class="showinfo">
            <p class="showstyle">消费习惯与计划：{{ formInline.data.consumptionHabitsOrPlans }}</p>
            <p class="showstyle">住址：{{ formInline.data.adressCascade }}</p>
          </div>
        </div>
        <p class="basicinfo"><span>家庭成员信息</span></p>
        <div>
          <el-table
            :data="formInline.data.familyMember"
            :header-cell-style="{ background: 'rgba(64, 158, 255, 0.1)' }"
            border
            style="width: 100%"
          >
            <el-table-column label="序号" min-width="7%">
              <template #default="requestscope">
                <span class="elispice">{{ requestscope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="10%"/>
            <el-table-column prop="sex" label="性别" min-width="10%"/>
            <el-table-column
              prop="relation"
              label="关系"
              min-width="10%"
            />
            <el-table-column
              prop="occupation"
              label="职业"
              min-width="10%"
            />
            <el-table-column
              prop="phoneNumber"
              label="手机号码"
              min-width="10%"
            />
            <el-table-column prop="consumptionHabitsOrPlans" label="消费习惯与计划" min-width="10%"/>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-mixins-clear-default" @click="close"
            >返回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>

</template>
<script  setup>
import { defineProps, ref } from "vue";
import { reactive, watch, defineEmits } from "vue";
import { ElMessage ,ElNotification} from "element-plus";
import store from '@/store'
import {getAllUserInfo as getAllUserInfo } from '@/api/index'
const emits = defineEmits(["update:modelValue"]);
const addform = ref();
const formLabelWidth = "70%";
let dialogInspectorVisible = ref(false);
let dialogExitVisible = ref(false);
let props = defineProps({
  dialogFormVisible: {
    type: Boolean,
  },
  dataId: {
  },
});
let titile = ref("");
const imageUrl = ref("");
let formInline = reactive({
    data:{}
});
const inspector = ref("");
const exitvalue = ref("");
const isinspector = ref(false);
watch(
  () => props,
  () => {
    titile.value = '查看';
    getAllUserInfo(props.dataId).then((res)=>{
      if(res.code === 200){
        formInline.data = res.body;
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
  },
  { deep: true, immediate: true }
);
const close = () => {
  emits("update:modelValue", false);
};

const closeExit = () => {
  dialogExitVisible.value = false;
};
</script>
<style lang = 'less' scoped>
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
    margin: 24px 0;
    color: #333333;
    border-bottom: 1px solid #cccccc;
    span {
      color: #333333;
      font-size: 20px;
      height: 40px;
      width: 150px;
      border-bottom: 2px solid #409eff;
      display: block;
    }
  }
  :deep(.el-dialog__footer) {
    padding-top: 16px;
  }
  :deep(.el-dialog__body){
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
  }
  :deep(.el-dialog__title) {
    color: #409eff;
    font-size: 20px;
    height: 40px;
    width: 100px;
    border-bottom: 4px solid #409eff;
  }
  :deep( .el-dialog) {
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
:deep(.el-form-item__label) {
  font-size: 14px;
}
:deep(.el-form) {
  position: relative;
}
:deep(.el-input){
  width: 100%;
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
:deep(.avatar-uploader .el-upload ){
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

.showinfo {
  display: flex;
  margin-bottom: 16px;
}
.imgstyle {
  width: 15%;
  :deep(.el-form-item) {
    margin: 0;
  }
  :deep(.el-form-item__content) {
    width: 100%;
  }
  :deep(.el-icon) {
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
.showstyle {
  margin-right: 24px;
  width: 250px;
}
.labstyle {
  width: 100px;
  background-color: #409eff;
  margin: 24px 0;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
}
.addcolum {
  border-bottom: 1px solid #ebeef5;
  text-align: center;
  line-height: 40px;
  font-size: 24px;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  cursor: pointer;
}
.errordom {
  float: left;
  width: 200px;
  margin-top: -6px;
  position: relative;
}
.errorselect {
  :deep(.el-input__wrapper ){
    box-shadow: 0 0 0 1px #f56c6c inset;
  }
}
.labelinspector {
  width: 100px;
  float: left;
}
.errorinfo {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 2px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
