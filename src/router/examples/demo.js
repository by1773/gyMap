import parentView from '@/components/parent-view'

export default {
  path: '/demo',
  name: 'demo',
  meta: {
    icon: 'ios-bug',
    title: '{{ demo }}'
  },
  component: parentView,
  children: [
    {
      path: 'action',
      name: 'demo_action',
      meta: {
        access: ['admin'],
        hideInBread: true,
        hideInMenu: true,
        icon: 'ios-bug',
        title: '{{ demo_action }}'
      },
      component: () => import('@/view/examples/demo/action.vue')
    },
    {
      path: 'simple-table',
      name: 'simple_table',
      meta: {
        icon: 'ios-bug',
        title: '{{ simple_table }}'
      },
      component: () => import('@/view/examples/demo/simple-table.vue')
    }
  ]
}
