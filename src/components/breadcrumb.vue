<template>
  <div class="BreadCrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
        <router-link :to="{ path: item.path }">
          {{ item.meta.title }}<span class="spacer">|</span>        </router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup>
    import { watch, ref } from 'vue'
    import { useRoute } from 'vue-router'
    const route = useRoute()
    const breadcrumbList = ref([])

    const initBreadcrumbList = () => {
    breadcrumbList.value = route.matched
    console.log(route.matched)
    }
    watch(
    route,
    () => {
        initBreadcrumbList()   
    },
    { deep: true, immediate: true }
    )


   
</script>
<style scoped>
    .BreadCrumb {
        height: 48px;
        width: 100%;
        left: 239px;
        top: 0;
        line-height: 48px;
        padding: 16px;
        margin: 16px 0;
        background-color: #ffffff;
    }
    .spacer{
        margin: 0 16px;
    }
</style>