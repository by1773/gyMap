import parentView from '@/components/parent-view'

export default {
  path: '/multilevel',
  name: 'multilevel',
  meta: {
    icon: 'md-menu',
    title: '多级菜单'
  },
  component: parentView,
  children: [
    {
      path: 'level_2_1',
      name: 'level_2_1',
      meta: {
        icon: 'md-funnel',
        title: '二级-1'
      },
      component: () => import('@/view/examples/multilevel/level-2-1.vue')
    },
    {
      path: 'level_2_2',
      name: 'level_2_2',
      meta: {
        access: ['super_admin'],
        icon: 'md-funnel',
        showAlways: true,
        title: '二级-2'
      },
      component: parentView,
      children: [
        {
          path: 'level_2_2_1',
          name: 'level_2_2_1',
          meta: {
            icon: 'md-funnel',
            title: '三级'
          },
          component: () =>
            import('@/view/examples/multilevel/level-2-2/level-2-2-1.vue')
        },
        {
          path: 'level_2_2_2',
          name: 'level_2_2_2',
          meta: {
            icon: 'md-funnel',
            title: '三级'
          },
          component: () =>
            import('@/view/examples/multilevel/level-2-2/level-2-2-2.vue')
        }
      ]
    },
    {
      path: 'level_2_3',
      name: 'level_2_3',
      meta: {
        icon: 'md-funnel',
        title: '二级-3'
      },
      component: () => import('@/view/examples/multilevel/level-2-3.vue')
    }
  ]
}
