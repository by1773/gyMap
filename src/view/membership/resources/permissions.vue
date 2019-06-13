<template>
  <Card :bordered="false">
    <p slot="title">{{resourceName}} - 权限管理</p>
    <Button type="primary"
            icon="md-arrow-round-back"
            slot="extra"
            @click="onBack">返回</Button>
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
              v-hasPermission="$access.membership.permission.create"
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
        <FormItem :label="formModal.component.resourceName.label">
          <Tooltip content="资源名字自动设置！"
                   style="width:100%"
                   placement="top-start">
            <Input v-model="resourceName"
                   readonly />
          </Tooltip>
        </FormItem>
        <FormItem :label="formModal.component.privilege.label"
                  :prop="formModal.component.privilege.prop">
          <Tooltip content="权限代码创建后不能修改！"
                   style="width:100%"
                   placement="top-start">
            <Input v-model="formModal.model.privilege"
                   :readonly="!formModal.isCreator"
                   :placeholder="formModal.component.privilege.placeholder">
            <span slot="prepend">{{formModal.model.resourceId}}_</span>
            </Input>
          </Tooltip>
        </FormItem>
        <FormItem :label="formModal.component.name.label"
                  :prop="formModal.component.name.prop">
          <Input v-model="formModal.model.name"
                 :placeholder="formModal.component.name.placeholder" />
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
  </Card>
</template>
<script>
import Action from '_c/action'
import { mapMutations } from 'vuex'
import SimpleTable from '_c/simple-table'
import { pagePermissions, deletePermission, createPermission, updatePermission, getPermission } from '@/api/membership/permissions'
export default {
  name: 'Permission',
  components: {
    Action,
    SimpleTable
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '#', key: 'id', width: 220 },
          { title: '权限名字', key: 'name', minWidth: 150 },
          // { title: '资源标识', key: 'resourceId', minWidth: 90 },
          // { title: '权限代码', key: 'privilege', minWidth: 90 },
          { title: '添加人', key: 'createdBy', width: 80 },
          { title: '添加时间', key: 'createdDate', width: 150 },
          { title: '备注', key: 'summary', minWidth: 400 },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            fixed: 'right',
            render: (h, { row }) => {
              return h('div', [
                h(Action, {
                  props: {
                    value: [
                      { key: 'update', name: '修改', icon: 'md-create', access: this.$access.membership.permission.update },
                      { key: 'delete', name: '删除', icon: 'md-trash', access: this.$access.membership.permission.delete }
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
                      }
                    }
                  }
                })
              ])
            }
          }
        ],
        searcher: true,
        searchPlaceholder: '权限名字、资源标识、操作',
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
        createButtonText: '添加资源权限',
        title: '添加资源权限',
        width: 700,
        name: 'permissionForm',
        model: {
          name: '',
          privilege: '',
          resourceId: '',
          summary: ''
        },
        component: {
          name: { label: '权限名字', prop: 'name', placeholder: '请输入权限名字', required: true, message: '权限名字必填', trigger: 'blur' },
          privilege: { label: '权限代码(创建后不允许修改)', prop: 'privilege', placeholder: '请输入权限代码', required: true, message: '权限代码必填', trigger: 'blur' },
          resourceName: { label: '资源名字(自动设置)' },
          summary: { label: '备注', prop: 'summary', placeholder: '请输入备注信息' }
        },
        rules: [
        ]
      },
      resourceName: ''
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 加载数据
    loadData (page, keyword) {
      page = page || 1
      let input = {
        currentPage: page
      }
      if (keyword) {
        input.keyword = keyword
      }
      input.resourceId = this.formModal.model.resourceId
      this.tableMeta.loadding = true
      pagePermissions(input).then(({ data }) => {
        this.tableMeta.current = data.currentPage
        this.tableMeta.total = data.totalCount
        this.tableMeta.pageSize = data.pageSize
        this.tableMeta.data = data.items
        this.tableMeta.loadding = false
      }).catch(res => {
        this.tableMeta.loadding = false
      })
    },
    // 表单重置
    formReset () {
      this.$refs[this.formModal.name].resetFields()
      this.formModal.show = false
    },
    // 表单保存
    formSave () {
      this.$refs[this.formModal.name].validate((valid) => {
        if (valid) {
          this.formModal.loading = true
          this.formModal.loaddingText = '正在保存，请稍后...'
          if (this.formModal.isCreator) {
            createPermission(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          } else {
            updatePermission(this.formModal.model).then(res => {
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
    // 返回上一级
    onBack () {
      // 关闭标签
      this.closeTag(this.$route)
      // 路由回退
      this.$router.replace({
        name: 'resource'
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
      this.formModal.title = '添加资源权限'
      this.formModal.show = true
    },
    // 修改
    onUpdate (id) {
      this.formModal.isCreator = false
      this.formModal.show = true
      this.formModal.title = '编辑资源权限'
      this.formModal.loading = true
      this.formModal.loaddingText = '正在加载数据中...'
      getPermission({ id }).then(({ data }) => {
        this.formModal.model = data
        this.formModal.loading = false
      }).catch(res => {
        this.formModal.loading = false
      })
    },
    // 删除
    onDelete (id) {
      this.$Modal.confirm({
        title: '删除资源权限？',
        content: '<p>确定要删除资源权限吗？</p>',
        onOk: () => {
          this.$Spin.show()
          deletePermission({ id }).then(res => {
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
    this.formModal.model.resourceId = this.$route.query.resourceId
    this.resourceName = this.$route.query.resourceName
    if (!this.formModal.model.resourceId) {
      this.$$Message.error('资源标识不存在,重定向到资源列表!')
      this.$router.push({
        name: 'resources'
      })
    }
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
