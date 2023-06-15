<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20" >
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.name"
          placeholder="请输入姓名"
        />
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.phoneNumber"
          placeholder="请输入手机号"
        />
         <el-select class="w-10 m-2 mr-16" v-model="searchvalue.customerLevel" clearable placeholder="请选择关怀类型">
          <el-option
            v-for="item in customerLevelDropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button  class="searchButtonBox  " @click="sendAll"
            >一键发送短信</el-button>
        <el-button  class="searchButtonBox mr-16" @click="queryTableData"
            >查询</el-button>
      </el-col>

    </div>
    <div class="chartstyle">
      <el-table
        ref="multipleTableRef"
        :data="state.tableData1"
        :header-cell-style="{ background: '#d9ecff' }" 
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        :row-key="getRowKeys"
      >
      <!-- <el-table-column type="selection" width="55" :reserve-selection="true"/> -->
      <el-table-column label="序号" min-width="7%">
          <template #default="requestscope">
                    <span >{{
                      requestscope.$index+1 + (state.PageSize*(state.CurrentPage-1))
                    }}</span>
              </template>
        </el-table-column>
        <el-table-column prop="customerCode" label="客户编码" min-width="10%" />
        <el-table-column prop="userName" label="姓名" min-width="10%" />
        <el-table-column prop="IDNumber" label="证件号" min-width="18%" />
        <el-table-column prop="phoneNumber" label="手机号" min-width="15%" />
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="sendMsg(scope.row)"
              >发送短信</el-button>
              <el-button size="small" @click="callPhone(scope.row)"
              >呼叫</el-button>
          </template>
        </el-table-column>
        <template #empty>
            <el-empty v-loading="isloading"></el-empty>
        </template>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          :currentPage="state.currentPage"
          :page-size="state.pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.Total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

  </div>
  </div>
</template>
<script setup>
import { reactive, ref,nextTick} from "vue";
import { markRaw, onBeforeMount } from "vue";
import { userCare as userCare } from '@/api/index'
import { ElNotification } from "element-plus";
import { ElTable } from 'element-plus'
import {smsGetTowns as smsGetTowns, sendSmsList as sendSmsList} from '@/api/common'
import store from '@/store'
import YSF from '@neysf/qiyu-web-sdk';
// const { APIs } = window.SoftPhoneSDK;
// const { SoftPhone } = window.SoftPhoneSDK;
// const softPhone = SoftPhone.getInstance();
const customerLevelDropdown = [
  {
    label: '节假日',
    value:'0'
  },
  {
    label: '生日',
    value:'1'
  },
]
const searchvalue = reactive({
  userName:'',
  phoneNumber:'',
  customerLevel:'0',
  // customerCode:'',
  // IDNumber:'',
  "pageindex": 0,
  "pagesize": 0,
  //   "birthday": "string",
  // "careType": 0,
  // "county": "string",
  // "idCardNumber": "string",

  // "phoneNumber": "string",
  // "userName": "string"
});
const multipleSelection=ref ([])
const multipleTableRef = ref();
let tableData = [
  {
    id:'0',
    customerCode:'11',
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber:"18729538420",
    maintainType: "vip",
    detailAddress:'45451215',
  },
  {
    id:'1',
    userId: 1235665656,
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber:"18729538420",
    maintainType: "一级",
    city: '西安',
    county: "22",
    town:'11',
    detailAddress:'45451215',
    investmentMethod:'5454',
    customerType: "new",
    installationCapacity:'545L'
  },
];
// 分页
const dialogFormVisible = ref(false)
const state = reactive({
  tableLoading: false,
  CurrentPage: 1,
  PageSize: 10,
  Total: 0,
  TotalList: [],
  tableData1: [],
});
const isloading = ref('false')
const queryTableData = () => {
     isloading.value = true;
     let obj = JSON.parse(JSON.stringify(searchvalue));
     obj.pageindex = state.CurrentPage;
     obj.pagesize = state.PageSize;
     obj.blacklist = 1;
  userCare(obj).then((res)=>{
    isloading.value = false;
    if(res.code === 200){
          let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          console.log(state.tableData1)
          state.Total = data&&data.total?data.total:0;
          handleRowSelection(state.tableData1)
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
};

onBeforeMount(() => {
  queryTableData();
  // YSF.init('6e03e391cbb9e26e1cdb868f15de52e9');
  // YSF.init('6c5351b62b27bf83cd30a533652d315f', {
  //       templateId: 123, // templateId表示自定义会话邀请的模板标识
  //       shuntId: 123, // shuntId表示访客选择多入口分流模版id
  //       sessionInvite: false, // sessionInvite表示是否开启会话邀请设置
  //       hidden: 1 // hidden表示是否隐藏访客端默认入口
  //   }).then(ysf => {
  //       ysf('open');
  //   }).catch(error => {
  //       console.log('sdk加载失败---', error);
  //   });
});


//切换一页显示多少条数据
const handleSizeChange = (val) => {
  state.PageSize = val;
  queryTableData();
};
// 点击跳转到第几页
const handleCurrentChange = (val) => {
  state.CurrentPage = val;
  queryTableData();
};
const getRowKeys=(row)=> {
    return row.id;
}
let selectedObj = {}
const handleSelect = (selection,row)=>{
  if(!selection.some((item)=>{ item.id === row.id})){
    delete selectedObj[row.id]
  }
}
const handleRowSelection=(data)=>{
  if(data){
      data.forEach((item)=>{
        if(selectedObj[item.id]){
          nextTick(()=>{
            multipleTableRef.value.toggleRowSelection(item,true)
          })
        }
      })
  }else{
    multipleTableRef.value.clearSelection()
  }

}
const  handleSelectionChange=(val)=> {
      //全选取消
      if(val.length === 0){
        state.tableData1.forEach((item)=>{
          delete selectedObj[item.id]
        })
      }
      //勾选数据
      selectedObj={}
      val.forEach((item) => {
        selectedObj[item.id] = item
      })
      //获取所有分页勾选的数据
      multipleSelection.value = [];
        for(const key in selectedObj){
          multipleSelection.value.push(selectedObj[key])
        }
      }
// 批量发送短信
const sendAll =()=>{
    
    console.log(multipleSelection._rawValue)  //当前所选中的用户id
    console.log(multipleSelection)

    sendSmsList()
}
//发送短信
const sendMsg = (item)=>{
  // let obj={
  //   phone:item.phoneNumber
  // }
  smsGetTowns(item.phoneNumber).then((res)=>{
    console.log(res)
  })
}
const callPhone = (item)=>{
  
}

</script>
<style lang = 'less' scoped>
.tablestyle {
  position: relative;
  ::v-deep .el-table__header thead tr {
    background-color: rgba(64, 158, 255, 0.1);
  }
  ::v-deep .el-col-3 {
    max-width: none;
  }
}
.searchButtonBox{
  float: right;
}
.chartstyle{
  height: calc(100% - 76px);
}
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .showmodal {
    width: 400px;
    height: 200px;
    background-color: aqua;
    z-index: 200;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
.searchBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.editinfo {
  width: 30%;
  background-color: orange;
  height: 500px;
}
.lz-dialog {
  .dia-suc {
    margin-left: 16px !important;
  }
}
.searchsize {
    position: relative;
    width: 100%;
    // height: 114px;
    border: 1px solid #ecf5ff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0px 0px 6px #d9ecff;
    display: flex;
    justify-content: space-between;
  .batchimport {
    position: absolute;
    right: 24px;
  }
}
.demo-pagination-block {
  margin-top: 16px;
  position: absolute;
  bottom: 32px;
  right: 32px;
}
.elispice {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 100%;
}
::v-deep .el-table--fit{
  height:100%;
}
::v-deep .el-table__body-wrapper{
  overflow-y: auto;
}
</style>