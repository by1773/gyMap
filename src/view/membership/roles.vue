<template>
  <Card>
    <simple-table :columns="tableMeta.columns"
                  :data="tableMeta.data"
                  :total="tableMeta.total"
                  :rows="tableMeta.rows"
                  :page="tableMeta.page"
                  :loading="tableMeta.loadding"
                  :showSearcher="tableMeta.searcher"
                  :searchPlaceholder="tableMeta.searchPlaceholder"
                  @on-search="onSearch"
                  @on-page-change="onPage">
      <Button type="primary"
              icon="md-add"
              class="table-toolbar"
              v-hasPermission="$access.membership.role.create"
              @click="onCreate">{{formModal.createButtonText}}</Button>
    </simple-table>
    <Modal v-model="formModal.show"
           :title="formModal.title"
           :width="formModal.width"
           :mask-closable="false"
           class="modal-form">
      <Form :ref="formModal.name"
            :model="formModal.model"
            :rules="formModal.component"
            label-position="top">
        <FormItem :label="formModal.component.name.label"
                  :prop="formModal.component.name.prop">
          <Input v-model="formModal.model.name"
                 :placeholder="formModal.component.name.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.identity.label"
                  :prop="formModal.component.identity.prop">
          <Input v-model="formModal.model.identity"
                 :placeholder="formModal.component.identity.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.summary.label">
          <Input v-model="formModal.model.summary"
                 type="textarea"
                 style="height: 93px; min-height: 52px; max-height: 115px; overflow-y: hidden; margin-top: 0px; margin-bottom: 0px;"
                 :autosize="{minRows: 2,maxRows: 5}"
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
    <Modal v-model="authorizeModal.show"
           :title="authorizeModal.title"
           :width="authorizeModal.width"
           :mask-closable="false"
           class="modal-form">
      <div style="max-height: 400px;overflow: auto;">
        <Tree :data="authorizeModal.data"
              show-checkbox
              @on-check-change="onCheckChange"></Tree>
        <Spin fix
              v-if="authorizeModal.loading">
          <Icon type="ios-loading"
                size=30
                class="modal-con-spin-icon-load"></Icon>
          <div>{{authorizeModal.loadingText}}</div>
        </Spin>
      </div>
      <div slot="footer">
        <Button type="primary"
                @click="onAuthorizeSave">保存</Button>
        <Button @click="onAuthorizeReset">重置</Button>
        <Button @click="onAuthorizeClose">取消</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
import { mapTree } from '@/libs/util'
import Action from '_c/action'
import SimpleTable from '_c/simple-table'
import {
  authorizeRole, getRoleAuthorizeTrees,
  pageRoles, deleteRoles, createRole, updateRole, getRole } from '@/api/membership/roles'
export default {
  name: 'Role',
  components: {
    Action,
    SimpleTable
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '#', key: 'id', width: 80 },
          { title: '角色名字', key: 'name', minWidth: 90 },
          { title: '标识', key: 'identity', minWidth: 90 },
          { title: '添加人', key: 'createdBy', width: 80 },
          { title: '添加时间', key: 'createdDate', width: 150 },
          { title: '修改人', key: 'modifiedBy', width: 80 },
          { title: '修改时间', key: 'modifiedDate', width: 150 },
          { title: '备注', key: 'summary', minWidth: 400 },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            fixed: 'right',
            render: (h, { row }) => {
              return h('div', [h(Action, {
                props: {
                  value: [
                    { key: 'update', name: '编辑', icon: 'md-create', access: this.$access.membership.role.update },
                    { key: 'delete', name: '删除', icon: 'md-trash', access: this.$access.membership.role.delete },
                    { key: 'authorize', name: '授权', icon: 'md-hammer', access: this.$access.membership.role.update }
                  ]
                },
                on: {
                  click: (key) => {
                    switch (key) {
                      case 'update':
                        this.onUpdate(row.id)
                        break
                      case 'delete':
                        this.onDelete(row.id)
                        break
                      case 'authorize':
                        this.onAuthorize(row.id)
                        break
                    }
                  }
                }
              })])
            }
          }
        ],
        searcher: true,
        searchPlaceholder: '角色名字',
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
        createButtonText: '添加角色',
        title: '添加角色',
        width: 500,
        name: 'roleForm',
        model: {
          name: '',
          identity: '',
          summary: ''
        },
        component: {
          name: { label: '角色名字', prop: 'name', placeholder: '请输入角色名字', required: true, message: '角色名字必填', trigger: 'blur' },
          identity: { label: '标识', prop: 'identity', placeholder: '请输入标识', required: true, message: '标识必填', trigger: 'blur' },
          summary: { label: '备注', prop: 'summary', placeholder: '请输入备注信息' }
        }
      },
      authorizeModal: {
        show: false,
        title: '角色授权',
        width: 700,
        loading: false,
        loadingText: '正在加载权限信息,请稍后...',
        authorizeId: 0,
        data: [],
        values: []
      }
    }
  },
  methods: {
    // 表单重置
    formReset () {
      this.$refs[this.formModal.name].resetFields()
      this.formModal.show = false
    },
    // 加载数据
    loadData (page, keyword) {
      page = page || 1
      let input = {
        currentPage: page
      }
      if (keyword) {
        input.keyword = keyword
      }
      this.tableMeta.loadding = true
      pageRoles(input).then(({ data }) => {
        this.tableMeta.current = data.currentPage
        this.tableMeta.total = data.totalCount
        this.tableMeta.pageSize = data.pageSize
        this.tableMeta.data = data.items
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
          if (this.formModal.isCreator) {
            createRole(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          } else {
            updateRole(this.formModal.model).then(res => {
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
    // 授权
    onAuthorize (id) {
      this.authorizeModal.loading = true
      this.authorizeModal.loadingText = '正在加载权限信息，请稍后...'
      this.authorizeModal.show = true
      getRoleAuthorizeTrees({ id }).then(({ data }) => {
        mapTree(data, (node, parent) => {
          node.checked = node.isGranted
          node.expand = true
          node.title = node.name
          if (node.children && node.children.length === 0) {
            node.children = node.permissions
            node.children.forEach(item => {
              item.isPermission = true
              item.checked = item.isGranted
            })
          }
        })
        this.authorizeModal.authorizeId = id
        this.authorizeModal.data = data
        this.authorizeModal.loading = false
      }).catch(res => {
        this.authorizeModal.loading = false
      })
    },
    // 授权重置
    onAuthorizeReset () {
      mapTree(this.authorizeModal.data, (node) => {
        node.checked = false
      })
      this.authorizeModal.values = []
    },
    // 授权关闭
    onAuthorizeClose () {
      this.authorizeModal.data = []
      this.authorizeModal.show = false
      this.authorizeModal.values = []
    },
    // 选中切换
    onCheckChange (values, item) {
      this.authorizeModal.values = values
    },
    // 授权保存
    onAuthorizeSave () {
      let input = {
        id: this.authorizeModal.authorizeId,
        permissionIds: []
      }
      this.authorizeModal.values.forEach(item => {
        if (item && item.isPermission) {
          input.permissionIds.push(item.id)
        }
      })
      this.authorizeModal.loading = true
      this.authorizeModal.loadingText = '正在保存权限信息，请稍后...'
      authorizeRole(input).then(res => {
        this.$Message.success('授权成功!')
        this.authorizeModal.loading = false
        this.authorizeModal.show = false
      }).catch(res => {
        this.authorizeModal.loading = false
      })
    },
    // 分页切换
    onPage (page, keyword) {
      this.loadData(page, keyword)
    },
    // 搜索
    onSearch (keyword) {
      if (keyword) {
        this.loadData(1, keyword)
      } else {
        this.loadData()
      }
    },
    // 添加
    onCreate () {
      this.formReset()
      this.formModal.isCreator = true
      this.formModal.title = '添加角色'
      this.formModal.show = true
    },
    // 修改
    onUpdate (id) {
      this.formModal.isCreator = false
      this.formModal.show = true
      this.formModal.title = '编辑角色'
      this.formModal.loading = true
      this.formModal.loaddingText = '正在加载数据中...'
      getRole({ id }).then(({ data }) => {
        this.formModal.model = data
        this.formModal.loading = false
      }).catch(res => {
        this.formModal.loading = false
      })
    },
    // 删除
    onDelete (id) {
      this.$Modal.confirm({
        title: '删除角色？',
        content: '<p>确定要删除角色吗？</p>',
        onOk: () => {
          this.$Spin.show()
          deleteRoles({ id }).then(res => {
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
.table-toolbar {
  margin-left: 10px;
}
.modal-form .ivu-modal-footer {
  text-align: left;
}
.modal-con-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>
