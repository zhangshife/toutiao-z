// 导入axios
import axios from 'axios'

// 导入vuex
import store from '@/store'

// 处理大数字问题
import JSONBig from 'json-bigint'

import router from '@/router'

// 实例化一个axios对象
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/', // 基础路径
  // timeout: 3000
  transformResponse: [function (data) {
    // 对data进行任意转换处理
    try {
      // JSONBig.parse是进行大数据转化,能够保留大数字的识别.如果没有大数字就进行不同的JSON.parse
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// console.log(axios);
// axios({
//   url:请求头,
//   method:请求方式,
//   data:请求体,
//   params:get提交的参数
// })

// 暴露request

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const user = store.state.user
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 成功的请求走这里
  return response
}, async function (error) {
  // 对响应错误做点什么
  // 错误的请求走这里
  // token出错
  if (error.response && error.response.status === 401) {
    // 1效验是否有refresh_token
    const user = store.state.user
    if (!user || !user.refresh_token) {
      router.push('/login')
      // 代码就不往后执行
      return
    }
    // 2如果有refresh_token,则请求获取新的token
    // 更换token
    try {
      const res = await request({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 如果获取成功，则把新的 token 更新到容器中
      console.log('刷新 token  成功', res)
      store.commit('setUser', {
        token: res.data.data.token, // 最新获取的可用 token
        refresh_token: user.refresh_token // 还是原来的 refresh_token
      })

      // 把之前失败的用户请求继续发出去
      // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
      // return 把 request 的请求结果继续返回给发请求的具体位置
      return request(error.config)
    } catch (err) {
      // 如果获取失败，直接跳转 登录页
      console.log('请求刷线 token 失败', err)
      router.push('/login')
    }
  }
  return Promise.reject(error)
})
export default request
