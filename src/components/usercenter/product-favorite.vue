<template>
  <div class="fa-product-wrap pre">
    <div v-if="favoriteProduct" class="fa-cancel" @click="cancel">取消关注</div>
    <div class="fa-p_content">
      <!-- 活动标签 -->
      <img
        class="fa-activity"
        v-lazy="productItem.promotionWatermark"
        v-if="productItem.promotionWatermark"
      >
      <!-- 立减 -->
      <div class="fa-reduce" v-if="productItem.reducePrice&&productItem.stockState!=3">立减
        <br>
        {{productItem.reducePrice}}元
      </div>
      <div class="fa-iconImg" @click="goToProductDetail">
        <img width="140" height="140" v-lazy="productItem.imgUrl" v-if="productItem.imgUrl">
        <img
          width="140"
          height="140"
          src="../../assets/images/propic_default.gif"
          v-if="!productItem.imgUrl"
        >
        <span
          class="p_kucun"
          v-if="productItem.inventoryShowText"
        >{{productItem.inventoryShowText}}</span>
        <div class="acp-top-gone" v-if="productItem.stockState==3"></div>
      </div>
      <p class="fa-p_name" @click="goToProductDetail">
        <span v-if="productItem.saleMode==2">【合作】</span>
        <span v-if="productItem.saleMode==6">【经销商】</span>
        <span v-if="productItem.stockState==4">【预售】</span>
        {{productItem.productName}}
      </p>
      <div class="fa-p_spec">
        规格：{{productItem.specName}}
        <span
          v-if="productItem.productionDate"
        >&nbsp;&nbsp;&nbsp;&nbsp;生产日期：{{productItem.productionDate}}</span>
      </div>
      <!-- 商品价格 -->
      <!-- 非凑单 -->
      <div class="fa-p_price clearfix" v-if="!productItem.gatherOrderPrice">
        <span v-if="productItem.saleMode!=6" v-html="$options.filters.price(productItem.price,productItem.priceunit)"></span>
        <!--经销商产品-->
        <span class="c-red" v-else v-html="$options.filters.dealerPrice(productItem)"></span>
        <del
          v-if="productItem.price<productItem.sellPrice"
        >&yen;{{$options.filters.priceToFixed(productItem.sellPrice)}}</del>
        <p
          class="level-price frt"
          v-if="productItem.userLevelPrices&&productItem.userLevelPrices.length"
        >
        <span>{{productItem.customerLevelName}}</span>
          &yen;{{$options.filters.priceToFixed(productItem.customerLevelPrice)}}

        </p>
      </div>
      <!-- 凑单 -->
      <div class="fa-p_price clearfix" v-if="productItem.gatherOrderPrice">
        <span v-html="$options.filters.price(productItem.gatherOrderPrice,productItem.priceunit)"></span>
        <del
          v-if="productItem.price>productItem.gatherOrderPrice"
        >&yen;{{$options.filters.priceToFixed(productItem.price)}}</del>
        <p
          class="level-price frt"
          v-if="productItem.userLevelPrices&&productItem.userLevelPrices.length"
        >
          <span>{{productItem.customerLevelName}}</span>
          &yen;{{$options.filters.priceToFixed(productItem.customerLevelPrice)}}
        </p>
      </div>
      <!-- 促销标签 -->
      <div class="product-common-tags">

      <span class="tags_common_item" v-if="productItem.manZeng">赠</span>
      <span class="tags_common_item" v-if="productItem.songHongBao">&yen;</span>
    </div>
      <div class="fa-p_bouns" v-if="productItem.saleMode!=6">
        <p v-if="productItem.isUseBonus">可用红包</p>
        <p v-if="!productItem.isUseBonus">不可用红包</p>
        <div></div>
        <p v-if="productItem.isUseCoupon">可用券</p>
        <p v-if="!productItem.isUseCoupon">不可用券</p>
      </div>
      <div class="product-common-delivery" v-if="productItem.saleMode==6">{{productItem.deliveryMode==1?`经销商直配`:`易久批配送`}}</div>
    </div>
    <!-- 加入购物车 -->
    <div v-if="productItem.price">
      <div class="fa-p_munber" v-if="productItem.canSellStoreCount || productItem.saleMode==2">
        <div class="fa-p_munber_wrap flex-center">
          <div>
            <number-picker :product="productItem"
            ></number-picker>
          </div>
          <span class="c-3 fz12" v-if="productItem.saleUnit">{{productItem.productSkuId==productItem.productSaleSpecId?productItem.saleUnit:productItem.minUnit}}</span>
        </div>
        <a class="add-cart pre" href="javascript:;">
          <toast-cart style="top:-50px;left:-82px" ref="toastCart"></toast-cart>
          <a class="c-w" @click="addCart">加入购物车</a>
        </a>
      </div>
      <div class="fa-p_munber" v-else>
        <a
          style="width: 100%;"
          href="javascript:;"
          @click="_getProductNotify"
        >{{productItem.alreadyArrivalNotice ? '已订阅到货通知' : '到货通知'}}</a>
      </div>
    </div>
    <!--经销商申请进货按钮-->
    <div class="fa-p_munber" v-if="!productItem.price && productItem.stockState!=3&&productItem.saleMode==6">
      <a class="dealer-apply" href="javascript:;" @click="_dealerApply">申请进货</a>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/images/duigou_jiarugouwuche@2x.png";
import * as usercenter from "@/api/usercenter/usercenter.js";
// import NumberInput from "@/components/common/NumberInput.vue";
import { AddShopCart } from "@/api/cart/cart";
import { makeProductToCartParam } from "../../common/productUtil/list";
import { getProductNotify } from "api/product/product";
import { mapActions } from "vuex";
import numberPicker from "../common/numberPicker.vue";
import toastCart from '../common/toastAddCart.vue';
import bus from "common/bus";
export default {
  name: "productFavorite",
  data() {
    return {
      selectIndex: "",
      proCount: this.productItem.minPurchaseNum,
      minNum: parseInt(this.productItem.minPurchaseNum),
      maxNum: parseInt(this.productItem.limitPurchaseNum),
      productInfo: {}
    };
  },
  components: {
    numberPicker,
    toastCart
  },
  props: {
    productItem: {
      type: Object,
      default: {}
    },
    favoriteProduct: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  created() {
    if (this.proCount == 0) {
      this.proCount = 1;
    }
  },
  methods: {
    ...mapActions(["saveCartCount"]),
    //跳转到商品详情
    goToProductDetail: function() {
      let routeData
      //经销商产品
      if(this.productItem.saleMode==6){
        routeData = this.$router.resolve({
          path: "/dealer/productDetail",
          query: this.encodeUrlQuery({ skuId: this.productItem.productSkuId,shopId: this.productItem.companyId })
        });
      }else{
        routeData = this.$router.resolve({
          name: "productDetail",
          query: this.encodeUrlQuery({ skuId: this.productItem.productSkuId })
        });
      }
      window.open(routeData.href, "_blank");
    },
    //取消关注
    cancel() {
      let id = this.productItem.productSkuId;
      let currentPage = this.currentPage;
      if (this.totalCount % 9 == 1 && this.currentPage != 1) {
        currentPage--;
      }
      usercenter.cancelProduct([id]).then(res => {
        if (res.success) {
          let data = {
            currentPage,
            pageSize: 9
          };
          usercenter.getFavoriteProduct(data).then(res => {
            let productList = res.data;
            this.changeList({ productList, currentPage });
          });
        }
      });
    },
    //加入购物车
    addCart() {
      let param = makeProductToCartParam(this.productItem);
      if (this.productItem.gatherOrderPrice > 0) {
        param.sellingPrice = this.productItem.gatherOrderPrice;
      } else {
        param.sellingPrice = this.productItem.price;
      }
      AddShopCart(param).then(res => {
        if (res.success) {
          this.saveCartCount(param.count);
          this.$refs.toastCart.show();
        }
      });
    },
    //到货通知
    _getProductNotify() {
      if (this.productItem.alreadyArrivalNotice) {
        this.$message("您已订阅该商品的到货通知");
        return false;
      }
      getProductNotify(this.productItem.productSkuId)
        .then(res => {
          if (res.success) {
            this.productItem.alreadyArrivalNotice = true;
            this.$message(
              "如果1个月内到货，系统将以短信的形式发送到您的手机上"
            );
          }
        })
        .catch(res => {});
    },
    changeList(list) {
      this.$emit("changeList", list);
    },
    onChangeCount(data) {
      this.proCount = data;
    },
    _dealerApply(){
      bus.$emit("popShow",this.productItem);
    },
  }
};
</script>
<style lang="stylus">
.fa-p_munber {
  width: 100%;
  height: 40px;
  pos(absolute);
  bottom: 0;
  left: 0;
  bg(#fff);
  // flex();
  // hide();
  box();
  transform: translateY(0);
  -ms-transform: translateY(0);
  border-top: 1px solid #ededed;
  // opacity: 0;
  visibility hidden

  .add-cart {
    frt()
    c(#fff)
  }

  .fa-p_munber_wrap {
    // flex-1();
    // justify-content: flex-start;
    pos(absolute)
    top 50%
    transform translateY(-50%)
    inline()
    ml(8);
    >div {
      inline()
      vertical-align top
    }

    >span {
      inline()
      ml(6);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  >a {
    inline();
    text-c();
    lh(40);
    c(#fff);
    ft(12);
    bg(#FFA727);
    width: 84px;
  }
}

// @keyframes m_enter {
//   0% {
//     transform: translateY(42px);
//     -ms-transform: translateY(42px);
//     opacity: 0.1;
//     filter:Alpha(opacity=10);
//   }

//   100% {
//     transform: translateY(0px);
//     -ms-transform: translateY(0px);
//     opacity: 1;
//     filter:Alpha(opacity=100);
//   }
// }

.fa-product-wrap {
  position: relative;

  &:hover {
    box-shadow: 0px 6px 8px 0px rgba(0,0,0,0.1), 0px -2px 8px 0px rgba(0,0,0,0.1);

    .fa-p_munber {
      visibility visible
      opacity: 1;
      // animation: m_enter 0;
    }

    .fa-cancel {
      display block
      opacity: 0.7;

    }

    .fa-p_content {
      .fa-iconImg {
        span {
          opacity 1
        }
      }

      .product-common-tags{
       .tags_common_item{
          hide()
        }
    }
    }
  }
}

.fa-product-wrap {
  box();
  bg(#fff);
  float: left;
  width: 31.5%;
  margin-right: 2.75%;
  mb(20);
  pb(12);
  // min-width: 200px;
  // height: 360px;
  border: 1px solid #ededed;

  &:nth-of-type(3n) {
    margin-right: 0;
  }

  .fa-reduce {
    box();
    position: absolute;
    top: 0;
    right: 12px;
    z-index: 5;
    width: 40px;
    height: 44px;
    bg(#F0593A);
    border-radius: 0 0 50% 50%;
    ft(10);
    c(#FFFFFF);
    text-align: center;
    line-height: 1.4em;
  }

  .fa-p_content {
    cp();
    pt(12);
    box();
    margin: 0 auto;

    .fa-iconImg {
      margin: 0 16px;
      width: auto;
      height: auto;
      position: relative;

      img {
        block();
        width: 200px;
        height: 200px;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
      }

      span {
        position: absolute;
        bottom: 0;
        block();
        width: 100%;
        height: 22px;
        text-align: center;
        lh(22);
        c(#fff);
        ft(14);
        background: rgba(0, 0, 0, 0.6);
        left: 50%;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        opacity 0
      }
    }

    .fa-activity {
      position: absolute;
      top: 0;
      left: 0;
      width: 60px;
      height: 60px;
      z-index: 5;
    }

    .fa-p_name {
      omit();
      mt(12);
      c(#333);
      ft(16);
      ml(16);
      mr(16)

      span {
        ft(16);
      }
    }

    .fa-p_spec {
      mt(12);
      ml(16);
      c(#999);
      ft(12);
    }

    .fa-p_price {
      mt(12);
      ml(16);
      height 20px
      ft(18);
      c($color-base-theme);

      >del {
        c(#999);
        ft(12);
        ml(16);
      }

      .level-price {
        mr(8);
        // mt(6);
        c(#333);
        ft(14);

        span {
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
      }
    }

    .fa-p_reduce {
      width: 83px;
      height: 20px;
      mt(12);
      mb(12);
      ml(16);
      radius(2);
      bg(#E53935);
      ft(12);
      c(#FFFFFF);
      text-align: center;
      lh(20);
    }

    .product-common-tags {
      mt(12);
      ml(16)
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

    .fa-p_bouns {
      ft(10);
      c(#999999);
      mt(12);
      ml(16);

      p {
        inline();
      }

      div {
        inline();
        width: 1px;
        height: 10px;
        bg(#bdbdbd);
        ml(6);
        mr(6);
      }
    }
  }
}

.fa-cancel {
  display none
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  width: 64px;
  height: 22px;
  bg(#000000);
  // opacity: 0;
  ft(12);
  c(#ffffff);
  text-align: center;
  lh(22);
  cursor: pointer;
}

.acp-top-gone{
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    z-index 0
    background rgba(255,255,255,0.6)
    &:before{
      content ""
      position absolute
      left 50%
      top 50%
      w(96)
      h(96)
      background-image url(../../assets/images/yiqiangguang.png)
      background-size contain
      background-repeat no-repeat
      background-position center
      transform translate(-50%,-50%)
      z-index 9
    }
  }
  .dealer-apply{
    width 100% !important
    background #E53935 !important
  }
  .product-common-delivery{
    display inline-block
    bg(#fff)
    border 1px solid #E53935
    ft(12)
    c(#E53935)
    border-radius 2px
    padding 1px 3px
    ml(16)
  }
</style>


