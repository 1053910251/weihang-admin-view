import request from '@/utils/request'

/**
 * 视频列表
 * @param param
 */
export function fetchVideo(param) {
  return request({
    url: '/api/video',
    method: 'get',
    params: param
  })
}

/**
 * 删除视频
 * @param id
 */
export function removeVideo(id) {
  return request({
    url: `/api/video/${id}`,
    method: 'delete'
  })
}

/**
 * 修改视频状态
 * @param id
 * @param param
 */
export function updateVideo(id, param) {
  return request({
    url: `/api/video/${id}`,
    method: 'put',
    data: param
  })
}

/**
 * 上传视频
 * @param param
 */
export function createVideo(param) {
  return request({
    url: '/api/video',
    method: 'post',
    data: param
  })
}
