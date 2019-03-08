<template>
  <div id="help" class="w clearfix">
    <div class="help flt">
      <div class="help-list">
        <div class="help-title">关于我们</div>
        <div>
          <router-link to="/index/help/about" :class="{'selectedColor': titleColor == 'about'}">关于久批</router-link>
          <router-link to="/index/help/culture" :class="{'selectedColor': titleColor == 'culture'}">久批文化</router-link>
          <router-link to="/index/help/contact" :class="{'selectedColor': titleColor == 'contact'}">联系久批</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">新手入门</div>
        <div>
          <router-link to="/index/help/howreg" :class="{'selectedColor': titleColor == 'howreg'}">如何注册</router-link>
          <router-link to="/index/help/shopprocess" :class="{'selectedColor': titleColor == 'shopprocess'}">购物流程</router-link>
          <router-link to="/index/help/protocal" :class="{'selectedColor': titleColor == 'protocal'}">服务协议</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">批发服务</div>
        <div>
          <router-link to="/index/help/aftersales" :class="{'selectedColor': titleColor == 'aftersales'}">售后服务</router-link>
          <router-link to="/index/help/returnprocess" :class="{'selectedColor': titleColor == 'returnprocess'}">退货流程</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">支付配送</div>
        <div>
          <router-link to="/index/help/deliverymethod" :class="{'selectedColor': titleColor == 'deliverymethod'}">配送方式</router-link>
          <router-link to="/index/help/deliveryrule" :class="{'selectedColor': titleColor == 'deliveryrule'}">配送细则</router-link>
          <router-link to="/index/help/paymethod" :class="{'selectedColor': titleColor == 'paymethod'}">付款方式</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">帮助中心</div>
        <div>
          <router-link to="/index/help/faq" :class="{'selectedColor': titleColor == 'faq'}">常见问题</router-link>
          <router-link to="/index/help/promotioncode" :class="{'selectedColor': titleColor == 'promotioncode'}">优惠码</router-link>
          <router-link to="/index/help/forgetpwd" :class="{'selectedColor': titleColor == 'forgetpwd'}">忘记密码</router-link>
          <router-link to="/index/help/balance" :class="{'selectedColor': titleColor == 'balance'}">零头结余</router-link>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "help",
  data(){
    return {
      titleColor: ""
    }
  },
  mounted(){
      this.titleColor = this.$route.name;
  },
  watch: {
      "$route": function (to, from) {
        this.titleColor = to.name
    }
  }
};
</script>
<style lang="stylus" scoped>
#help {
  pt(16);
  mb(38)
}

.help {
  width: 200px;
}

.help-list {
  width: 100%;
  mb(10px);

  a {
    block();
    height: 36px;
    lh(36);
    pl(36);
    c(#666);
    ft(14);

    &:hover {
        c(#E53935)
    }
  }

  .selectedColor {
    c(#E53935)
  }
}

.help-title {
  box();
  pl(12);
  width: 100%;
  height: 42px;
  lh(42);
  ft(16);
  bg(#f5f5f5);
  c(#666);
}
</style>


