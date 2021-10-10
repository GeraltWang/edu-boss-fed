import request from '@/utils/request.js';

// 按条件分页查询资源
export const getResourcePages = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类列表
export const getAllCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 获取角色拥有的资源列表
export const getRoleResources = (roleId) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

// 给角色分配资源
export const allocateRoleResources = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}
