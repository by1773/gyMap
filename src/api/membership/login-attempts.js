import axios from '@/libs/api.request'

/**
 * 导出登录尝试数据
 */
export const exportLoginAttempts = ({ beginDate, endDate }) => {
  return axios.request({
    url: '/export/login/attempts',
    method: 'get',
    params: {
      beginDate,
      endDate
    },
    responseType: 'blob'
  })
}

/**
 * 清空所有的日志
 */
export const clearLoginAttempts = () => {
  return axios.request({
    url: '/login/attempts',
    method: 'delete'
  })
}

/**
 * 分页登录尝试日志列表
 */
export const pageLoginAttempts = ({
  currentPage,
  pageSize,
  beginDate,
  endDate
}) => {
  return axios.request({
    url: '/page/login/attempts',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      beginDate,
      endDate
    }
  })
}
