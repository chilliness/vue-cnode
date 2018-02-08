<template>
  <div class="login-wrap">
    <app-header>
      <span>登录</span>
    </app-header>
    <div class="main">
      <div class="login-box">
        <input class="text" type="text" placeholder="请输入Access Token" v-model="accesstoken">
        <div class="line"></div>
        <div class="tip">请输入Access Token</div>
        <div class="tip-err" v-show="msg">{{msg}}</div>
        <a class="box-login" @click="onLogin()">登录</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accesstoken: '',
      isAjax: false,
      msg: ''
    };
  },
  methods: {
    onLogin() {
      if (this.isAjax || !this.accesstoken.replace(/\s/g, '').length) {
        return;
      }

      this.isAjax = true;
      this.msg = '';

      this.$http
        .post(this.$api.accesstoken, { accesstoken: this.accesstoken })
        .then(res => {
          if (res.success == this.$api.code) {
            sessionStorage.logined = 1;
            sessionStorage.accesstoken = this.accesstoken;
            this.$router.replace({
              name: 'user',
              params: { loginname: res.loginname }
            });
          }
          this.isAjax = false;
        })
        .catch(() => {
          this.msg = this.$api.tip;
          this.isAjax = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-wrap {
  .main {
    padding-top: 80px;
  }
  .login-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 260px;
    margin: 0 auto;
  }
  .text {
    display: flex;
    align-items: center;
    font-size: 16px;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid $bdcc;
  }
  .text:focus + .line {
    transform: scaleX(1);
  }
  .text:focus + .line + .tip {
    top: -24px;
    font-size: 12px;
    opacity: 1;
  }
  .line {
    position: absolute;
    left: 0;
    right: 0;
    top: 40px;
    border-bottom: 1px solid $bd04;
    transform: scaleX(0);
    transition: 0.3s;
  }
  .tip {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    color: $fs04;
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
  }
  .box-login {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 14px;
    color: $fsff;
    border-radius: 3px;
    background: $bg22;
  }
  .tip-err {
    margin-top: 20px;
    font-size: 16px;
    color: $fscc;
  }
}
</style>
