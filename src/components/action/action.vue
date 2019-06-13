<template>
  <div v-if="showAction">
    <Button style="margin-right:5px;"
            :type="type"
            :icon="button.icon"
            :size="size"
            @click="click">{{button.name}}</Button>
    <Dropdown v-if="data&& data.length>0"
              placement="bottom-start"
              :transfer="true"
              @on-click="click">
      <Button :type="type"
              :size="size">
        {{title}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in data"
                      :name="item.key"
                      :key="item.key">
          <Icon v-if="item.icon"
                :type="item.icon"></Icon>
          {{item.name}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { hasPermission } from '@/libs/util'
export default {
  name: 'Action',
  props: {
    // 操作按钮列表
    value: {
      type: Array,
      default () {
        return []
      }
    },
    // 分组下拉列表标题
    title: {
      type: String,
      default () {
        return '更多'
      }
    },
    // 按钮类型
    type: {
      type: String,
      default () {
        return 'primary'
      }
    },
    // 按钮大小
    size: {
      type: String,
      default () {
        return 'small'
      }
    },
    // 附带属性
    attr: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showAction: false,
      data: [],
      button: {}
    }
  },
  methods: {
    click (key) {
      if (key && typeof key === 'object') {
        key = this.button.key
      }
      this.$emit('click', key, this.attr)
    }
  },
  mounted () {
    const accessData = this.value.filter(item => {
      if (item.access) {
        return hasPermission(this, item.access)
      }
      return true
    })
    this.showAction = accessData.length > 0
    if (this.showAction) {
      this.button = accessData[0]
      this.data = accessData.slice(1, accessData.length)
    }
  }
}
</script>
