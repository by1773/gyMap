<template>
  <span>
    <Input v-model="iconName"
           placeholder="请选择图标"
           :icon="iconName"
           style="width:80%" />
    <Button type="primary"
            shape="circle"
            icon="ios-search"
            size="small"
            style="margin-left:10px;"
            @click="onOpenSelector()"></Button>
    <Modal title="图标选择器"
           v-model="iconSelectorModel.show"
           :mask-closable="false"
           width="804"
           :footer-hide="true"
           :scrollable="true">
      <icons-selector @on-select="onSelectIcon"></icons-selector>
    </Modal>
  </span>
</template>
<script>
import IconsSelector from '_c/icons-selector'
export default {
  name: 'IconsInput',
  components: {
    IconsSelector
  },
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      iconSelectorModel: {
        show: false
      },
      iconName: ''
    }
  },
  methods: {
    onOpenSelector () {
      this.iconSelectorModel.show = true
    },
    onSelectIcon (type) {
      this.iconName = type.name
      this.iconSelectorModel.show = false
    }
  },
  watch: {
    value (newVal) {
      this.iconName = newVal
    },
    iconName (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
