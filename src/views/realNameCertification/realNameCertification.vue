<template>
  <div id="realName">
    <div class="realNameHeader">
      <a>
        <img src="../../assets/images/logo.png" class="logo">
      </a>
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
            <img src="../../assets/images/shimingrz_shimrz.png">
            <span class="fz14 c-6">实名认证</span>
          </div>
        </div>
        <div class="real-form">
          <div class="form-content">
            <div>
              <span class="c-6 fz14">真实姓名</span>
              <i></i>
              <input type="text" placeholder="请填写您的真实姓名" v-model="realNameForm.trueName"/>
            </div>
            <div>
              <span class="c-6 fz14">身份证号</span>
              <i></i>
              <input type="text" placeholder="请输入您的身份证号" v-model="realNameForm.idCardNO" @blur="validateCard"/>
            </div>
            <span class="errorTitle" v-show="cardFlag">{{error.errCardNo}}</span>
          </div>
          <div class="c-6 fz12 realNameTitle">
            <p>温馨提示：</p>
            <p>1.以后在使用在线支付时，绑定的银行卡需要与此真实姓名保持一致。</p>
            <p>2.请确认您输入的信息是否正确，若3次验证不成功，之后需采用上传身
              份证照片方式进行验证</p>
          </div>
          <div class="next cs" @click="next" :style="changeBtnColor==true?'background:#E91F2F;':''">下一步</div>
          <p class="activityTitle fz12">{@活动描述@：可以获得<span class="c-yellow">40酒币</span>可用于抽奖和抵扣}</p>
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
            cardFlag: false,
            realNameForm: {
                trueName: '',
                idCardNO: '',   //身份证号
                isFirst: true,   //是否首次认证
            },
            authenSuccess:false,    //是否认证成功
            failReason:'',    //失败原因
            error: {
                errorName: '',
                errCardNo: '',
            }
        }
    },
    methods: {
        //校验身份证号
        validateCard() {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!this.realNameForm.idCardNO) {
                this.error.errCardNo = '请输入身份证号'
                this.cardFlag = true
                return
            } else if (!reg.test(this.realNameForm.idCardNO)) {
                this.error.errCardNo = '身份证输入不合法'
                this.cardFlag = true
                return
            } else {
                this.cardFlag = false
            }
        },
        next() {
            let {idCardNO, isFirst, trueName} = this.realNameForm
            this.validateCard();
            if (!this.changeBtnColor) {
                return
            }
            author.userAuthen({idCardNO, isFirst, trueName}).then(data => {
                if (data.success) {
                    let realInfo = data.data
                    this.$router.push({name: 'realNameExamine',query:{realInfo}})
                }
            })

        },
    },
    computed: {
        changeBtnColor() {
            let {trueName, idCardNO} = this.realNameForm
            if (!trueName || !idCardNO || this.phoneFlag) {
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
        align-items: center;
        padding: 41px 0
        .form-content {
          /*padding: 0 46px;*/
          div {
            height: 48px;
            width: 376px;
            border: 1px solid #ddd;
            radius(4);
            display: flex;
            align-items center;
            margin-top: 18px;
            span {
              padding: 15px;
            }
            i {
              block();
              width: 1px;
              height: 20px;
              bg(#ddd);
              mr(9)
            }
            input {
              outline 0;
              font-size: 14px;
            }
            /*input的type值为number时，去掉上下的箭头*/
            input:
            :-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            input[type="number"] {
              -moz-appearance: textfield;
              outline 0;
              font-size: 14px;
            }
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
          ft(17);
          lh(48);
          text-c();
          radius(4);
          margin: 25px 46px;
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

  .errorTitle {
    display: block;
    pt(9);
    ft(12);
    c(#E91F2F);
    pl(45)
  }
</style>
