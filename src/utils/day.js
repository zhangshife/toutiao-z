// 导入vue
import Vue from 'vue'

// 导入dayjs
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

// 获取当前时间对象,处理当前时间对象
// console.log(dayjs())

// 当前时间格式化
// console.log(dayjs().format())

// 按照格式,格式化时间
// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))

// 获取相对时间
// console.log(dayjs().toDate(dayjs()))
// console.log(dayjs().toDate(dayjs('2020-10')))

// 注册一个全局过滤器,处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
