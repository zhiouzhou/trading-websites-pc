<template>
  <div class="reg w">
    <div class="step clearfix">
      <dl class="step1 doing">
        <dt class="s-num fz12">1</dt>
        <dd class="s-text">填写用户名</dd>
        <dd></dd>
      </dl>
      <dl>
        <dt class="s-num fz12">2</dt>
        <dd class="s-text">填写新密码</dd>
      </dl>
    </div>
    <form class="reg-form fz14" novalidate="novalidate">
      <div class="form-list">
        <div class="form-list-f1">
          <input
            type="text"
            class="form-control"
            :class="{'input-error': error.mobileError}"
            placeholder="请输入您的手机号"
            v-model="info.mobileNo"
            @input="inputMobile"
            maxlength="11"
            required
            @focus="focusInput('mobileError')"
          >
          <div class="form-label">手机号</div>
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.mobileError">
          <img src="../../assets/images/zhengque@2x.png" alt="" class="icon-error" v-if="mobileCheck&&!error.mobileError">
          <div class="error">
            <span>{{error.mobileError}}</span>
          </div>
        </div>
      </div>
      <div class="form-list">
        <div class="form-list-f1">
          <input type="text" class="form-control" :class="{'input-error': error.validateError}" placeholder="请输入验证码" v-model="info.validateCode" maxlength="6" @focus="focusInput('validateError')">
          <div class="form-label">验证码</div>
          <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.validateError">
          <div class="error">
            <span>{{error.validateError}}</span>
          </div>
        </div>
        <div class="form-list-f2" :class="{'reg-validateCode': validateCodeTime == 0 && info.mobileNo.length==11}" @click="getvalidateCode">
          {{validateCodeTime>0?`${validateCodeTime}秒后重新获取`:'获取验证码'}}
        </div>
      </div>
      <button type="button" class="next-step fz18 c-w" :class="{'no-nextstep' : info.mobileNo.length!=11||info.validateCode.length<6}" @click="nextStep">下一步</button>
    </form>
  </div>
</template>
<script>
import * as author from "@/api/author/author.js";
export default {
  name: "findpwdStep1",
  data() {
    return {
      error: {
        mobileError: "",
        validateError: ""
      },
      info: {
        mobileNo: "",
        validateCode: "",
        validateCodeId: ""
      },
      validateCodeTime: 0,
      isRequest: false,
      mobileCheck: false
    };
  },
  created(){
    this.info.mobileNo = this.$route.query.mobileNo;
  },
  methods: {
    //检查输入手机号
    inputMobile(e){
      let mobileNo = '';
      let value = e.target.value;
      let partter = /[^\d]/g;
      mobileNo = value.replace(partter,'');
      this.info.mobileNo = mobileNo;
    },
    //倒计时
    reduceTime(seconds) {
      this.validateCodeTime = seconds;
      let validateCodeInterval = setInterval(() => {
        this.validateCodeTime=this.validateCodeTime-1;
        if (this.validateCodeTime <= 0) {
          this.validateCodeTime = 0;
          window.clearInterval(validateCodeInterval);
        }
      }, 1000);
    },
    //检查账号格式
    checkMobileNo(){
      let partter = /^0?1[3|4|5|6|8|7|9][0-9]\d{8}$/;
      let exp = new RegExp(partter);
      if (!this.info.mobileNo) {
        this.error.mobileError = "手机号不能为空!";
        this.mobileCheck = false;
        return;
      }
      if (!exp.test(this.info.mobileNo)) {
        this.error.mobileError = "手机号格式不正确!";
        this.mobileCheck = false;
        return;
      }
      this.error.mobileError = "";
    },
    //检查验证码
    checkValidateCode(){
      if (!this.info.validateCode) {
        this.error.validateError = "请输入验证码";
        this.error.mobileError = "";
        return;
      } else {
        this.error.validateError = "";
      }
    },
    //获取验证码
    getvalidateCode() {
      if(this.validateCodeTime>0||this.isRequest){
        return;
      }
      this.isRequest = true;
      this.checkMobileNo();
      if(this.error.mobileError){
        this.isRequest = false;
        return;
      }
      author.isUserExist(this.info.mobileNo).then(
        res => {
          if(res.data){
            author.getCode(this.info.mobileNo).then(
              res => {
                if(res.success){
                  this.mobileCheck = true;
                  this.info.validateCodeId = res.data.identifyingCodeId;
                  this.reduceTime(60);
                }else{
                  if(res.message=="获取验证码频率太快，请稍后重试"){
                    this.reduceTime(60);
                  }
                  this.error.mobileError=res.message;
                }
                this.isRequest = false;
              }
            )
          }else {
            this.error.mobileError="该手机号不存在";
            this.isRequest = false;
          }
        },
        error => {
          this.error.mobileError = error.message;
          this.isRequest = false;
        }
      );
    },

    //下一步
    nextStep() {
      this.checkMobileNo();
      if(this.error.mobileError){
        return;
      }
      this.checkValidateCode();
      if(this.error.validateError){
        return;
      }
      var data = {
        code: this.info.validateCode,
        codeId: this.info.validateCodeId,
        mobileNo: this.info.mobileNo
      };
      author.checkValidate(data).then(
        res => {
          if (res.data) {
            this.$router.push({ name: "findpwdStep2", params: data });
          } else {
            this.error.validateError = "请输入正确验证码";
          }
        },
        error => {
          this.error.validateError = "请输入正确验证码";
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
    text-indent: 70px;
    lh(46)

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
  width 102px
  height: 46px;
  border: 1px solid #ddd;
  bg(#FAFAFA);
  c(#333);
  ml(15);
  lh(46);
  radius(4)
  text-c()
  cursor: pointer;
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
  pt(0);
  pb(0);
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
  bg(#bdbdbd)
  border-color: #bdbdbd;

  &:hover {
    bg(#bdbdbd)
    border-color: #bdbdbd;
  }
}

.error {
  ml(0)
  color: #e43834;
}

.reg-validateCode {
  bg(#e53935)
  c(#fff)
}

.input-error {
  c(#E53935)
  border-color #E53935
}

.icon-error {
  inline()
  squ(14)
  position absolute
  right 10px
  lh(46)
  top 16px
}
</style>

