import request from '@/utils/request'

/**
 * 标签配置
 * @param param
 * @returns {*}
 */
export function fetchConfig(param) {
  return request({
    url: '/api/config',
    method: 'get',
    params: param
  })
}

/**
 * 创建配置
 * @param param
 */
export function createConfig(param) {
  return request({
    url: '/api/config',
    method: 'post',
    data: param
  })
}

/**
 * 编辑配置
 * @param id
 * @param param
 */
export function updateConfig(id, param) {
  return request({
    url: `/api/config/${id}`,
    method: 'put',
    data: param
  })
}

/**
 * 删除配置
 * @param id
 */
export function deleteConfig(id) {
  return request({
    url: `/api/config/${id}`,
    method: 'delete'
  })
}
