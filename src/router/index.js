import { createRouter, createWebHashHistory } from "vue-router";
// import HelloWorld from '../components/HelloWorld.vue';
// import BigScreen from '../components/screen/BigScreen.vue';
import ManageMent from '../components/management.vue';
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
    component: () => import('../components/frame/src/login/login.vue'),
  },
  {
    path: '/manageMent',
    name: 'manageMent',
    redirect: '/basicinfo',
    component: ManageMent,
    meta: {
      title: '客户基础信息',
      requiresAuth: true, // true表示需要登录
    },
    children: [
      {
        path: '/basicinfo',
        name: '客户基础信息',
        component: () => import('../components/frame/src/crm/custominfo/basic/basicinfo.vue'),
      },
      {
        path: '/blacklist',
        name: '黑名单客户信息',
        component: () => import('../components/frame/src/crm/custominfo/blacklist/blacklist.vue'),
      },
      {
        path: '/maintain',
        name: '客户维护与关怀',
        component: () => import('../components/frame/src/crm/custominfo/maintain/maintain.vue'),
      },
      {
        path: '/powerstationinfo',
        name: '客户电站信息',
        component: () => import('../components/frame/src/crm/custominfo/powerstationinfo/powerstationinfo.vue'),
      },
      {
        path: '/insurancelist',
        name: '电站保单列表',
        component: () => import('../components/frame/src/crm/powerInsurance/insurancelist/insurancelist.vue'),
      },
      {
        path: '/policyremind',
        name: '保单提醒',
        component: () => import('../components/frame/src/crm/powerInsurance/policyremind/policyremind.vue'),
      },
      {
        path: '/claimsprocess',
        name: '电站理赔流程',
        component: () => import('../components/frame/src/crm/powerInsurance/claimsprocess/claimsprocess.vue'),
      },
      {
        path: '/businessexpansion',
        name: '电商拓展',
        component: () => import('../components/frame/src/crm/businessexpansion/businessexpansion.vue'),
      },
      {
        path: '/unaudited',
        name: '未审核工单',
        component: () => import('../components/frame/src/wokeorder/unaudited/unaudited.vue'),
      },
      {
        path: '/approved',
        name: '已审核工单',
        component: () => import('../components/frame/src/wokeorder/approved/approved.vue'),
      },
      {
        path: '/completed',
        name: '已完成工单',
        component: () => import('../components/frame/src/wokeorder/completed/completed.vue'),
      },
      {
        path: '/agentinfo',
        name: '代理商信息',
        component: () => import('../components/frame/src/crmagent/agentinfo/agentinfo.vue'),
      },

      {
        path: '/account',
        name: '客户账户管理',
        component: () => import('../components/frame/src/customerassets/photovoltaicloan/account/account.vue'),
      },
      {
        path: '/income',
        name: '电站收益',
        component: () => import('../components/frame/src/customerassets/photovoltaicloan/income/income.vue'),
      },
      {
        path: '/managelist',
        name: '返还金管理列表',
        component: () => import('../components/frame/src/customerassets/rent/managelist/managelist.vue'),
      },
      {
        path: '/statistics',
        name: '返还金发放统计',
        component: () => import('../components/frame/src/customerassets/rent/statistics/statistics.vue'),
      },
      {
        path: '/user',
        name: '用户管理',
        component: () => import('../components/frame/src/system/user/user.vue'),
      },
      {
        path: '/role',
        name: '角色管理',
        component: () => import('../components/frame/src/system/role/role.vue'),
      },
      {
        path: '/log',
        name: '系统日志',
        component: () => import('../components/frame/src/system/log/log.vue'),
      },
      {
        path: '/ratingmodel',
        name: '服务评价设置',
        component: () => import('../components/frame/src/system/systemdesign/ratingmodel/ratingmodel.vue'),
      },
      {
        path: '/creditmodel',
        name: '信用级别设置',
        component: () => import('../components/frame/src/system/systemdesign/creditmodel/creditmodel.vue'),
      },
      {
        path: '/powerdate',
        name: '电站保质期设置',
        component: () => import('../components/frame/src/system/systemdesign/powerdate/powerdate.vue'),
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