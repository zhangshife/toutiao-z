import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入axios
import '@/utils/request'

// 导入vant
import Vant from 'vant'
// 导入样式
import 'vant/lib/index.css'

// // 导入字体图表
// import './styles/icon.scss'

// 加载全局样式
import './styles/index.scss'

// 导入rem处理
import 'amfe-flexible'

// 引入时间处理
import './utils/day'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
