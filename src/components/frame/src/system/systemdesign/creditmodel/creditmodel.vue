<template>
  <div class="totalStyle">
    <div class="tablestyle">
      <div class="searchsize">
        <span></span>
        <el-button
          class="searchbutton "
          @click="addButton"
        >新建</el-button>
        <!-- <el-button  class="searchbutton" v-if="!isSave" @click="editButton"
        >编辑</el-button>
        <el-button  class="searchbutton" v-if="isSave" @click="saveButton"
        >保存</el-button> -->
      </div>
      <div class="chartstyle">
        <el-table
          :data="tableData"
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
            prop="appraise"
            label="保证金"
            min-width="10%"
          >
            <template #default="scope">
              <el-input
                placeholder="请输入工单评价"
                :disabled="!scope.row.isEdit"
                v-model="scope.row.appraise"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="级别"
            min-width="18%"
          >
            <template #default="scope">
              <el-input
                placeholder="请输入分数"
                :disabled="!scope.row.isEdit"
                v-model="scope.row.score"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作列"
            width="250"
            min-width="28%"
          >
            <template #default="scope">
              <el-button
                size="small"
                @click="editRow(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="small"
                @click="saveRow(scope.$index, scope.row)"
              >保存</el-button>
              <el-button
                size="small"
                @click="deleteData(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty v-loading="isloading"></el-empty>
          </template>
        </el-table>
      </div>

    </div>
    <!-- <DiaLog
        v-model="dialogFormVisible"
        v-if="dialogFormVisible"
        :dialogFormVisible="dialogFormVisible"
        :dialogTitile="dialogTitile"
        :dialogTableValue="dialogTableValue"
    ></DiaLog> -->
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { markRaw, onBeforeMount } from "vue";
import { getAllUserList as getAllUserList } from "@/api/index";
import { ElNotification } from "element-plus";
import store from "@/store";
// import DiaLog from './dialog.vue'
const searchvalue = reactive({
  name: "",
  phoneNumber: "",
  customerLevel: "",
  city: "",
  county: "",
  town: "",
});
let isShow = ref(true);
let tableData = reactive([
  {
    id: "1212",
    appraise: "工单评价",
    score: "分数",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
  {
    id: "1212",
    appraise: "优秀",
    score: "9",
  },
]);
let dialogTitile = ref("编辑");
let isQuery = ref(false);
let isSave = ref(false);
// 分页
const dialogFormVisible = ref(false);
let dialogTableValue = reactive({});
const state = reactive({
  tableLoading: false,
  CurrentPage: 1,
  PageSize: 10,
  Total: 0,
  TotalList: [],
  tableData1: [],
});
const isloading = ref("false");
//编辑
const editRow = (index, row) => {
  tableData[index].isEdit = true;
};
const saveRow = (index, row) => {
  tableData[index].isEdit = false;
};
//新建
const addButton = () => {
  let obj = {
    appraise: "优秀",
    score: "9",
    isEdit: "true",
  };
  tableData.unshift(obj);
  console.log(tableData);
};
const queryTableData = () => {
  console.log("11111");
  isQuery.value = true;
  isloading.value = true;
  let obj = {
    pageindex: 1,
    pagesize: 10,
  };
  getAllUserList(obj).then((res) => {
    console.log("11111", res);
    isloading.value = false;
    if (res.code === 200) {
      let data = res.data;
      // state.tableData1=data&&data.records?data.records:[];
      // state.Total = data&&data.total?data.total:0;
    } else {
      //  ElNotification({
      //   title: 'Warning',
      //   message: res.msg,
      //   type: 'warning',
      // })
      // if(res.msg.indexOf('token已过期')>-1  ){
      //         store.dispatch('app/logout')
      //     }
    }
  });
};
//删除
const deleteData = (index) => {
  tableData.splice(index, 1);
};
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
.searchBox {
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
::v-deep .el-table--fit {
  height: 100%;
}
::v-deep .el-table__body-wrapper {
  overflow-y: auto;
}
</style>