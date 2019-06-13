import parentView from '@/components/parent-view'

export default {
  path: '/tools_methods',
  name: 'tools_methods',
  meta: {
    hideInBread: true
  },
  component: parentView,
  children: [
    {
      path: 'tools_methods_page',
      name: 'tools_methods_page',
      meta: {
        icon: 'ios-hammer',
        title: '工具方法',
        beforeCloseName: 'before_close_normal'
      },
      component: () => import('@/view/examples/tools-methods/tools-methods.vue')
    }
  ]
}
