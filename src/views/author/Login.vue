<template>
  <div id="login">
    <div class="w">
      <div class="login-log">
        <a href="#/index/home" class="flt">
          <img class="inline" src="../../assets/images/logo.png" alt>
        </a>
        <span>欢迎登录</span>
      </div>
    </div>

    <div class="login-content">
      <div class="w clearfix">
        <div class="login-banner flt"></div>
        <div class="login-form frt pre">
          <div class="login-switch">
            <span @click="_switchWay" :class="{'c-red':type}">密码登录</span>
            <span @click="_switchWay" :class="{'c-red':!type}">手机验证码登录</span>
          </div>
          <!--  -->
          <div class="login-warn" v-show="warnMessage">
            <b></b>
            {{warnMessage}}
          </div>
          <!--  -->
          <div class="login-info" v-show="type">
            <div class="login-bar pre">
              <label class="label-name"></label>
              <input
                type="text"
                pattern="[0-9]"
                placeholder="请输入手机号"
                maxlength="16"
                v-model.trim="username"
                @change="_userNameChange($event)"
              >
              <span class="password-clear" v-show="username.length" @click.stop="_clearUserName"></span>
            </div>
            <div class="login-bar pre">
              <label class="label-password"></label>
              <input
                :type="visible"
                placeholder="请输入密码"
                v-model.trim="password"
                maxlength="24"
                @change="_passWordChange($event)"
                @keyup.enter="_doLogin"
              >
              <span
                class="password-eye"
                :class="{'password-eye-visible':visible=='text'}"
                @click.stop="visiblePassword"
              ></span>
            </div>
            <!-- 密码登录  且发送登录请求后需要验证 -->
            <div class="login-bar login-bar-code" v-if="defaultWithCodeLogin">
              <input
                type="text"
                pattern="[0-9]"
                maxlength="10"
                placeholder="请输入验证码"
                v-model.trim="code"
                @change="_codeChange($event)"
                @keyup.enter="_doLogin"
              >
              <a
                href="javascript:;"
                class="login-code"
                :class="{'code-able': codeAble}"
                @click="_getValidateCode"
              >
                <span v-show="validateCodeTime">{{validateCodeTime}}</span>
                {{validateCodeTime?'秒后重新获取':'获取验证码'}}
              </a>
            </div>
            <div class="about-password">
              <!-- <div class="password-save">
                <span @click="_rememberPassword" :class="{'checked': rememberPassword}"></span> 记住密码
              </div>-->
              <span class="cs">
                <a class="c-b" @click="findpwd">忘记密码？</a>
              </span>
            </div>
            <a href="javascript:;" class="login-btn" @click="_doLogin">登&nbsp;录</a>
            <div class="im-reg">
              <router-link to="/reg/step1" class="reg-btn">
                立即注册
                <span class="arrow">>></span>
              </router-link>
            </div>
          </div>
          <!--  -->
          <div class="login-info" v-show="!type">
            <div class="login-bar pre">
              <label class="label-name"></label>
              <input
                type="text"
                pattern="[0-9]"
                placeholder="请输入手机号"
                maxlength="16"
                v-model.trim="username"
                @change="_userNameChange($event)"
              >
              <span class="password-clear" v-show="username.length" @click.stop="_clearUserName"></span>
            </div>

            <div class="login-bar login-bar-code">
              <input
                type="text"
                pattern="[0-9]"
                placeholder="请输入验证码"
                v-model.trim="code"
                maxlength="10"
                @change="_codeChange($event)"
                @keyup.enter="_doLogin"
              >
              <a
                href="javascript:;"
                class="login-code"
                :class="{'code-able': codeAble}"
                @click="_getValidateCode"
              >
                <span v-show="validateCodeTime">{{validateCodeTime}}</span>
                {{validateCodeTime?'秒后重新获取':'获取验证码'}}
              </a>
            </div>

            <div class="about-password">
              <span class="frt cs">
                <router-link to="/findpwd/step1" class="c-b">忘记密码？</router-link>
              </span>
            </div>
            <a href="javascript:;" class="login-btn" @click="_doLogin">登&nbsp;录</a>
            <div class="im-reg">
              <router-link to="/reg/step1" class="reg-btn">
                立即注册
                <span class="arrow">>></span>
              </router-link>
            </div>
          </div>
          <!--  -->
        </div>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import * as UserService from "api/author/author";
import AppFooter from "../AppFooter.vue";
import { mapActions } from "vuex";
import storage from "common/storage";
export default {
  name: "login",
  data() {
    return {
      visible: "password",
      type: true, //true 密码   false 验证码
      username: localStorage.getItem("USERNAME") || "",
      password: localStorage.getItem("PASSWORD") || "",
      code: "",
      rememberPassword: true,
      validateCodeTime: 0,
      nameWarn: "",
      passwordWarn: "",
      codeWarn: "",
      otherWarn: "",
      defaultWithCodeLogin: false
    };
  },
  computed: {
    warnMessage() {
      return (
        this.nameWarn || this.passwordWarn || this.codeWarn || this.otherWarn
      );
    },
    codeAble() {
      if (this.validateCodeTime) {
        return false;
      }
      const Result = UserService.checkMobile(this.username);
      return (
        !!(this.type && Result.result && this.password) ||
        !!(Result.result && !this.type) ||
        false
      );
    }
  },
  //identifyingCodeId
  components: {
    AppFooter
  },
  mounted() {},
  beforeDestory() {
    clearInterval(this.validateCodeInterval);
  },
  methods: {
    ...mapActions(["saveUserDtail", "initUserDefaultAddress"]),
    _clearUserName() {
      this.username = "";
      this.nameWarn = this.passwordWarn = this.codeWarn = this.otherWarn = "";
    },
    _userNameChange(event) {
      const username = event.target.value;
      const Result = UserService.checkMobile(username);
      this.nameWarn = Result.msg;
    },
    _passWordChange(event) {
      const password = event.target.value;
      if (password == "") {
        this.passwordWarn = "请输入密码";
      } else if (password.length < 6 || password.length > 18) {
        this.passwordWarn = "请输入6-18位密码";
      } else {
        this.passwordWarn = "";
      }
      //非法字符TODO
    },
    _codeChange(event) {
      const code = event.target.value;
      if (code == "") {
        this.codeWarn = "请输入验证码";
      } else {
        this.codeWarn = this.otherWarn = "";
      }
    },
    _switchWay() {
      this.nameWarn = this.passwordWarn = this.codeWarn = this.otherWarn = "";
      this.type = !this.type;
    },
    _rememberPassword() {
      this.rememberPassword = !this.rememberPassword;
    },
    //获取短信验证码
    _getValidateCode() {
      const userName = this.username;
      if (!this.codeAble) {
        return false;
      }
      //手机号码格式校验
      const Result = UserService.checkMobile(userName);
      this.nameWarn = Result.msg;
      if (!Result.result) {
        return false;
      }
      UserService.isUserExist(userName)
        .then(res => {
          if (res.success && res.data) {
            //存在
            UserService.SendMessage(userName)
              .then(res => {
                if (res.success) {
                  this.reduceTime(60);
                  this.identifyingCodeId = res.data.identifyingCodeId;
                } else {
                  this.otherWarn = res.message;
                }
              })
              .catch(res => {
                this.otherWarn = res.message;
              });
          } else {
            this.$confirm({
              content: "您还不是久批会员，是否立即注册？",
              title: "温馨提示",
              yesText: "立即注册",
              noText: "取消"
            })
              .then(() => {
                this.openNewWindow({ path: "/reg/step1" });
              })
              .catch(() => {});
          }
        })
        .catch(res => {});
    },
    //短信倒计时
    reduceTime(seconds) {
      this.validateCodeTime = seconds;
      this.validateCodeInterval = setInterval(() => {
        this.validateCodeTime--;
        if (this.validateCodeTime <= 0) {
          this.validateCodeTime = 0;
          this.validateCodeInterval = null;
        }
      }, 1000);
    },
    //click登录
    _doLogin() {
      const {
        type,
        username,
        password,
        code,
        identifyingCodeId = "",
        defaultWithCodeLogin = ""
      } = this;
      let params = {
        username,
        password,
        code,
        identifyingCodeId,
        defaultWithCodeLogin
      };
      if (!username) {
        this.nameWarn = "请输入用户名";
        return false;
      }
      if (type && !password) {
        this.passwordWarn = "请输入密码";
        return false;
      }
      if ((!type || defaultWithCodeLogin) && !code) {
        this.codeWarn = "请输入验证码";
        return false;
      }
      this.userLogin(params, type);
    },
    //登录接口
    userLogin(params, type) {
      UserService.Login(params, type)
        .then(res => {
          if (res.success) {
            const deviceId = localStorage.getItem("deviceId");
            const searchHistory = storage.get("searchHistory", []);
            const talkingData = storage.get("TalkingData", []);
            const username =  storage.get("USERNAME", '');
            const firstShowPrompt = storage.get(
              username + "firstShowPrompt",
              false
            );

            const token = res.data.token;
            localStorage.clear();
            sessionStorage && sessionStorage.clear();
            localStorage.setItem("deviceId", deviceId);
            localStorage.setItem("USERNAME", params.username);
            localStorage.setItem("securityToken", res.data.securityToken || "");
            localStorage.setItem("refreshToken", res.data.refreshToken || "");
            
            localStorage.setItem("TOKEN", res.data.token);
            localStorage.setItem("rememberPassword", this.rememberPassword);

            storage.set("searchHistory", searchHistory);
            storage.set("TalkingData", talkingData);
            storage.set(username + "firstShowPrompt", firstShowPrompt);
            if (this.rememberPassword) {
              localStorage.setItem("PASSWORD", this.password);
            }
            let initSetting = this.initSetting();
            let getUserAddress = this.getUserAddress();

            Promise.all([initSetting, getUserAddress])
              .then(result => {
                let address = this.initDefaultAddress();
                localStorage.setItem("USER_DEFAULT_ADDRESS", address);
                this.initUserDefaultAddress({
                  userDefaultAddress: address,
                  refresh: false
                });
                this.$router.push({ path: "/index/home" }); //cityId
              })
              .catch(error => {});
          } else {
            if (res.errorCode == 206) {
              this.otherWarn = "请输入验证码进行二次确认";
              this.defaultWithCodeLogin = true;
              this._getValidateCode();
            } else if (res.errorCode == 201) {
              this.otherWarn = "您的账号当前无法登录，请联系客服";
            } else {
              this.otherWarn = res.message;
            }
          }
        })
        .catch(res => {});
    },
    //初始化用户信息
    initSetting() {
      //带token
      return UserService.GetUserDetail()
        .then(res => {
          if (res.success && res.data) {
            this.saveUserDtail(res.data);
            localStorage.setItem("USER_DETAIL", JSON.stringify(res.data));
            localStorage.setItem("CITY_ID", res.data.cityId);
            localStorage.setItem("CITY_NAME", res.data.city);
            localStorage.setItem("NATIVE_CITY_ID", res.data.cityId);
            localStorage.setItem("NATIVE_CITY_NAME", res.data.city);
            localStorage.setItem("defaultAddressId", res.data.addressId);
          }
        })
        .catch(res => {});
    },
    //获取用户收货地址
    getUserAddress() {
      let param = { datas: [0, 1, 2, 3] };
      return UserService.getAddressList(param).then(data => {
        if (data.success) {
          localStorage.setItem("USER_ADDRESS", JSON.stringify(data.data));
        }
      });
    },
    //初始化默认收货地址
    initDefaultAddress() {
      let userAddress = JSON.parse(localStorage.getItem("USER_ADDRESS"));
      let addressId = localStorage.getItem("defaultAddressId");
      if (!userAddress || !userAddress.length) return ``;
      let defaultAddress =
        userAddress.find(item => item.addressId == addressId) || userAddress[0];
      return (
        (defaultAddress.province || ``) +
        (defaultAddress.city || ``) +
        (defaultAddress.county || ``) +
        (defaultAddress.street || ``) +
        (defaultAddress.detailAddress || ``)
      );
    },
    visiblePassword() {
      if (this.visible == "text") {
        this.visible = "password";
      } else {
        this.visible = "text";
      }
    },
    //去找回密码页面
    findpwd(){
      this.$router.push({name: 'findpwdStep1',query: {mobileNo: this.username}})
    }
  }
};
</script>
<style lang="stylus">
.password-eye {
  cp();
  pos(absolute);
  squ(36);
  top: 1px;
  right: 1px;
  background-image: url('../../assets/images/biyan@2x.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px 18px;
}

.password-eye-visible {
  background-image: url('../../assets/images/zhengyan@2x.png');
}

.password-clear {
  @extend .password-eye;
  background-image: url('../../assets/images/shanchu@2x.png');
}

.login-warn {
  pos(absolute);
  top: 40px;
  left: 20px;
  w(308);
  h(30);
  lh(28);
  box();
  c(#666);
  bg(#fff6d2);
  b1(#ffe57d);

  >b {
    vm();
    inline();
    squ(16);
    ml(10);
    mr(5);
    mt(-4);
    background: url('../../assets/images/login-warn.png') no-repeat;
    background-size: cover;
  }
}

.login-code {
  inline();
  h(38);
  lh(38);
  ml(10);
  bg(#fafafa);
  ft(12);
  radius(3);
  b1(#ddd);
  text-c();
  c(#333);
  padding: 0 10px;
}

.code-able {
  c(#fff);
  bg($color-base-theme);
}

.login-bar {
  b1(#ddd);
  h(40);
  box();
  mb(15);
  flex();

  >label {
    inine();
    squ(38);
    background-image: url('../../assets/images/pwd-icons.png');
    background-repeat: no-repeat;
    float: left;

    &.label-name {
      background-position: 0 0;
    }

    &.label-password {
      background-position: -48px 0;
    }
  }

  >input {
    inline();
    ft(14);
    c(#333);
    float: left;
    flex-1();
    text-indent: 12px;
  }
}

.login-bar-code {
  border: 0;

  input {
    text-indent: 12px;
    border: 1px solid #ddd;
  }
}

.about-password {
  mt(12);
  h(24);
  lh(24);

  .password-save {
    flt();
    fb();

    >span {
      inline();
      squ(18);
      cp();
      vm();
      background: url('../../assets/images/sprite-select.png');
      background-position: -2px -2px;

      &.checked {
        background: url('../../assets/images/sprite-select.png');
        background-position: -192px -2px;
      }
    }
  }

  >span {
    inline();
    float: right;
  }
}

.login-btn {
  block();
  lh(40);
  mt(15);
  ft(16);
  text-c();
  c(#fff);
  bg($color-base-theme);
}

.login-log {
  h(100);
  bg(#fff);
  pt(24);

  >span {
    ft(20);
    c(#333);
    lh(60);
    ml(24);
    float: left;
  }
}

.login-content {
  h(520);
  background: url('../../assets/images/login-banner.png') repeat-x;
  border-top: 1px solid $color-base-hr;
}

.login-banner {
  w(400);
  h(355);
  ml(70);
  mt(60);
  background: url('../../assets/images/banner_content.png') no-repeat;
  background-size: cover;
}

@media screen and (min-width: 1230px) {
  .login-banner {
    w(459);
    h(407);
  }
}

.login-form {
  w(348);
  mr(70);
  mt(60);
  bg(#fff);
  b1($color-base-hr);

  .login-switch {
    mt(12);
    mb(12);
    h(20);
    lh(20);

    >span {
      float: left;
      inline();
      text-c();
      cp();
      ft(14);
      width: 50%;

      &:nth-of-type(1) {
        box();
        border-right: 1px solid $color-base-hr;
      }
    }
  }

  .login-info {
    padding: 35px 20px 20px;
    border-top: 1px solid $color-base-hr;
  }
}

.im-reg {
  h(24);
  mt(15);

  .reg-btn {
    lh(24);
    ft(12);
    frt();
    c($color-base-theme);
  }
}
</style>

