import parentView from '@/components/parent-view'

export default {
  path: '/argu',
  name: 'argu',
  meta: {
    hideInMenu: true
  },
  component: parentView,
  children: [
    {
      path: 'params/:id',
      name: 'params',
      meta: {
        icon: 'md-flower',
        title: route => `{{ params }}-${route.params.id}`,
        notCache: true,
        beforeCloseName: 'before_close_normal'
      },
      component: () => import('@/view/examples/argu-page/params.vue')
    },
    {
      path: 'query',
      name: 'query',
      meta: {
        icon: 'md-flower',
        title: route => `{{ query }}-${route.query.id}`,
        notCache: true
      },
      component: () => import('@/view/examples/argu-page/query.vue')
    }
  ]
}
