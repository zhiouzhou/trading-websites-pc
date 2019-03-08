<template>
  <div class="container">
    <div class="explainContent">
      <p class="explain-title">酒币使用规则
        <span class="frt fz16 cs" @click="cancel">返回<<</span>
      </p>
      <div>
        <p>1.什么是酒币？ 
          <br>酒币是易久批用户在久批客户端购物时获得的奖励，酒币只可以在易久批客户端，PC商城（由北京易酒批 电子商务有限公司提供的一款专门用来批发酒类产品的软件）使用。
        </p>
        <p>2.酒币有什么作用？ 
            <br>1）使用酒币可以在易久批客户端内抽奖。奖品种类多样，详见抽奖页面（首页——酒币抽奖）。 
            <br>2）特定数量的酒币可以使易久批客户拥有参加易久批客户端特定优惠活动的资格，参加某些优惠活动需要消耗一定数量的酒币。例如：某个特价活动可能会要求您具备20个以上酒币才能享有参与资格。 
            <br>3）酒币的数量标志着您的会员级别高低，您拥有的酒币越多，您享受的会员权利就更多，获得的服务便优。
        </p>
        <p>3.如何获得酒币？ 
            <br>在易久批客户端内购买带有酒币标识的产品即可获得酒币。赠送酒币标识，可以在产品详情页 面的促销信息处查看。如下图示，即为赠送酒币产品。赠送数量为一件产品赠送的酒币数量。
        </p>
        <p>4.酒币何时到帐？ 
            <br>订单配送完成后（即交易结束后），酒币即可到帐。如果您发现订单提交后，酒币没有到帐， 这是正常的哟，只有您付款并确认收货（或发货满24h系统自动确认交易完成），订单才完成。
        </p>
        <p>5.酒币有效期是多久？ 
            <br>目前酒币为永久有效期。
        </p>
        <p>6.酒币可否从A账户转到B账户？ 
            <br>亲爱的用户，酒币是不可以从A账户转到B账户的哟。 
            <br>（注：酒币获取方法及使用规则实时完善中，请以最新版本为准。）
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ruleCoin",
  methods: {
      //返回上一页
      cancel(){
        this.$router.go(-1);
      }
    }
};
</script>
<style lang="stylus">
.explainContent {
  bg(#fff);
  padding: 0 20px;
  ml(220)
  mb(39)
  min-height 652px

  .explain-title {
    padding: 24px 0;
    ft(28);
    c(#333);

    span {
      inline()
      c(#4A90E2)
      lh(28)
    }
  }

  div {
    padding-bottom: 40px;

    p {
      padding-bottom: 16px;
      ft(14);
      c(#333);
      line-height: 20px;
    }

    span {
      c(#e43834);
      line-height: 20px;
    }
  }
}
</style>
