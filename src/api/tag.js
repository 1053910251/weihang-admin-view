import request from '@/utils/request'

/**
 * 标签列表
 * @param param
 * @returns {*}
 */
export function fetchTag(param) {
  return request({
    url: '/api/tag',
    method: 'get',
    params: param
  })
}

/**
 * 创建标签
 * @param param
 */
export function createTag(param) {
  return request({
    url: '/api/tag',
    method: 'post',
    data: param
  })
}

/**
 * 编辑标签
 * @param id
 * @param param
 */
export function updateTag(id, param) {
  return request({
    url: `/api/tag/${id}`,
    method: 'put',
    data: param
  })
}

/**
 * 删除标签
 * @param id
 */
export function deleteTag(id) {
  return request({
    url: `/api/tag/${id}`,
    method: 'delete'
  })
}

/**
 * 查询标签数据（不分页）
 * @param param
 */
export function fetchAllTag(param) {
  return request({
    url: '/api/tag/all',
    method: 'get',
    params: param
  })
}
