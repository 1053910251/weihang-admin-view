import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'

export const ACCESS_TOKEN_HEADER = 'Authorization'

export function getToken() {
  return `Bearer ${Cookies.get(TOKEN_KEY)}`
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}
