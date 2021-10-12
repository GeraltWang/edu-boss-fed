import request from '@/utils/request.js';

// 获取所有角色
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 按条件查询角色
export const getRolePages = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 删除角色
export const deleteRole = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 保存或更新角色
export const createOrUpdateRole = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 根据id获取角色信息
export const queryById = (id) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 列出所有角色，并且标记当前用户ID是否拥有该角色
export const getRolesWithUserPermission = (id) => {
  return request({
    method: 'GET',
    url: '/boss/role/getRolesWithUserPermission',
    params: {
      id
    }
  })
}

// 给用户分配角色
export const allocateUserRoles = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色
export const getUserRole = id => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${id}`
  })
}
