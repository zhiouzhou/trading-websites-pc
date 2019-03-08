<template>
  <div class="help-content">
    <div class="title">优惠码</div>
    <h5>优惠码使用说明</h5>
    <ul>
      <li>1、成功获取优惠码后，即可在指定商品购买时使用，需选择商品后，进入提交订单页中输入6位兑换码获得指定商品优惠；</li>
      <li>2、优惠码仅限指定商品使用；（每次仅限1件商品，限时惠和组合活动除外）；</li>
      <li>3、优惠码不可与单品赠品优惠叠加使用，优惠码优惠优先生效；</li>
      <li>4、单笔订单只能使用1个优惠码，请根据实际需购买的商品数量拆分相同数量的订单分批购买；</li>
      <li>5、使用了优惠码享受优惠的商品发生退款时，优惠码减去的金额一概不退；</li>
      <li>6、优惠码一经使用即不再有效，退款后也不可恢复使用。</li>
    </ul>
    <h5>优惠码使用说明</h5>
    <p>拍下活动指定商品，在提交订单页“使用优惠码”框中 输入优惠码，并点击“使用”按钮，即可获得指定商品优惠或赠品</p>
    <div class="code-img"></div>
  </div>
</template>
<script>
export default {
  name: "promotioncode"
};
</script>
<style lang="stylus" scoped>
.help-content {
  ml(220);

  p {
    ft(14);
    c(#666);
    line-height: 1.4em;
  }

  h5 {
    c(#333);
    ft(18);
    position: relative;
    pl(10);
    margin: 12px 0;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 1px;
      bg(#E7372D);
      height: 16px;
      width: 5px;
      radius(3);
    }
  }

  ul {
    mb(30);
  }

  li {
    mb(8);
    c(#666);
    ft(14);
    line-height: 1.4em;
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

.code-img {
  mt(20)
  width: 80%;
  padding-bottom: 50%;
  background-image: url('../../assets/images/coupon_code_tip_bg1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
