<template>
  <div class="h-composition-item">
    <a href="javascript:;" class="hc-item-img pre" @click="_jumpGroupProductDetail(item)">
      <img v-lazy="item.imgUrl" :alt="item.name">
      <span v-if="item.kucun">{{item.kucun}}</span>
    </a>
    <div class="hc-item-info" @click="_jumpGroupProductDetail(item)">
      <div class="hc-name">{{item.name || item.title}}</div>
      <div class="hc-time">
        <timer :endTime="item.endDate" :startTime="item.beginDate"></timer>
      </div>
      <div class="hc-price">
        <span class="c-red" v-html="$options.filters.price(item.packagePrice,item.priceUnit)"></span>
        <i v-if="item.reducePrice">立减{{item.reducePrice}}元</i>
        <del v-else>&yen;{{$options.filters.priceToFixed(item.regularPrice)}}</del>
      </div>
      <div class="p_munber_wrap hc-num" v-if="item.stockCount && !isVisitor">
        <number-picker :product="item"></number-picker>
        <span class="c-3 fz12 ml8">{{item.priceUnit}}</span>
      </div>
    </div>
    <slot v-if="isVisitor">
      <router-link class="hc-item-add" to="/login">{{!item.packagePrice ? '登录看价' : '登录购买'}}</router-link>
    </slot>
    <slot v-else>
      <a href="javascript:;" class="hc-item-add" v-if="item.stockCount" @click.stop="_addToCart">
        <b></b>加入购物车
      </a>
      <a href="javascript:;" class="hc-item-add" style="background:#999" v-else>已抢光</a>
    </slot>
  </div>
</template>

<script>
import { AddShopCart } from "api/cart/cart";
import avatar from "@/assets/images/duigou_jiarugouwuche@2x.png";
import timer from "components/common/timer.vue";
import numberPicker from "components/common/numberPicker.vue";
import bus from "common/bus";
export default {
  name: "composite-product",
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    "number-picker": numberPicker,
    timer
  },
  methods: {
    _addToCart() {
      const {
        buyCount,
        activityId,
        productType,
        productSaleSpecId,
        packagePrice,
        priceUnit
      } = this.item;
      const params = {
        count: buyCount,
        productSkuId: activityId,
        productType,
        saleSpecId: activityId,
        sellingPrice: packagePrice,
        sellingPriceUnit: priceUnit,
        sourceId: activityId
      };
      AddShopCart(params).then(res => {
        if (res.success) {
          if (this.$route.name == 'home') {
            bus.$emit("updatePrompt", this.productItem)
          }
          this.$confirm({
            content: "已成功加入购物车",
            imgUrl: avatar,
            yesText: "去购物车",
            noText: "继续购物",
            showDuration: true
          })
            .then(() => {
              this.openNewWindow({
                path: "/cartIndex/shopCart"
              });
            })
            .catch(() => {});
        }
      });
    },
    _jumpGroupProductDetail(item) {
     
      const params = {
        path: "/index/groupProductDetail",
        query: this.encodeUrlQuery({
          activityId: item.activityId
        })
      };
      this.openNewWindow(params);
      this.$createTalkingData("index", "Index_Promotion", {
        PromotionId: item.activityId
      });
    }
  }
};
</script>
<style lang="stylus">
.h-composition-item {
  w(310);
  h(220);
  flt();
  bg(#fff);
  box();
  pos(relative);
  padding: 10px 10px 0;
  mr(10);

  &:nth-of-type(3) {
    mr(0);
  }

  .hc-item-img {
    block();
    flt();
    squ(105);
    mr(10);

    >img {
      width: 100%;
      height: 100%;
    }

    >span {
      position: absolute;
      bottom: 0;
      display: block;
      width: 100%;
      text-align: center;
      line-height: 18px;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .hc-item-info {
    w(160);
    flt();

    .hc-name {
      mt(16);
      ft(16);
      c(#333);
      omit();
      cp();
    }

    .hc-time {
      c(#999);
      mt(12);
    }

    .hc-price {
      mt(24);

      >i {
        ml(12);
        inline();
        padding: 0 3px;
        color: #e53935;
        border: 1px solid #e53935;
        height: 18px;
        line-height: 18px;
        border: 1px solid #e53935;
        border-radius: 2px;
        vertical-align: bottom;
      }

      >del {
        c(#999);
        ml(16);
      }
    }

    .hc-num {
      mt(20);
      flex();
      align-items: center;
    }
  }

  .hc-item-add {
    pos(absolute);
    bottom: 0;
    left: 0;
    width: 100%;
    h(40);
    bg(#FFA727);
    lh(40);
    c(#fff);
    ft(14);
    text-c();

    >b {
      inline();
      squ(16);
      vm();
    }
  }
}

@media screen and (min-width: 1230px) {
  .h-composition-item {
    w(372);
    mr(20);
    padding: 12px 12px 0 12px;

    .hc-item-img {
      squ(140);
      mr(16);
    }

    .hc-item-info {
      w(185);
    }
  }
}
</style>
