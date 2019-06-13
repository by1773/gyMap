import parentView from '@/components/parent-view'

export default {
  path: '/i18n',
  name: 'i18n',
  meta: {
    hideInBread: true
  },
  component: parentView,
  children: [
    {
      path: 'i18n_page',
      name: 'i18n_page',
      meta: {
        icon: 'md-planet',
        title: 'i18n - {{ i18n_page }}'
      },
      component: () => import('@/view/examples/i18n/i18n-page.vue')
    }
  ]
}
