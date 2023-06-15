<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="20">
        <el-input
          class="w-10 m-2 mr-16"
          v-model="searchvalue.powerName"
          placeholder="请输入电站单元名称"
        />
      </el-col>
      <el-col :span="4">
      <el-button  class="searchbutton " @click="queryTableData"
        >查询</el-button>
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
        <el-table-column prop="powerName" label="电站单元名称" min-width="10%" />
        <el-table-column prop="powerWarranty" label="保质期" min-width="18%" >
            <template #default="scope">
                <el-input
                  placeholder="请输入分数"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.powerWarranty"
                />
            </template>
        </el-table-column>
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
          <el-button size="small" @click="editRow(scope.$index, scope.row)"
              >编辑</el-button>
            <el-button size="small"  @click="saveRow(scope.$index, scope.row)"
              >保存</el-button>
            <!-- <el-button size="small" @click="deleteData(scope.$index)"
              >删除</el-button> -->
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
import { getWarrantyList as getWarrantyList,setWarranty as setWarranty } from '@/api/index'
import { ElNotification } from "element-plus";
import store from '@/store'
const searchvalue = reactive({
  powerName:'',
  "pageindex": 0,
  "pagesize": 0,
});
let isShow = ref(true)
let tableData = reactive([
  {
    id:'1212',
    appraise: "工单评价",
    score:'分数',
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
    {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
    {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
    {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
    {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
    {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
  {
    id:'1212',
    appraise: "优秀",
    score: "9",
  },
]);
let dialogTitile = ref("编辑");
let isQuery = ref(false);
let isSave = ref(false)
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
//编辑
const editRow =(index,row)=>{
  state.tableData1[index].isEdit = true;
}
const saveRow =(index,row)=>{
  if(state.tableData1[index].isEdit){
      setWarranty(row.powerId,row.powerWarranty).then((res)=>{
        if(res.code === 200){
          state.tableData1[index].isEdit = false
           ElNotification({
              title: 'Success',
              message: '保存成功',
              type: 'success',
            })
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

}
const queryTableData = () => {
    console.log('11111')
    isQuery.value = true;
     isloading.value = true;
      let obj = JSON.parse(JSON.stringify(searchvalue));
      obj.powerName = obj.powerName.trim();
      obj.pageindex = state.CurrentPage;
      obj.pagesize = state.PageSize;
    getWarrantyList(obj).then((res)=>{
      console.log('11111',res)
      isloading.value = false;
      if(res.code === 200){
        let data = res.body;
          state.tableData1=data&&data.data?data.data:[];
          console.log(state.tableData1)
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