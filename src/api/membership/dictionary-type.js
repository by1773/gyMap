import axios from '@/libs/api.request'

/**
 * 分页字典类型列表
 */
export const pageDictionariesTypes = ({ currentPage, pageSize, keyword }) => {
  return axios.request({
    url: '/page/dictionaries/types',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      keyword
    }
  })
}

/**
 * 删除字典类型信息
 */
export const deleteDictionariesType = ({ id }) => {
  return axios.request({
    url: `/dictionaries/types/${id}`,
    method: 'delete'
  })
}

/**
 * 创建字典类型信息
 */
export const createDictionariesType = input => {
  return axios.request({
    url: '/dictionaries/types',
    method: 'post',
    data: input
  })
}

/**
 * 修改字典类型信息
 */
export const updateDictionariesType = input => {
  return axios.request({
    url: '/dictionaries/types',
    method: 'put',
    data: input
  })
}

/**
 * 查询字典类型信息
 */
export const getDictionariesType = ({ id }) => {
  return axios.request({
    url: `/dictionaries/types/${id}`,
    method: 'get'
  })
}

/**
 * 查询所有字典类型信息
 */
export const getAllList = () => {
  return axios.request({
    url: `/dictionaries/types`,
    method: 'get'
  })
}
