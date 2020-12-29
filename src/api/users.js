// 所有关于用户模块的数据请求

// 导入自己处理过的axios
import request from '@/utils/request'
// 导入工具方法
// import { getItem } from '@/utils/storage'

// 登录注册
export const userLogin = function (data) {
  return request({
    url: '/v1_0/authorizations',
    method: 'post',
    data
  })
}

// 获取手机验证码
export const getPhoneSms = mobile => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: 'get'
  })
}

// 获取用户个人资料信息
export const getUserInfo = () => {
  // const user = getItem('TOUTIAO_USER')
  return request({
    url: '/v1_0/user'
    // 请求头配置
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      // target: target
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = target => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}

// 获取用户详细资料
export const getUserInfoDetail = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 修改用户头像
export const updataUserPhoto = data => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}

// 更新用户资料(昵称,性别,出生年月)
export const updataUserMessage = data => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
