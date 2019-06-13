<template>
  <div class="user-avator-dropdown">
    <Tooltip placement="left-start"
             :content="userName">
      <Dropdown trigger="click"
                @on-click="handleClick">
        <Badge :dot="!!messageUnreadCount">
          <Avatar :src="userAvator" />
        </Badge>
        <Icon :size="18"
              type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="userinfo">
            个人资料
          </DropdownItem>
          <DropdownItem name="updatePassword">
            修改密码
          </DropdownItem>
          <DropdownItem name="message">
            消息中心<Badge style="margin-left: 10px"
                   :count="messageUnreadCount"></Badge>
          </DropdownItem>
          <DropdownItem name="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Tooltip>
    <Modal v-model="passwordModal.show"
           :title="passwordModal.title"
           :width="passwordModal.width"
           :mask-closable="false"
           class="modal-form">
      <Form :ref="passwordModal.name"
            :model="passwordModal.model"
            :rules="passwordModal.component"
            label-position="top">
        <FormItem :label="passwordModal.component.password.label"
                  :prop="passwordModal.component.password.prop">
          <Input v-model="passwordModal.model.password"
                 type="password"
                 :placeholder="passwordModal.component.password.placeholder" />
        </FormItem>
        <FormItem :label="passwordModal.component.newPassword.label"
                  :prop="passwordModal.component.newPassword.prop">
          <Input v-model="passwordModal.model.newPassword"
                 type="password"
                 :placeholder="passwordModal.component.newPassword.placeholder" />
        </FormItem>
        <FormItem :label="passwordModal.component.confirmNewPassword.label"
                  :prop="passwordModal.component.confirmNewPassword.prop">
          <Input v-model="passwordModal.model.confirmNewPassword"
                 type="password"
                 :placeholder="passwordModal.component.confirmNewPassword.placeholder" />
        </FormItem>
      </Form>
      <Spin fix
            v-if="passwordModal.loading">
        <Icon type="ios-loading"
              size=30
              class="modal-con-spin-icon-load"></Icon>
        <div>{{passwordModal.loaddingText}}</div>
      </Spin>
      <div slot="footer">
        <Button type="primary"
                @click="formSave">保存</Button>
        <Button @click="formReset">取消</Button>
      </div>
    </Modal>
    <Modal v-model="userinfoModal.show"
           :title="userinfoModal.title"
           :width="userinfoModal.width"
           :mask-closable="false"
           class="modal-form">
      <Form :ref="userinfoModal.name"
            :model="userinfoModal.model"
            :rules="userinfoModal.component"
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
                          style="display: inline-block;">
                    <div style="width: 133px;height:133px;line-height: 133px;">
                      <Icon v-if="!userinfoModal.model.avatars"
                            type="ios-camera"
                            size="60"></Icon>
                      <img v-if="userinfoModal.model.avatars"
                           :src="userinfoModal.model.avatars"
                           width="133">
                    </div>
                  </Upload>
                  <Spin fix
                        v-if="userinfoModal.upload.loadding">
                    <Icon type="ios-loading"
                          size=30
                          class="modal-con-spin-icon-load"></Icon>
                    <div>上传中，请稍后...</div>
                  </Spin>
                </template>
              </i-col>
              <i-col span="18">
                <FormItem :label="userinfoModal.component.surname.label"
                          :prop="userinfoModal.component.surname.prop">
                  <Input v-model="userinfoModal.model.surname"
                         :placeholder="userinfoModal.component.surname.placeholder" />
                </FormItem>
                <FormItem :label="userinfoModal.component.name.label"
                          :prop="userinfoModal.component.name.prop">
                  <Input v-model="userinfoModal.model.name"
                         :placeholder="userinfoModal.component.name.placeholder" />
                </FormItem>
              </i-col>
            </Row>
            <FormItem :label="userinfoModal.component.email.label"
                      :prop="userinfoModal.component.email.prop">
              <Input v-model="userinfoModal.model.email"
                     type="email"
                     :placeholder="userinfoModal.component.email.placeholder" />
            </FormItem>
            <FormItem :label="userinfoModal.component.username.label"
                      :prop="userinfoModal.component.username.prop">
              <Tooltip content="用户名不能修改！"
                       style="width:100%"
                       placement="top-start">
                <Input :readonly="true"
                       v-model="userinfoModal.model.username"
                       :placeholder="userinfoModal.component.username.placeholder" />
              </Tooltip>
            </FormItem>
          </TabPane>
          <TabPane label="个人信息"
                   name="userinfo">
            <FormItem :label="userinfoModal.component.phone.label"
                      :prop="userinfoModal.component.phone.prop">
              <Input v-model="userinfoModal.model.phone"
                     :placeholder="userinfoModal.component.phone.placeholder" />
            </FormItem>
            <FormItem :label="userinfoModal.component.gender.label"
                      :prop="userinfoModal.component.gender.prop">
              <Select v-model="userinfoModal.model.gender"
                      style="width:300px">
                <Option value="保密">保密</Option>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            <FormItem :label="userinfoModal.component.birthday.label">
              <DatePicker type="date"
                          :placeholder="userinfoModal.component.birthday.placeholder"
                          v-model="userinfoModal.model.birthday"></DatePicker>
            </FormItem>
            <FormItem :label="userinfoModal.component.address.label"
                      :prop="userinfoModal.component.address.prop">
              <Input v-model="userinfoModal.model.address"
                     type="textarea"
                     style="margin-top: 0px; margin-bottom: 0px; height: 100px;"
                     :placeholder="userinfoModal.component.address.placeholder" />
            </FormItem>
          </TabPane>
        </Tabs>
      </Form>
      <Spin fix
            v-if="userinfoModal.loading">
        <Icon type="ios-loading"
              size=30
              class="modal-con-spin-icon-load"></Icon>
        <div>{{userinfoModal.loaddingText}}</div>
      </Spin>
      <div slot="footer">
        <Button type="primary"
                @click="onSaveUserinfo">保存</Button>
        <Button @click="onCloseUserinfo">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { getDateWeek, dateFormat } from '@/libs/tools'
import { updateUserPassword, updateUserInfo } from '@/api/membership/users'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showTip: false,
      userName: '',
      passwordModal: {
        show: false,
        loading: false,
        loaddingText: '加载中，请稍后...',
        title: '修改密码',
        width: 500,
        name: 'updatePasswordForm',
        model: {
          password: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        component: {
          password: { label: '当前密码', prop: 'password', placeholder: '请输入当前密码', required: true, message: '当前密码必填', trigger: 'blur' },
          newPassword: { label: '新密码', prop: 'newPassword', placeholder: '请输入新密码', required: true, message: '新密码必填', trigger: 'blur' },
          confirmNewPassword: { label: '确认新密码', prop: 'confirmNewPassword', placeholder: '请输入新密码', required: true, message: '确认新密码必填', trigger: 'blur' }
        }
      },
      userinfoModal: {
        show: false,
        loading: false,
        loaddingText: '加载用户信息中，请稍后...',
        title: '个人资料',
        width: 700,
        name: 'userinfoForm',
        upload: {
          loadding: false
        },
        model: {
          address: '',
          avatars: '',
          birthday: '',
          email: '',
          gender: '',
          name: '',
          phone: '',
          surname: ''
        },
        component: {
          username: { label: '用户名', prop: 'username' },
          email: { label: '邮箱地址', prop: 'email', placeholder: '请输入邮箱地址', required: true, message: '邮箱地址必填', trigger: 'blur' },
          address: { label: '地址', prop: 'address', placeholder: '请输入地址' },
          avatars: { label: '头像', prop: 'avatars', placeholder: '请输入头像' },
          birthday: { label: '生日', prop: 'birthday', placeholder: '请输入生日' },
          gender: { label: '性别', prop: 'gender', placeholder: '请输入性别' },
          name: { label: '名', prop: 'name', placeholder: '请输入名' },
          phone: { label: '手机号', prop: 'phone', placeholder: '请输入手机号' },
          surname: { label: '姓氏', prop: 'surname', placeholder: '请输入姓氏' }
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'getUserInfo'
    ]),
    // 表单重置
    formReset () {
      this.$refs[this.passwordModal.name].resetFields()
      this.passwordModal.show = false
    },
    formSave () {
      this.$refs[this.passwordModal.name].validate((valid) => {
        if (valid) {
          if (this.passwordModal.model.newPassword !== this.passwordModal.model.confirmNewPassword) {
            this.$Message.error('两次输入的密码不一致!')
            return
          }
          this.passwordModal.loading = true
          this.passwordModal.loaddingText = '正在修改密码，请稍后...'
          updateUserPassword(this.passwordModal.model).then(res => {
            this.$Message.success('修改密码成功!')
            this.formReset()
            this.passwordModal.loading = false
            this.passwordModal.show = false
            this.logout()
          }).catch(res => {
            this.passwordModal.loading = false
          })
        } else {
          this.$Message.error('表单验证失败!')
          this.passwordModal.show = true
          return false
        }
      })
    },
    onBeforeUpload () {
      this.userinfoModal.upload.loadding = true
    },
    onUpload (res, file) {
      this.userinfoModal.upload.loadding = false
      this.userinfoModal.model.avatars = 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
    },
    onCloseUserinfo () {
      this.$refs[this.userinfoModal.name].resetFields()
      this.userinfoModal.show = false
    },
    onSaveUserinfo () {
      this.$refs[this.userinfoModal.name].validate((valid) => {
        if (valid) {
          this.userinfoModal.loading = true
          this.userinfoModal.loaddingText = '正在保存个人信息，请稍后...'
          updateUserInfo(this.userinfoModal.model).then(res => {
            this.$Message.success('修改个人信息成功!')
            this.getUserInfo()
            this.userinfoModal.loading = false
            this.userinfoModal.show = false
          }).catch(res => {
            this.userinfoModal.loading = false
          })
        } else {
          this.$Message.error('表单验证失败!')
          this.userinfoModal.show = true
          return false
        }
      })
    },
    onUpdatePassword () {
      this.passwordModal.loaddingText = '正在加载，请稍后...'
      this.passwordModal.loading = true
      this.formReset()
      this.passwordModal.show = true
      this.passwordModal.loading = false
    },
    onUserinfo () {
      this.userinfoModal.loaddingText = '正在加载用户信息，请稍后...'
      this.userinfoModal.loading = true
      let { address, avatars, birthday, email, gender, name, phone, surname } = this.$store.state.user.userinfo
      this.userinfoModal.model = {
        address, avatars, birthday, email, gender, name, phone, surname
      }
      this.userinfoModal.loading = false
      this.userinfoModal.show = true
    },
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'updatePassword': this.onUpdatePassword()
          break
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'userinfo': this.onUserinfo()
          break
      }
    }
  },
  mounted () {
    this.userName = this.$store.state.user.userName
    if (!this.showTip) {
      let now = new Date()
      let tip = dateFormat('yyyy年MM月dd日 hh:mm:ss', now)
      tip += getDateWeek(now)
      this.$Notice.info({
        title: '欢迎您 ' + this.userName,
        desc: '今天是 ' + tip
      })
      this.showTip = true
    }
  }
}
</script>
<style>
.modal-con-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.modal-form .ivu-upload {
  width: 133px;
}
</style>
