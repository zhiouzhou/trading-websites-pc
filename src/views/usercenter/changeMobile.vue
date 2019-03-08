<template>
  <div class="jiupi-center">
    <div class="userinfo">
      <p class="info-title">修改手机号</p>
      <form class="info-content">
        <p>
          <span class="red">*</span>&nbsp;&nbsp;&nbsp;&nbsp;更换手机号，下次登录请使用新手机号登录。当前手机号：
          <span class="red fw-b">{{mobileNo}}</span>
        </p>
        <div class="form-country">
          <label>
            国家/地区
            <span class="red">*</span>
          </label>
          <p>中国</p>
        </div>
        <div>
          <label>
            +86
            <span class="red">*</span>
          </label>
          <div class="w-50">
            <input type="text" placeholder="请填写新手机号码" class="form-mobile" v-model="newMobileNo" @input="inputMobile" maxlength="11">
          </div>
        </div>
        <div>
          <label></label>
          <div class="w-50">
            <div class="form-button">
              <a href="javascript:;" class="info-change" :class="{'no-nextstep': newMobileNo.length<11}" @click="nextStep">下一步</a>
              <router-link to="/myOrderEntry/editUserinfo" class="info-change cancel">取消</router-link>
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
  name: "changeMobile",
  data() {
    return {
      mobileNo: "",
      newMobileNo: "",
      error: {
        mobileError: ""
      }
    };
  },
  created() {
    usercenter.getUserInfo().then(res => {
      this.mobileNo = res.data.mobileNo;
    });
  },
  methods: {
    checkMobile() {
      let result = true;
      var partter = /^0?1[3|4|5|6|8|7|9][0-9]\d{8}$/;
      var reg = new RegExp(partter);
      if (!this.newMobileNo) {
        this.$alert("手机号不能为空");
        result = false;
      } else if (!reg.test(this.newMobileNo)) {
        this.$alert("手机号格式不正确");
        result = false;
      }
      return result;
    },
    //检查输入手机号
    inputMobile(e){
      let mobileNo = '';
      let value = e.target.value;
      let partter = /[^\d]/g;
      mobileNo = value.replace(partter,'');
      this.newMobileNo = mobileNo;
    },
    nextStep() {
      let result = this.checkMobile();
      if (result) {
        author.isUserExist(this.newMobileNo).then(
          res => {
            if (!res.data) {
              this.$confirm({
                content: `我们将发送验证码到这个号码:+86${this.newMobileNo}`
              })
                .then(() => {
                  author.getCode(this.newMobileNo).then(
                    res => {
                      if (res.success) {
                        this.validateCodeId = res.data.identifyingCodeId;
                        this.$router.push({
                          name: "changeMobileCode",
                          params: {
                            newMobileNo: this.newMobileNo,
                            validateCodeId: this.validateCodeId
                          }
                        });
                      } else {
                        this.$(res.msg);
                      }
                    },
                    error => {
                      if (error.msg == "验证码调用频率过快") {
                        this.$alert(res.msg);
                      } else {
                        this.$alert("请稍后重试");
                      }
                    }
                  );
                })
                .catch(() => {});
            } else {
              this.$alert("该手机号已注册");
            }
          },
          error => {
            this.$alert(error.msg);
          }
        );
      }
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
  &:
  :-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

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
  mt(40);
  mb(15);
  text-align: right;
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

.cancel {
  bg(#fff);
  c(#333);
  border-color: #ccc;

  &:hover {
    bg(#eee);
    border-color: #aaa;
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
</style>

