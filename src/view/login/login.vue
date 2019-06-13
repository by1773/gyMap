<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <Spin fix
              v-if="showLoginSpin">
          <Icon type="ios-loading"
                size=30
                class="login-con-spin-icon-load"></Icon>
          <div>{{loginSpinText}}</div>
        </Spin>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      showLoginSpin: false,
      loginSpinText: '正在登录，请稍后...'
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getUserMenus',
      'handleUserMenus'
    ]),
    handleSubmit ({ userName, password }) {
      this.showLoginSpin = true
      this.handleLogin({ userName, password })
        .then(res => {
          // 加载用户信息
          this.loginSpinText = '正在加载用户信息.....'
          this.getUserInfo().then(res => {
            // 加载菜单信息
            this.loginSpinText = '正在加载菜单信息.....'
            this.handleUserMenus(this.$router).then(routers => {
              this.$router.push({
                name: this.$config.homeName
              })
              // window.location.href = this.$config.homeName
            })
          })
        }).catch(
          res => {
            this.showLoginSpin = false
          }
        )
    }
  }
}
</script>

<style>
</style>
