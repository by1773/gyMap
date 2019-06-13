import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  mapTree
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
import Main from '@/components/main'
import parentView from '@/components/parent-view'

const { homeName } = config

const closePage = (state, route) => {
  let nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  if (!nextRoute) {
    nextRoute = getHomeRoute(routers)
  }
  router.push(nextRoute)
}

const initRouters = (menus, router) => {
  mapTree(menus, (node, parent) => {
    if (!node.parentId) {
      if (node.children && node.children.length > 0) {
        node.component = Main
      }
    } else {
      if (node.children && node.children.length > 0) {
        node.component = parentView
      }
    }
    if (!node.children || node.children.length === 0) {
      node.component = () => import(`@/view${node.url}.vue`)
    }
  })
  router.options.routes.push(...menus)
  router.addRoutes(menus)
}

export default {
  state: {
    breadCrumbList: [],
    bigScreen: false,
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    bigScreen: state => state.bigScreen,
    menuList: (state, getters, rootState) =>
      getMenuByRouter(routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBigScreen (state, bool) {
      state.bigScreen = bool
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    // 初始化用户菜单
    handleUserMenus ({ rootState, dispatch }, router) {
      return new Promise((resolve, reject) => {
        try {
          if (rootState.user.menus && rootState.user.menus.length > 0) {
            // 缓存中获取菜单信息
            initRouters(rootState.user.menus, router)
            resolve(rootState.user.menus)
          } else {
            dispatch('getUserMenus', { root: true }).then(menus => {
              // 服务端中获取菜单信息
              console.log(menus)
              initRouters(menus, router)
              resolve(menus)
            })
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    // 添加错误信息
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) {
        commit('setHasReadErrorLoggerStatus', false)
      }
      const {
        user: { token, userId, userName }
      } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    }
  }
}
