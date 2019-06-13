import axios from '@/libs/api.request'

/**
 * 分页权限列表
 */
export const pagePermissions = ({
  resourceId,
  currentPage,
  pageSize,
  keyword
}) => {
  return axios.request({
    url: '/page/permissions',
    method: 'get',
    params: {
      resourceId,
      currentPage,
      pageSize,
      keyword
    }
  })
}

/**
 * 删除权限信息
 */
export const deletePermission = ({ id }) => {
  return axios.request({
    url: `/permissions/${id}`,
    method: 'delete'
  })
}

/**
 * 创建权限信息
 */
export const createPermission = input => {
  return axios.request({
    url: '/permissions',
    method: 'post',
    data: input
  })
}

/**
 * 修改权限信息
 */
export const updatePermission = input => {
  return axios.request({
    url: '/permissions',
    method: 'put',
    data: input
  })
}

/**
 * 查询权限信息
 */
export const getPermission = ({ id }) => {
  return axios.request({
    url: `/permissions/${id}`,
    method: 'get'
  })
}
