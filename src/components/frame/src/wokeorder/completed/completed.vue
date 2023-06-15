<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20" >
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.name"
          placeholder="请输入工单编号"
        />
        <el-input
          class="w-10 m-2"
          v-model="searchvalue.phoneNumber"
          placeholder="请输入工单名称"
        />
      </el-col>
      <el-col :span="4">
        <el-button  class="searchbutton " @click="searchbutton"
        >查询</el-button>
        <el-button  class="searchbutton mr-16"  @click="handleBuild">新建</el-button>
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
        <el-table-column prop="wokeOrderCode" label="工单编号" min-width="10%" />
        <el-table-column prop="userName" label="客户名称" min-width="18%" />
        <el-table-column prop="phoneNumber" label="客户电话" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="powerStationTitle" label="电站名称" min-width="15%">
          <template #default="requestscope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="requestscope.row.powerStationTitle"
            >
              <template #reference>
                <span class="elispice">{{
                  requestscope.row.powerStationTitle
                }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="powerStationName" label="电站单元名称" min-width="15%">
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.powerStationName"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.powerStationName }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="policyAddress" label="电站地址" min-width="15%">
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.policyAddress"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.policyAddress }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="problem" label="问题描述" min-width="15%">
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.problem"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.problem }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="wokeOrderStatus" label="工单状态" min-width="15%" />
        <el-table-column prop="handlePerson" label="处理人" min-width="15%" />
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >回访</el-button>
            <el-button
              size="small"
              @click="appraise(scope.$index, scope.row)"
              >评价</el-button>
            <el-button size="small" @click="detail(scope.$index, scope.row)"
              >查看</el-button>
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
            :dialogTableValue="dialogTableValue"
        :dialogTitile="dialogTitile"
    ></DiaLog>
    <!-- 评价 -->
    <div>
    <el-dialog
      ref="exitRef"
      :model-value="dialogExitVisible"
      title="用户评价"
      :before-close="closeExit"
      width="40%"
      :close-on-click-modal="false"
      draggable
    >
      <div class="mlr-24">
        用户评价：
        <el-input
          style="width:80%"
          class="w-10 m-2"
          v-model="exitvalue"
          placeholder="请选择评价"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="btn-mixins-clear-default" @click="saveExit"
            >确定</el-button
          >
          <el-button class="btn-mixins-clear-default" @click="closeExit"
            >返回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
// import { getLog as getLog,queryLog as queryLog } from '@/api/index'
import { ElNotification } from "element-plus";
import store from '@/store'
import DiaLog from '../dialog.vue'
const searchvalue = reactive({
  name:'',
  phoneNumber:'',
  customerLevel:'',
  city:'',
  county:'',
  town:''
});
let dialogTableValue = reactive({});
let tableData = [
  {
    id:'1212',
    wokeOrderCode:'工单编号',
    userName: "客户名称",
    phoneNumber:'客户电话',
    powerStationTitle:'电站名称',
    powerStationName: "电站单元名称",
    policyAddress:"电站地址",
    problem:'问题描述',
    wokeOrderStatus:'工单状态',
    handlePerson:'处理人'
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
    let obj = {
        limit:state.PageSize,
        pageNum: state.CurrentPage 
    }
  getLog(obj).then((res)=>{
    isloading.value = false;
    if(res.code === 200){
      let data = res.data;
        // state.tableData1=data&&data.records?data.records:[];
        // state.Total = data&&data.total?data.total:0;
    }else {
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
};

onBeforeMount(() => {
//   queryTableData();
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
                message: res.msg,
                type: 'warning',
              })
              if(res.msg.indexOf('token已过期')>-1  ){
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
//新建
const handleBuild = () => {
  dialogTitile.value = "新建";
  dialogFormVisible.value = true;
};
//详情
const detail = (index, row)=>{
    dialogTitile.value = "查看";
    dialogTableValue.value = JSON.parse(JSON.stringify(row));
    dialogFormVisible.value = true;
}
//编辑
const handleEdit = (index, row) => {
  dialogTitile.value = "编辑";
  dialogTableValue.value = JSON.parse(JSON.stringify(row));
  dialogFormVisible.value = true;
};
//评价
const appraise = (index, row) => {
    dialogExitVisible.value = true;
//   ElMessageBox.confirm("你确定删除此人员信息吗?", "删除", {
//     type: "warning",
//     icon: markRaw(Delete),
//   })
//     .then(() => {
      // deleteCar(row.id).then((res)=>{
      //   if(res.code === 200){
      //       state.tableData1.splice(index, 1);
      //       if(state.tableData1.length === 0&& state.CurrentPage>1){
      //         state.CurrentPage = state.CurrentPage -1;
      //       }
      //       searchvalue.value&&isQuery.value?searchCarData():queryTableData();
      //       console.log('111111')
      //       ElMessage({
      //         type: "success",
      //         message: "删除成功",
      //       });
      //   }else{
      //       ElNotification({
      //         title: 'Warning',
      //         message: res.msg,
      //         type: 'warning',
      //       })
      //        if(res.msg.indexOf('token已过期')>-1  ){
      //               store.dispatch('app/logout')
      //           }
      //   }
      // })
    //   })
};
const closeExit = () => {
  dialogExitVisible.value = false;
};
const saveExit = () => {
//   if(exitvalue.value!==''){
//     let params={
//       billMainId:JSON.parse(JSON.stringify(formInline)).id,
//       desc:exitvalue.value
//     }
//     saveGoback(params).then((res)=>{
//        if(res.code ===200){
//          emits("update:modelValue", false);
//      }else{
//        ElNotification({
//               title: 'Warning',
//               message: res.msg,
//               type: 'warning',
//             })
//         if(res.msg.indexOf('token已过期')>-1  ){
//                     store.dispatch('app/logout')
//                 }
//      }
//     })
//   } else {
//     alert("请输入退回说明");
//   }
 
};
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