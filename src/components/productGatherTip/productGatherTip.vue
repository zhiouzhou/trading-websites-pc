<template>
  <div :class="{'fixed-bottom':fixedShow}" v-if="!hiddenTip">
    <div class="tip-bar">
      <div class="tb-l">
        <p>
          <span class="title">{{promptObj.title}}</span>
          <span class="tip">{{promptObj.meetTip}}</span>
        </p>
      </div>
      <div class="tb-r">
        <div class="content">
          <p>已选<i>{{totalCount}}</i>，总计：<span class="price">￥{{$options.filters.priceToFixed(totalMoney)}}</span></p>
          <h5>{{promptObj.conditionTip}}</h5>
        </div>
        <div class="btn">
          <router-link to="/cartIndex/shopCart">去购物车</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as GatherUtil from "common/productGatherUtil/productGatherUtil";
  import bus from "common/bus";
  import * as $cache from "common/cache";

  export default {
    props: {
      gatherObj: {
        type: Object
      },
    },
    data() {
      return {
        prompt: ``,
        promptObj: {},
        totalCount: 0,
        totalMoney: 0,
        hiddenTip: false,
        fixedShow: true
      }
    },
    components:{

    },
    beforeCreate(){

    },
    created(){
      if(!this.$route.query.gatherType){
        this.hiddenTip = true
        return
      }
      this.initPrompt()
    },
    beforeDestroy(){
      $cache.setCache('currentGoods',[])
    },
    destroyed(){

    },
    mounted(){
      bus.$off("listCreat")
      bus.$off("updatePrompt")
      bus.$on("listCreat", (data) => {
        this.settlementBarFixed(data)
      });
      bus.$on("updatePrompt", (data) => {
        let goods = $cache.getCache('currentGoods') || []
        goods.push(data)
        $cache.setCache('currentGoods',goods)
        GatherUtil.getUserCouponPrompt.call(this)
      });
    },
    methods:{
      //初始化起送优惠提示信息
      initPrompt(){
        $cache.setCache('currentGoods',[])
        GatherUtil.getUserCouponPrompt.call(this)
      },
      settlementBarFixed(h) {
        let roofTop = h
        let _this = this
        window.addEventListener('scroll', function() {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          let windowHeight = document.documentElement.clientHeight;
          if(scrollTop + windowHeight >= roofTop) {
            _this.fixedShow = false
          } else {
            _this.fixedShow = true
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped>
.fixed-bottom{
  position fixed
  left 0
  bottom 0
  width 100%
  bg(#fff)
  box-shadow:0px -4px 8px 0px rgba(0,0,0,0.1)
  z-index 10
}
.tip-bar{
  bg(#FAFAFB)
  border 1px solid #ededed;
  height 56px;
  ft(12)
  c(#666)
  font-size 12px;
  flex()
  align-items center;
  justify-content space-between;
  box-sizing border-box
  .tb-l{
    flex-1()
    p{
      ml(16)
      inline()
      border 1px solid #FFA727
      ft(12)
      c(#FFA727)
      padding 8px
      .title{
        inline()
        pr(8)
        border-right 1px solid #FFA727
        mr(8)
      }
    }
  }
  .tb-r{
    flex()
    align-items center
    .content{
      mr(24)
      ft(12)
      c(#666)
      p{
        mb(6)
        i,span{
          c(#e53935)
          font-weight 600
        }
        .price{
          ft(16)
        }
      }
      h5{
        c(#e53935)
        font-weight 600
      }
    }
    .btn{
      w(120)
      h(56)
      lh(56)
      bg(#e53935)
      ft(18)
      c(#fff)
      text-c()
      cp()
      a{
        ft(18)
        c(#fff)
      }
    }
  }
}
.tip-bar{
  width: 990px;
  margin: 0 auto;
}
@media screen and (min-width: 1230px){
  .tip-bar{
    width: 1210px;
  }
}
</style>
