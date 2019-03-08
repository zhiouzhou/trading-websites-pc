<template>
  <div id="help">
    <div class="help flt" ref="dom">
      <div class="help-list">
        <div class="help-title">订单中心</div>
        <div class="select-dom">
          <router-link to="/myOrderEntry/myOrders" :class="{'selectedColor': titleColor == 'myOrders'||titleColor == 'orderDetail'}">我的订单</router-link>
          <router-link to="/myOrderEntry/returnGoodsManage" :class="{'selectedColor': titleColor == 'returnGoodsManage'||titleColor == 'returnGoodsDetail'}">退货管理</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">资产中心</div>
        <div class="select-dom">
          <router-link to="/myOrderEntry/myCoupon" :class="{'selectedColor': titleColor == 'myCoupon'||titleColor == 'ruleCoupon'}">我的优惠券</router-link>
          <router-link to="/myOrderEntry/myBonus" :class="{'selectedColor': titleColor == 'myBonus'||titleColor == 'ruleBonus'}">我的红包</router-link>
          <router-link to="/myOrderEntry/myCoin" :class="{'selectedColor': titleColor == 'myCoin'||titleColor == 'ruleCoin'||titleColor == 'winescore'}">我的酒币</router-link>
          <router-link to="/myOrderEntry/myBankCard" :class="{'selectedColor': titleColor == 'myBankCard'}">我的银行卡</router-link>
          <router-link to="/myOrderEntry/oddBalance" :class="{'selectedColor': titleColor == 'oddBalance'||titleColor == 'ruleExplain'}">零头结余</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">关注中心</div>
        <div class="select-dom">
          <router-link to="/myOrderEntry/favoriteProduct" :class="{'selectedColor': titleColor == 'favoriteProduct'}">商品关注</router-link>
          <router-link to="/myOrderEntry/favoriteShop" :class="{'selectedColor': titleColor == 'favoriteShop'}">经销商关注</router-link>
          <router-link to="/myOrderEntry/history" :class="{'selectedColor': titleColor == 'history'}">我的足迹</router-link>
        </div>
      </div>
      <div class="help-list">
        <div class="help-title">帮助中心</div>
        <div class="select-dom">
          <router-link to="/myOrderEntry/prizeApply" :class="{'selectedColor': titleColor == 'prizeApply'||titleColor == 'applyDetail'}">兑奖申请</router-link>
          <router-link to="/myOrderEntry/findGoods" :class="{'selectedColor': titleColor == 'findGoods'||titleColor == 'addFindGoods'||titleColor == 'goodsDetail'}">帮我找货</router-link>
          <router-link to="/myOrderEntry/complainSuggestion" :class="{'selectedColor': titleColor == 'complainSuggestion'||titleColor == 'addNewComplain'}">投诉建议</router-link>
          <!-- <router-link to="/myOrderEntry/priceReport" :class="{'selectedColor': titleColor == 'priceReport'}">价格举报</router-link> -->
          <router-link to="/myOrderEntry/salesman" :class="{'selectedColor': titleColor == 'salesman'}">联系业务员</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "help",
    data(){
      return{
        titleColor: ""
      }
    },
    props:{
      pathName:{
        type:String
      }
    },
    mounted(){
      this.titleColor = this.$route.name;
    },
    methods:{
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
    mb(38);
    mr(20);
    float left
  }

  .help {
    width: 200px;
    bg(#fff)

  }

  .help-list {
    border-bottom: 1px solid #ededed;
    padding: 24px

    a {
      block();
      c(#666);
      ft(14);
      padding-bottom: 16px
      font-family:MicrosoftYaHei;
      &:last-child {
        padding-bottom: 0
      }

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
    width: 100%;
    ft(16);
    c(#333);
    padding-bottom: 24px;
    font-family: MicrosoftYaHei;
  }
</style>
