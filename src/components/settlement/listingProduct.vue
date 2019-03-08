<template>
  <div class="product-item">
    <div class="item-l">
      <img v-if ="product.imgUrl||(product.imgsUrl&&product.imgsUrl.length)"  :src="product.imgUrl||(product.imgsUrl&&product.imgsUrl[0])" />
      <img  src="../../assets/images/loading-logo.png" v-else />
      <div class="item-info">
        <h5>{{product.productName||product.name}}</h5>
        <span class="spec">规格：{{product.specName}}</span>
         <span class="spec" v-if="gift&&product.sourceDesc">{{product.sourceDesc}}</span>
        <div style="flex:1;"></div>
        <!--限时惠不显示-->
        <product-tags v-if="product.productType!=4&&!gift" :bonusCanuse="bonusCanuse" :couponCanuse="couponCanuse"></product-tags>
      </div>
    </div>
    <div class="item-c">
      <div class="price">批价：￥{{product.productPrice.price}}/{{product.priceunit}}</div>
      <div class="reduce" v-if="product.productPrice&&product.productPrice.reducePrice>0&&!gift">立减￥{{product.productPrice.reducePrice}}/{{product.priceunit}}</div>
    </div>
    <div class="item-r" v-if="!gift">
      {{product.saleSpecQuantity == product.specQuantity? product.buyCount: product.buyCount* product.saleSpecQuantity}}{{product.productSkuId == product.productSaleSpecId ? product.saleUnit : product.minUnit}}
    </div>
    <div class="item-r" v-else>
      <span v-if="product.productPrice&&product.productPrice.price<=0||!product.productPrice">{{'X'+product.buyCount}}{{product.priceunit}}</span>
      <span v-if="product.productPrice&&product.productPrice.price>0&&product.productSkuId == product.productSaleSpecId">{{'X'+product.buyCount}}{{product.saleUnit}}</span>
      <span v-if="product.productPrice&&product.productPrice.price>0&&product.productSkuId != product.productSaleSpecId">{{'X'+product.buyCount*product.saleSpecQuantity}}{{product.minUnit}}</span>
    </div>
  </div>

</template>

<style lang="stylus" scoped>
  @import "./listingProduct.styl"
</style>

<script>
  import ProductTags from '../common/ProductTags.vue'
  export default {
    props: {
      product: {
        type: Object,
        default: {}
      },
      gift: Boolean
    },
    data() {
      return {
        bonusCanuse: true,       //能否使用红包
        couponCanuse: true,      //能否使用优惠券
      }
    },
    components:{
      ProductTags
    },
    created(){
      this.bonusCanuse = this.product.bonusText ? true : false
      this.couponCanuse = this.product.couponText ? true : false
    },
    methods:{
      //跳转到商品详情
      goToProductDetail: function () {
        let routeData
        //判断产品类型promotionType=5
        if(this.product.enjoyPromotions&&this.product.enjoyPromotions.length&&this.product.enjoyPromotions[0].promotionType == 5){
          routeData = this.$router.resolve({
            name: "groupProductDetail",
            query: this.encodeUrlQuery({activityId: this.product.productSkuId})
          });
        }else{
          routeData = this.$router.resolve({
            name: "productDetail",
            query: this.encodeUrlQuery({skuId: this.product.productSkuId})
          });
        }
        window.open(routeData.href, '_blank');
      },
    },
    watch:{

    }
  }
</script>

