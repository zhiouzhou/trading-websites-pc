<template>
  <div class="w clearfix pb-20">
    <div class="al-title">
      <router-link to="/index/home" class="c-3 fz14">首页&nbsp;>&nbsp;</router-link>
      <span class="c-3 fz14">常购清单</span>
      </div>
      <div class="base-product-list clearfix" v-if="productList.length">
        <product-common
          v-for="product in productList"
          :key="product.productSkuId + product.canSellStoreCount"
          v-bind:product-item="product"
        ></product-common>
      </div>
      <div class="empty-list clearfix" v-if="!productList.length&&!firstShow">
        <div class="empty-img flt">
          <img src="../assets/images/empty/no-alwaysbuy-icon.png">
        </div>
        <div class="history-empty-word flt">
          <p>您的常购清单还没有商品</p>
          <p>
            <span>快去逛逛吧~</span>
          </p>
        </div>
      </div>
  </div>
</template>
<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter.js";
import productCommon from "components/common/product-common.vue";
import { transformProductList } from "common/productUtil/list";
import * as $cache  from "common/cache";
export default {
  name: "alwaysBuyList",
  data() {
    return {
      productList: [],
      firstShow: true
    };
  },
  components: {
    productCommon
  },
  created() {
    assetsCenter.getAlwaysBuyList().then(res => {
      if (res.success) {
        this.productList = transformProductList(res.data);
        this.firstShow = false;
      }
    });
  }
};
</script>
<style lang="stylus">
@import '../assets/stylus/list.styl';

.al-title {
  height: 40px;
  lh(40);
}

.pb-20 {
  pb(20)
}

.empty-list {
  margin: 100px auto;
  height: 150px;
  padding-left: 50%;

  .history-empty-word {
    padding-left: 5%;

    p {
      pt(50);
      ft(18);
      c(#757575);
      width 200px

      &:nth-of-type(2) {
        pt(8);
        c(#666);
      }

      span {
        ft(14);
      }
    }
  }
}

.empty-img {
  width: 150px;
  height: 150px;
  ml(-150);
  position: relative;

  img {
    inline();
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
