<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20" >
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.customerName"
          placeholder="请输入客户名称"
        />
        <el-select class="w-10 m-2" v-model="searchvalue.year" placeholder="请选择年度">
          <el-option
            v-for="item in yearList.value"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button  class="searchbutton " @click="queryTableData"
        >查询</el-button>
        <el-button  class="searchbutton mr-16"  @click="exportXlsx">导出</el-button>
        </el-col>
      
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
        <el-table-column prop="userName" label="客户名称" min-width="10%" />
        <el-table-column prop="powerStationName" label="电站单元名称" min-width="18%" />
        <el-table-column prop="powerStationTitle" label="电站名称" min-width="15%" />
        <el-table-column prop="year" label="年度" min-width="15%" />
        <el-table-column prop="distributionAmount" label="发放金额" min-width="15%" />
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="detail(scope.$index, scope.row)"
              >明细</el-button>
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
import { refundStatistics as refundStatistics, exportStatistics as exportStatistics } from '@/api/index'
import {getYearList as getYearList} from '@/api/common'
import { ElNotification } from "element-plus";
import store from '@/store'
import DiaLog from './dialog.vue'
import * as XLSX from 'xlsx' 
const searchvalue = reactive({
  customerName:'',
  year:'2023',
  "pageindex": 1,
  "pagesize": 10,
});
let dialogTableValue = reactive({});
let tableData = [
  {
    id:'1212',
    userName: "客户名称",
    powerStationTitle:'电站名称',
    powerStationName: "电站单元名称",
    policyAddress:"电站地址",
    year:'年度',
    distributionAmount:'发放金额',
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
let isQuery = ref(false);
// 分页
const dialogFormVisible = ref(false)
let dialogExitVisible = ref(false);
const yearList = reactive([])
const state = reactive({
  tableLoading: false,
  CurrentPage: 1,
  PageSize: 10,
  Total: 0,
  TotalList: [],
  tableData1: [],
});
let dialogTitile = ref("编辑");
const isloading = ref('false')
const queryTableData = () => {
    isQuery.value = true;
     isloading.value = true;
  let obj = JSON.parse(JSON.stringify(searchvalue));
  obj.customerName = obj.customerName.trim();
  obj.pageindex = state.CurrentPage;
  obj.pagesize = state.PageSize;
  refundStatistics(obj).then((res)=>{
    isloading.value = false;
      if(res.code === 200){
        let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          state.Total = data&&data.total?data.total:0;
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
};
const getYearListOptions = ()=>{
  getYearList().then((res)=>{
      if(res.code === 200){
           yearList.value = res.body;
           searchvalue.year = res.body[0].value
        }
  })
}
onBeforeMount(() => {
  queryTableData();
  getYearListOptions()
});
let allData = [];
const exportStatisticsData = () => {
  return new Promise((resolve, reject) => {
       let obj={
          customerName:searchvalue.customerName,
          year:searchvalue.year
        }
        exportStatistics(obj).then((res)=>{
              if(res.code === 200){
                  // allData = res.body;
                  // console.log(allData)
                  resolve(res.body)
              }else {
                      ElNotification({
                        title: 'Warning',
                        message: res.message?res.message:'服务器异常',
                        type: 'warning',
                      })
                      if(res.code === 100007 ||  res.code === 100008){
                              store.dispatch('app/logout')
                          }
                          reject('err')
              }
        })
  })
 
}
//导出
const exportXlsx = async()=>{
  let allData = await exportStatisticsData()
  console.log(allData)
  if(allData !='err'){
      let aoa=[]
      aoa.push(['客户名称','电站单元名称','电站名称','年度','发放金额'])
      allData.forEach((item)=>{
        aoa.push([item.userName,item.powerStationName,item.powerStationTitle,item.year,item.distributionAmount])
      })
      const data = XLSX.utils.aoa_to_sheet(aoa)
      console.log(data)
      // 创建工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表放入工作簿中
      XLSX.utils.book_append_sheet(wb, data, '返还金发放统计')
      // 生成文件并下载
      XLSX.writeFile(wb, '返还金发放统计.xlsx')
  }
   // 创建工作表
  //  let head = {
  //     powerStationName: "电站单元名称",
  //     refund: "返还金额",
  //     refundStateString:'返还状态',
  //     refundTime:'返还日期',
  //   }
  //   const list = allData.map(item => {
  //     const obj = {}
  //     for (const k in item) {
  //       if (head[k]) {
  //         obj[head[k]] = item[k]
  //       } 
  //     }
  //     return obj
  //   })

}
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

//详情
const detail = (index, row)=>{
    dialogTitile.value = "查看";
    dialogFormVisible.value = true;
    dialogTableValue.value = row
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