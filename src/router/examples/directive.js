import parentView from '@/components/parent-view'

export default {
  path: '/directive',
  name: 'directive',
  meta: {
    hideInBread: true
  },
  component: parentView,
  children: [
    {
      path: 'directive_page',
      name: 'directive_page',
      meta: {
        icon: 'ios-navigate',
        title: '指令'
      },
      component: () => import('@/view/examples/directive/directive.vue')
    }
  ]
}
