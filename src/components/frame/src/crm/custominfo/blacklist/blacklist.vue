<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20" >
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.userName"
          placeholder="请输入姓名"
        />
        <el-input
          class="w-10 m-2"
          v-model="searchvalue.phoneNumber"
          placeholder="请输入手机号"
        />
      </el-col>
      <el-col :span="4">
      <el-button  class="searchbutton " @click="queryTableData"
        >查询</el-button
      >
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
        <el-table-column prop="customerCode" label="客户编码" min-width="10%" />
        <el-table-column prop="userName" label="姓名" min-width="10%" />
        <el-table-column prop="IDNumber" label="证件号" min-width="18%" />
        <el-table-column prop="phoneNumber" label="手机号" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="customerLevel" label="客户等级" min-width="15%">
          <template #default="requestscope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="requestscope.row.customerLevel"
            >
              <template #reference>
                <span class="elispice">{{
                  requestscope.row.customerLevel
                }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" min-width="10%" >
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
import { getAllUserList as getAllUserList} from '@/api/index'
import { getCustomerLevel as getCustomerLevel} from '@/api/common'
import { ElNotification } from "element-plus";
import store from '@/store'
const searchvalue = reactive({
  userName:'',
  phoneNumber:'',
  customerLevel:'',
  customerCode:'',
});
let customerDropdown=reactive([])
let tableData = [
  {
    id:'1212',
    customerCode:'11',
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber:"13456456",
    customerLevel: "一级",
    detailAddress:'45451215',
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
const getCustomerLevelFun = () => {
  getCustomerLevel().then((res)=>{
    if (res.code === 200) {
      customerDropdown.value = res.body;
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
const queryTableData = () => {
     isloading.value = true;
     let obj = JSON.parse(JSON.stringify(searchvalue));
     obj.pageindex = state.CurrentPage;
     obj.pagesize = state.PageSize;
     obj.blacklist = 1;
  getAllUserList(obj).then((res)=>{
    isloading.value = false;
    if(res.code === 200){
          let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          console.log(state.tableData)
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
  getCustomerLevelFun()
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