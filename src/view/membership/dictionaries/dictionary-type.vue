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
              v-hasPermission="$access.membership.dictionaryType.create"
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
        <FormItem :label="formModal.component.type.label"
                  :prop="formModal.component.type.prop">
          <Input v-model="formModal.model.type"
                 :placeholder="formModal.component.type.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.name.label"
                  :prop="formModal.component.name.prop">
          <Input v-model="formModal.model.name"
                 :placeholder="formModal.component.name.placeholder" />
        </FormItem>
        <FormItem :label="formModal.component.sortValue.label">
          <InputNumber :min="0"
                       v-model="formModal.model.sortValue"
                       :placeholder="formModal.component.sortValue.placeholder"></InputNumber>
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
import SimpleTable from '_c/simple-table'
import {
  pageDictionariesTypes, deleteDictionariesType,
  createDictionariesType, updateDictionariesType, getDictionariesType } from '@/api/membership/dictionary-type'
export default {
  name: 'DictionaryType',
  components: {
    Action,
    SimpleTable
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '#', key: 'id', width: 80 },
          { title: '字典类型', key: 'type', minWidth: 90 },
          { title: '字典类型名字', key: 'name', minWidth: 90 },
          { title: '排序', key: 'sortValue', minWidth: 90 },
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
                    { key: 'update', name: '编辑', icon: 'md-create', access: this.$access.membership.dictionaryType.update },
                    { key: 'delete', name: '删除', icon: 'md-trash', access: this.$access.membership.dictionaryType.delete }
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
              })])
            }
          }
        ],
        searcher: true,
        searchPlaceholder: '字典类型名字',
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
        createButtonText: '添加字典类型',
        title: '添加字典类型',
        width: 500,
        name: 'DictionaryTypeForm',
        model: {
          name: '',
          sortValue: 0,
          type: '',
          summary: ''
        },
        component: {
          name: { label: '字典类型名字', prop: 'name', placeholder: '请输入字典类型名字', required: true, message: '字典类型名字必填', trigger: 'blur' },
          sortValue: { label: '排序', prop: 'sortValue', placeholder: '请输排序', required: true, message: '排序必填', trigger: 'blur' },
          type: { label: '字典类型', prop: 'type', placeholder: '请输入字典类型', required: true, message: '排序必填', trigger: 'blur' },
          summary: { label: '备注', prop: 'summary', placeholder: '请输入备注信息' }
        }
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
      pageDictionariesTypes(input).then(({ data }) => {
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
            createDictionariesType(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          } else {
            updateDictionariesType(this.formModal.model).then(res => {
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
      this.formModal.title = '添加字典类型'
      this.formModal.show = true
    },
    // 修改
    onUpdate (id) {
      this.formModal.isCreator = false
      this.formModal.show = true
      this.formModal.title = '编辑字典类型'
      this.formModal.loading = true
      this.formModal.loaddingText = '正在加载数据中...'
      getDictionariesType({ id }).then(({ data }) => {
        this.formModal.model = data
        this.formModal.loading = false
      }).catch(res => {
        this.formModal.loading = false
      })
    },
    // 删除
    onDelete (id) {
      this.$Modal.confirm({
        title: '删除字典类型？',
        content: '<p>确定要删除字典类型吗？</p>',
        onOk: () => {
          this.$Spin.show()
          deleteDictionariesType({ id }).then(res => {
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
