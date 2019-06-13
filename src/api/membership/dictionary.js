import axios from '@/libs/api.request'

/**
 * 分页字典列表
 */
export const pageDictionaries = ({ currentPage, pageSize, keyword, dictionaryType }) => {
  return axios.request({
    url: '/page/dictionaries',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      keyword,
      dictionaryType
    }
  })
}

/**
 * 删除字典信息
 */
export const deleteDictionary = ({ id }) => {
  return axios.request({
    url: `/dictionaries/${id}`,
    method: 'delete'
  })
}

/**
 * 创建字典信息
 */
export const createDictionary = input => {
  return axios.request({
    url: '/dictionaries',
    method: 'post',
    data: input
  })
}

/**
 * 修改字典信息
 */
export const updateDictionary = input => {
  return axios.request({
    url: '/dictionaries',
    method: 'put',
    data: input
  })
}

/**
 * 查询字典信息
 */
export const getDictionary = ({ id }) => {
  return axios.request({
    url: `/dictionaries/${id}`,
    method: 'get'
  })
}
