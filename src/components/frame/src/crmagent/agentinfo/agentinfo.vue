<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20">
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.name"
          placeholder="请输入姓名"
        />
        <el-input
          class="w-10 m-2  mr-16"
          v-model="searchvalue.phoneNumber"
          placeholder="请输入区域"
        />
        <el-select class="w-10 m-2" v-model="searchvalue.customerLevel" placeholder="请选择代理商级别">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
            <el-button  class="searchbutton " @click="searchbutton"
             >查询</el-button>
      </el-col>

    </div>
    <div class="chartstyle">
      <el-table
        :data="tableData"
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
        <el-table-column prop="agentName" label="代理商名称" min-width="10%" />
        <el-table-column prop="phoneNumber" label="联系方式" min-width="18%" />
        <el-table-column prop="responsibleArea" label="负责区域" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="agentLevel" label="代理商级别" min-width="15%">
          <template #default="requestscope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="requestscope.row.agentLevel"
            >
              <template #reference>
                <span class="elispice">{{
                  requestscope.row.agentLevel
                }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="creditLevel" label="信用级别" min-width="15%">
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.creditLevel"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.creditLevel }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="detail(scope.$index, scope.row)"
              >详情</el-button
            >
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
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
        :dialogTitile="dialogTitile"
        :dialogTableValue="dialogTableValue"
    ></DiaLog>
    </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
import { getAllUserList as getAllUserList } from '@/api/index'
import { ElNotification } from "element-plus";
import store from '@/store'
import DiaLog from './dialog.vue'
import axios from "axios"
const searchvalue = reactive({
  name:'',
  phoneNumber:'',
  customerLevel:'',
  city:'',
  county:'',
  town:''
});

let tableData = [
  {
    id:'1212',
    agentName: "代理商名称",
    phoneNumber: "联系方式",
    agentLevel:"代理商级别",
    responsibleArea: "负责区域",
    creditLevel:'信用级别'
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
let dialogTitile = ref("编辑");
let isQuery = ref(false);
// 分页
const dialogFormVisible = ref(false)
let dialogTableValue = reactive({});
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
  console.log('11111')
    isQuery.value = true;
     isloading.value = true;
    let obj = {
        "pageindex":1,
        "pagesize":10
    }
    getAllUserList(obj).then((res)=>{
      console.log('11111',res)
      isloading.value = false;
      if(res.code === 200){
        let data = res.data;
          // state.tableData1=data&&data.records?data.records:[];
          // state.Total = data&&data.total?data.total:0;
      }else {
              //  ElNotification({
              //   title: 'Warning',
              //   message: res.message,
              //   type: 'warning',
              // })
              // if(res.message.indexOf('token已过期')>-1  ){
              //         store.dispatch('app/logout')
              //     }
      }
    })
};

onBeforeMount(() => {
  queryTableData();
});
//查询
const searchbutton = () => {
  isloading.value = true;
  let parmes = {
    condition: searchvalue.value,
    limit:state.PageSize,
    pageNum:state.CurrentPage,
  }
  queryLog(parmes).then((res)=>{
    isloading.value = false;
    if(res.code === 200){
          let data = res.data;
          state.tableData1=data&&data.records?data.records:[];
          state.Total = data&&data.total?data.total:0;
      } else{
        ElNotification({
                title: 'Warning',
                message: res.message?res.message:'服务器异常',
                type: 'warning',
              })
              if(res.message.indexOf('token已过期')>-1  ){
                    store.dispatch('app/logout')
                }
      }
  })
};

//切换一页显示多少条数据
const handleSizeChange = (val) => {
  state.PageSize = val;
  searchvalue.value&&isQuery.value?searchbutton():queryTableData();
};
// 点击跳转到第几页
const handleCurrentChange = (val) => {
  state.CurrentPage = val;
  searchvalue.value&&isQuery.value?searchbutton():queryTableData();
};
//详情
const detail = (index,row)=>{
  dialogTitile.value = "查看";
  dialogTableValue.value = JSON.parse(JSON.stringify(row));
    dialogFormVisible.value = true;
}
//编辑
const handleEdit = (index,row)=>{
    dialogTitile.value = "编辑";
    dialogTableValue.value = JSON.parse(JSON.stringify(row));
    dialogFormVisible.value = true;
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