// 所有关于文章模块的数据请求

// 导入自己处理过的axios
import request from '@/utils/request'

// 获取文章列表
export const getArticleList = params => {
  return request({
    url: '/v1_1/articles',
    method: 'get',
    params
  })
}

// 根据id获取文章
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollect = target => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}

// 取消收藏文章
export const deleteCollect = target => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}

/**
 * 点赞
 */
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消点赞
 */
export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}
