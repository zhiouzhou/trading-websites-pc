<template>
  <div class="jiupi-center">
    <div class="changepwd">
      <p>修改密码</p>
      <div class="error" v-bind:class="{hide: !errorMessage}">{{errorMessage}}</div>
      <div class="change">
        <label>旧密码：</label>
        <div class="w-50">
          <input
            :type="pwdState?'text':'password'"
            v-model="oldPassword"
            data-type="old"
            @input="checkPwd"
            maxlength="18"
          >
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState('pwd')" v-if="pwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState('pwd')" v-if="!pwdState">
        </div>
      </div>
      <div class="change">
        <label>新密码：</label>
        <div class="w-50">
          <input
            :type="newpwdState?'text':'password'"
            v-model="newPassword"
            data-type="new"
            @input="checkPwd"
            maxlength="18"
          >
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState('newpwd')" v-if="newpwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState('newpwd')" v-if="!newpwdState">
        </div>
      </div>
      <div class="change">
        <label>再次输入密码：</label>
        <div class="w-50">
          <input
            :type="repwdState?'text':'password'"
            v-model="rePassword"
            data-type="re"
            @input="checkPwd"
            maxlength="18"
          >
          <img src="../../assets/images/zhengyan@2x.png" class="password-close cs" @click="changePwdState('repwd')" v-if="repwdState">
          <img src="../../assets/images/biyan@2x.png" class="password-close cs" @click="changePwdState('repwd')" v-if="!repwdState">
        </div>
      </div>
      <div class="change">
        <label></label>
        <div>
          <a href="javascript:;" @click="savePassword">保存</a>
          <router-link to="/myOrderEntry/myJiupi">取消</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter";
export default {
  name: "changepwd",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      rePassword: "",
      errorMessage: "",
      timeout: false,
      pwdState: false,
      newpwdState: false,
      repwdState: false
    };
  },
  methods: {
    //显示和隐藏密码
    changePwdState(state){
      if(state=='pwd'){
        this.pwdState = !this.pwdState;
      }else if(state == 'repwd'){
        this.repwdState = !this.repwdState;
      }else if(state == 'newpwd'){
        this.newpwdState = !this.newpwdState;
      }
    },
    //显示错误信息
    showError(errorMessage) {
      if (this.timeout) {
        return;
      }
      this.errorMessage = errorMessage;
      this.timeout = true;
      setTimeout(() => {
        this.errorMessage = "";
        this.timeout = false;
      }, 3000);
    },
    //检查密码
    checkPwd(e) {
      let value = e.target.value;
      let partter = /\s/g;
      value = value.replace(partter, "");
      if (e.target.dataset.type == "old") {
        this.oldPassword = value;
      } else if (e.target.dataset.type == "new") {
        this.newPassword = value;
      } else if (e.target.dataset.type == "re") {
        this.rePassword = value;
      }
    },
    //保存修改
    savePassword() {
      if (!this.oldPassword) {
        this.showError("请输入旧密码");
        return;
      }
      if (this.oldPassword == this.newPassword) {
        this.showError("新旧密码不能相同！");
        return;
      }
      if (this.newPassword.length < 6) {
        this.showError("新密码最少输入6个字符");
        return;
      }
      if (this.newPassword != this.rePassword) {
        this.showError("两次密码输入不一致");
        return;
      }
      let data = {
        oldPassword: this.oldPassword,
        password: this.newPassword
      };
      usercenter.changePassword(data).then(
        res => {
          if (res.success == true) {
            localStorage.setItem("PASSWORD", this.newPassword);
            this.$toast({text: "密码修改成功"})
            this.oldPassword = "";
            this.newPassword = "";
            this.rePassword = "";
          } else {
            this.$toast({text: res.desc,type:"fail"})
          }
        },
        error => {
          this.$toast({text: error.msg,type:"fail"})
        }
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
  width: 100%;
}

.changepwd {
  bg(#fff);
  pb(1);
  mb(38);
  min-height: 680px;

  >p {
    pl(20);
    width: 100%;
    height: 84px;
    ft(28);
    c(#333);
    lh(84);
  }
}

.change {
  width: 100%;
  mb(24);

  .w-50 {
    position relative
    width: 52%;
    pl(12);
    ml(0);
  }

  >label {
    inline();
    width: 138px;
    ft(14);
    c(#666);
    text-align: right;
  }

  input {
    box();
    width: 100%;
    height: 34px;
    padding: 11px 12px;
    border: 1px solid #EDEDED;
    c(#333);
  }

  >div {
    ml(16);
    inline();

    a {
      inline();
      bg(#E53935);
      c(#fff);
      ft(18);
      padding: 13px 42px;
      mr(24);
      border: 1px solid #E53935;

      &:nth-of-type(2) {
        bg(#EDEDED);
        c(#333);
        border-color: #E5E5E5;

        &:hover {
          bg(#ddd);
          border-color: #ddd;
        }
      }

      &:hover {
        bg(#ef5350);
        border-color: #ef5350;
      }
    }
  }
}

.error {
  box();
  height: 48px;
  bg(#f9f0f0);
  border-left: 5px solid #e4b9c0;
  mb(20);
  ml(20);
  ft(13);
  pl(15);
  lh(48);
  c(#a94442);
}

.hide {
  display: none;
}

.password-close {
  inline()
  width 18px
  height 18px
  position absolute
  right 10px
  top 50%
  transform translateY(-50%)
}
</style>


