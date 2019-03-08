<template>
  <div class="apply-explain" v-if="show">
    <div class="dialog-background"></div>
    <div class="cash-dialog">
      <p class="cash-dialog-close cs" @click="close">关闭</p>
      <div>
        <h5 class="cash-title">兑奖说明</h5>
        <p class="cash-text">1、只能兑换从易久批平台购买的商品。</p>
        <p class="cash-text">2、奖品会折算成易久批红包直接返到用户账号，可用于购买平台上任意商品(部分特价商品除外)。</p>
        <p class="cash-text">3、兑奖订单会和最近一次订单一起由司机上门处理；如果您近期内不会下单而又急需兑奖，建议联系您的经纪人处理。</p>
        <p class="cash-text">4、红包到账时间：司机上门取回兑换券（如：瓶盖）后第二天到账。</p>
        <p class="cash-text">5、兑奖券有期限，请于有效期内兑换，否则会导致兑奖失败。</p>
        <p class="cash-text">6、兑奖请遵守诚实守信原则，文明有礼兑换。</p>
        <p class="cash-text">7、由于用户原因导致的兑奖失败，由用户自行承担，谢谢合作。</p>
      </div>
      <p class="cash-look cs" @click="close">{{text}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: ''
      }
    },
    methods: {
      close(){
        this.$emit('closeExplain')
      }
    }
  };
</script>
<style lang="stylus" scoped>

.apply-explain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow auto
}

  .dialog-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    bg(#000);
    opacity: 0.5;
  }

  .cash-dialog {
    box()
    position: relative;
    margin: 10% auto 0;
    width: 697px;
    height: 593px;
    padding: 180px 70px 0 110px;
    background: url('../../assets/images/cash-dialog-bg_03.png') no-repeat 0px 20px;
  }
  .cash-dialog-close {
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    &:hover {
      c(#E53935)
    }
  }
  .cash-title {
    line-height 2
    padding-left: 8px;
    font-size: 16px;
    color: #fdcf5a;
  }
  .cash-text {
    font-size: 12px;
    line-height: 2;
    color: #FFFFff;
  }
  .cash-look {
    position: absolute;
    width: 200px;
    height: 36px;
    left: 52%;
    bottom: 85px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    -khtml-transform: translateX(-50%);
    transform: translateX(-50%);
    line-height: 36px;
    font-size: 24px;
    color: #fdd75b;
    text-align: center;
  }
</style>
