<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col class="searchBox">
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.userName"
          placeholder="请输入姓名"
        />
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.phoneNumber"
          placeholder="请输入手机号"
        />
        <el-select class="w-10 m-2 mr-16" v-model="searchvalue.customerLevel" clearable placeholder="请输入客户等级">
          <el-option
            v-for="item in customerDropdown.value"
            :key="item.numb"
            :label="item.dataName"
            :value="item.numb"
          />
        </el-select>
        
        <el-select class="w-10 m-2 mr-16"  v-model="searchvalue.city" clearable placeholder="请输入住址（市）">
          <el-option
            v-for="item in cityDropdown.value"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
         <el-select class="w-10 m-2 mr-16" @visible-change ='showCounty' clearable v-model="searchvalue.county" placeholder="请输入住址（县）">
          <el-option
            v-for="item in countyDropdown.value"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-select class="w-10 m-2" @visible-change ='showTown' clearable v-model="searchvalue.town" placeholder="请输入住址（镇）">
          <el-option
            v-for="item in townDropdown.value"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-col>
      <el-button  class="searchbutton mt-16 " @click="queryTableData"
        >查询</el-button
      >
    </div>
    <div class="chartstyle">
      <el-table
        :data="state.tableData1"
        :header-cell-style="{ background: '#d9ecff' }" 
        border
        style="width: 100%"
      >
        <el-table-column label="序号" min-width="7%">
          <template #default="requestscope">
                    <span >{{
                      requestscope.$index+1 + (state.PageSize*(state.CurrentPage-1))
                    }}</span>
              </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="10%" />
        <el-table-column prop="IDNumber" label="证件号" min-width="20%">
          <template #default="idscope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="idscope.row.IDNumber"
            >
              <template #reference>
                <span class="elispice">{{
                  idscope.row.IDNumber
                }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="customerLevel" label="客户等级" min-width="10%"/>
        <el-table-column prop="city" label="市" min-width="10%"/>
        <el-table-column prop="county" label="县" min-width="10%" />
        <el-table-column prop="town" label="镇" min-width="12%" />
        <el-table-column prop="detailAddress" label="详细地址" min-width="20%" >
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.detailAddress"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.detailAddress }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="investmentMethod" label="投资方式" min-width="10%" />
        <el-table-column prop="customerType" label="新/老客户" min-width="10%" />
        <el-table-column prop="installationCapacity" label="安装容量" min-width="10%" />
        <el-table-column label="操作列" width="100" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="detail(scope.row.userId)"
              >详情</el-button
            >
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
    <DiaLog
        v-model="dialogFormVisible"
        v-if="dialogFormVisible"
        :dialogFormVisible="dialogFormVisible"
        :dataId = 'dataId'
    ></DiaLog>
</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
import { getAllUserList as getAllUserList, getAllUserInfo as getAllUserInfo } from '@/api/index'
import { getCitys as getCitys,getCountys as getCountys,getTowns as getTowns,getCustomerLevel as getCustomerLevel} from '@/api/common'
import { ElNotification } from "element-plus";
import store from '@/store'
import DiaLog from './dialog.vue'
import axios from "axios"
let searchvalue = reactive({
  userName:'',
  phoneNumber:'',
  customerLevel:'',
  city:'',
  county:'',
  town:'',
  pageindex:'',
  pagesize:''
});
let customerDropdown=reactive([])
let cityDropdown = reactive([])
let countyDropdown = reactive([])
let townDropdown = reactive([])
let tableData = [
  {
    id:'1212',
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber:"13456456",
    customerLevel: "一级",
    city: '西安',
    county: "22",
    town:'11',
    detailAddress:'45451215',
    investmentMethod:'5454',
    customerType: "new",
    installationCapacity:'545L'
  },
  {
    userId: 1235665656,
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber:"13456456",
    customerLevel: "一级",
    city: '西安',
    county: "22",
    town:'11',
    detailAddress:'45451215',
    investmentMethod:'5454',
    customerType: "new",
    installationCapacity:'545L'
  },
];
let dataId = ref()
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
const showCity = ()=>{
  let obj={
    code:'370'
    }
  getCitys(obj).then((res)=>{
    if(res.code === 200){
      cityDropdown.value = res.body;
      console.log(cityDropdown.value)
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
const showCounty=(val)=>{
  console.log(val)
  if(searchvalue.city!=''&&val){
        getCountys(searchvalue.city).then((res)=>{
          if (res.code === 200) {
            countyDropdown.value = res.body;
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
}
const showTown =(val)=>{
    if(searchvalue.county!=''&&val){
        getTowns(searchvalue.county).then((res)=>{
          if (res.code === 200) {
            townDropdown.value = res.body;
          }else{
            ElNotification({
                title: 'Warning',
                message:res.message?res.message:'服务器异常',
                type: 'warning',
              })
            if(res.code === 100007 ||  res.code === 100008){
                    store.dispatch('app/logout')
                }
          }
        })
  }
}
const queryTableData = () => {
     isloading.value = true;
     let obj = JSON.parse(JSON.stringify(searchvalue));
     obj.pageindex = state.CurrentPage;
     obj.pagesize = state.PageSize;
    getAllUserList(obj).then((res)=>{
      console.log('11111',res)
      isloading.value = false;
      if(res.code === 200){
        let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          state.Total = data&&data.total?data.total:0;
      }else {
               ElNotification({
                title: 'Warning',
                message:res.message?res.message:'服务器异常',
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
  showCity();
  getCustomerLevelFun()
});
const getCustomerLevelFun = () => {
  getCustomerLevel().then((res)=>{
    if (res.code === 200) {
      customerDropdown.value = res.body;
    }else {
      ElNotification({
        title: 'Warning',
        message:res.message?res.message:'服务器异常',
        type: 'warning',
      })
      if(res.code === 100007 ||  res.code === 100008){
              store.dispatch('app/logout')
          }
    }
  })
}
//切换一页显示多少条数据
const handleSizeChange = (val) => {
  state.PageSize = val;
  queryTableData()
};
// 点击跳转到第几页
const handleCurrentChange = (val) => {
  state.CurrentPage = val;
  queryTableData()
};
//详情
const detail = (id)=>{
  console.log(id)
    dialogFormVisible.value = true;
    dataId.value = id;
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
.searchbutton{
  float: right;
}
.chartstyle{
  height: calc(100% - 124px);
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
    height: 114px;
    border: 1px solid #ecf5ff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0px 0px 6px #d9ecff;
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