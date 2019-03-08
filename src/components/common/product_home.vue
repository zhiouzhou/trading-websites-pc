<template>
  <div
    class="product-wrap pre"
    :class="{'product-wrap-hover': productItem.canSellStoreCount || !productItem.promotionType}"
  >
    <div class="p_reduce" v-if="productItem.reducePrice">立减
      <br>
      {{productItem.reducePrice}}元
    </div>
    <img
      class="p_mark"
      v-if="productItem.promotionWatermark"
      v-lazy="productItem.promotionWatermark"
      :alt="productItem.productName"
    >
    <div class="p_content">
      <a href="javascript:;" class="p_img">
        <img
          width="140"
          height="140"
          v-lazy="productItem.imgUrl"
          :alt="productItem.productName"
          @click="_jumpProductDetailFromHome"
        >
        <span class="sale-out-icon" v-if="productItem.saleMode!=2 && (productItem.stockState === 3 || !productItem.canSellStoreCount)"></span>
        <span
          class="p_kucun"
          v-if="productItem.inventoryShowText">{{productItem.inventoryShowText}}</span>
      </a>
      <p class="p_name" @click="_jumpProductDetailFromHome">{{productItem.productName}}</p>
      <div class="p_spec">规格：{{productItem.specName}}</div>
      <!--  -->
      <div class="p_price" v-if="productItem.gatherOrderPrice>0">
        <span
          class="c-red"
          v-html="$options.filters.price(productItem.gatherOrderPrice,productItem.priceunit)"
        ></span>
        <del v-if="productItem.gatherOrderPrice < productItem.price">&yen;{{productItem.price}}</del>
      </div>
      <!--  -->
      <div class="p_price" v-else>
        <span
          class="c-red"
          v-html="$options.filters.price(productItem.price,productItem.priceunit)"
        ></span>
        <del v-if="productItem.sellingPrice>productItem.price">&yen;{{productItem.sellingPrice}}</del>
      </div>
    </div>
    <!--  -->
    <slot v-if="!isVisitor && productItem.price">
      <div class="p_munber clearfix" v-if="productItem.canSellStoreCount || productItem.saleMode==2">
        <div class="p_munber_wrap">
          <number-picker :product="productItem" class="inline"></number-picker>
          <span class="c-3 fz12 inline" v-if="productItem.saleUnit">{{productItem.productSkuId==productItem.productSaleSpecId?productItem.saleUnit:productItem.minUnit}}</span>
        </div>
        <a href="javascript:;" class="pre">
          <toast-cart style="top:-50px;left:-100px" ref="toastCart"></toast-cart>
          <a class="c-w" @click.stop="_addToCartFromHome">加入购物车</a>
        </a>
      </div>
      <!--  -->
      <div class="p_munber" v-else>
        <a
          v-if="!productItem.promotionType"
          style="width: 100%;"
          href="javascript:;"
          @click="_getProductNotify"
        >{{productItem.alreadyArrivalNotice ? '已订阅到货通知' : '到货通知'}}</a>
      </div>
    </slot>
    <div class="p_munber" v-if="isVisitor">
      <router-link style="width: 100%;" to="/login">{{!productItem.price ? '登录看价' : '登录购买'}}</router-link>
    </div>
  </div>
</template>

<script>
import { mixin } from "./product-mix";
export default {
  mixins: [mixin],
  name: "product-home",
  data() {
    return {};
  },
  props: {
    productItem: {
      type: Object,
      default: {}
    }
  },
  computed: {},
  created() {},
  methods: {}
};
</script>
<style lang="stylus">
@import './stylus/product-home.styl';
</style>


