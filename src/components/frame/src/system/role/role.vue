<template>
<div class="totalStyle">
  <div class="tablestyle">
    <div class="searchsize">
      <span></span>
      <el-button size="small" @click="handleBuild">新建</el-button>
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
        <el-table-column prop="roleName" label="角色名称" min-width="15%" />
        <el-table-column prop="roleDesc" label="角色说明" min-width="10%" >
          <template #default="menuLblScope">
            <el-popover
              placement="top-start"
              :width="100"
              trigger="hover"
              :content="menuLblScope.row.roleDesc"
            >
              <template #reference>
                <span class="elispice">{{
                  menuLblScope.row.roleDesc}}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="menuLbl" label="角色菜单" min-width="15%" >
          <template #default="menuLblScope">
            <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="menuLblScope.row.menuLbl"
            >
              <template #reference>
                <span class="elispice">{{
                  menuLblScope.row.menuLbl}}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="roleCode" label="角色编码" min-width="10%" />
        <el-table-column prop="createdTime" label="创建时间" min-width="20%" />
        <el-table-column prop="statusLbl" label="角色状态" min-width="10%">
          <template #default="scope">
            <el-tag
              :type="scope.row.statusLbl === '启用' ? 'success' : ''"
              disable-transitions
              >{{ scope.row.statusLbl }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作列" width="150" min-width="15%">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
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
  <!-- 编辑 -->
  <RoleDialog
    v-model="dialogFormVisible"
    v-if="dialogFormVisible"
    :dialogFormVisible="dialogFormVisible"
    :dialogTitile="dialogTitile"
    :dialogTableValue="dialogTableValue"
    :dropdownValue = 'dropdownValue'
  ></RoleDialog>
</div>
</template>
<script setup>
import RoleDialog from "./roledialog.vue";
import { onBeforeMount,watch } from "vue";
import { reactive, ref, markRaw } from "vue";
import { ElMessage, ElMessageBox,ElNotification } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import store from '@/store'
import { getRoleAuthorityList as getRoleAuthorityList,deleteRole as deleteRole } from '@/api/user'
const searchvale = ref("");
const dialogFormVisible = ref(false);
let dialogTitile = ref("编辑");
let dialogTableValue = reactive({});
let dropdownValue =  reactive({});
const searchvalue = ref()
//分页
let tableData = [
  {
    roleId: 12345464654,
    roleName: "设备副班长",
    roleDesc: "仅部分权限",
    status: "开启",
    roleCode:'001',
    createdTime: "2022-11-16 18:22:30",
    menuLbl: "",
    menuNumLbl: [['crm', 'custominfo', 'basicinfo'],['crm', 'custominfo', 'blacklist']],
  },
  {
    roleId: 12345464654,
    roleName: "超级管理员",
    roleDesc: "最高权限",
    status: "关闭",
    createdTime: "2022-11-15 17:22:30",
    rolemenumsg: "车辆派修记录",
    roleMenu: ["1", "2"],
  },
];
const isloading = ref('false')
const state = reactive({
  tableLoading: false,
  CurrentPage: 1,
  PageSize: 10,
  Total: 0,
  TotalList: [],
  tableData1: [],
});
const queryTableData = () => {
  isloading.value = true;
  let obj = {
    pagesize:state.PageSize,
    pageindex: state.CurrentPage 
  }
  getRoleAuthorityList(obj)
    .then((res)=>{
      isloading.value = false;
      if(res.code ===200){
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
  // queryTableData();
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
//新建
const handleBuild = () => {
  dialogTitile.value = "新建";
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
      deleteRole(row.roleId).then((res)=>{
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
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>
<style  lang = 'less' scoped>
.tablestyle {
  position: relative;
  /deep/ .el-table__header thead tr {
    background-color: rgba(64, 158, 255, 0.1);
  }
  /deep/ .el-col-3 {
    max-width: none;
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
/deep/ .el-table--fit{
  height:100%;
}
/deep/ .el-table__body-wrapper{
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