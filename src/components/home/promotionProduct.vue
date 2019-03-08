<template>
  <div class="column">
    <div class="column-tit">
      <h3>{{activity.name}}</h3>
    </div>
    <!--  -->
    <div v-if="activity.type==5">
      <el-carousel :arrow="showArrow" height="220px" :autoplay="false" indicator-position="none">
        <el-carousel-item>
          <div class="column-content-composition clearfix">
            <composite-product
              v-for="item in activity.products.slice(0,3)"
              :key="item.promotionId"
              :item="item"
            ></composite-product>
          </div>
        </el-carousel-item>
        <el-carousel-item v-if="activity.products.length>3">
          <div class="column-content-composition clearfix">
            <composite-product
              v-for="item in activity.products.slice(3)"
              :key="item.promotionId"
              :item="item"
            ></composite-product>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--  -->
    <div class="column-content column-content-promotion" v-else>
      <div class="cc-products clearfix">
        <product
          v-for="item in activity.products.slice(0,5)"
          :key="item.productSkuId + item.promotionType"
          :product-item="item"
        ></product>
      </div>
      <div class="cc-more" :class="{'limit': activity.type == 4}" @click="_jumpActivity"></div>
    </div>
  </div>
</template>

<script>
import product from "components/common/product_home.vue";
import compositeProduct from "./compositeProduct.vue";
export default {
  name: "promotion-product",
  data() {
    return {};
  },
  props: {
    activity: {
      type: Object,
      dafault: () => ({})
    }
  },
  computed: {
    showArrow() {
      if (this.activity.type == 5 && this.activity.products.length > 3) {
        return "hover";
      } else {
        return "never";
      }
    }
  },
  components: {
    product,
    "composite-product": compositeProduct
  },
  methods: {
    _jumpActivity() {
      this.$router.push({ path: "/index/activityList" });
       this.$createTalkingData("index", "Index_Promotion_more", {
        PromotionId: ""
      });
    }
  }
};
</script>

<style lang="stylus">
.column-content-promotion {
  width: 100%;
  h(270);

  .cc-products {
    flt();
    mr(190);
    h(270);
    overflow: hidden;
  }

  .cc-more {
    w(190);
    h(270);
    flt();
    ml(-190);
    cp();
    background: url('../../assets/images/bg_xianshidazhe.png') no-repeat;
    background-size: cover;
  }

  .limit {
    background: url('../../assets/images/bg_xianshitejia.png') no-repeat;
  }
}

@media screen and (min-width: 1230px) {
  .column-content-promotion {
    .cc-products {
      mr(200);
    }

    .cc-more {
      w(200);
      ml(-200);
    }
  }
}

.column-content-composition {
  padding: 0 17px;
}
</style>



