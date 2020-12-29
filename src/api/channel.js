// 所有关于频道模块的数据模块

// 导入自己处理过的axios
import request from '@/utils/request'

// 获取用户自己的频道(为登录获取后台默认推荐的)
export const getUserChannel = () => {
  return request({
    url: '/v1_0/user/channels',
    method: 'get'
  })
}

// 获取所有频道数据
export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels',
    method: 'get'
  })
}

// 添加用户频道
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}

// 删除用户频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
