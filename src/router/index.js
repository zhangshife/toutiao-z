import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入仓库
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  // 登录路由
  { name: 'login', path: '/login', component: () => import('@/views/login'), meta: { title: '登录' } },
  // 整体结构
  {
    // name: 'layout',
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      { name: 'home', path: '/', component: () => import('@/views/home'), meta: { title: '首页' } },
      { name: 'wd', path: '/wd', component: () => import('@/views/wd'), meta: { title: '问答' } },
      { name: 'video', path: '/video', component: () => import('@/views/video'), meta: { title: '视频' } },
      { name: 'user', path: '/user', component: () => import('@/views/user'), meta: { title: '我的' } }

    ]
  },
  // 搜索页面理由
  {
    name: 'search',
    path: '/search',
    component: () => import('@/views/search'),
    meta: { title: '搜索' }
  },
  // 文章详情路由
  {
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article'),
    // 将动态路由的数据注入到组件的props里面
    props: true,
    meta: { title: '文章详情' }
  },
  // 用户资料修改
  { path: '/user/profile', component: () => import('@/views/user-profile'), meta: { needLogin: true, title: '资料修改' } },
  { path: '/user/collect', component: () => import('@/views/user-collect'), meta: { needLogin: true, title: '我的收藏' } },
  { path: '/user/history', component: () => import('@/views/user-history'), meta: { needLogin: true, title: '我的历史' } }

]

const router = new VueRouter({
  routes
})

// 导航守卫
// 思路:是给要登录的路由的原信息里面添加一个字段,我们在导航守卫里面判断
// 如果没有该子墩直接方形,如果有该字段就去判断是否登陆了
// 没有登录跳转到登录页面,登陆了就方形
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.meta.needLogin) {
    if (store.state.user) {
      next()
    } else {
      router.push(`/login?url=${to.path}`)
    }
  } else {
    next()
  }
})

export default router
