<template> 
  <div class="reg">
    <div class="success c-3">
      <!--     您的账号信息已成功提交到后台,我们会尽快为您审核! -->
      您的注册信息提交成功，我们将于五日内审核，请耐心等待！谢谢！
    </div>
    <router-link tag="div" class="goHome cs" to="/index/home">
      返回首页
    </router-link>
  </div>
</template>
<script>
export default {
  name: "regStep3"
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
.goHome {
  w(152)
  h(36)
  border 1px solid #DDDDDD
  ft(14)
  c(#333)
  text-c()
  lh(36)
  margin auto
  mt(32)
}
</style>

