<template>
  <section id="home">
    <homeFloat :home-float-list="homeFloatList" v-if="homeFloatList.length>=2"/>
    <div class="right-side-box" v-if="!isVisitor" :class="{ cartshow: showMiniCart}">
      <sideBar />
      <miniCart :is-show="showMiniCart"/>
    </div>
    <div class="w">
      <!--  -->
      <div class="h-main-area clearfix">
        <category></category>
        <div class="notice-center frt">
          <div class="h_notice">
            <h5>
              <span class="fz14">
                <b class="fz14">久批</b>通知
              </span>
            </h5>
            <ul class="h_notice_list" v-if="notices.length">
              <li v-for="item in notices.slice(0, 2)" :key="item.noticeId">
                <a href="javascript:;" class="c-3" @click="_goToNotice(item)">&nbsp;{{item.title}}</a>
              </li>
            </ul>
            <p class="h_notice_list" v-else>当前城市暂无通知</p>
          </div>
          <!--  -->
          <div class="h-coupons-center" v-if="canReceiveCoupon.length">
            <div class="h-coupons-title">
              <h4>每日领券</h4>
              <p>总有你想要的</p>
            </div>
            <div class="h-coupons-info">
              <p class="h-c-bar"></p>
              <div class="h-c-body">

                <div class="h-c-amount">
                  <slot v-if="currentCoupon.amount">
                    &yen;
                    <strong>{{currentCoupon.amount}}</strong>
                  </slot>
                </div>
                <p class="h-c-condition">{{currentCoupon.couponUseDesc}}</p>
                <div class="h-c-type">{{currentCoupon.couponDesc}}</div>
                <a
                  class="h-c-jump"
                  href="javascript:;"
                  v-if="canReceiveCoupon.length==1"
                  @click="_receiveCoupon(currentCoupon)"
                >{{currentCoupon.alreadyReceived?'领取':'已领取'}}</a>
                <router-link v-else class="h-c-jump" to="/couponCenter">
                  去领券中心
                  <span class="arrow">>></span>
                </router-link>
              </div>
            </div>
          </div>
          <!--  -->
          <div
            class="h-coupons-center h-recommend"
            v-if="!canReceiveCoupon.length && recommendProductList.length"
          >
            <div class="h-coupons-title">
              <h4>为您推荐</h4>
            </div>
            <el-carousel :interval="3000" arrow="hover" height="206px" indicator-position="outside">
              <el-carousel-item
                v-for="product in recommendProductList"
                :key="product.productSkuId+product.promotionType+product.price+product.timeLimitPromotionId"
              >
                <div class="h-recommend-product" @click="_goToProductDetail(product)">
                  <img v-lazy="product.imgUrl" :alt="product.productName">
                  <div class="r-product-name">{{product.productName}}</div>
                  <span
                    class="r-product-price c-red"
                    v-html="$options.filters.price(product.productPrice.price,product.priceunit)"
                  ></span>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!-- v-if="banners.length"  -->
        <div class="h-banner">
          <el-carousel :interval="5000" arrow="hover" height="360px">
            <el-carousel-item v-for="item in banners" :key="item.bannerId">
              <a href="javascript:;" @click="_jumpBannerLink(item)">
                <img :src="item.imgUrl">
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!--  floor1-->
      <section class="home-float-list floor" v-if="!noActivityList">
        <promotionProduct
          v-for="activity in activityList"
          :key="activity.type"
          :activity="activity"
        ></promotionProduct>
        <!--  -->
        <div class="home-middle-slider" v-if="activityList.length && middleBanners.length">
          <el-carousel :interval="4000" arrow="hover" height="200px">
            <el-carousel-item v-for="item in middleBanners" :key="item.bannerId">
              <a href="javascript:;" @click="_jumpBannerLink(item)">
                <img :src="item.imgUrl">
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </section>
      <!--  floor2  :column-id="column.columnId" -->
      <section class="floor" v-if="!noColumnList">
        <column
          v-if="columnList.length"
          class="home-float-list"
          v-for="column in columnList"
          :key="column.columnId"
          v-bind:column-item="column"
          v-on:turn-page="changeColumnProducts(column)"
        >
          <template slot="products" v-if="column.products && column.products.length">
            <product
              v-for="item in column.products"
              :key="item.productSkuId+item.promotionType+ item.price +item.timeLimitPromotionId"
              :product-item="item"
            ></product>
          </template>
        </column>
      </section>
      <!-- floor3   赚钱精选 -->
      <div class="column home-float-list floor" v-if="!noHotSaleProduct">
        <div class="column-tit">
          <h3>赚钱精选</h3>
          <a href="javascript:;" @click="_jumpProfit" class="c_change">
            查看更多
            <span class="arrow fz14">>></span>
          </a>
        </div>
        <div class="column-content">
          <product-common
            v-for="item in hotSaleProduct"
            :key="item.productSkuId + item.promotionType + item.price +item.timeLimitPromotionId"
            :product-item="item"
          ></product-common>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import * as homeApi from "api/home/home";
import { getPromotionList } from "api/activity/activity";
import { transformProductList } from "common/productUtil/list";
import category from "components/home/category.vue";
import column from "components/home/column.vue";
import promotionProduct from "components/home/promotionProduct.vue";
import product from "components/common/product_home.vue";
import productCommon from "components/common/product-common.vue";
import homeFloat from "components/home/homeFloat.vue";
import sideBar from "components/home/sideBar.vue";
import miniCart from "../components/minicart/miniCart.vue";
import bus from "common/bus";
import * as productApi from "api/product/product";
import * as $cache from "common/cache";
import * as homeService from "service/homeService";
import { GetCouponCenter, UserReceive } from "api/assetsCenter/assetsCenter";
import { RecommendProductList } from "api/common/common";
import { bannerDefault } from "common/firstScreenData";
import { removeClass } from "common/dom";
import storage from 'common/storage'
export default {
  name: "home",
  data() {
    return {
      counter: 0,
      columnList: [],
      banners: bannerDefault,
      middleBanners: [],
      activityList: [],
      hotSaleProduct: [],
      notices: [],
      canReceiveCoupon: [],
      recommendProductList: [],
      showMiniCart: false, //侧边栏购物车默认不显示
      noHotSaleProduct: false,
      noActivityList: false,
      noColumnList: false
    };
  },
  components: {
    category,
    column,
    promotionProduct,
    product,
    homeFloat,
    sideBar,
    miniCart,
    "product-common": productCommon
  },
  beforeCreate() {},
  computed: {
    currentCoupon() {
      if (this.canReceiveCoupon.length) {
        return this.canReceiveCoupon[0];
      }
      return {};
    },
    homeFloatList() {
      if (this.counter == 3) {
        const list = this.columnList.map(item => item.columnName);
        if (this.activityList.length) {
          list.unshift("优惠特价");
        }
        if (this.hotSaleProduct.length) {
          list.push("赚钱精选");
        }
        this.$nextTick(() => {
          bus.$emit("column-repeated");
          let i = 0;
          const els = document.getElementsByClassName("floor");
          while (i < els.length) {
            removeClass(els[i], "floor");
            i++;
          }
        });
        return list;
      }
      return [];
    }
  },
  created() {
    this._getHomeInfo();
    this._HomePromotions();
    this._HomeColumnProducts();
    this._choiceProducts();
    if (!this.isVisitor) {
      this._listReceiveCoupon();
    }
  },
  mounted() {
    //监听侧边购物车展开关闭
    bus.$on("toggleMiniCart", () => {
      this.showMiniCart = !this.showMiniCart;
    });
    //cache
    if (!this.isVisitor) {
      homeService.CacheMyProductBriefList();
    }
    //cache
    homeService.fetchColumnListInfo();
  },
  activated() {
    this.$createTalkingData("Index", "", {}, 1);
  },
  deactivated() {
    this.$createTalkingData("Index", "", {}, 2);
  },
  beforeDestroy() {},
  methods: {
    _getHomeInfo() {
      homeApi
        .WebPageInfo()
        .then(res => {
          const { banners, middleBanners, notices } = res.data;
          this.banners = banners.length ? banners : bannerDefault;
          this.middleBanners = middleBanners;
          this.notices = notices;
        })
        .catch(res => {});
    },
    _HomePromotions() {
      homeApi
        .HomePromotions()
        .then(res => {
          this.activityList = res.data;
          this.noActivityList = !this.activityList.length;
          this.counter++;
        })
        .catch(res => {
          this.noActivityList = true;
          this.counter++;
        });
    },
    _HomeColumnProducts() {
      homeApi
        .HomeColumnProducts()
        .then(res => {
          this.columnList = res.data;
          this.noColumnList = !this.columnList.length;
          this.counter++;
        })
        .catch(res => {
          this.noColumnList = true;
          this.counter++;
        });
    },
    _choiceProducts() {
      homeApi
        .choiceProducts()
        .then(res => {
          this.hotSaleProduct = res.data;
          this.noHotSaleProduct = !this.hotSaleProduct.length;
          this.counter++;
        })
        .catch(res => {
          this.noHotSaleProduct = true;
          this.counter++;
        });
    },
    //notice
    _goToNotice(item) {
      const skipUrl = item.skipUrl;
      const params = {
        name: "notice",
        query: { skipUrl }
      };
      this.openNewWindow(params);
    },
    //领券
    _listReceiveCoupon() {
      const params = { currentPage: 1, pageSize: 20 };
      GetCouponCenter(params).then(res => {
        if (res.success && res.data) {
          // res.data   null
          this.canReceiveCoupon = res.data;
        } else {
          this._listRecommendProductList();
        }
      });
    },
    _receiveCoupon(currentCoupon) {
      const params = {
        promotionId: currentCoupon.promotionId,
        receiveSource: 1
      };
      UserReceive(params).then(res => {
        if (res.success) {
          currentCoupon.alreadyReceived = false;
        }
      });
    },
    _listRecommendProductList() {
      const params = {
        currentPage: 1,
        pageSize: 5,
        data: {
          recommendTarget: 3,
          specialAreaId: ""
        }
      };
      RecommendProductList(params).then(res => {
        if (res.success) {
          this.recommendProductList = transformProductList(res.data);
        }
      });
    },
    //跳转到商品详情
    _goToProductDetail(productItem) {
      const params = {
        name: "productDetail",
        query: this.encodeUrlQuery({ skuId: productItem.productSkuId })
      };
      this.openNewWindow(params);
    },
    changeColumnProducts(column) {
      column.products = column.products.reverse();
    },
    _jumpBannerLink(item) {
      const { bannerType, bannerId } = item;
      homeService.jumpBannerLink.call(this, item);
       this.$createTalkingData("index", "Index_Banner", {
        BannerType: bannerType,
        BannerId: bannerId
      });
    },
    _jumpProfit() {
      this.$router.push({ path: "/index/profit" });
      this.$createTalkingData("index", "Index_Channel_Profit_Sift", {});
    }
  }
};
</script>

<style lang="stylus">
.floor {
  min-height: 500px;
  background: url('../assets/images/xiaoche.gif') no-repeat 50% 50%;
}

.home-middle-slider {
  mt(32);
}

.el-carousel__item {
  >a {
    width: 100%;
    height: 100%;

    >img {
      width: 100%;
      height: 100%;
    }
  }
}

.h-recommend {
  padding-bottom: 0 !important;

  .el-carousel {
    .el-carousel__indicators {
      .el-carousel__button {
        width: 16px;
      }
    }
  }
}

.h-recommend-product {
  mt(12);
  box();
  padding: 0 16px 0;
  height: 194px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(240, 89, 58, 0.1);
  border-radius: 4px;

  >img {
    squ(108);
  }

  .r-product-name {
    margin: 8px 0;
    c(#333);
    ft(14);
    h(28);
    overflow: hidden;
  }

  .r-product-price {
    mt(12);
  }
}

.h-coupons-center {
  h(258);
  bg(#FFEFC2);
  padding: 12px;
}

.h-coupons-info {
  .h-c-bar {
    w(184);
    ml(-4);
    h(6);
    bg(#FFA727);
    radius(3);
  }

  .h-c-body {
    w(176);
    bg(#fff);
    h(170);
    border-top: 1px solid #D78611;
    pos(relative);
    top: -2px;

    .h-c-amount {
      font-family: simsun;
      ft(22);
      c(#975127);
      margin: 24px auto 0;
      text-c();
      fb();
      min-height 38px
      strong {
        ft(44);
      }
    }

    .h-c-condition {
      margin: 8px auto 0;
      c(#975127);
      text-c();
    }

    .h-c-type {
      mt(22);
      h(34);
      box();
      lh(32);
      c(#975127);
      text-c();
      pos(relative);
      border-top: 2px dashed #DDDDDD;

      &:after, &:before {
        content: '';
        inline();
        squ(16);
        border-radius: 50%;
        pos(absolute);
        top: -8px;
        bg(#FFEFC2);
      }

      &:after {
        right: -8px;
      }

      &:before {
        left: -8px;
      }
    }

    .h-c-jump {
      block();
      bg(#FFA727);
      ft(14);
      text-c();
      lh(32);
      c(#fff);

      .arrow {
        ft(14);
      }
    }
  }
}

.h-coupons-title {
  h4 {
    c(#975127);
    ft(14);
    flex-center();

    &:after, &:before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 1px;
      background: #975127;
    }

    &:after {
      ml(8);
    }

    &:before {
      mr(8);
    }
  }

  p {
    c(#975127);
    lh(36);
    text-c();
    color: rgba(151, 81, 39, 0.8);
  }
}

#home {
  width: 100%;
  height: auto;
  min-height: 800px;
  padding-bottom: 60px;
  background: $color-base-bg;
}

.h-main-area {
  width: 100%;
  height: h = 360px;
  clear: both;

  .h-banner {
    height: h;
    mauto(210);
    overflow: hidden;
  }

  .notice-center {
    width: 200px;
    height: h;
    bg(#fff);
  }
}

.banner-item {
  >a {
    inline();
    height: 360px;

    >img {
      width: 100%;
      height: 100%;
    }
  }
}

.hr {
  content: '';
  inline();
  width: 16px;
  height: 1px;
  background: rgba(151, 81, 39, 1);
}

.h_notice {
  width: 200px;
  height: 102px;
  bg(#fff);
  box();
  pt(16);
  border-top: 4px solid #FFA727;

  >h5 {
    flex-center();
    font-size: 14px;
    color: #333333;

    >span >b {
      color: #975127;
    }

    &:before {
      @extend .hr;
      mr(8);
    }

    &:after {
      @extend .hr;
      ml(8);
    }
  }
}

.h_notice_list {
  mt(16);
  box();
  pl(12);
  c(#333);

  >li {
    mb(12);
    omit();

    &:before {
      content: '';
      inline();
      squ(4);
      mr(4);
      background: #333333;
      radius(50%);
    }

    &:nth-last-of-type(1) {
      mb(0);
    }
  }
}

.right-side-box {
  w(356);
  height: 100%;
  min-height: 600px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  mr(-320);
  transition: all 0.6s ease;
}

.cartshow {
  mr(0);
}
</style>

