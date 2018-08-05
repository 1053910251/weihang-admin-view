import request from '@/utils/request'

/**
 * 文章列表
 * @param param
 */
export function fetchArticle(param) {
  return request({
    url: '/api/article',
    method: 'get',
    data: param
  })
}

/**
 * 删除文章
 * @param id
 */
export function removeArticle(id) {
  return request({
    url: `/api/article/${id}`,
    method: 'delete'
  })
}

/**
 * 创建文章
 * @param param
 */
export function createArticle(param) {
  return request({
    url: '/api/article',
    method: 'post',
    data: param
  })
}

/**
 * 修改文章
 * @param id
 * @param param
 */
export function updateArticle(id, param) {
  return request({
    url: `/api/article/${id}`,
    method: 'put',
    data: param
  })
}

export function findArticleById(id) {
  return request({
    url: `/api/article/${id}`,
    method: 'get'
  })
}
