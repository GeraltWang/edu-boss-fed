import request from '@/utils/request.js';
// import qs from 'qs'

// 请求编辑菜单页面信息
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 新增菜单表单提交
export const createOrUpdateMenu = (data) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    // axios 默认采用json格式，所以无需转换
    data
  })
}

// 请求所有菜单
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
export const deleteMenu = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

// 获取所有菜单并按层级展示
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 获取角色拥有的菜单列表
export const getRoleMenus = (roleId) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}

// 给角色分配菜单
export const allocateRoleMenus = (data) => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}
