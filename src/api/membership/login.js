import axios from '@/libs/api.request'

/**
 * 登录
 */
export const login = ({ userName, password }) => {
  return axios.request({
    url: '/login',
    method: 'post',
    data: {
      username: userName,
      password
    }
  })
}

/**
 * 菜单列表
 */
export const getUserMenus = () => {
  return axios.request({
    url: '/menus',
    method: 'get'
  })
}

/**
 * 登录用户的信息
 */
export const getUserInfo = () => {
  return axios.request({
    url: '/userinfo',
    method: 'get'
  })
}
