<template>
  <div class="jiupi-center">
    <div class="userinfo">
      <p class="info-title">填写验证码</p>
      <form class="info-content">
        <p>
          <span class="red">*</span>&nbsp;&nbsp;&nbsp;&nbsp;短信验证码已发送，请填写验证码
        </p>
        <div class="form-country">
          <label>
            手机号
            <span class="red">*</span>
          </label>
          <p>+86{{newMobileNo}}</p>
        </div>
        <div>
          <label>
            验证码
            <span class="red">*</span>
          </label>
          <div class="w-50">
            <input type="text" placeholder="请填写验证码" class="form-mobile" v-model="identifyingCode" maxlength="6">
          </div>
        </div>
        <div class="button">
          <label class="getCode c-999" v-if="validateCodeTime>0">{{validateCodeTime}}秒后重新获取</label>
          <label class="getCode" @click="getCode" v-else>收不到验证码？</label>
          <div class="w-50">
            <div class="form-button">
              <a href="javascript:;" class="info-change" :class="{'no-nextstep': identifyingCode.length==0}" @click="submit">提交</a>
              <router-link to="/myOrderEntry/changeMobile" class="info-change cancel">取消</router-link>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter";
import * as author from "@/api/author/author";
export default {
  name: "changeMobileCode",
  data() {
    return {
      newMobileNo: "",
      identifyingCodeId: "",
      identifyingCode: "",
      validateCodeTime: 0
    };
  },
  created() {
    this.newMobileNo = this.$route.params.newMobileNo;
    this.identifyingCodeId = this.$route.params.validateCodeId;
  },
  methods: {
    //倒计时
    reduceTime(seconds) {
      this.validateCodeTime = seconds;
      let validateCodeInterval = setInterval(() => {
        this.validateCodeTime = this.validateCodeTime - 1;
        if (this.validateCodeTime <= 0) {
          this.validateCodeTime = 0;
          window.clearInterval(validateCodeInterval);
        }
      }, 1000);
    },
    submit() {
      if (!this.identifyingCode) {
        this.$alert("验证码不能为空");
        return;
      }
      let data = {
        mobileNo: this.newMobileNo,
        validateCode: this.identifyingCode,
        validateCodeId: this.identifyingCodeId
      };
      usercenter.changeMobile(data).then(
        res => {
          if (res.success) {
            this.$router.push({
              name: `userinfo`,
              params: {
                changeMobileSuccess: true
              }
            });
          } else {
            this.$alert(res.desc);
          }
        },
        error => {
          this.$alert(error.desc);
        }
      );
    },
    //获取验证码
    getCode() {
      this.$confirm({content:'是否重新获取验证码?'})
        .then(() => {
          author.getCode(this.newMobileNo).then(
            res => {
              if (res.success) {
                this.$alert("您的验证码已发送，请查收！");
                this.identifyingCodeId = res.data.identifyingCodeId;
              } else {
                this.$alert(res.msg);
              }
              this.reduceTime(60);
            },
            error => {
              if (error.msg == "验证码调用频率过快") {
                this.$alert(error.msg);
              } else {
                this.$alert("请稍后重试");
              }
            }
          );
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
  width: 100%;
}

.userinfo {
  pl(20);
  bg(#fff);
  mb(38);
  min-height: 680px;
}

.info-title {
  width: 100%;
  height: 84px;
  ft(28);
  c(#333);
  lh(84);
}

.info-content {
  margin: 20px 0;
  ft(12);
  c(#666);
  line-height: 1.4em;
}

.red {
  color: red;
}

.form-country {
  mt(30);
  mb(15);

  p {
    inline();
    pl(15);
    pt(7);
  }
}

label {
  inline();
  width: 16.6%;
  pt(7);
  text-align: right;
  font-weight: 500;
}

.form-mobile {
  inline();
  box();
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  ft(14);
  c(#555);
  border: 1px solid #ddd;

  &::placeholder {
    c(#999);
  }
}

.w-50 {
  inline();
  width: 50%;
  padding: 0 15px;
  box();
}

.form-button {
  inline();
  width: 100%;
  text-align: right;
}

.button {
  pt(40);
  pb(15);
}

.info-change {
  inline();
  ft(14);
  c(#fff);
  bg(#e43834);
  border: 1px solid #e43834;
  radius(4);
  padding: 6px 12px;
  ml(20);

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

.cancel {
  bg(#fff);
  c(#333);
  border-color: #ccc;

  &:hover {
    bg(#eee);
    border-color: #aaa;
  }
}

.getCode {
  vertical-align: top;
  c(#0b94ea);
  cursor: pointer;
  pt(0);
}

.c-999 {
  c(#999);
}

.error {
  color: #e43834;
}
</style>
