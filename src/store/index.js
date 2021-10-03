import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功后保存用户数据至user,初始值先读取本地存储，如过没有则为空
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    // 存储用户数据
    setUser (state, payload) {
      // 由于服务器返回的是JSON字符串，所以要转换成对象后再存储
      state.user = JSON.parse(payload)
      // 将用户数据payload保存在本地存储中
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
