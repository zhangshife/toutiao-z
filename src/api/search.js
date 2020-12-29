// 有关搜索的请求

// 导入封装好的axios
import request from '@/utils/request'

// 获取联想建议
/**
 *
 * @param {*} q 搜索关键字
 */
export const getSearchSuggestion = q => {
  return request({
    url: '/v1_0/suggestion',
    method: 'get',
    params: {
      q: q
    }
  })
}

/**
 * 获取搜索结果
 */
export const getSearchResult = data => {
  return request({
    url: '/v1_0/search',
    method: 'get',
    params: data
  })
}
