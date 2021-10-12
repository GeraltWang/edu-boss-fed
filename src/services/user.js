import request from '@/utils/request.js';
import qs from 'qs'

// 登录接口
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // urlencoded 格式：名=值&名=值
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers 已经在拦截其中统一处理了
  })
}

// 分页查询用户信息
export const getUserPages = (data) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户
export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}

// 启用用户
export const enableUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/enableUser',
    params: {
      userId
    }
  })
}
