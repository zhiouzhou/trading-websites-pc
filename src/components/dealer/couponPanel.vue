<template>
    <div class="panel-wrap" v-if="couponList.length">
      <ul>
        <li class="coupon-list" v-for="(item,i) in couponList" :key="item.promotionId">
          <div class="cl-l">
            <span>¥</span>
            <h3>{{item.amount}}</h3>
          </div>
          <div class="cl-r">
            <div class="content">
              <h5>{{item.couponDesc}}</h5>
              <p class="text-overflow1">{{item.couponUseDesc}}</p>
              <span>使用期限：{{item.effectDate}}-{{item.expireDate}}</span>
            </div>
            <div class="btn">
              <span :class="{'done': item.alreadyReceived}" @click="getCoupon(item,i)">{{item.alreadyReceived?`已领取`:`立即领取`}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<style lang="stylus" scoped>
.panel-wrap{
  bg(#fff)
  box-shadow 0px 2px 4px 2px rgba(0,0,0,0.08)
  z-index 10
  position relative
  &:after{
    content ""
    position absolute
    top -15px
    right 15px
    width 0
    height 0
    border-right 20px solid transparent
    border-left 20px solid transparent
    border-bottom 15px solid #fff
  }
  ul{
    overflow-y scroll
    max-height 600px
    &:li:last-child:before{
      background transparent
    }
  }
}
.coupon-list{
  flex()
  align-items center
  padding 25px 0
  overflow-x hidden
  position relative
  &:before{
    content ""
    position absolute
    left 140px
    bottom 0
    height 1px
    width 100%
    bg(#ededed)
  }
  .cl-l{
    c(#5E91E2)
    flex()
    align-items flex-end
    justify-content center
    w(140)
    min-width 140px
    h3{
      ft(48)
    }
    span{
      ft(28)
    }
  }
  .cl-r{
    flex-1()
    flex()
    align-items center
    .content{
      flex-1()
      flex-direction column
      h5{
        c(#333)
        ft(16)
      }
      p,span{
        c(#666)
        ft(12)
      }
      p{
        margin 12px 0
        line-height 1.4
      }
    }
    .btn{
      mr(30)
      ml(20)
      span{
        display inline-block
        w(80)
        h(30)
        lh(30)
        text-align center
        bg(#5E91E2)
        ft(12)
        c(#fff)
        border-radius 2px
        cursor pointer
      }
      .done{
        bg(#BDBDBD)
      }
    }
  }
}
</style>

<script>
  import { attentionShop } from "api/dealer/dealer"
  import { debounce } from "common/lodash"
  import bus from "common/bus";
  import { dealerApplyStock } from "api/dealer/dealer"
  export default {
    props: {
      couponList: {
        type: Array,
        default: []
      },
    },
    data() {
      return {
        popShow: false,
      }
    },
    components:{

    },
    mounted() {

    },
    created(){

    },
    methods:{
      //领取优惠券
      getCoupon(e,i){
        if(e.alreadyReceived) return
        let param = {
          data: e.promotionId
        }
        receiveDealerCoupon(param)
          .then(res => {
            if (res.success) {
              this.couponList[i].surplusCount -= 1
              this.couponList[i].alreadyReceived = true
              this.$message(`领取成功`)
            }
          })
          .catch(res => {});
      },
    },
    watch:{

    }
  }
</script>

