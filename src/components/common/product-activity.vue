<template>
  <div class="ac-product-box" :class="{'h-390':productItem.gatherOrderPrice&&productItem.orderAmount}">
    <div class="acp-top">
      <div class="acp-top-pic">
        <img v-lazy="productItem.imgUrl" :alt="productItem.productName" @click="_jumpProductDetailFromPromotion">
        <!--库存-->
        <div
          class="acp-top-kucun"
          v-if="productItem.inventoryShowText"
        >{{productItem.inventoryShowText}}</div>
        <!--已抢光图标-->
        <div class="acp-top-gone" v-if="productItem.stockState==3||(productItem.stockState==2&&productItem.storeCount==0)" @click="_jumpProductDetailFromPromotion"></div>
      </div>
      <!--产品水印-->
      <div class="acp-top-water" v-if="!hideWater">
        <img
          v-if="productItem.promotionWatermark"
          v-lazy="productItem.promotionWatermark"
          :alt="productItem.productName"
        >
      </div>
      <!--立减-->
      <div class="acp-top-reduce" v-if="productItem.reducePrice">
        <span class="fz10">立减</span>
        <span class="fz10">{{productItem.reducePrice}}元</span>
      </div>
    </div>
    <div class="acp-content">
      <h5 @click="_jumpProductDetailFromPromotion">
        <span v-if="productItem.saleMode==2">【合作】</span>
        <span v-if="productItem.saleMode==6">【经销商】</span>
        <span v-if="productItem.stockState==4">【预售】</span>
        {{productItem.productName}}
      </h5>
      <div class="acp-content-spec">
        <div>规格 {{productItem.specName}}</div>
        <div class="date" v-if="productItem.productionDate">生产日期：{{productItem.productionDate}}</div>
      </div>
      <div class="acp-content-price">
        <div class="p_price" v-if="productItem.gatherOrderPrice>0">
          <span class="price-tag">凑</span>
          <span
            class="c-red"
            v-html="$options.filters.price(productItem.gatherOrderPrice,productItem.priceunit)"
          ></span>
          <del
            class="ml-16"
            v-if="productItem.gatherOrderPrice < productItem.price"
          >&yen;{{$options.filters.priceToFixed(productItem.price)}}</del>
        </div>
        <!--  -->
        <div class="p_price" v-else>
          <span
            class="c-red"
            v-html="$options.filters.price(productItem.price,productItem.priceunit)"
          ></span>
          <del
            class="ml-16"
            v-if="productItem.sellPrice>productItem.price"
          >&yen;{{$options.filters.priceToFixed(productItem.sellPrice)}}</del>
        </div>
      </div>
      <!--自提优惠,会员专享,红包,优惠券,赠品,酒币icon-->
      <div class="acp-content-self-pick" v-if="productItem.jiupiTagShow">
        <i v-if="productItem.giftsTagShow">赠</i>
        <i v-if="productItem.bonusTagShow">¥</i>
        <i v-if="productItem.couponTagShow">券</i>
      </div>
      <div style="align-self:flex-end;flex:1;"></div>
      <!--红包优惠券tag 限时惠产品不显示-->
      <div v-if="productItem.productType!=4" class="acp-content-preferential" v-html="$options.filters.reduceTags(productItem)"></div>
    </div>
    <!--凑单产品凑单信息-->
    <div class="acp-gather" v-if="productItem.gatherOrderPrice&&productItem.orderAmount">
      <span class="fz10">凑单</span>
      <p class="fz10">每件另购{{$options.filters.priceToFixed(productItem.orderAmount)}}元，可享受凑单价，指定商品除外</p>
    </div>
    <!--底部加入购物车-->
    <slot v-if="!isVisitor && productItem.price">
      <div class="acp-bottom" v-if="productItem.canSellStoreCount || productItem.saleMode==2">
        <div class="acp-bottom-wrap flex-center">
          <number-picker :product="productItem"></number-picker>
          <span class="c-3 fz12" v-if="productItem.saleUnit">{{productItem.productSkuId==productItem.productSaleSpecId?productItem.saleUnit:productItem.minUnit}}</span>
        </div>
        <a href="javascript:;" class="pre">
          <toast-cart style="top:-50px;left:-100px" ref="toastCart"></toast-cart>
          <a class="c-w" @click="_addToCart">加入购物车</a>
        </a>
      </div>
    </slot>
    <div class="b_p_munber" v-if="isVisitor">
        <router-link style="width: 100%;" to="/login">{{!productItem.price ? '登录看价' : '登录购买'}}</router-link>
    </div>
  </div>
</template>

<script>
import { mixin } from "./product-mix";
import * as $cache from 'common/cache'
export default {
  mixins: [mixin],
  name: "product-activity",
  data() {
    return {};
  },
  props: {
    productItem: {
      type: Object,
      default: {}
    },
    activity: {
      type: Object,
      default: {}
    },
    hideWater:{
      type: Boolean,
    }
  },
  computed: {},
  created() {
  },
  methods: {
    //跳转到商品详情
    _jumpProductDetailFromPromotion() {
      $cache.setCache("toProductParam", '');
      const {
        activityId,
        state,
        name,
        startTime,
        endTime,
        promotionType,
        enjoyUserLevelDiscount,
        showCountdownTime
      } = this.activity;
      const { href } = this.$router.resolve({
        name: "productDetail",
        query: {}
      });
      const toProductParam = {
        skuId: this.productItem.productSkuId,
        activityId,
        activityState: state,
        activityName: name,
        startTime,
        endTime,
        promotionType,
        enjoyUserLevelDiscount,
        showCountdownTime
      }
      $cache.setCache("toProductParam", toProductParam);
      //点击活动列表页面的产品埋点
      if(this.$route.name==`activityList`){
        const talkingParam = {
          PromotionId: this.activity.activityId,
          PromotionType: this.activity.promotionType,
          PromotionState: this.activity.state,
          SkuId: this.productItem.productSkuId
        }
        this.$createTalkingData("Promotion", "", {},2)
        this.$createTalkingData("Promotion", "Promotion_List", talkingParam)
      }else if(this.$route.name==`activityDetail`){
        this.$createTalkingData("Activity_Content", "", {},2)
        this.$createTalkingData("Activity_Content", "Activity_Content_Product", {SkuId:this.productItem.productSkuId})
      }
/*      this.$router.push({
        name: "productDetail",
        params: {
          skuId: this.productItem.productSkuId,
          activityId,
          activityState: state,
          activityName: name,
          startTime,
          endTime,
          promotionType,
          enjoyUserLevelDiscount,
          showCountdownTime
        }
      });*/
      window.open(href, "_blank");
    }
  }
};
</script>

<style lang="stylus">
@import './stylus/product-activity.styl';
</style>

