import axios from 'axios'
const http = axios.create({
  baseURL: '/elephone', //process.env.VUE_APP_BASE_API
  // timeout: 1800000,
})
// http.defaults.headers.post["loginClient"] = "pc";
//请求拦截
http.interceptors.request.use(
  (config) => {
    // if (localStorage.getItem('token')) {
    //   if (diffTokenTime()) {
    //     store.dispatch('app/logout')
    //     return Promise.reject(new Error('token 失效了'))
    //   }
    // }
    if (typeof config !== 'object') {
      console.log('服务端异常！');
      return Promise.reject(config)
    }
    // config.headers.loginClient = 'pc'
    config.headers.token = localStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(new Error(error))
  }
)
//响应拦截
http.interceptors.response.use(
  (response) => {
   return response.data
  },
  (error) => {
    return error.response.data
  }
)
export default http
