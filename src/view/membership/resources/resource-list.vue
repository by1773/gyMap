<template>
  <Card>
    <Spin fix
          v-if="tableMeta.loadding">
      <Icon type="ios-loading"
            size=30
            class="modal-con-spin-icon-load"></Icon>
      <div>加载中，请稍后...</div>
    </Spin>
    <div class="toolbar">
      <Button type="primary"
              icon="md-add"
              class="table-toolbar"
              v-hasPermission="$access.membership.resource.create"
              @click="onCreate">{{formModal.createButtonText}}</Button>
    </div>
    <tree-table expand-key="name"
                :tree-type="true"
                :expand-type="false"
                :selectable="false"
                :is-fold="false"
                :columns="tableMeta.columns"
                :data="tableMeta.data">
      <template slot="icon"
                slot-scope="scope">
        <Icon :type="scope.row.icon ? scope.row.icon : 'md-menu'" />
      </template>
      <template slot="isAuthorize"
                slot-scope="scope">
        <Icon :type="scope.row.isAuthorize ? 'md-checkmark-circle' : 'md-remove-circle'" />
      </template>
      <template slot="isMenu"
                slot-scope="scope">
        <Icon :type="scope.row.isMenu ? 'md-checkmark-circle' : 'md-remove-circle'" />
      </template>
      <template slot="isSysRes"
                slot-scope="scope">
        <Icon :type="scope.row.isSysRes ? 'md-checkmark-circle' : 'md-remove-circle'" />
      </template>
      <template slot="action"
                slot-scope="scope">
        <action :value="tableMeta.action"
                :attr="scope"
                @click="onAction"></action>
      </template>
    </tree-table>
    <Modal v-model="formModal.show"
           :title="formModal.title"
           :width="formModal.width"
           :mask-closable="false"
           class="modal-form">
      <Form :ref="formModal.name"
            :model="formModal.model"
            :rules="formModal.component"
            label-position="top">
        <FormItem :label="formModal.component.id.label"
                  :prop="formModal.component.id.prop">
          <Tooltip content="资源标识设置后不允许修改！"
                   style="width:100%"
                   placement="top-start">
            <Input v-model="formModal.model.id"
                   :readonly="!formModal.isCreator"
                   :placeholder="formModal.component.id.placeholder" />
          </Tooltip>
        </FormItem>
        <FormItem :label="formModal.component.name.label"
                  :prop="formModal.component.name.prop">
          <Input v-model="formModal.model.name"
                 :placeholder="formModal.component.name.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.icon.label"
                  :prop="formModal.component.icon.prop">
          <icons-input v-model="formModal.model.icon"></icons-input>
        </FormItem>
        <FormItem :label="formModal.component.parentId.label">
          <Cascader :data="tableMeta.data"
                    style="width:300px"
                    change-on-select
                    v-model="formModal.model.paths"></Cascader>
        </FormItem>
        <FormItem :label="formModal.component.routerId.label"
                  :prop="formModal.component.routerId.prop">
          <Input v-model="formModal.model.routerId"
                 :placeholder="formModal.component.routerId.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.sortValue.label">
          <InputNumber :min="0"
                       v-model="formModal.model.sortValue"
                       :placeholder="formModal.component.sortValue.placeholder"></InputNumber>
        </FormItem>
        <FormItem :label="formModal.component.url.label"
                  :prop="formModal.component.url.prop">
          <Input v-model="formModal.model.url"
                 :placeholder="formModal.component.url.placeholder" />
        </FormItem>
        <FormItem label="选项">
          <Checkbox v-model="formModal.model.isAuthorize">
            {{formModal.component.isAuthorize.label}}</Checkbox>
          <Checkbox v-model="formModal.model.isMenu">
            {{formModal.component.isMenu.label}}</Checkbox>
        </FormItem>
        <FormItem :label="formModal.component.summary.label">
          <Input v-model="formModal.model.summary"
                 type="textarea"
                 :autosize="{minRows: 3,maxRows: 8}"
                 :placeholder="formModal.component.summary.placeholder" />
        </FormItem>
      </Form>
      <Spin fix
            v-if="formModal.loading">
        <Icon type="ios-loading"
              size=30
              class="modal-con-spin-icon-load"></Icon>
        <div>{{formModal.loaddingText}}</div>
      </Spin>
      <div slot="footer">
        <Button type="primary"
                @click="formSave">保存</Button>
        <Button @click="formReset">取消</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
import { mapMutations } from 'vuex'
import { mapTree } from '@/libs/util'
import Action from '_c/action'
import SimpleTable from '_c/simple-table'
import IconsInput from '_c/icons-input'
import { getResourceTreeList, deleteResource, createResource, updateResource, getResource } from '@/api/membership/resources'
export default {
  name: 'Resource',
  components: {
    Action,
    SimpleTable,
    IconsInput
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '资源名字', key: 'name', minWidth: 130 },
          { title: '图标', key: 'icon', type: 'template', template: 'icon', minWidth: 40, align: 'center', headerAlign: 'center' },
          // { title: '资源标识', key: 'id', minWidth: 80, align: 'center', headerAlign: 'center' },
          { title: '路由标识', key: 'routerId', minWidth: 100, align: 'center', headerAlign: 'center' },
          { title: '授权', key: 'isAuthorize', minWidth: 40, type: 'template', template: 'isAuthorize', align: 'center', headerAlign: 'center' },
          { title: '菜单', key: 'isMenu', minWidth: 40, type: 'template', template: 'isMenu', align: 'center', headerAlign: 'center' },
          { title: '系统', key: 'isSysRes', minWidth: 40, type: 'template', template: 'isSysRes', align: 'center', headerAlign: 'center' },
          { title: '排序', key: 'sortValue', minWidth: 40, align: 'center', headerAlign: 'center' },
          { title: '添加人', key: 'createdBy', width: 60 },
          { title: '添加时间', key: 'createdDate', width: 150 },
          { title: '修改人', key: 'modifiedBy', width: 60 },
          { title: '修改时间', key: 'modifiedDate', width: 150 },
          { title: '备注', key: 'summary', minWidth: 200 },
          {
            title: '操作',
            key: 'action',
            type: 'template',
            minWidth: 130,
            align: 'center',
            template: 'action',
            headerAlign: 'center'
          }
        ],
        action: [
          { key: 'update', name: '编辑', icon: 'md-create', access: this.$access.membership.resource.update },
          { key: 'permission', name: '权限管理', icon: 'md-trash', access: this.$access.membership.resource.permission },
          { key: 'delete', name: '删除', icon: 'md-trash', access: this.$access.membership.resource.delete }
        ],
        searcher: true,
        searchPlaceholder: '资源名字、路由标识',
        data: [],
        current: 1,
        total: 0,
        pageSize: 10,
        loadding: false
      },
      formModal: {
        show: false,
        isCreator: true,
        loading: false,
        loaddingText: '加载中，请稍后...',
        createButtonText: '添加资源',
        title: '添加资源',
        width: 900,
        name: 'resourceForm',
        model: {
          icon: '',
          id: '',
          isAuthorize: false,
          isMenu: false,
          name: '',
          parentId: '',
          paths: [],
          routerId: '',
          sortValue: 0,
          summary: '',
          url: ''
        },
        component: {
          id: { label: '资源标识', prop: 'id', placeholder: '请输入资源标识', required: true, message: '资源标识必填', trigger: 'blur' },
          icon: { label: '图标', prop: 'icon' },
          isAuthorize: { label: '授权', prop: 'isAuthorize', required: true },
          isMenu: { label: '菜单', prop: 'isMenu' },
          name: { label: '资源名字', prop: 'name', placeholder: '请输入资源名字', required: true, message: '资源名字必填', trigger: 'blur' },
          parentId: { label: '父级资源', prop: 'parentId', placeholder: '请选择资源标识' },
          routerId: { label: '路由标识', prop: 'routerId', placeholder: '请输入路由标识' },
          sortValue: { label: '排序', prop: 'sortValue', placeholder: '请输入排序' },
          url: { label: 'url地址', prop: 'url', placeholder: '请输入url地址' },
          summary: { label: '备注', prop: 'summary', placeholder: '请输入备注信息' }
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 表单重置
    formReset () {
      this.$refs[this.formModal.name].resetFields()
      this.formModal.model.icon = ''
      this.formModal.model.id = ''
      this.formModal.model.isAuthorize = false
      this.formModal.model.isMenu = false
      this.formModal.model.name = ''
      this.formModal.model.parentId = ''
      this.formModal.model.paths = []
      this.formModal.model.routerId = ''
      this.formModal.model.sortValue = 0
      this.formModal.model.summary = ''
      this.formModal.model.url = ''
      this.formModal.show = false
    },
    // 加载数据
    loadData () {
      this.tableMeta.loadding = true
      getResourceTreeList().then(({ data }) => {
        mapTree(data, null, (node) => {
          node.value = node.id
          node.label = node.name
        })
        this.tableMeta.data = data
        this.tableMeta.loadding = false
      }).catch(res => {
        this.tableMeta.loadding = false
      })
    },
    // 表单保存
    formSave () {
      this.$refs[this.formModal.name].validate((valid) => {
        if (valid) {
          this.formModal.loading = true
          this.formModal.loaddingText = '正在保存，请稍后...'
          if (this.formModal.model.paths && this.formModal.model.paths.length > 0) {
            this.formModal.model.parentId = this.formModal.model.paths[this.formModal.model.paths.length - 1]
          } else {
            this.formModal.model.parentId = null
          }
          if (this.formModal.isCreator) {
            createResource(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          } else {
            updateResource(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          }
        } else {
          this.formModal.show = true
          this.$Message.error('表单验证失败!')
          return false
        }
      })
    },
    // Action
    onAction (key, { row }) {
      switch (key) {
        case 'update':
          this.onUpdate(row.id)
          break
        case 'delete':
          this.onDelete(row.id)
          break
        case 'permission':
          this.$router.push({
            name: 'permission',
            query: {
              resourceId: row.id,
              resourceName: row.name
            }
          })
          break
      }
    },
    // 添加
    onCreate () {
      this.formReset()
      this.formModal.isCreator = true
      this.formModal.title = '添加资源'
      this.formModal.paths = []
      this.formModal.show = true
    },
    // 修改
    onUpdate (id) {
      this.formModal.isCreator = false
      this.formModal.show = true
      this.formModal.title = '编辑资源'
      this.formModal.loading = true
      this.formModal.loaddingText = '正在加载数据中...'
      getResource({ id }).then(({ data }) => {
        this.formModal.model = data
        this.formModal.model.paths = data.paths.slice(0, data.paths.length - 1)
        this.formModal.loading = false
      }).catch(res => {
        this.formModal.loading = false
      })
    },
    // 删除
    onDelete (id) {
      this.$Modal.confirm({
        title: '删除资源？',
        content: '<p>确定要删除资源吗？</p>',
        onOk: () => {
          this.$Spin.show()
          deleteResource({ id }).then(res => {
            this.$Message.success('删除成功!')
            this.$Spin.hide()
            this.loadData()
          }).catch(res => {
            this.$Spin.hide()
          })
        },
        onCancel: () => {
        }
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
<style>
.toolbar {
  margin: 0px 0px 15px;
}
.modal-form .ivu-modal-footer {
  text-align: left;
}
.modal-con-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.zk-table__body tr.zk-table__body-row {
  height: 40px;
}
</style>
