<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="10">
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.userName"
          placeholder="请输入操作人员"
        />
        <el-date-picker
        v-model="searchvalue.requestTime"
        type="datetime"
        placeholder="请输入请求时间"
      />
      </el-col>

      <el-button size="small" class="searchbutton" @click="queryTableData"
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
        <el-table-column prop="username" label="操作人员" min-width="10%" />
        <el-table-column prop="requestTime" label="请求时间" min-width="18%" />
        <el-table-column prop="ipAddr" label="IP地址" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="requestMethod" label="请求方法" min-width="15%">
          <template #default="requestscope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="requestscope.row.requestMethod"
            >
              <template #reference>
                <span class="elispice">{{
                  requestscope.row.requestMethod
                }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="requestParam" label="请求参数" min-width="15%">
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.requestParam"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.requestParam }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="requestDesc" label="请求描述" min-width="10%" >
          <template #default="scope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="scope.row.requestDesc"
            >
              <template #reference>
                <span class="elispice">{{ scope.row.requestDesc }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="requestType" label="请求类型" min-width="12%" />
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
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
import { getLogs as getLogs } from '@/api/index'
import { ElNotification } from "element-plus";
import { getymdhms } from '@/utils/auth'
import store from '@/store'
const searchvalue = reactive({
  userName:'',
  requestTime:'',
  "pageindex": '',
  "pagesize": '',
});
let tableData = [
  {
    userId: 1235665656,
    userName: "设备副班长",
    ipAddr: "113.219.138.174",
    requestMethod:
      "com.allen.inspection.controller.SysUserController.updateRole",
    requestTime: "2022-11-16 18:22:30",
    requestParam: '[{"roleId":7,"username":"17885542585",}]',
    requestDesc: "更新角色信息",
    methodType: "更新",
  },
  {
    userId: 1235665656,
    userName: "点检员",
    ipAddr: "113.219.138.174",
    requestMethod:
      "com.allen.inspection.controller.SysUserController.updateRole",
    requestTime: "2022-11-16 18:22:30",
    requestParam: '[{"roleId":7,"username":"17885542585"}]',
    requestDesc: "更新角色信息",
    methodType: "INSERT",
  },
];
let isQuery = ref(false);
// 分页
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
  obj.userName = obj.userName.trim();
  obj.requestTime = obj.requestTime?getymdhms(obj.requestTime):'';
  obj.pageindex = state.CurrentPage;
  obj.pagesize = state.PageSize;
  getLogs(obj).then((res)=>{
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

onBeforeMount(() => {
  queryTableData();
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
.search {
  position: relative;
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
</style>