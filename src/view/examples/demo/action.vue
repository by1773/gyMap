<template>
  <Card style="heigth:400px">
    <h2 style="margin-bottom:30px">使用方式：</h2>
    <action :value="data"
            @click="onClick"></action>
    <Button @click="onRender"
            type="primary"
            size="small"
            style="margin-left:30px;">render 模式</Button>
  </Card>
</template>
<script>
import Action from '_c/action'
export default {
  components: {
    Action
  },
  data () {
    return {
      data: [
        { key: 'delete', name: '删除', icon: 'md-trash' }
      ]
    }
  },
  methods: {
    onRender () {
      this.$Modal.confirm({
        render: (h) => {
          return h(Action, {
            props: {
              value: [
                { key: 'delete', name: '删除', icon: 'md-trash' }
              ]
            },
            on: {
              click: (key) => {
                this.onClick(key)
              }
            }
          })
        }
      })
    },
    onClick (key) {
      this.$Message.info('当前选择的KEY:' + key)
    }
  },
  mounted () {
  }
}
</script>
