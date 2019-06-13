/**
 * 自定义权限控制指令
 * 示例：
 *  <Button v-hasPermission="'add'">添加</Button>
 */
import { hasPermission } from '@/libs/util'

export default {
  bind: (el, binding, vnode) => {
    if (!hasPermission(vnode.context, binding.value)) {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      } else {
        el.disabled = true
        el.style.display = 'none'
      }
    }
  }
}
