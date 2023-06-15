<template>
<div>
  <router-view></router-view>
</div>
</template>

<script>
import * as echarts from 'echarts';
import {provide} from 'vue';
provide ( 'echarts',echarts);
export default {
  name: 'App',
}
</script>

<style>
</style>
