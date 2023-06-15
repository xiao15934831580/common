import router from './index'
import store from '@/store'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // 通过requiresAuth判断当前路由导航是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)){
    let token = localStorage.getItem('token');
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
     } else {
        next()
     }
  }else{
    next()
  }
  // if (store.getters.token) {
  //   if (to.path === '/login') {
  //     next()
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (whiteList.includes(to.path)) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
  // next()
})
