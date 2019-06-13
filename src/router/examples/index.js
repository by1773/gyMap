import Main from '@/components/main'

import argu_page from './argu-page'
import components from './components'
import directive from './directive'
import excel from './excel'
import i18n from './i18n'
import multilevel from './multilevel'
import tools_methods from './tools-methods'
import update from './update'
import error_store from './error-store'
import demo from './demo'

export default {
  path: '/examples',
  name: 'examples',
  meta: {
    icon: 'md-menu',
    title: '示例组件'
  },
  component: Main,
  children: [
    argu_page,
    components,
    directive,
    excel,
    i18n,
    multilevel,
    tools_methods,
    update,
    error_store,
    demo
  ]
}
