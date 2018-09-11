import request from '@/utils/request'

/**
 * 岗位列表
 * @param param
 * @returns {*}
 */
export function fetchJob(param) {
  return request({
    url: '/api/job',
    method: 'get',
    params: param
  })
}

/**
 * 创建岗位
 * @param param
 */
export function createJob(param) {
  return request({
    url: '/api/job',
    method: 'post',
    data: param
  })
}

/**
 * 编辑岗位
 * @param id
 * @param param
 */
export function updateJob(id, param) {
  return request({
    url: `/api/job/${id}`,
    method: 'put',
    data: param
  })
}

/**
 * 删除岗位
 * @param id
 */
export function deleteJob(id) {
  return request({
    url: `/api/job/${id}`,
    method: 'delete'
  })
}
