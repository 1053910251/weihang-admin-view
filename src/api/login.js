import request from '@/utils/request'

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
  console.log('logout')
}

export function getUserInfo(token) {
  console.log('getUserInfo')
}

