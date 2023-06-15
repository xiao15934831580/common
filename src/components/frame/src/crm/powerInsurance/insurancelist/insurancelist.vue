<template>
  <div class="totalStyle">
    <div class="tablestyle">
      <div class="searchsize">
        <el-col :span="20">
          <el-input
            class="w-10 m-2 mr-16"
            v-model="searchvalue.policyNum"
            placeholder="请输入保单编码"
          />
          <el-input
            class="w-10 m-2"
            v-model="searchvalue.powerNum"
            placeholder="请输入电站单元名称"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            class="searchbutton "
            @click="queryTableData();"
          >查询</el-button>
          <el-button
            class="searchbutton mr-16"
            @click="handleBuild"
          >新建</el-button>
        </el-col>
      </div>
      <div class="chartstyle">
        <el-table
          :data="state.tableData1"
          :header-cell-style="{ background: '#d9ecff' }"
          border
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            min-width="7%"
          >
            <template #default="requestscope">
              <span>{{
                      requestscope.$index+1 + (state.PageSize*(state.CurrentPage-1))
                    }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="电站业主"
            min-width="10%"
          />
          <el-table-column
            prop="powerStationName"
            label="电站单元名称"
            min-width="15%"
          />
          <el-table-column
            prop="powerAddress"
            label="电站地址"
            min-width="15%"
          />
          <!-- :show-overflow-tooltip='true' -->
          <el-table-column
            prop="policyNo"
            label="保单编号"
            min-width="15%"
          />
          <el-table-column
            prop="policyAmount"
            label="保单金额"
            min-width="15%"
          />
          <el-table-column
            prop="policyEffectiveDateString"
            label="保单生效日期"
            min-width="15%"
          />
          <el-table-column
            prop="policyExpirationDateString"
            label="保单失效日期"
            min-width="15%"
          />
          <el-table-column
            label="操作列"
            width="250"
            min-width="28%"
          >
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="small"
                @click="detail(scope.$index, scope.row)"
              >详情</el-button>
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
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount, watch } from "vue";
import {
  getPolicy as getPolicy,
  deletePolicy as deletePolicy,
} from "@/api/index";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import store from "@/store";
import DiaLog from "./dialog.vue";
const searchvalue = reactive({
  policyNum: "",
  powerNum: "",
  pageindex: "",
  pagesize: "",
});
let dialogTableValue = reactive({});
let tableData = [
  {
    id: "1212",
    userName: "电站业主",
    powerStationName: "电站单元名称",
    powerAddress: "电站地址",
    policyNo: "保单编号",
    policyAmount: "保单金额",
    policyEffectiveDateString: "生效日期",
    policyExpirationDateString: "失效日期",
    policyAccountManager: "保单客户经理",
  },
  {
    userId: 1235665656,
    userName: "设备副班长",
    IDNumber: "111",
    phoneNumber: "13456456",
    customerLevel: "一级",
    city: "西安",
    county: "22",
    town: "11",
    detailAddress: "45451215",
    investmentMethod: "5454",
    customerType: "new",
    installationCapacity: "545L",
  },
];
let isQuery = ref(false);
// 分页
const dialogFormVisible = ref(false);
const state = reactive({
  tableLoading: false,
  CurrentPage: 1,
  PageSize: 10,
  Total: 0,
  TotalList: [],
  tableData1: [],
});
let dialogTitile = ref("编辑");
const isloading = ref("false");
const queryTableData = () => {
  isQuery.value = true;
  isloading.value = true;
  let obj = JSON.parse(JSON.stringify(searchvalue));
  obj.pageindex = state.CurrentPage;
  obj.pagesize = state.PageSize;
  getPolicy(obj).then((res) => {
    isloading.value = false;
    if (res.code === 200) {
      let data = res.body;
      state.tableData1 = data && data.data ? data.data : [];
      state.Total = data && data.total ? data.total : 0;
    } else {
      ElNotification({
        title: "Warning",
        message: res.message?res.message:'服务器异常',
        type: "warning",
      });
            if(res.code === 100007 ||  res.code === 100008){
                    store.dispatch('app/logout')
                }
    }
  });
};

onBeforeMount(() => {
  queryTableData();
});
watch(
  () => dialogFormVisible.value,
  () => {
    if (!dialogFormVisible.value) {
      queryTableData();
    }
  },
  { deep: true, immediate: true }
);

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
//新建
const handleBuild = () => {
  dialogTitile.value = "新建";
  dialogFormVisible.value = true;
};
//详情
const detail = (index, row) => {
  dialogTitile.value = "查看";
  dialogTableValue.value = JSON.parse(JSON.stringify(row));
  dialogFormVisible.value = true;
};
//编辑
const handleEdit = (index, row) => {
  dialogTitile.value = "编辑";
  dialogTableValue.value = JSON.parse(JSON.stringify(row));
  dialogFormVisible.value = true;
};
//删除
const handleDelete = (index, row) => {
  ElMessageBox.confirm("你确定删除此人员信息吗?", "删除", {
    type: "warning",
    icon: markRaw(Delete),
  })
    .then(() => {
      deletePolicy(row.policyId).then((res) => {
        if (res.code === 200) {
          state.tableData1.splice(index, 1);
          if (state.tableData1.length === 0 && state.CurrentPage > 1) {
            state.CurrentPage = state.CurrentPage - 1;
          }
          // queryTableData();
          // console.log('111111')
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        } else {
          ElNotification({
            title: "Warning",
            message: res.message?res.message:'服务器异常',
            type: "warning",
          });
            if(res.code === 100007 ||  res.code === 100008){
                    store.dispatch('app/logout')
                }
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
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
.searchbutton {
  float: right;
}
.chartstyle {
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
::v-deep .el-table--fit {
  height: 100%;
}
::v-deep .el-table__body-wrapper {
  overflow-y: auto;
}
</style>