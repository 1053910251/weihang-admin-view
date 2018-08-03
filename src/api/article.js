import request from '@/utils/request'

/**
 * 文章列表
 * @param param
 */
export function fetchList(param) {
  return request({
    url: '/api/article',
    method: 'get',
    data: param
  })
}
