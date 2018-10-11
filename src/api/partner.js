import request from '@/utils/request'

/**
 * 伙伴列表
 * @param param
 * @returns {*}
 */
export function fetchPartner(param) {
  return request({
    url: '/api/partner',
    method: 'get',
    params: param
  })
}

/**
 * 创建伙伴列表
 * @param param
 */
export function createPartner(param) {
  return request({
    url: '/api/partner',
    method: 'post',
    data: param
  })
}

/**
 * 编辑配置
 * @param id
 * @param param
 */
export function updatePartner(id, param) {
  return request({
    url: `/api/partner/${id}`,
    method: 'put',
    data: param
  })
}

/**
 * 删除配置
 * @param id
 */
export function deletePartner(id) {
  return request({
    url: `/api/partner/${id}`,
    method: 'delete'
  })
}
