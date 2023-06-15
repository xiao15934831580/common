<template>
  <div class="bottombox">
    <el-row class="tac">
      <el-col>
        <el-menu
          router
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          :default-active="defaultMenu"
        >
          <template v-for="(item) in menulist" >
            <!-- 有二级菜单 -->
            <el-sub-menu
              :key="item.path"
              v-if="item.children&&item.children.length>0" :index="'/'+item.path"
            > 
              <!-- 一级菜单模板区域 -->
              <template #title>
                <span>{{ item.menuName }}</span>
              </template>
              <!-- <template v-if="item.children && item.children.length > 0"> -->
              <template v-for="(subItem) in item.children" >
                <!-- 只有二级菜单 -->
                <el-menu-item
                  :index="'/'+subItem.path"
                  :key="subItem.path"
                  v-if="!subItem.children"
                  @click="savePath(subItem)"
                >
                  <!-- <el-icon :size="20"><component :is="subItem.icon" /></el-icon> -->
                  <span>{{ subItem.menuName }}</span>
                </el-menu-item>
                <!-- 有三级菜单 -->
                <template v-else>
                  <el-sub-menu  :index="'/'+subItem.path" :key="subItem.path">
                    <template #title>
                      <span>{{ subItem.menuName }}</span>
                    </template>
                    <el-menu-item
                      v-for="(grandson) in subItem.children"
                      :index="'/'+grandson.path"
                      :key="grandson.path"
                      @click="savePath(grandson)"
                    >
                      <span>{{ grandson.menuName }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                </template>

                <!-- </template> -->
              </template>
            </el-sub-menu>
            <!-- 只有一级菜单 -->
            <el-menu-item
              :index="'/'+item.path"
              :key="item.menuName"
              @click="savePath(item)"
              v-else
            >
              <!-- <el-icon :size="20"><component :is="item.icon" /></el-icon> -->
              <span>{{ item.menuName }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script >
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import menulist from '../../../assets/js/menulist';
import { useStore } from 'vuex'
export default {
  name: "AllMenus",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore()
    const list = JSON.parse(localStorage.getItem('userData')) 
    const menulist = list.menuTrees;
    console.log(menulist)
    const allRoutes = router.options.routes;
    const activePath = computed(() => {
      return route.path;
    });
    console.log(activePath);
    const savePath = (item) => {
      router.push({ name: item.menuName });
    };
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const defaultMenu = computed(() => { 
      return route.path })
      return {
        // allRoutes,
        menulist,
        activePath,
        // homeRoute,
        savePath,
        handleOpen,
        handleClose,
        defaultMenu
      };
  },
};
</script>
<style scoped>
.homepage .el-row .el-col .el-menu--vertical {
  height: calc(100vh - 60px);
}
.bottombox {
  position: relative;
}
.el-menu {
  border-right: none;
}
</style>