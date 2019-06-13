import axios from '@/libs/api.request'

/**
 * 角色授权
 */
export const authorizeRole = input => {
  return axios.request({
    url: '/authorize/role',
    method: 'post',
    data: input
  })
}

/**
 * 分页角色列表
 */
export const pageRoles = ({ currentPage, pageSize, keyword }) => {
  return axios.request({
    url: '/page/roles',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      keyword
    }
  })
}

/**
 * 删除角色信息
 */
export const deleteRoles = ({ id }) => {
  return axios.request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

/**
 * 角色列表
 */
export const getRoleList = () => {
  return axios.request({
    url: '/roles',
    method: 'get'
  })
}

/**
 * 创建角色信息
 */
export const createRole = input => {
  return axios.request({
    url: '/roles',
    method: 'post',
    data: input
  })
}

/**
 * 修改角色信息
 */
export const updateRole = input => {
  return axios.request({
    url: '/roles',
    method: 'put',
    data: input
  })
}

/**
 * 查询角色信息
 */
export const getRole = ({ id }) => {
  return axios.request({
    url: `/roles/${id}`,
    method: 'get'
  })
}

/**
 * 查询角色信息
 */
export const getRoleAuthorizeTrees = ({ id }) => {
  return axios.request({
    url: `/roles/${id}/authorize/trees`,
    method: 'get'
  })
}
