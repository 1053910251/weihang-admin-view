import request from '@/utils/request'
import { removeToken } from '@/utils/auth'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/api/auth/token',
    method: 'post',
    data
  })
}

export function logout() {
  removeToken()
}

export function getUserInfo(token) {
  console.log('getUserInfo')
}

