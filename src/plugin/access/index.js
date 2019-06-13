import access from '@/access'
export default {
  install (Vue, options) {
    access.config = options
    Vue.prototype.$access = access
  }
}
