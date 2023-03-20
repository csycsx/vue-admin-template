import request from '@/utils/request'

// 调用后端用户登录接口，并返回全局token
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 后端统一身份认证登录
export function loginOauth(data) {
  return request({
    url: '/user/loginOauth',
    method: 'post',
    params: data
  })
}


export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUserInfoById(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: data
  })
}

export function getAdminInfo(data) {
  return request({
    url: '/admin_info/findAdminById',
    method: 'get',
    params: data
  })
}

