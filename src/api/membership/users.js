import axios from '@/libs/api.request'

/**
 * 用户授权
 */
export const authorizeUser = input => {
  return axios.request({
    url: '/authorize/user',
    method: 'post',
    data: input
  })
}

/**
 * 分页用户列表
 */
export const pageUsers = ({ currentPage, pageSize, keyword }) => {
  return axios.request({
    url: '/page/users',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      keyword
    }
  })
}

/**
 * 删除用户信息
 */
export const deleteUser = ({ id }) => {
  return axios.request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

/**
 * 创建用户信息
 */
export const createUser = input => {
  return axios.request({
    url: '/users',
    method: 'post',
    data: input
  })
}

/**
 * 修改用户信息
 */
export const updateUser = input => {
  return axios.request({
    url: '/users',
    method: 'put',
    data: input
  })
}

/**
 * 查询用户信息
 */
export const getUser = ({ id }) => {
  return axios.request({
    url: `/users/${id}`,
    method: 'get'
  })
}

/**
 * 用户授权树
 */
export const getUserAuthorizeTrees = ({ id }) => {
  return axios.request({
    url: `/users/${id}/authorize/trees`,
    method: 'get'
  })
}

/**
 * 修改密码
 */
export const updateUserPassword = input => {
  return axios.request({
    url: '/update/user/password',
    method: 'post',
    data: input
  })
}

/**
 * 修改用户的信息
 */
export const updateUserInfo = input => {
  return axios.request({
    url: '/userinfo',
    method: 'post',
    data: input
  })
}
