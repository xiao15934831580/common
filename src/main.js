import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as echarts from 'echarts';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import router from './router/index';
import * as Icons from '@element-plus/icons-vue'
import store from './store/index';
import '../src/assets/css/global.less';
import '@/router/permission'
import axios from 'axios';
import md5 from 'js-md5';
import * as Base64 from 'js-base64'

import { dispatchEventStorage } from '@/utils/auth.js'

const app = createApp(App)
Object.keys(Icons).forEach((key) => {
    app.component(key, Icons[key]);
}); 
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$md5 = md5;
app.config.globalProperties.$Base64 = Base64;
app.use(dispatchEventStorage)

app.use(ElementPlus, { locale })
.use(router)
.use(store)
.mount('#app');

