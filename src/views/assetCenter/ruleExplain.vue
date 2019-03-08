<template>
  <div class="container">
    <div class="explainContent">
      <p class="explain-title">零头计算细则说明
        <span class="frt fz16 cs" @click="cancel">返回<<</span>
      </p>
      <div class="pt-16">
        <p>1、下单成功</p>
        <p>在您下单时，系统自动将本次订单应付金额与零头结余相加，计算后所得小数部分为新的零头结余值，并于下次下单时一并结算；</p>
        <p>示例：<span>订单应收金额10.22元，历次未收0.30元（即零头结余），则您的订单实付金额为10.00元，本次零头则为0.52元，即新的 零头结余值为0.52；</span></p>
      </div>
      <div>
        <p>2、部分配送</p>
        <p>在发生部分配送情况时，先计算部分配送后的订单应收金额；具体公式如下：订单应收金额=原订单实付金额—退货金额；然后， 将订单应收金额的小数部分累加到您的零头结余账户；</p>
        <p>示例：<span>订单应收金额10.22元，历次未收0.30元（即零头结余），订单实付金额10.00元，本次零头则为0.52元，即新的零头结余 值为0.52；发生部分配送，退货1.82元，先计算部分配送后订单应收金额10.00-1.82=8.18元，将小数部分0.18累加到您的零头 结余账户，最新的零头结余值为0.18+0.52=0.70；</span>
        </p>
      </div>
      <div>
        <p>3、取消订单</p>
        <p>取消订单，先计算该订单产生的零头结余变动值，具体公式如下：零头结余变动值=应付金额-实付金额；然后，从您的零头结余账 户中减去该订单的零头结余变动值；</p>
        <p>示例：<span>订单应收金额10.22元，历次未收0.80元（即零头结余），订单实付金额11.00元，本次零头则为0.02元，即新的零头 结余值为0.02；取消订单，则零头结余金额变动值为10.22-11.00= -0.78，从您零头结余账户减去-0.78，最新的零头结余 值为0.02-（-0.78）0=0.80。</span>
        </p>
      </div>
      <div>
        <p>4、 配送失败</p>
        <p>配送失败，与取消订单情况规则一致。</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ruleExplain",
    methods: {
      //返回上一页
      cancel(){
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .explainContent {
    bg(#fff)
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
      padding-bottom: 24px;
      p {
        padding-bottom: 16px;
        ft(14);
        c(#333)
        line-height: 17px;
      }
      span {
        c(#666);
        line-height: 17px
      }
    }
  }

  .pt-16 {
    pt(16)
  }
</style>
