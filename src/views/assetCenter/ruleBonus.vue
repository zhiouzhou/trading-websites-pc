<template>
  <div class="container">
    <div class="explainContent">
      <p class="explain-title">红包使用规则
        <span class="frt fz16 cs" @click="cancel">返回<<</span>
      </p>
      <div>
        <p>1.什么是红包？
          <br>红包是在易久批客户端，PC商城（由北京易酒批电子商务有限公司提供的一款专门用来批发酒类产品的 软件）购买产品获得的红包返还。
        </p>
        <p>2.红包有什么用？
          <br>红包就好比您的现金：除少量特价优惠活动外，红包可在易久批平台抵作现金使用。
        </p>
        <p>3.如何获得红包？
            <br>在易久批客户端内购买带有红包标识的产品，即可获得相应的红包。另外，系统还会经常给您 发送各种“名目”的红包讨好您。
        </p>
        <p>4.如何使用红包？ 
            <br>订单结算时，进入待确认订单页面，在此页面可以选择是否使用红包。
        </p>
        <p>5.一个订单可以使用几个红包？一天内可以使用多少个红包？ 
            <br>一个订单可以使用的多个红包，一天内使用红包的个数无限制。
        </p>
        <p>6.红包可以兑现或者找零吗？ 
            <br>红包不可以兑现，也不可以找零。如果使用的红包多于应付货款，那么多余的红包将被自动作废。
        </p>
        <p>7.红包可以账户之间转用么？ 
            <br>A账户红包只能在A账户内使用，不可以转给B账户或者代B账户付款。
        </p>
        <p>8.使用红包结账的订单，取消后，红包会被退回么？
            <br>如果订单使用了红包，但是又取消了订单，红包会直接退回到您的账户中。
        </p>
        <p>9.什么是红包的有效期？ 
            <br>红包有效期即红包的最后使用期限，超过这个时间未使用，则红包失效。
        </p>
        <p>10.红包何时到帐？ 
            <br>订单配送完成后（交易完成后），红包即可到帐。如果您发现订单提交后，红包没有到帐，这 是正常的哟。 （注：红包获取方法及使用规则实时完善中，请以最新版本为准。）
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ruleBonus",
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
  min-height: 682px;
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
