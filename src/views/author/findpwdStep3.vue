<template> 
  <div class="reg w">
    <div class="success c-6">您的密码已修改成功!</div>
    <div class="password-button">
      <router-link tag="p" to="/index/home">返回首页</router-link>
      <router-link tag="p" to="/login">立即登录</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "findpwdStep3"
};
</script>
<style lang="stylus" scoped>
.reg {
  pb(100);
  lh(20);
  overflow: hidden;
}

.success {
  mt(120);
  pt(128);
  background: url('../../assets/images/tijiaochenggong@2x.png') no-repeat center top;
  background-size: 96px 96px
  text-c();
  font-size: 20px;
}

.password-button {
  margin auto
  mt(32)
  w(316)

  p {
    inline()
    w(152)
    h(36)
    border 1px solid #dddddd
    lh(36)
    text-c()
    c(#333)
    ft(14)
    cursor pointer

    &:nth-of-type(2){
      frt()
      bg(#E53935)
      border-color #E53935
      c(#fff)
    }
  }
}
</style>

