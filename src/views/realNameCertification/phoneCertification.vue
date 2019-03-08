<template>
  <div id="realName">
    <div class="realNameHeader">
      <router-link to="/index/home">
        <img src="../../assets/images/logo.png" class="logo">
      </router-link>
      <span>实名认证</span>
    </div>
    <div class="phoneCertification">
      <div class="main">
        <div class="certificationLogo">
          <div class="realLogo">
            <img src="../../assets/images/shoujirz-01.png">
            <span class="fz14 c-0">手机认证</span>
          </div>
          <div class="line"></div>
          <div class="realLogo">
            <img src="../../assets/images/shimrz-02.png">
            <span class="fz14 c-6">实名认证</span>
          </div>
        </div>
        <div class="real-form">
          <div class="form-content">
            <div :style="phoneFlag?'border:1px solid #E91F2F;':''">
              <img class="phone" src="../../assets/images/shimingrz_shoujh_icon.png">
              <i></i>
              <input type="number" placeholder="请输入11位手机号" maxlength="11" v-model="realNameForm.mobileNo" @blur="validatePhone"
                     :style="phoneFlag?'color:#E91F2F':''"/>
            </div>
            <span class="errorTitle" v-show="phoneFlag">{{error.mobileError}}</span>
            <div>
              <img class="real" src="../../assets/images/shimingrz_yanzhengma_icon.png"/>
              <i></i>
              <input type="number" placeholder="请输入验证码" v-model="realNameForm.code"/>
              <i style="margin: 0;"></i>
              <span class="c-red cs" @click="clickGetCode" v-if="sendAuthCode">获取验证码</span>
              <span v-else class="fz14" style="color:#333">{{countDown}}秒后重发</span>
            </div>
            <span class="errorTitle" v-show="codeFlag">验证码输入错误</span>
          </div>
          <div class="c-6 fz12 realNameTitle">
            <p>温馨提示：</p>
            <p>1.以后在使用在线支付时，绑定的银行卡需要与此真实姓名保持一致。</p>
            <p>2.请确认您输入的信息是否正确，若3次验证不成功，之后需采用上传身
              份证照片方式进行验证</p>
          </div>
          <div class="next cs" @click="next" :style="changeBtnColor==true?'background:#E91F2F;':''">下一步</div>
          <p class=" activityTitle fz12">{@活动描述@：可以获得<span class="c-yellow">40酒币</span>可用于抽奖和抵扣}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as author from "@/api/author/author";

  export default {
    name: "realNameCertification",
    data() {
      return {
        phoneFlag: false,
        codeFlag: false,
        countDown: '',   //倒计时
        sendAuthCode: true, /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        realNameForm: {
          mobileNo: '',   //手机号
          code: '',    //验证码
          codeId:'',    //验证码id
        },
        error: {
          mobileError: '',
          codeError: '',
        }
      }
    },
    methods: {
      //点击获取验证码
      clickGetCode() {
        let {mobileNo} = this.realNameForm
        if (!mobileNo || this.phoneFlag) {
          return
        } else {
          this.getValidateCode()
          this.sendAuthCode = false;
          this.countDown = 60;
          let countDownTimer = setInterval(() => {
            this.countDown--;
            if (this.countDown <= 0) {
              this.sendAuthCode = true;
              clearInterval(countDownTimer)
            }
          }, 1000)
        }
      },
      //获取验证码
      getValidateCode() {
        let {mobileNo} = this.realNameForm;
        author.getCode(mobileNo).then(data => {
          if (data.success) {
            this.realNameForm.codeId = data.data.identifyingCodeId
          }
        })
      },
      validatePhone() {
        let reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!this.realNameForm.mobileNo) {
          this.error.mobileError = '手机号不能为空'
          this.phoneFlag = true
        }
        else if (!(reg.test(this.realNameForm.mobileNo))) {
          this.error.mobileError = '手机号码格式不正确'
          this.phoneFlag = true
        } else {
          this.phoneFlag = false
        }
      },
      next() {
        if (!this.changeBtnColor) {
          return
        }
        let {code,mobileNo,codeId} = this.realNameForm
        let data = {code,mobileNo,codeId}
        author.checkValidate(data).then(data=>{
          if(data.data){
            this.$router.push({name: 'realNameCertification'})
            this.codeFlag = false
          }else{
            this.codeFlag = true
            this.error.codeError = '请输入正确的验证码'
          }
          console.log(data)
        })
      },
    },
    computed: {
      changeBtnColor() {
        let {mobileNo, code} = this.realNameForm
        console.log(this.phoneFlag)
        if (!mobileNo || !code || this.phoneFlag ) {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  #realName {
    width: 100%
  }

  .realNameHeader {
    border-bottom: 1px solid #e0e0e0;
    flex();
    padding 26px 18%;
    align-items center;
    .logo {
      width: 141px;
      height: 55px;
      mr(22);
    }
    span {
      ft(18);
      c(#212121);
    }
  }

  .phoneCertification {
    mt(73)
    width: 100%;
    flex-center()
    .main {
      .certificationLogo {
        display: flex;
        align-items: center;
        justify-content: center;
        .realLogo {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 113px;
            height: 100px;
            mb(16)
          }
        }
        .line {
          width: 200px;
          height: 2px;
          background: #e0e0e0;
          margin: 0 20px;
        }
      }
      .real-form {
        display: flex;
        flex-direction: column;
        padding: 41px 0;
        align-items: center;
        .form-content {
          div {
            height: 48px;
            border: 1px solid #ddd;
            width: 376px;
            radius(4);
            display: flex;
            align-items center;
            margin-top: 18px;
            .phone {
              padding-left: 8px;
              width: 14px;
              height: 24px;
              padding-right: 12px;
            }
            .real {
              padding-left: 8px;
              width: 18px;
              height: 22px;
              padding-right: 8px;
            }
            i {
              block();
              width: 1px;
              height: 20px;
              bg(#ddd);
              mr(9)
            }
            /*input的type值为number时，去掉上下的箭头*/
            input:
            :-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            input[type="number"] {
              -moz-appearance: textfield;
              width: 100%;
              outline 0;
            }
            span {
              min-width: 98px;
              color: #E53935;
              text-align center;
            }
          }
          .errorTitle {
            display: block;
            pt(9);
            ft(12);
            c(#E91F2F);
            pl(45)
          }
        }
        .realNameTitle {
          width: 376px;
          line-height: 20px;
          padding: 27px 46px 0;
        }
        .next {
          height: 48px;
          bg(#bdbdbd);
          c(#fff);
          fz(17);
          lh(48);
          text-c();
          radius(4);
          mt(25);
          width: 376px;
        }

        .activityTitle {
          c(#bdbdbd);
          mt(16);
          text-c();
        }
      }
    }

  }
</style>
