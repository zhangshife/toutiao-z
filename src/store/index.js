import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('TOUTIAO_USER') // 用户token信息
  },
  mutations: {
    // state是上面的数据,data是外面传入的数据
    SET_USER (state, data) {
      // console.log(data)
      // 放入data中
      state.user = data
      // 存入本地存储中
      setItem('TOUTIAO_USER', data)
    }
  },
  actions: {
  },
  modules: {
  }
})
