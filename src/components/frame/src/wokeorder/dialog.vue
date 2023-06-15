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
              <!-- <el-form-item v-if="titile === '查看'||titile === '更新' " label="工单编号" prop="wokeOrderCode" required>
                <el-input
                  placeholder="请输入工单编号"
                  :disabled="titile === '查看'"
                  v-model="formInline.wokeOrderCode"
                />
              </el-form-item> -->

              <el-form-item label="客户名称" prop="userName">
                <el-input
                  placeholder="请输入客户名称"
                  :disabled="titile === '查看'"
                  v-model="formInline.userName"
                />
              </el-form-item>
              <el-form-item label="联系电话" prop="phoneNumber" required>
                      <el-input
                      placeholder="请输入联系电话"
                      :disabled="titile === '查看'"
                      v-model="formInline.phoneNumber"
                    />
              </el-form-item>
              <el-form-item label="来源" prop="source">
                 <el-select
                  :disabled="titile === '查看'"
                  v-model="formInline.source"
                  placeholder="请选择来源"
                >
                  <el-option v-for="item in dowpdown" :key="item.label" :label="item.label" :value="item.value" >
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预约时间" prop="appointmentTime" >
                <el-date-picker
                        :disabled="titile === '查看'"
                        v-model="formInline.appointmentTime"
                        type="datetime"
                        placeholder="请选择预约时间"
                    />
              </el-form-item> 
              <el-form-item label="服务" prop="service" >
                <el-select
                  :disabled="titile === '查看'"
                  v-model="formInline.service"
                  placeholder="请选择服务"
                >
                  <el-option v-for="item in dowpdown" :key="item.label" :label="item.label" :value="item.value" >
                    </el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="问题描述" prop="problem" >
                <el-input
                    type='textarea'
                  placeholder="请输入问题描述"
                  :disabled="titile === '查看'"
                  v-model="formInline.problem"
                />
              </el-form-item> 
              
              <el-form-item label="是否人为破坏" prop="isCharge" >
                <el-select
                  v-model="formInline.isMaliciousDamage"
                  placeholder="是否人为破坏"
                  :disabled="titile === '查看'"
                >
                  <el-option v-for="item in isYes" :key="item.label" :label="item.label" :value="item.value" required>
                    </el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="是否收费" prop="isCharge" >
                <el-select
                  :disabled="titile === '查看'||titile === '编辑'"
                  v-model="formInline.isCharge"
                  placeholder="是否收费"
                >
                  <el-option v-for="item in isYes" :key="item.label" :label="item.label" :value="item.value" required>
                    </el-option>
                </el-select>
              </el-form-item> 
              <div>
                <p class="basictitle">电站信息</p>
                <div>
                <el-form-item label="电站名称" prop="powerStationTitle" >
                      <el-input
                        placeholder="请输入电站名称"
                        disabled
                        v-model="formInline.powerStationTitle"
                      />
              </el-form-item>
               <el-form-item label="电站单元名称" prop="powerStationName" >
                <el-input
                  placeholder="请输入电站单元名称"
                  disabled
                  v-model="formInline.powerStationName"
                />
              </el-form-item> 
              <el-form-item label="电站地址" prop="policyAddress" >
                <el-input
                  placeholder="请输入电站地址"
                  disabled
                  v-model="formInline.policyAddress"
                />
              </el-form-item> 
              <el-form-item label="电站类型" prop="powerStationType" >
                <el-input
                  placeholder="请输入电站类型"
                  disabled
                  v-model="formInline.powerStationType"
                />
              </el-form-item> 
              <!-- <el-form-item label="并网类型" prop="gridConnectionType" >
                <el-select
                  disabled
                  v-model="formInline.gridConnectionType"
                  placeholder="请选择并网类型"
                >
                  <el-option v-for="item in dowpdown" :key="item.label" :label="item.label" :value="item.value" required>
                    </el-option>
                </el-select>
              </el-form-item> 
              <el-form-item label="投资类型" prop="investmentType" >
                <el-select
                  disabled
                  v-model="formInline.investmentType"
                  placeholder="请选择投资类型"
                >
                  <el-option v-for="item in dowpdown" :key="item.label" :label="item.label" :value="item.value" required>
                    </el-option>
                </el-select>
              </el-form-item>  -->
              <el-form-item label="试运行日期" prop="testRunDate" >
                <el-date-picker
                        disabled
                        v-model="formInline.testRunDate"
                        type="date"
                        placeholder="请选择试运行日期"
                    />
              </el-form-item> 
              <el-form-item label="逆变器功率" prop="inverterPower" >
                <el-input
                  placeholder="请输入逆变器功率"
                  disabled
                  v-model="formInline.inverterPower"
                />
              </el-form-item> 
              <el-form-item label="逆变器型号" prop="inverterModel" >
                <el-input
                  placeholder="请输入逆变器型号"
                  disabled
                  v-model="formInline.inverterModel"
                />
              </el-form-item> 
              <el-form-item label="逆变器序列号" prop="inverterSerialNumber" >
                <el-input
                  placeholder="请输入逆变器序列号"
                  disabled
                  v-model="formInline.inverterSerialNumber"
                />
              </el-form-item> 
              <el-form-item label="电站保质期" prop="powerStationWarranty" >
                <el-input
                  placeholder="请输入电站保质期"
                  disabled
                  v-model="formInline.powerStationWarranty"
                />
              </el-form-item> 
              <el-form-item label="质保期到期时间" prop="expirationDate" >
                <el-date-picker
                        disabled
                        v-model="formInline.expirationDate"
                        type="date"
                        placeholder="请选择质保期到期时间"
                    />
              </el-form-item> 
                </div>
              </div>

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
            >取消</el-button>
          <el-button v-if="titile !== '查看'"
            class="btn-mixins dia-suc"
            @click="success(addform)"
            >保存</el-button>
          <el-button
            v-if="titile === '查看'"
            class="btn-mixins dia-suc"
            @click="surelook"
            >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script  setup>
import { defineProps, ref } from "vue";
import { reactive, watch, defineEmits } from "vue";
import { ElNotification  } from "element-plus";
import { getOrderInfo as getOrderInfo } from '@/api/index'
import { getymdhms } from '@/utils/auth'
import store from '@/store'
const emits = defineEmits(["update:modelValue"]);
const addform = ref();
const formLabelWidth = "60%";
const isYes=[
  {
    label: "是",
    value:'1'
  },{
    label: "否",
    value:'0'
  }
]
let props = defineProps({
  dialogFormVisible: {
    type: Boolean,
  },
  dialogTitile: {
    type: String,
  },
  orderId: {
    type: String,
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
  // wokeOrderCode: [{ required: true, message: "请输入工单编号", trigger: "blur" }],
  // source: [{ required: true, message: "请选择来源", trigger: "Change" }],
  // userName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  phoneNumber: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  // powerStationTitle: [{ required: true, message: "请输入电站名称", trigger: "blur" }],
  // powerStationName: [{ required: true, message: "请输入电站单元名称", trigger: "blur" }],
    // policyAddress: [{ required: true, message: "请输入电站地址", trigger: "blur" }],
  // powerStationType: [{ required: true, message: "请输入电站类型", trigger: "blur" }],
  // gridConnectionType: [{ required: true, message: "请选择并网类型", trigger: "Change" }],
  // investmentType: [{ required: true, message: "请选择投资类型", trigger: "Change" }],
  // testRunDate: [{ required: true, message: "请选择试运行日期", trigger: "Change" }],
      // inverterPower: [{ required: true, message: "请输入逆变器功率", trigger: "blur" }],
  // inverterModel: [{ required: true, message: "请输入逆变器型号", trigger: "blur" }],
  // inverterSerialNumber: [{ required: true, message: "请输入逆变器序列号", trigger: "blur" }],

  // service: [{ required: true, message: "请选择服务", trigger: "Change" }],
  // appointmentTime: [{ required: true, message: "请选择预约时间", trigger: "change" }],
    // powerStationWarranty: [{ required: true, message: "请选择电站质保期", trigger: "Change" }],
  // expirationDate: [{ required: true, message: "请选择质保期到期时间", trigger: "change" }],
    // isCharge: [{ required: true, message: "请选择是否收费", trigger: "Change" }],
  // problem: [{ required: true, message: "请输入问题描述", trigger: "blur" }],
});

let titile = ref("");
const imageUrl = ref("");
let formInline = reactive({
  id: '',
  wokeOrderCode: "工单编号",
  source: "来源",
  userName: "客户名称",
  phoneNumber: "联系电话",
  powerStationTitle: "电站名称",
  powerStationName: "电站单元名称",
  policyAddress: "电站地址",
  testRunDate: "试运行日期",//2022-4-7
  inverterPower: '逆变器功率',
  inverterModel: "逆变器型号",
  inverterSerialNumber: '逆变器序列号',
  service: '服务',
  appointmentTime: '预约时间',
  powerStationWarranty: '电站质保期',
  expirationDate: '质保期到期时间',
  isCharge: '',
  isMaliciousDamage:'',
  problem: '问题描述',
});
watch(
  () => props,
  () => {
    titile.value = props.dialogTitile;
    if (titile.value === "编辑" || titile.value === "查看"){
        // formInline = props.dialogTableValue.value;
        getOrderInfo(props.orderId).then((res)=>{
          if(res.code === 200){
            console.log(res)
          }
        })
    }
      
  },
  { deep: true, immediate: true }
);
const close = () => {
  addform.value.resetFields();
  emits("update:modelValue", false);
};
// const getymd = (dateStr) => {
//   let d = new Date(dateStr),
//   month = '' + (d.getMonth() + 1),
//   day = '' + d.getDate(),
//   year = d.getFullYear(),
//   hour = ''+d.getHours(),
//   minute = '' + d.getMinutes(),
//   second = ''+d.getSeconds()
//   if (month.length < 2) month = '0' + month;
//   if (day.length < 2) day = '0' + day;
//   if (hour.length < 2) hour = '0' + hour;
//   if (minute.length < 2) minute = '0' + minute;
//   if (second.length < 2) second = '0' + second;
//   return [year, month, day].join('-') + ' '+[hour,minute,second].join(':');
// }
const success = (addform) => {
  if (!addform) return;
  addform.validate(async (valid) => {
    if (valid) {
      let obj = JSON.parse(JSON.stringify(formInline));
      obj.appointmentTime = obj.appointmentTime? getymdhms(obj.appointmentTime):'';
      console.log(obj)
      saveCar(obj).then((res)=>{
        if(res.code ===200){
            close()
          }else{
              ElNotification({
                title: 'Warning',
                message: res.msg,
                type: 'warning',
              })
               if(res.msg.indexOf('token已过期')>-1  ){
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
.basictitle{
      font-size: 18px;
    margin: 16px 0 24px;
    color: #333333;
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
