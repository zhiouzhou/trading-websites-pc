<template> 
  <div>
    <div class="header w">
      <div class="header-logo flt">
        <router-link to="/index/home" class="flt">
          <img src="../../assets/images/logo.png" alt="北京易酒批电子商务有限公司">
        </router-link>
        <div class="header-text c-3 flt">欢迎注册</div>
      </div>
      <div class="header-login frt c-6">已有账号
        <router-link to="/login" class="fz14">请登录</router-link>
      </div>
    </div>
    <div class="line"></div>

    <router-view/>
    <AppFooter/>
  </div>
</template>
<script>
import AppFooter from "../AppFooter.vue";
export default {
  name: "reg",
  components: {
    AppFooter
  }
};
</script>
<style lang="stylus" scoped>
.header {
  height: 100px;
  padding: auto 15px;
  margin: 0 auto 10px;

  .header-logo {
    mt(24);
    height: 60px;
  }

  .header-text {
    ml(24);
    lh(60);
    font-size: 20px;
  }

  .header-login {
    mt(24);
    mr(-15);
    lh(60);
    font-size: 14px;

    a {
      ml(8);
      c(#333);
    }
  }
}

.line {
  height 1px
  bg(#e5e5e5)
}
</style>

