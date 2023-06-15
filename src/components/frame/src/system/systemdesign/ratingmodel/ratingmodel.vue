<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <span></span>
      <el-button  class="searchbutton " @click="addButton"
        >新建</el-button>
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
        <el-table-column prop="grade" label="工单评价" min-width="10%" >
            <template #default="scope">
                <el-input
                  placeholder="请输入工单评价"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.grade"
                />
            </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" min-width="18%" >
            <template #default="scope">
                <el-input
                  placeholder="请输入分数"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.score"
                />
            </template>
        </el-table-column>
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
          <el-button size="small" @click="editRow(scope.$index, scope.row)"
              >编辑</el-button>
            <el-button size="small"  @click="saveRow(scope.$index, scope.row)"
              >保存</el-button>
            <el-button size="small" @click="deleteData(scope.row)"
              >删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
            <el-empty v-loading="isloading"></el-empty>
        </template>
      </el-table>
    </div>
  </div>
</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
import { getServiceEvaluation as getServiceEvaluation,operateServiceEvaluation as operateServiceEvaluation, deleteServiceEvaluation as deleteServiceEvaluation } from '@/api/index'
import { ElNotification } from "element-plus";
import store from '@/store'
const searchvalue = reactive({
  name:'',
  phoneNumber:'',
  customerLevel:'',
  city:'',
  county:'',
  town:''
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

let isSave = ref(false)
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
    let obj={
      "grade": row.grade,
      "id": row.id,
      "score": row.score
  }
  operateServiceEvaluation(obj).then((res)=>{
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
//新建
const addButton = ()=>{
    let obj={
        "grade": '',
        "score": '',
        isEdit:'true'
    }
    state.tableData1.unshift(obj)
}
const queryTableData = () => {
     isloading.value = true;
    getServiceEvaluation().then((res)=>{
      console.log('11111',res)
      isloading.value = false;
      if(res.code === 200){
        let data = res.body;
          state.tableData1=data;
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
//删除
const deleteData=(row)=>{
    deleteServiceEvaluation(row.id).then((res)=>{
      if(res.code === 200){
          queryTableData()
          ElNotification({
              title: 'Success',
              message: '删除成功',
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
onBeforeMount(() => {
  queryTableData();
});

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