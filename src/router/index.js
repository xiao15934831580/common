import { createRouter, createWebHashHistory } from "vue-router";
// import HelloWorld from '../components/HelloWorld.vue';
// import BigScreen from '../components/screen/BigScreen.vue';
import HomePage from '../components/homepage.vue';
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      requiresAuth: false, // false表示不需要登录
      },
    component: () => import('../components/login/login.vue'),
  },
  {
    path: '/homepage',
    name: 'homepage',
    redirect: '/basicinfo',
    component: HomePage,
    meta: {
      title: '客户基础信息',
      requiresAuth: true, // true表示需要登录
    },
    children: [
      {
        path: '/basicinfo',
        name: '客户基础信息',
        // component: () => import('../components/crm/custominfo/basic/basicinfo.vue'),
      },
      {
        path: '/blacklist',
        name: '黑名单客户信息',
        // component: () => import('../components/crm/custominfo/blacklist/blacklist.vue'),
      },
      {
        path: '/maintain',
        name: '客户维护与关怀',
        // component: () => import('../components/crm/custominfo/maintain/maintain.vue'),
      },
    ]
  },
];
const router = createRouter({
  mode:'history',
  history: createWebHashHistory(),
  routes
});
export default router;