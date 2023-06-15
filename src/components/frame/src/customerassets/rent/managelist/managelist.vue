<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="12" >
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.customerName"
          placeholder="请输入客户名称"
        />
        <el-select class="w-10 m-2" v-model="searchvalue.refundState" placeholder="请选择返还状态">
          <el-option
            v-for="item in returnStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        
      </el-col>
      <div class="searchButtonBox">
        <el-button  class="searchbutton" @click="queryTableData"
            >查询</el-button>
        <el-button  class="searchbutton" @click="sendAll"
            >一键外呼</el-button>
        <el-button  class="searchbutton" @click="sendAll"
            >一键发送短信</el-button>
            <!-- <el-button  class="searchbutton " @click="batchimport"
            >导入</el-button> -->
        <el-upload
            class="upload m-12"
            action="#"
            :show-file-list="false"
            :on-change="handleExcel"
            accept="'.xlsx','.xls'"
            :auto-upload="false">
                <el-button class="searchbutton" >导入</el-button>            
          </el-upload>

            <el-button  class="searchbutton" @click="exportXlsx"
            >导出</el-button>
            <el-button  class="searchbutton" @click="addButton"
            >新建</el-button>
      </div>

    </div>
    <div class="chartstyle">
      <el-table
        ref="multipleTableRef"
        :data="state.tableData1"
        :header-cell-style="{ background: '#d9ecff' }" 
        border
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="序号" min-width="7%">
          <template #default="requestscope">
                    <span >{{
                      requestscope.$index+1 + (state.PageSize*(state.CurrentPage-1))
                    }}</span>
              </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" min-width="10%" />
        <el-table-column prop="powerStationName" label="电站单元名称" min-width="10%" />
        <!-- <el-table-column prop="powerStationAddress" label="电站地址" min-width="10%" /> -->
        <el-table-column prop="refund" label="返还金额" min-width="18%" />
        <el-table-column prop="refundStateString" label="返还状态" min-width="15%" />
        <el-table-column prop="refundTime" label="返还日期" min-width="15%" />
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="deliteData(scope.row.id)"
              >删除</el-button>
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
import { markRaw, onBeforeMount ,watch} from "vue";
import { getEquityList as getEquityList,deleteEquity as deleteEquity, equityAllInto as equityAllInto, exportRefund as exportRefund } from '@/api/index'
import { ElNotification,ElMessageBox ,ElMessage} from "element-plus";
import { ElTable } from 'element-plus'
import { Delete } from "@element-plus/icons-vue";
import store from '@/store'
import DiaLog from './dialog.vue'
import * as XLSX from 'xlsx' 
import {readFile} from '@/utils/auth.js'
const uploadRef = ref()
const dialogUploadVisible = ref(false);
const dialogUploadWidth = "20%";
let fileList = reactive([]);
let files = reactive([]);
const headers = ''
const returnStatusOptions = reactive([
  {
    label: '未返还',
    value:'0'
  },
  {
    label: '结算中',
    value:'1'
  },
  {
    label: '已到账',
    value:'2'
  },
])
const searchvalue = reactive({
  "customerName": "",
  "pageindex": 1,
  "pagesize": 10,
  "refundState": ''
});
const multipleSelection=ref ([])
const multipleTableRef = ref();
const dialogTitile = ref('')
let tableData = [
  {
    id:'0',
    customerName: "张三",
    powerStationName: "电站",
    powerStationAddress:"三峡",
    refundAmount: "100",
    returnStatus:'已返还',
  },
  {
    id:'0',
    customerName: "李四",
    powerStationName: "一号电站",
    powerStationAddress:"三峡",
    refundAmount: "200",
    returnStatus:'未返还',
  },
];
let isQuery = ref(false);
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
    isQuery.value = true;
     isloading.value = true;
  let obj = JSON.parse(JSON.stringify(searchvalue));
  obj.customerName = obj.customerName.trim();
  obj.pageindex = state.CurrentPage;
  obj.pagesize = state.PageSize;
  getEquityList(obj).then((res)=>{
    isloading.value = false;
    if(res.code === 200){
        let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          state.Total = data&&data.total?data.total:0;
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
watch(
    () => dialogFormVisible.value,
    () => {
      if(!dialogFormVisible.value){
        queryTableData();
      }
    },
    { deep: true, immediate: true }
)
onBeforeMount(() => {
  getAllData();
});
//获取所有数据（导出）
//新建
let allData = []
const getAllData=()=>{
      let obj = {
        customerName:searchvalue.customerName,
        refundState:searchvalue.refundState
      }
      exportRefund(obj).then((res)=>{
        if(res.code === 200){
            allData = res.body;
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
const addButton=()=>{
  dialogTitile.value = '新建'
  dialogFormVisible.value = true;
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
// 删除
const deliteData=(id)=>{
    ElMessageBox.confirm("你确定删除此电站人员返还金信息吗?", "删除", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(() => {
      deleteEquity(id).then((res)=>{
        if(res.code === 200){
            if(state.tableData1.length === 0&& state.CurrentPage>1){
              state.CurrentPage = state.CurrentPage -1;
            }
            queryTableData();
            ElMessage({
              type: "success",
              message: "删除成功",
            });
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
    })
}

// 批量发送短信
const sendAll =()=>{
    console.log(multipleSelection._rawValue)  //当前所选中的用户id
}
//余额
const showRemainder=(index,row)=>{
  dialogTableValue.value = row.remainder
  dialogFormVisible.value = true
}
//导出
const exportXlsx = ()=>{
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
  let aoa=[]
  aoa.push(['电站单元名称','返还金额','返还状态','返还日期'])
  allData.forEach((item)=>{
    aoa.push([item.powerStationName,item.refund,item.refundStateString,item.refundTime])
  })
  const data = XLSX.utils.aoa_to_sheet(aoa)
  console.log(data)
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  // 将工作表放入工作簿中
  XLSX.utils.book_append_sheet(wb, data, '返还金管理列表')
  // 生成文件并下载
  XLSX.writeFile(wb, '返还金管理列表.xlsx')
}
//上传

const  handleExcel = (file)=>{
      //调用后台导入的接口
      let obj={
        file:file.raw
      }
      equityAllInto(obj).then(res => {
        if (res.code === 200) {
            queryTableData();
            ElMessage({
              type: "success",
              message: "导入成功",
            });
        } else {
          ElMessage({
              type: "error",
              message: "导入失败",
            });
        }
      }).catch(err => {
          ElMessage({
              type: "error",
              message: "导入失败",
            });
      })
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
.underline{
  text-decoration: underline;
    cursor: pointer;
}
.searchButtonBox{
  display: flex;
}
.m-12{
  margin: 0 12px;
}

</style>