<template>
  <div class="help-content">
    <div class="title">零头结余</div>
    <div class="content">
      <p class="fz16 fw-b mb12">1.下单成功</p>
      <p class="fz14 mb16">在您下单时，系统自动将本次订单应付金额与零头结余相加，计算后所得小数部分为新的零头结余值，并于下次下单时一并结算；</p>
      <p class="fz14 c-6 mb32">
        <span class="fw-b c-3">示例：</span>订单应收金额10.22，历次未收0.30元（即零头结余），则您的订单实付金额为10.00元，本次零头则为0.52元，即新的零头结余值为0.52。
      </p>
      <p class="fz16 fw-b mb12">2.部分配送</p>
      <p class="fz14 mb12">在发生部分配送情况时，先计算部分配送后的订单应收金额；具体公式如下：
        <br>
        <span class="fw-b">订单应收金额=原订单实付金额-退货金额</span>
        <br>然后，将订单应收金额的小数部分累加到您的零头结余账户
      </p>
      <p class="fz14 c-6 mb32">
        <span class="fw-b c-3">示例：</span> 订单应收金额10.22，历次未收金额0.30元（即零头结余），订单实付金额10.00，本次零头结余金额则为0.52元，即新的零头结余值为0.52；发生部分配送，退货1.82元，先计算部分配送后的订单应收金额10.00-1.82=8.18元，将小数部分0.18累加到您的零头结余账户，最新的零头结余值为0.18+0.52=0.70。
      </p>
      <p class="fz16 fw-b mb12">3.取消订单</p>
      <p class="fz14 mb12">取消订单，先计算该订单产生的零头结余变动值，具体公式如下：
        <br>
        <span class="fw-b">零头结余变动值=应付金额-实付金额</span>
        <br>然后，从您的零头结余账户中减去该订单零头结余变动值；
      </p>
      <p class="fz14 c-6 mb32">
        <span class="fw-b c-3">示例：</span> 订单应收金额10.22元，历次未收0.80元（ 即零头结余），订单实付金额11.00元，本次零头则为0.02元，即新的零头结余值0.02；取消订单，则零头结余金额变动值为10.22-11.00=-0.78，从您的零头结余账户减去-0.78，最新的零头结余值为0.02- （-0.78）=0.80。
      </p>
      <p class="fz16 fw-b mb12">4.配送失败</p>
      <p class="fz14">配送失败，与取消订单情况规则一致</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "balance"
};
</script>
<style lang="stylus" scoped>
.help-content {
  ml(220);

  .mb12 {
    mb(12);
  }

  .mb16 {
    mb(16);
  }

  .mb32 {
    mb(32);
  }
}

.title {
  box();
  width: 100%;
  height: 52px;
  lh(52);
  pl(12);
  mb(8);
  ft(16);
  bg(#f5f5f5);
  c(#333);
}

.content {
  padding: 12px 16px;
}

p {
  c(#333);
  line-height: 1.5em;
}
</style>
