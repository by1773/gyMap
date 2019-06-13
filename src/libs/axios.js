import axios from 'axios'
import store from '@/store'
import router from '@/router'
import iView from 'iview'

const showError = error => {
  if (error) {
    iView.Message.error(error)
  }
}

const showInfo = error => {
  if (error) {
    iView.Message.info(error)
  }
}

const addErrorLog = errorInfo => {
  const {
    isAjax,
    result,
    success,
    targetUrl,
    unAuthorizedRequest,
    error: { code, details, message, validationErrors }
  } = errorInfo
  errorInfo = Object.assign(
    {
      isAjax,
      result,
      success,
      targetUrl,
      unAuthorizedRequest,
      code,
      details,
      message,
      validationErrors
    },
    errorInfo
  )
  if (!errorInfo.url.includes('save_error_logger')) {
    store.dispatch('addErrorLog', errorInfo)
  }
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // headers
      }
    }
    // 如果token存在，则附加到请求头上
    if (store.state.user.token) {
      config.headers.authorization = store.state.user.token
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)

        const { data, status, headers } = res
        if (data) {
          if (data.success) {
            return { data: data.result, status, headers }
          } else {
            if (data.error) {
              showInfo(data.error.message)
              return Promise.reject(data.error)
            }
          }
        }
        return { data, status, headers }
      },
      error => {
        if (!error.response) {
          showError(error.message)
          return
        }

        this.destroy(url)

        const { data, status, request } = error.response
        let errorInfo = { status, url: request.responseURL }

        if (data && !data.success) {
          showError(data.error.message)
          errorInfo = Object.assign(data, errorInfo)
        } else {
          showError('未知错误！')
        }

        // 添加错误日志
        addErrorLog(errorInfo)

        // 登录跳转
        if (status === 401) {
          store.dispatch('handleLogOut').then(() => {
            router.push({
              name: 'login'
            })
          })
        }
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
