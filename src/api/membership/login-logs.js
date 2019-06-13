import axios from '@/libs/api.request'

/**
 * 导出登录日志数据
 */
export const exportLoginLogs = ({ beginDate, endDate }) => {
  return axios.request({
    url: '/export/login/logs',
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
export const clearLoginLogs = () => {
  return axios.request({
    url: '/login/logs',
    method: 'delete'
  })
}

/**
 * 分页登录日志列表
 */
export const pageLoginLogs = ({
  currentPage,
  pageSize,
  beginDate,
  endDate
}) => {
  return axios.request({
    url: '/page/login/logs',
    method: 'get',
    params: {
      currentPage,
      pageSize,
      beginDate,
      endDate
    }
  })
}
