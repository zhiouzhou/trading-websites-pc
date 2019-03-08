<template>
  <div class="reg w">
    <div class="step clearfix">
      <dl class="step1">
        <dt class="s-num fz12">1</dt>
        <dd class="s-text">填写用户名</dd>
        <dd></dd>
      </dl>
      <dl class="doing">
        <dt class="s-num fz12">2</dt>
        <dd class="s-text">填写新密码</dd>
      </dl>
    </div>
    <form class="reg-form" novalidate="novalidate">
      <div class="form-list">
        <div class="form-list-f1">
          <input
            :type="pwdState?'text':'password'"
            class="form-control"
            :class="{'input-error': error.passwordError}"
            placeholder="请输入新密码"
            v-model="info.password"
            data-type="new"
            @input="checkPwd"
            maxlength="18"
            @focus="focusInput('passwordError')"
          >
          <div class="form-label fz14">新密码</div>
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState('pwd')" v-if="pwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState('pwd')" v-if="!pwdState">
          <div class="error fz14">
            <span>{{error.passwordError}}</span>
          </div>
        </div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input
            :type="repwdState?'text':'password'"
            class="form-control"
            placeholder="请再次输入新密码"
            v-model="info.rePassword"
            data-type="re"
            @input="checkPwd"
            maxlength="18"
          >
          <div class="form-label fz14">确认新密码</div>
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState('repwd')" v-if="repwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState('repwd')" v-if="!repwdState">
          <div class="error fz14">
            <span>{{error.rePasswordError}}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="next-step fz18 c-w"
        :class="{'no-nextstep': info.password.length<6||info.rePassword.length<6}"
        @click="nextStep"
      >下一步</button>
    </form>
  </div>
</template>
<script>
import * as author from "@/api/author/author.js";
export default {
  name: "findpwdStep2",
  data() {
    return {
      info: {
        password: "",
        rePassword: ""
      },
      error: {
        passwordError: "",
        rePasswordError: ""
      },
      pwdState: false,
      repwdState: false
    };
  },
  created() {
    // if (!this.$route.params.mobileNo) {
    //   this.$router.push("/findpwd/step1");
    // }
    this.info.mobileNo = this.$route.params.mobileNo;
    this.info.validateCodeId = this.$route.params.codeId;
    this.info.validateCode = this.$route.params.code;
  },
  methods: {
    //显示和隐藏密码
    changePwdState(state){
      if(state=='pwd'){
        this.pwdState = !this.pwdState;
      }else if(state == 'repwd'){
        this.repwdState = !this.repwdState;
      }
    },
    //检查密码
    checkPwd(e) {
      let value = e.target.value;
      let partter = /\s/g;
      value = value.replace(partter, "");
      if (e.target.dataset.type == "new") {
        this.info.password = value;
      } else if (e.target.dataset.type == "re") {
        this.info.rePassword = value;
      }
    },
    //下一步
    nextStep() {
      let { password, rePassword } = this.info;
      if (!password) {
        this.error.passwordError = "新密码不能为空！";
        return;
      }
      if (password.length < 6) {
        this.error.passwordError = "新密码不能少于6个字符";
        return;
      }
      if (password !== rePassword) {
        this.error.rePasswordError = "两次密码输入不一致！";
        return;
      }
      let data = {
        mobileNo: this.info.mobileNo,
        validateCodeId: this.info.validateCodeId,
        validateCode: this.info.validateCode,
        password: this.info.password
      };
      author.resetPassword(data).then(
        res => {
          if (res.success) {
            localStorage.setItem("PASSWORD", this.info.password);
            this.$router.push("/findpwd/step3");
          } else {
            this.error.rePasswordError = res.desc;
          }
        },
        error => {
          this.error.rePasswordError = error.desc;
        }
      );
    },
    focusInput(e){
      this.error[e] = '';
    }
  }
};
</script>
<style lang="stylus" scoped>
.reg {
  pb(64);
  lh(20);
  overflow: hidden;
}

.step {
  text-c();
  margin: 55px auto 0;
  width: 460px;

  dl {
    float: left;
    position: relative;
    width: 230px;
    top: -5px;
    border-top: 5px solid #ccc;
  }

  .step1 {
    border-top-color: #caecb6;
  }
}

dl.doing {
  border-top-color: #7abd54;

  .s-text {
    c(#7abd54);
  }

  .s-num {
    background-position: -23px 0;
  }
}

.s-num {
  margin: -15px auto 0;
  c(#fff);
  fb();
  width: 23px;
  background-image: url('../../assets/images/step2013.png');
  lh(23);
}

.s-text {
  mt(8);
  font-size: 14px;
  c(#ccc);
}

.step1 {
  .s-num {
    background-position-x: -47px;
  }

  .s-text {
    c(#caecb6);
  }
}

.step3 .s-num {
  background-position-x: -68px;
}

.reg-form {
  width: 460px;
  margin: 0 auto;
  c(#333);
}

.form-list {
  display: -moz-box;
  display: -webkit-box;
  mt(30);

  input {
    text-indent: 100px;
    lh(46);

    &::placeholder {
      c(#999);
    }
  }
}

.form-list-f1 {
  position: relative;
  box-flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
}

.form-list-f2 {
  box();
  height: 46px;
  border: 1px solid #ddd;
  bg(#FAFAFA);
  c(#333);
  ml(15);
  lh(46);
  padding: 0 20px;

  &:hover {
    cursor: pointer;
    bg(#ddd);
  }
}

.form-control {
  box();
  radius(0);
  border-color: #ddd;
  width: 100%;
  height: 46px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  c(#555);
  font-size: 14px;
}

.form-label {
  position: absolute;
  left: 15px;
  top: 0;
  height: 46px;
  lh(46);
}

.next-step {
  mt(48);
  margin-left: 8.33333333%;
  width: 83.33333333%;
  height: 46px;
  lh(46);
  border: 1px solid #e43834;
  radius(4px);
  cursor: pointer;
  touch-action: manipulation;
  bg(#e43834);

  &:hover {
    bg(#ef5350);
    border-color: #ef5350;
  }
}

.no-nextstep {
  bg(#bdbdbd);
  border-color: #bdbdbd;

  &:hover {
    bg(#bdbdbd);
    border-color: #bdbdbd;
  }
}

.password-close {
  inline()
  width 18px
  height 18px
  position absolute
  right 10px
  top 15px
}

.error {
  color: #e43834;
}

.input-error {
  c(#E53935)
  border-color #E53935
}
</style>