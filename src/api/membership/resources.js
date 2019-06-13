import axios from '@/libs/api.request'

/**
 * 获取树列表
 */
export const getResourceTreeList = () => {
  return axios.request({
    url: '/resources/trees',
    method: 'get'
  })
}

/**
 * 删除资源信息
 */
export const deleteResource = ({ id }) => {
  return axios.request({
    url: `/resources/${id}`,
    method: 'delete'
  })
}

/**
 * 创建资源信息
 */
export const createResource = input => {
  return axios.request({
    url: '/resources',
    method: 'post',
    data: input
  })
}

/**
 * 修改资源信息
 */
export const updateResource = input => {
  return axios.request({
    url: '/resources',
    method: 'put',
    data: input
  })
}

/**
 * 查询资源信息
 */
export const getResource = ({ id }) => {
  return axios.request({
    url: `/resources/${id}`,
    method: 'get'
  })
}

/**
 * 查询子节点列表
 */
export const getChildrenResources = ({ id }) => {
  return axios.request({
    url: `/resources/${id}/children`,
    method: 'get'
  })
}
