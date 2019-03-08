<template>
  <div>
    <app-header />
    <div>
      <div class="header w">
        <div class="settlement-wrap">
          <div class="header-logo flt">
            <router-link to="/index/home"  class="flt">
              <img src="../../assets/images/logo.png" alt="北京易酒批电子商务有限公司">
            </router-link>
          </div>
          <div class="settlement-title">结算页</div>
          <div class="settlement-subheader">
            <ul class="subheader-list">
              <li>购物车</li>
              <li>确认订单信息</li>
              <li>提交订单</li>
            </ul>
          </div>
        </div>
      </div>
      <router-view/>
    </div>
    <app-footer/>
  </div>
</template>
<script>
  import AppHeader from '../AppHeader.vue'
  import AppFooter from '../AppFooter.vue'
  export default {

    components: {
      AppHeader,
      AppFooter
    }
  }
</script>
<style lang="stylus" scoped>
.header {
  height: 100px;
  padding: auto 15px;
  margin: 0 auto 10px;

  .header-logo {
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
  .settlement-wrap{
    flex()
    align-items center
    mt(34)
  }
  .settlement-title{
    ft(20)
    c(#333)
    ml(32)
  }
  .settlement-subheader{
    flex-1()
    .subheader-list{
      float right
      pt(55)
      w(480)
      h(84)
      flex()
      background-repeat: no-repeat;
      background-position: center 0;
      box-sizing: border-box;
      background-image: url(../../assets/images/state_order1.png);
      li{
        h(24)
        lh(24)
        text-c()
        width 33.3%
      }
    }
  }
</style>

