import { login as loginApi } from '@/api/index'
import router from '@/router'
import { setTokenTime } from '@/utils/auth'
import { ElNotification } from "element-plus";
import store from '@/store'
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || '',
    siderType: true,
    lang: localStorage.getItem('lang') || 'zh',
    userData:  localStorage.getItem('userData') || '',
    loginErr:false
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    changeSiderType(state) {
      state.siderType = !state.siderType
    },
    changLang (state, lang) {
      state.lang = lang
    },
    SetUserData(state,userData){
      state.userData = userData
      localStorage.setItem('userData', JSON.stringify(userData))
    },
    changeErr(state,err){
      state.loginErr = err
    }
  },
  actions: {
    login({ commit }, userInfo) {
      // commit('setToken', res.data.msg)
      // router.replace('/')
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            if(res.code === 200){
              console.log(res)
              commit('SetUserData', res.body)
              commit('setToken', res.body.token)
              setTokenTime()
              router.replace('/homepage')
              resolve()
            }else{
              ElNotification({
                title: 'Warning',
                message: res.message,
                type: 'warning',
              })
            }

          })
          .catch((err) => {
            // commit('changeErr', true)
            // console.log(err)
            ElNotification({
              title: 'Warning',
              message: '服务器异常',
              type: 'warning',
            })
            reject(err)
          })
      })
    },
    // 退出
    logout({ commit }) { 
      commit('setToken', '')
      localStorage.clear()
      router.replace('/login')
    }
  }   
}
