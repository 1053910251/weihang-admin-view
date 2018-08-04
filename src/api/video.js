import request from '@/utils/request'

/**
 * 视频列表
 * @param param
 */
export function fetchVideo(param) {
  return request({
    url: '/api/video',
    method: 'get',
    data: param
  })
}
