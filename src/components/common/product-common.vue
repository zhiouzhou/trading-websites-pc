<template>
  <div common class="product-common-container product-common-hover">
    <div class="product-common-reduce" v-if="productItem.reducePrice">立减
      <br>
      {{productItem.reducePrice}}元
    </div>
    <img
      class="product-common-mark"
      v-if="productItem.promotionWatermark"
      v-lazy="productItem.promotionWatermark"
      :alt="productItem.productName"
    >
    <a href="javascript:;" class="product-common-img">
      <img
        width="140"
        height="140"
        v-lazy="productItem.imgUrl"
        :alt="productItem.productName"
        @click="_jumpProductDetailFromCommon"
      >
      <span
        class="sale-out-icon"
        v-if="productItem.saleMode!=2 && (productItem.stockState === 3 || !productItem.canSellStoreCount)"
      ></span>
      <span
        class="product-common-kucun"
        v-if="productItem.inventoryShowText"
      >{{productItem.inventoryShowText}}</span>
    </a>
    <p class="product-common-name" @click="_jumpProductDetailFromCommon">
      <span v-if="productItem.saleMode==2">【合作】</span>
      <span v-if="productItem.saleMode==6">【经销商】</span>
      <span v-if="productItem.stockState==4">【预售】</span>
      {{productItem.productName}}
    </p>
    <div class="product-common-spec">
      规格：{{productItem.specName}}
      <span
        class="ml12 c-9"
        v-if="productItem.productionDate"
      >生产日期：{{productItem.productionDate}}</span>
    </div>
    <!--  -->
    <div class="product-common-price" v-if="productItem.gatherOrderPrice">
      <b class="product-common-decoration">凑</b>
      <span
        class="c-red"
        v-html="$options.filters.price(productItem.gatherOrderPrice,productItem.priceunit)"
      ></span>
      <del
        v-if="productItem.gatherOrderPrice < productItem.price && !productItem.customerLevelPrice"
        class="ml16 c-9"
      >&yen;{{$options.filters.priceToFixed(productItem.price)}}</del>

      <span class="ml10 c-3 fz14" v-if="productItem.customerLevelPrice ">
        <span class="product-customer-name">{{productItem.customerLevelName}}</span>
        &yen;{{$options.filters.priceToFixed(productItem.customerLevelPrice)}}
      </span>
    </div>
    <!--  -->
    <div class="product-common-price" v-else>
      <b class="product-common-decoration" v-if="productItem.isDiscount">促</b>
      <span class="c-red" v-if="productItem.saleMode!=6" v-html="$options.filters.price(productItem.price, productItem.priceunit)"></span>
      <!--经销商产品-->
      <span class="c-red" v-else v-html="$options.filters.dealerPrice(productItem)"></span>
      <del
        v-if="productItem.sellingPrice > productItem.price && !productItem.customerLevelPrice"
        class="ml16 c-9"
      >&yen;{{productItem.sellingPrice}}</del>

      <span class="ml10 c-3 fz14" v-if="productItem.customerLevelPrice ">
        <span class="product-customer-name">{{productItem.customerLevelName}}</span>
        &yen;{{$options.filters.priceToFixed(productItem.customerLevelPrice)}}
      </span>
    </div>
    <!--  -->
    <div class="product-common-tags">
      <span class="tags_common_item" v-if="productItem.manZeng">赠</span>
      <span class="tags_common_item" v-if="productItem.songHongBao">&yen;</span>
    </div>
    <div class="product-common-display" v-if="productItem.saleMode!=6">
      <span>{{productItem.isUseBonus? '可用红包' : '不可用红包'}}</span> |
      <span>{{productItem.isUseCoupon? '可用券' : '不可用券'}}</span>
    </div>
    <div class="product-common-delivery" v-if="productItem.saleMode==6">{{productItem.deliveryMode==1?`经销商直配`:`易久批配送`}}</div>
    <!--  -->
    <slot v-if="!isVisitor && productItem.price">
      <div
        class="product-common-munber"
        v-if="productItem.canSellStoreCount || productItem.saleMode==2"
      >
        <div class="p_munber_wrap flex-center">
          <number-picker :product="productItem"></number-picker>
          <span
            class="c-3 fz12"
            v-if="productItem.saleUnit"
          >{{productItem.productSkuId==productItem.productSaleSpecId?productItem.saleUnit:productItem.minUnit}}</span>
        </div>
        <a href="javascript:;" class="pre">
          <toast-cart style="top:-50px;left:-100px" ref="toastCart"></toast-cart>
          <a class="c-w" @click.stop="_addToCart">加入购物车</a>
        </a>
      </div>

      <div class="product-common-munber" v-else>
        <a
          v-if="!productItem.promotionType"
          style="width: 100%;"
          href="javascript:;"
          @click="_getProductNotify"
        >{{productItem.alreadyArrivalNotice ? '已订阅到货通知' : '到货通知'}}</a>
      </div>
    </slot>
    <!--经销商申请进货按钮-->
    <div class="product-common-munber" v-if="!isVisitor && !productItem.price && productItem.stockState!=3&&productItem.saleMode==6">
      <a class="dealer-apply" style="width: 100%;" href="javascript:;" @click="_dealerApply">申请进货</a>
    </div>
    <div class="product-common-munber" v-if="isVisitor">
      <router-link style="width: 100%;" to="/login">{{!productItem.price ? '登录看价' : '登录购买'}}</router-link>
    </div>
  </div>
</template>

<script>
import { mixin } from "./product-mix";

export default {
  mixins: [mixin],
  name: "product-common",
  data() {
    return {
      dealerApplyPopShow: false
    };
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
.product-common-decoration {
  inline();
  squ(16);
  bg($color-base-theme);
  c(#fff);
  radius(2);
  mt(-2);
  mr(5);
  vm();
  lh(15);
  text-c();
}

.product-common-container {
  pos(relative);
  h(306);
  w(240);
  mt(10);
  mr(10);
  padding: 12px 16px;
  box();
  bg(#fff);
  flt();
  border: 1px solid #ededed;
  overflow: hidden;

  &:nth-of-type(4n) {
    mr(0);
  }

  &:nth-last-of-type(1) {
    mr(0);
  }
}

@media screen and (min-width: 1230px) {
  .product-common-container {
    w(234);

    &:nth-of-type(4n) {
      mr(10);
    }

    &:nth-of-type(5n) {
      mr(0);
    }

    &:nth-last-of-type(1) {
      mr(0);
    }
  }
}

.product-common-reduce {
  position: absolute;
  top: -3px;
  right: 16px;
  z-index: 1;
  width: 40px;
  height: 44px;
  border-radius: 0 0 50% 50%;
  background: #F0593A;
  color: #fff;
  text-align: center;
  line-height: 1.4;
  padding-top: 4px;
  box-sizing: border-box;
  transform: scale(0.85);
}

.product-common-mark {
  squ(56);
  pos(absolute);
  top: 0;
  left: 0;
}

.product-common-img {
  block();
  margin: 0 auto;
  pos(relative);

  >img {
    squ(140);
  }

  .product-common-kucun {
    hide();
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 18px;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    left: 50%;
    transform: translateX(-50%);
  }

  .sale-out-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: rgba(255, 255, 255, 0.6);

    &:before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      w(80);
      h(80);
      background-image: url('../../assets/images/yiqiangguang.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transform: translate(-50%, -50%);
      z-index: 9;
    }
  }
}

.product-common-name {
  cp();
  omit();
  mt(12);
  c(#333);
  ft(16);

  >span {
    c(#333);
    ft(16);
  }
}

.product-common-spec {
  mt(8);
  c(#999);
  ft(12);
  white-space: nowrap;
}

.product-common-price {
  mt(12);
  ft(18);
  color: #e53935;
  white-space: nowrap;
}

.product-common-tags {
  mt(12);
  h(20);

  .tags_common_item {
    inline();
    lh(20);
    padding: 0 5px;
    c($color-base-theme);
    b1($color-base-theme);
    radius(2);
    mr(6);

    &:nth-last-of-type(1) {
      mr(0);
    }
  }
}

.product-common-display {
  mt(12);
  c(#999);
}

.product-customer-name {
  background: #330601;
  color: #fffac4;
  position: relative;
  margin-right: 5px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  width: 30px;
  text-align: center;

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #330601;
    position: absolute;
    left: 26px;
    top: 0;
  }
}

.product-common-munber {
  width: 100%;
  height: 42px;
  pos(absolute);
  bottom: 0;
  left: 0;
  bg(#fff);
  // flex();
  // hide();
  visibility: hidden;
  box();
  border-top: 1px solid #ededed;

  .p_munber_wrap {
    // flex-1();
    inline();
    pos(relative);
    top: 50%;
    left: 10%;
    transform: translateY(-50%);

    >div {
      inline();
    }

    >span {
      inline();
      ml(4);
      pos(absolute);
      top: 50%;
      transform: translateY(-50%);
    }
  }

  >a {
    frt();
    inline();
    text-c();
    lh(42);
    c(#fff);
    ft(12);
    bg(#FFA727);
    width: 70px;
  }
  .dealer-apply{
    width 100%
    bg(#E53935)
  }
}

.product-common-hover {
  &:hover {
    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1), 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

    .product-common-munber {
      // flex();
      visibility: visible;
    }

    .product-common-tags {
      .tags_common_item {
        hide();
      }
    }

    .product-common-kucun {
      block();
    }
  }
}
.product-common-delivery{
  display inline-block
  bg(#fff)
  border 1px solid #E53935
  ft(12)
  c(#E53935)
  border-radius 2px
  padding 1px 3px
}
</style>

