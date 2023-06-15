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
        <!-- <p class="basicinfo"><span>车辆信息</span></p> -->
        <div style="margin-top:24px;">
          <el-form
            :model="formInline"
            :inline="true"
            label-width="160px"
            :rules="rules"
            ref="addform"
            require-asterisk-position="left"
            size="default"
            scroll-to-error="true"
          >
            <div class="basicstyle">
              <el-form-item label="保单编号" prop="policyNo" required>
                <el-input
                  placeholder="请输入保单编号"
                  :disabled="titile === '查看'"
                  v-model="formInline.policyNo"
                />
              </el-form-item>
              <el-form-item label="电站单元名称" prop="powerStationName" required>
                 <el-input
                  placeholder="请输入电站单元名称"
                  :disabled="titile === '查看'||titile === '更新'"
                  v-model="formInline.powerStationName"
                />
              </el-form-item>
              <el-form-item label="电站业主名称" prop="userName" required>
                <el-input
                  placeholder="请输入电站业主名称"
                  :disabled="titile === '查看'||titile === '更新'"
                  v-model="formInline.userName"
                />
              </el-form-item>
              <el-form-item label="保单金额" prop="policyAmount" required>
                      <el-input
                  placeholder="请输入保单金额"
                  :disabled="titile === '查看'"
                  v-model="formInline.policyAmount"
                />
              </el-form-item>
              <el-form-item label="保单生效日期" prop="policyEffectiveDate" required>
                 <el-date-picker
                  :disabled="titile === '查看'"
                  placeholder="请选择保单生效日期"
                  v-model="formInline.policyEffectiveDate"
                  type="date"
                />
              </el-form-item>
              <el-form-item label="保单失效日期" prop="policyExpirationDate" required>
                <el-date-picker
                  :disabled="titile === '查看'"
                  placeholder="请选择保单失效日期"
                  v-model="formInline.policyExpirationDate"
                  type="date"
                />
              </el-form-item>
               <el-form-item label="电站地址" prop="powerAddress" required>
                <el-input
                  placeholder="请输入电站地址"
                  :disabled="titile === '查看'||titile === '更新'"
                  v-model="formInline.powerAddress"
                />
              </el-form-item> 
               <el-form-item label="保单客户经理" prop="policyAccountManager" required>
                <el-input
                  placeholder="请输入保单客户经理"
                  :disabled="titile === '查看'||titile === '更新'"
                  v-model="formInline.policyAccountManager"
                />
              </el-form-item> 
            </div>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="titile !== '查看'"
            class="btn-mixins-clear-default"
            @click="close"
            >取消</el-button
          >
          <el-button
            v-if="titile !== '查看'"
            class="btn-mixins dia-suc"
            @click="success(addform)"
            >保存</el-button
          >
          <el-button
            v-if="titile === '查看'"
            class="btn-mixins dia-suc"
            @click="surelook"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script  setup>
import { defineProps, ref } from "vue";
import { reactive, watch, defineEmits } from "vue";
import { ElNotification  } from "element-plus";
import { operatePolicy as operatePolicy } from '@/api/index'
import store from '@/store'
const emits = defineEmits(["update:modelValue"]);
const addform = ref();
const formLabelWidth = "60%";
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

});
const checkIphonenum = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入电话号码"));
  } else if (!/^[0-9]*$/.test(value)) {
    callback(new Error("电话号码只能输入数字"));
  } else {
    callback();
  }
};
const rules = reactive({
  policyNo: [{ required: true, message: "请输入保单编号", trigger: "blur" }],
  powerStationName: [{ required: true, message: "请输入电站单元名称", trigger: "blur" }],
  userName: [{ required: true, message: "请输入电站业主名称", trigger: "blur" }],
  policyAmount: [{ required: true, message: "请输入保单金额", trigger: "blur" }],
  powerAddress: [{ required: true, message: "请输入电站地址", trigger: "blur" }],
  policyAccountManager: [{ required: true, message: "请输入保单客户经理", trigger: "blur" }],
  policyEffectiveDate : [{ required: true, message: "请选择保单生效日期", trigger: "Change" }],
  policyExpirationDate: [{ required: true, message: "请选择保单失效日期", trigger: "change" }],

});

let titile = ref("");
const imageUrl = ref("");
let formInline = reactive({
  policyNo:'',
  powerStationName:'',
  userName:'',
  policyAmount:'',
  powerAddress:'',
  policyAccountManager:'',
  policyEffectiveDate:'',
  policyExpirationDate:''
});
watch(
  () => props,
  () => {
    titile.value = props.dialogTitile;
    console.log(titile.value)
    if (titile.value === "编辑" || titile.value === "查看"||  titile.value === "更新"){
        formInline = props.dialogTableValue.value;
    }
      
  },
  { deep: true, immediate: true }
);
const close = () => {
  addform.value.resetFields();
  emits("update:modelValue", false);
};
const getymd = (dateStr) => {
    let d = new Date(dateStr),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
 
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
 
  return [year, month, day].join('-');
}
const success = (addform) => {
  console.log(getymd(formInline.policyExpirationDate))
  if (!addform) return;
  addform.validate(async (valid) => {
    if (valid) {
      let obj = JSON.parse(JSON.stringify(formInline));
      obj.policyEffectiveDate = obj.policyEffectiveDate? getymd(obj.policyEffectiveDate):'';
      obj.policyExpirationDate = obj.policyExpirationDate?getymd(obj.policyExpirationDate):'';
      console.log(obj)
      operatePolicy(obj).then((res)=>{
        if(res.code ===200){
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
      return false;
    }
  });
};

const surelook = () => {
  emits("update:modelValue", false);
};
</script>



<style lang = 'less' scoped>
.lz-dialog {
  .dia-suc {
    margin-left: 16px !important;
  }

  :deep(.el-input){
    width: 300px;
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
      border-bottom: 2px solid #409eff;
      display: block;
    }
  }
  /deep/ .el-dialog__footer {
    padding-top: 16px;
  }
  /deep/ .el-dialog__body {
    padding: 0;
    max-height: 550px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #cccccc;
    padding: 0;
    margin-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ .el-dialog__title {
    color: #409eff;
    font-size: 20px;
    height: 40px;
    width: 100px;
    border-bottom: 4px solid #409eff;
  }
  /deep/ .el-dialog {
    padding: 24px;
  }
  /deep/ .el-dialog__headerbtn {
    position: static;
    top: 0px;
    right: 0;
    padding: 0;
    width: auto;
    height: auto;
  }
}
/deep/ .el-form-item__label {
  font-size: 14px;
}
/deep/ .el-form {
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
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
/deep/ .el-form-item__content {
  width: 300px;
}
.address {
  /deep/ .el-form-item__content {
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
  /deep/ .el-form-item {
    margin: 0;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
  /deep/ .el-icon {
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
</style>
