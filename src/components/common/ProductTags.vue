<template>
  <div class="tags-wrap">
    <!-- 红包 -->
    <div class="red-packet">
      <i :class="{ canuse: bonusCanuse }"></i>
      <span>{{bonusCanuse?'可用红包':'不可用红包'}}</span>
    </div>
    <!-- 优惠券 -->
    <div class="coupon">
      <i :class="{ canuse: couponCanuse }"></i>
      <span>{{couponCanuse?'可用优惠券':'不可用优惠券'}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      bonusCanuse: {
        type: Boolean,
        default: false
      },
      couponCanuse: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {

      }
    },
    components:{

    },
    beforeCreate(){

    },
    created(){

    },
    methods:{

    }
  }
</script>

<style lang="stylus" scoped>
.tags-wrap{
  display flex;
  align-items center;
  position absolute
  left 0
  bottom 0
  .red-packet,.coupon{
    flex()
    align-items center
    justify-content flex-start
    min-width 90px
    i{
      display inline-block
      width 13px
      height 13px
      background-image url(../../assets/images/canotUse.png)
      background-size contain
      background-repeat no-repeat
      background-position center
      mr(4)
    }
    .canuse{
      background-image url(../../assets/images/canUse.png)
    }
  }
  .red-packet{
    margin-right 12px;
  }
}
</style>
