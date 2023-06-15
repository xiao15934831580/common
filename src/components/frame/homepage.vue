<template>
    <!-- <div class="homepage">
        <NaviGation></NaviGation>
        <AllMenus></AllMenus>
    </div> -->
    
     <div class="common-layout homepage">
        <el-container>
        <el-header><NaviGation></NaviGation></el-header>
        <el-container>
            <el-aside width="256px"><AllMenus></AllMenus></el-aside>
            <el-main>
                <TagVue></TagVue>
                <router-view />
            </el-main>
        </el-container>
        </el-container>
    </div>

</template>
<script>
import AllMenus from './src/menus.vue';
import NaviGation from './src/navigation.vue';
import TagVue from './src/tag.vue';
export default {
    name: "HomePage",
    components: {AllMenus,NaviGation,TagVue},
    data() {
        return {
            
        };
     },
     methods: {},
};
</script>
<style scoped>
.homepage{
    background-color: #F0F2F5;
    height: 100vh;
    overflow: hidden;
}
.el-header{
        --el-header-padding: 0;
}
.el-aside{
    background-color: #545c64;
}
.el-main{
    --el-main-padding:0;
    width: 100%;
    overflow: hidden;
    height: calc(100% - 24px);
    margin-bottom: 24px;
}
.el-container.is-vertical{
    height: 100%;
}
 :deep(.el-container){
    height: calc(100Vh - 60px);
}
</style>