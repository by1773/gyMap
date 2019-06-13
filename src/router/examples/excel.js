import parentView from '@/components/parent-view'

export default {
  path: '/excel',
  name: 'excel',
  meta: {
    icon: 'ios-stats',
    title: 'EXCEL导入导出'
  },
  component: parentView,
  children: [
    {
      path: 'upload-excel',
      name: 'upload-excel',
      meta: {
        icon: 'md-add',
        title: '导入EXCEL'
      },
      component: () => import('@/view/examples/excel/upload-excel.vue')
    },
    {
      path: 'export-excel',
      name: 'export-excel',
      meta: {
        icon: 'md-download',
        title: '导出EXCEL'
      },
      component: () => import('@/view/examples/excel/export-excel.vue')
    }
  ]
}
