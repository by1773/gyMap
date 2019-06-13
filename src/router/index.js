import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle, getRoute } from '@/libs/util'
import config from '@/config'
import examples from '@/router/examples'

const { homeName } = config

Vue.use(Router)

// 根据环境变量决定是否导入 示例、文档
if (process.env.NODE_ENV !== 'production') {
  // routes.push({
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: 'iview-admin 文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // })
  routes.push({
    path: '/',
    name: 'cesium',
    redirect: '/cesium',
    meta: {
      icon: 'md-menu',
      title: 'cesium'
    },
    component: () => import('@/components/main'),
    children: [
      {
        path: 'cesium',
        name: 'cesium',
        meta: {
          access: ['admin'],
          hideInBread: true,
          hideInMenu: true,
          icon: 'ios-bug',
          title: 'cesium'
        },
        component: () => import('@/view/cesium/ecology')
      }
    ]
  })
  routes.push(examples)
}

const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) {
    // 有权限，可访问
    next()
  } else {
    // 无权限，重定向到401页面
    next({ replace: true, name: 'error_401' })
  }
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store
        .dispatch('getUserInfo')
        .then(user => {
          store.dispatch('handleUserMenus', router).then(routers => {
            // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;a
            // ccess必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
            const route = getRoute(routers, to.path)
            if (route) {
              if (to.query) {
                route.query = to.query
              }
              router.push(route)
            } else {
              turnTo(to, [user.username], next)
            }
          })
        })
        .catch(() => {
          setToken('')
          next({
            name: 'login'
          })
        })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
