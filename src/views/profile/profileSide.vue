<template>
  <div id="help" class="clearfix">
    <div class="help flt">
      <div class="help-list">
        <div class="help-title">订单中心</div>
        <div>
          <router-link to="/myOrderEntry/myOrders">我的订单</router-link>
          <router-link to="/myOrderEntry/returnGoodsManage">退货管理</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">资产中心</div>
        <div>
          <router-link to="/myOrderEntry/myCoupon">我的优惠券</router-link>
          <router-link to="/myOrderEntry/myBonus">我的红包</router-link>
          <router-link to="/myOrderEntry/myCoin">我的酒币</router-link>
          <router-link to="/myOrderEntry/myBankCard">我的银行卡</router-link>
          <router-link to="/myOrderEntry/oddBalance">零头结余</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">关注中心</div>
        <div>
          <router-link to="/myOrderEntry/favoriteProduct">商品关注</router-link>
<!--          <router-link to="/myOrderEntry/favoriteShop">经销商关注</router-link>
-->          <router-link to="/myOrderEntry/history">我的足迹</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">帮助中心</div>
        <div>
          <router-link to="/myOrderEntry/findGoods">帮我找货</router-link>
          <router-link to="/myOrderEntry/complainSuggestion">投诉建议</router-link>
          <router-link to="/myOrderEntry/priceReport">价格举报</router-link>
          <router-link to="/myOrderEntry/salesman">联系业务员</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "profile-side",
  data() {
    return {};
  },

  methods: {}
};
</script>
<style lang="stylus" scoped>
#help {
  w(200)
  mb(38);
  mr(20);
}

.help {
  width: 200px;
  bg(#fff);
}

.help-list {
  border-bottom: 1px solid #ededed;
  padding: 24px;

  a {
    block();
    c(#666);
    ft(14);
    padding-bottom: 16px;

    &:last-child {
      padding-bottom: 0;
    }

    &:hover {
      c($color-base-theme);
    }
  }
}

.help-title {
  box();
  width: 100%;
  ft(16);
  c(#333);
  padding-bottom: 24px;
}
</style>


