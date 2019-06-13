import parentView from '@/components/parent-view'

export default {
  path: '/update',
  name: 'update',
  meta: {
    icon: 'md-cloud-upload',
    title: '数据上传'
  },
  component: parentView,
  children: [
    {
      path: 'update_table_page',
      name: 'update_table_page',
      meta: {
        icon: 'ios-document',
        title: '上传Csv'
      },
      component: () => import('@/view/examples/update/update-table.vue')
    },
    {
      path: 'update_paste_page',
      name: 'update_paste_page',
      meta: {
        icon: 'md-clipboard',
        title: '粘贴表格数据'
      },
      component: () => import('@/view/examples/update/update-paste.vue')
    }
  ]
}
