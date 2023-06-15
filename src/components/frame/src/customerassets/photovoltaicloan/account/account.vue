<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <el-col :span="5" class="searchBox">
        <el-input
          class="w-10 m-2"
          v-model="searchvalue.name"
          placeholder="请输入姓名"
        />
      </el-col>
      <div class="searchButtonBox">
        <!-- <el-button  class="searchbutton " @click="setRent"
            >利率设置</el-button> -->
        <el-button  class="searchbutton " @click="sendAll"
            >一键外呼</el-button>
        <el-button  class="searchbutton" @click="sendAll"
            >一键发送短信</el-button>
        <el-button  class="searchbutton" @click="searchbutton"
            >查询</el-button>
      </div>
    </div>
    <div class="chartstyle">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        :header-cell-style="{ background: '#d9ecff' }" 
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
      <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="序号" min-width="7%">
          <template #default="requestscope">
                <span >{{
                  requestscope.$index+1 + (state.PageSize*(state.CurrentPage-1))
                }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户名称" min-width="10%" />
        <el-table-column prop="customerAccount" label="客户账号" min-width="10%" />
        <el-table-column prop="enterAccount" label="入账" min-width="18%" />
        <el-table-column prop="outerAccount" label="出账" min-width="15%" />
        <!-- :show-overflow-tooltip='true' -->
        <el-table-column prop="remainder" label="余额" min-width="15%">
          <template #default="scope">
                <span class="elispice underline" @click="showRemainder(scope.$index, scope.row)">{{
                  scope.row.remainder}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作列" width="250" min-width="28%">
          <template #default="scope">
            <el-button size="small" @click="detail(scope.row.id)"
              >智能外呼</el-button>
              <el-button size="small" @click="detail(scope.row.id)"
              >发送短信</el-button>
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
    <el-dialog
      ref="ruleFormRef"
      :model-value="dialogRentVisible"
      title="公司利率"
      :before-close="close"
      :width="formLabelWidth"
      :close-on-click-modal="false"
      draggable
    >
      <div>
        <!-- 基础信息 -->
        <!-- <p class="basicinfo"><span>车辆信息</span></p> -->
        <div style="margin:24px 48px">
            <el-form
            :model="formInline"
            :inline="true"
            label-width="160px"
            :rules="rules"
            ref="ruleFormRef"
            require-asterisk-position="left"
            size="default"
            scroll-to-error="true"
          >
            <div class="basicstyle">
              <el-form-item label="公司利率" prop="rentData" required>
                <el-input
                  placeholder="请输入公司利率"
                  v-model="formInline.rentData"
                />
              </el-form-item>
            </div>
            </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="btn-mixins-clear-default"
            @click="close"
            >取消</el-button
          >
          <el-button
            class="btn-mixins dia-suc"
            @click="surelook(ruleFormRef)"
            >确定</el-button>
        </span>
      </template>
    </el-dialog>
</div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
// import { getLog as getLog,queryLog as queryLog } from '@/api/index'
import { ElNotification } from "element-plus";
import { ElTable } from 'element-plus'
import store from '@/store'
import DiaLog from './dialog.vue'
const searchvalue = reactive({
  name:'',
  phoneNumber:'',
  customerLevel:'',
  customerCode:'',
  IDNumber:'',
});
const multipleSelection=ref ([])
const multipleTableRef = ref();
let dialogTableValue = reactive({});
const dialogRentVisible = ref(false);
const formLabelWidth = '40%'
const ruleFormRef = ref();
const errorMsg = ref('请输入公司利率');
const formInline = reactive({
  rentData:''
})
const rules = reactive({
  rentData: [{ required: true, message: "请输入公司利率", trigger: "blur" }],

});
let tableData = [
  {
    id:'0',
    userName: "用户名称",
    customerAccount: "客户账号",
    enterAccount:"300",
    outerAccount: "100",
    remainder:'200',
    rate:'4.5%'
  },
  {
    id:'1',
    userName: "用户名称",
    customerAccount: "客户账号",
    enterAccount:"入账",
    outerAccount: "出账",
    remainder:'100',
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
              message: res.message?res.message:'服务器异常',
              type: 'warning',
            })
            if(res.message.indexOf('token已过期')>-1  ){
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
const  handleSelectionChange=(val)=> {
        // this.multipleSelection = val;
        multipleSelection.value = [];
        val.forEach((item)=>{
            const id = item.id
			// 判断数组中是否包含这个 id 
			if (multipleSelection.value.indexOf(id) == -1) {
				multipleSelection.value.push(id)
			}
        })
        console.log(multipleSelection)
      }
// 批量发送短信
const sendAll =()=>{
    console.log(multipleSelection._rawValue)  //当前所选中的用户id
}
//余额
const showRemainder=(index,row)=>{
  console.log('1111122')
  dialogTableValue.value = row
  dialogFormVisible.value = true
}
const setRent = ()=>{
  dialogRentVisible.value = true;
}
const close = ()=>{
  dialogRentVisible.value = false;
}
const surelook = (ruleFormRef)=>{
  
    if (!ruleFormRef) return;
    ruleFormRef.validate(async (valid) => {
      if (valid) {
          dialogRentVisible.value = false;
      }else {
      return false;
      }
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
.errorStyle{
  color: red;

}
</style>