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
              v-hasPermission="$access.membership.user.create"
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
        <Tabs value="default">
          <TabPane label="账号"
                   name="default">
            <Row>
              <i-col span="6">
                <template>
                  <Upload ref="upload"
                          :show-upload-list="false"
                          :on-success="onUpload"
                          :before-upload="onBeforeUpload"
                          :format="['jpg','jpeg','png']"
                          :max-size="2048"
                          type="drag"
                          action="//jsonplaceholder.typicode.com/posts/"
                          style="display: inline-block;width:58px;">
                    <div style="width: 133px;height:133px;line-height: 133px;">
                      <Icon v-if="!formModal.model.avatars"
                            type="ios-camera"
                            size="60"></Icon>
                      <img v-if="formModal.model.avatars"
                           :src="formModal.model.avatars"
                           width="133">
                    </div>
                  </Upload>
                  <Spin fix
                        v-if="formModal.upload.loadding">
                    <Icon type="ios-loading"
                          size=30
                          class="modal-con-spin-icon-load"></Icon>
                    <div>上传中，请稍后...</div>
                  </Spin>
                </template>
              </i-col>
              <i-col span="18">
                <FormItem :label="formModal.component.surname.label"
                          :prop="formModal.component.surname.prop">
                  <Input v-model="formModal.model.surname"
                         :placeholder="formModal.component.surname.placeholder" />
                </FormItem>
                <FormItem :label="formModal.component.name.label"
                          :prop="formModal.component.name.prop">
                  <Input v-model="formModal.model.name"
                         :placeholder="formModal.component.name.placeholder" />
                </FormItem>
              </i-col>
            </Row>
            <FormItem :label="formModal.component.email.label"
                      :prop="formModal.component.email.prop">
              <Input v-model="formModal.model.email"
                     type="email"
                     :placeholder="formModal.component.email.placeholder" />
            </FormItem>
            <FormItem :label="formModal.component.username.label"
                      :prop="formModal.component.username.prop">
              <Tooltip content="用户名使用后不能修改！"
                       style="width:100%"
                       placement="top-start">
                <Input :readonly="!formModal.isCreator"
                       v-model="formModal.model.username"
                       :placeholder="formModal.component.username.placeholder" />
              </Tooltip>
            </FormItem>
            <FormItem :label="formModal.component.password.label"
                      :prop="formModal.component.password.prop">
              <Input v-model="formModal.model.password"
                     type="password"
                     :placeholder="formModal.component.password.placeholder" />
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model=" formModal.model.isActive">
                {{formModal.component.isActive.label}}</Checkbox>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model="formModal.model.isAccountNonExpired">
                {{formModal.component.isAccountNonExpired.label}}</Checkbox>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model=" formModal.model.isAccountNonLocked">
                {{formModal.component.isAccountNonLocked.label}}</Checkbox>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model="formModal.model.isCredentialsNonExpired">
                {{formModal.component.isCredentialsNonExpired.label}}</Checkbox>
            </FormItem>
          </TabPane>
          <TabPane :label="formModal.label"
                   name="roles">
            <CheckboxGroup v-model="formModal.model.roleIds">
              <div v-for="item in roles"
                   :value="item.id"
                   :key="item.id"
                   style="height:30px;line-height:30px;margin-left:16px;">
                <Checkbox :label="item.id">{{item.name}}</Checkbox>
              </div>
            </CheckboxGroup>
          </TabPane>
          <TabPane label="个人信息"
                   name="userinfo">
            <FormItem :label="formModal.component.phone.label"
                      :prop="formModal.component.phone.prop">
              <Input v-model="formModal.model.phone"
                     :placeholder="formModal.component.phone.placeholder" />
            </FormItem>
            <FormItem :label="formModal.component.gender.label"
                      :prop="formModal.component.gender.prop">
              <Select v-model="formModal.model.gender"
                      style="width:300px">
                <Option value="保密">保密</Option>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            <FormItem :label="formModal.component.birthday.label">
              <DatePicker type="date"
                          :placeholder="formModal.component.birthday.placeholder"
                          v-model="formModal.model.birthday"></DatePicker>
            </FormItem>
            <FormItem :label="formModal.component.address.label"
                      :prop="formModal.component.address.prop">
              <Input v-model="formModal.model.address"
                     type="textarea"
                     style="margin-top: 0px; margin-bottom: 0px; height: 100px;"
                     :placeholder="formModal.component.address.placeholder" />
            </FormItem>
          </TabPane>
        </Tabs>
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
import { getRoleList } from '@/api/membership/roles'
import {
  getUserAuthorizeTrees, authorizeUser,
  pageUsers, deleteUser, createUser, updateUser, getUser } from '@/api/membership/users'
export default {
  name: 'User',
  components: {
    Action,
    SimpleTable
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '#', key: 'id', width: 80 },
          { title: '用户名', key: 'username', minWidth: 50 },
          { title: '邮箱地址 ', key: 'email', minWidth: 150 },
          { title: '手机 ', key: 'phone', minWidth: 60 },
          {
            title: '姓名',
            key: 'surname',
            minWidth: 40,
            render: (h, { row }) => {
              return h('span', row.surname + row.name)
            }
          },
          { title: '性别', key: 'gender', minWidth: 40 },
          { title: '生日', key: 'birthday', minWidth: 150 },
          {
            title: '状态',
            key: 'isActive',
            minWidth: 60,
            render: (h, { row }) => {
              let status = '正常'
              if (!row.isActive) {
                status = '未激活'
              }
              if (!row.isCredentialsNonExpired) {
                status = '凭证过期'
              }
              if (!row.isAccountNonLocked) {
                status = '账号锁定'
              }
              if (!row.isAccountNonExpired) {
                status = '账号过期'
              }
              return h('span', {
                style: {
                  color: status === '正常' ? 'green' : 'red'
                }
              }, status)
            }
          },
          { title: '添加人', key: 'createdBy', minWidth: 80 },
          { title: '添加时间', key: 'createdDate', minWidth: 150 },
          { title: '修改人', key: 'modifiedBy', minWidth: 80 },
          { title: '修改时间', key: 'modifiedDate', minWidth: 150 },
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
                      { key: 'update', name: '修改', icon: 'md-create', access: this.$access.membership.user.update },
                      { key: 'delete', name: '删除', icon: 'md-trash', access: this.$access.membership.user.delete },
                      { key: 'authorize', name: '授权', icon: 'md-hammer', access: this.$access.membership.user.authorize }
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
                })
              ])
            }
          }
        ],
        searcher: true,
        searchPlaceholder: '用户名、姓名、邮箱、手机',
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
        createButtonText: '添加用户',
        title: '添加用户',
        width: 700,
        name: 'userForm',
        model: {
          address: '',
          avatars: '',
          birthday: '',
          email: '',
          gender: '',
          isAccountNonExpired: false,
          isAccountNonLocked: false,
          isActive: false,
          isCredentialsNonExpired: false,
          name: '',
          password: '',
          phone: '',
          roleIds: [],
          surname: '',
          username: ''
        },
        component: {
          username: { label: '用户名', prop: 'username', placeholder: '请输入用户名', required: true, message: '用户名必填', trigger: 'blur' },
          email: { label: '邮箱地址', prop: 'email', placeholder: '请输入邮箱地址', required: true, message: '邮箱地址必填', trigger: 'blur' },
          address: { label: '地址', prop: 'address', placeholder: '请输入地址' },
          avatars: { label: '头像', prop: 'avatars', placeholder: '请输入头像' },
          birthday: { label: '生日', prop: 'birthday', placeholder: '请输入生日' },
          gender: { label: '性别', prop: 'gender', placeholder: '请输入性别' },
          isAccountNonExpired: { label: '当前账户未过期', prop: 'isAccountNonExpired' },
          isAccountNonLocked: { label: '当前账户未锁定', prop: 'isAccountNonLocked' },
          isActive: { label: '当前账户账号已激活', prop: 'isActive' },
          isCredentialsNonExpired: { label: '当前账户凭证未过期', prop: 'isCredentialsNonExpired' },
          name: { label: '名', prop: 'name', placeholder: '请输入名' },
          password: { label: '密码', prop: 'password', placeholder: '请输入密码', required: false, message: '密码必填', trigger: 'blur' },
          phone: { label: '手机号', prop: 'phone', placeholder: '请输入手机号' },
          roleIds: { label: '角色', prop: 'roleIds', placeholder: '请选择角色' },
          surname: { label: '姓氏', prop: 'surname', placeholder: '请输入姓氏' }
        },
        label: (h) => {
          return h('div', [
            h('span', '角色'),
            h('Badge', {
              props: {
                count: this.formModal.model.roleIds.length
              }
            })
          ])
        },
        upload: {
          loadding: false
        }
      },
      roles: [],
      authorizeModal: {
        show: false,
        title: '用户授权',
        width: 600,
        loading: false,
        loadingText: '正在加载权限信息，请稍后...',
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
      this.formModal.model.address = ''
      this.formModal.model.avatars = ''
      this.formModal.model.birthday = ''
      this.formModal.model.email = ''
      this.formModal.model.gender = ''
      this.formModal.model.isAccountNonExpired = false
      this.formModal.model.isAccountNonLocked = false
      this.formModal.model.isActive = false
      this.formModal.model.isCredentialsNonExpired = false
      this.formModal.model.name = ''
      this.formModal.model.password = ''
      this.formModal.model.phone = ''
      this.formModal.model.roleIds = []
      this.formModal.model.surname = ''
      this.formModal.model.username = ''
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
      pageUsers(input).then(({ data }) => {
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
            createUser(this.formModal.model).then(res => {
              this.$Message.success('保存成功!')
              this.formReset()
              this.loadData()
              this.formModal.loading = false
            }).catch(res => {
              this.formModal.loading = false
            })
          } else {
            updateUser(this.formModal.model).then(res => {
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
      this.authorizeModal.show = true
      this.authorizeModal.loadingText = '正在加载权限信息，请稍后...'
      getUserAuthorizeTrees({ id }).then(({ data }) => {
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
      this.authorizeModal.loadingText = '正在保存权限信息，请稍后...'
      this.authorizeModal.loading = true
      authorizeUser(input).then(res => {
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
    onBeforeUpload () {
      this.formModal.upload.loadding = true
    },
    onUpload (res, file) {
      this.formModal.upload.loadding = false
      this.formModal.model.avatars = 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
    },
    // 添加
    onCreate () {
      this.formReset()
      this.formModal.isCreator = true
      this.formModal.title = '添加用户'
      this.formModal.show = true
    },
    // 修改
    onUpdate (id) {
      this.formModal.isCreator = false
      this.formModal.show = true
      this.formModal.title = '编辑用户'
      this.formModal.loading = true
      this.formModal.loaddingText = '正在加载数据中...'
      getUser({ id }).then(({ data }) => {
        this.formModal.model = data
        let rolesId = data.roles.map((itme) => itme.id)
        this.formModal.model.roleIds = rolesId || []
        delete this.formModal.model.roles
        this.formModal.loading = false
      }).catch(res => {
        this.formModal.loading = false
      })
    },
    // 删除
    onDelete (id) {
      this.$Modal.confirm({
        title: '删除用户？',
        content: '<p>确定要删除用户吗？</p>',
        onOk: () => {
          this.$Spin.show()
          deleteUser({ id }).then(res => {
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
    getRoleList().then(({ data }) => {
      this.roles = data
    })
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
.modal-form .ivu-upload {
  width: 133px;
}
</style>
