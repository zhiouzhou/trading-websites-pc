<template>
  <div>
    <!--优惠码凑单提示-->
    <div class="tip-column">
      <span>优惠</span>
      <p>{{this.couponCodeTip}}</p>
    </div>
    <!--产品信息-->
    <div class="product-item">
      <div class="pi-l">
        <div class="info">
          <div class="pic">
            <img v-lazy="product.imgsUrl[0]" />
          </div>
          <div class="detail">
            <h5>{{product.productName}}</h5>
            <div class="price">
              <span v-html="$options.filters.price(product.productPrice.price,product.priceunit)"></span>
            </div>
            <div class="reduce" v-if="product.productPrice.reducePrice>0">
              <span>立减{{product.productPrice.reducePrice}}元</span>
            </div>
            <div style="flex:1;"></div>
            <div class="spec">
              <span>规格：{{product.specName}}</span>
              <span v-if="product.productionDate">生产日期：{{product.productionDate}}</span>
            </div>
          </div>
        </div>
        <div class="tag">
          <product-tags :bonusCanuse="bonusCanuse" :couponCanuse="couponCanuse"></product-tags>
        </div>
      </div>
      <div class="pi-r">
        <div class="number-input">
          <div class="reduce" @click="decrease(product)">
            <span v-bind:class="{ disabled: product.buyCount <= product.minBuyNum }"></span>
          </div>
          <div class="input">
            <input :value="product.buyCount" @change="handleChange(product, $event)">
          </div>
          <div class="add" @click="increase(product)">
            <span v-bind:class="{ disabled: product.buyCount >=product.maxBuyNum }"></span>
          </div>
        </div>
        <div class="dw">{{product.productSkuId == product.productSaleSpecId ? product.saleUnit : product.minUnit}}</div>
      </div>
    </div>
  </div>

</template>

<style lang="stylus" scoped>
  @import "./couponCodeDirectional.styl"
</style>

<script>
  import ProductTags from '../common/ProductTags.vue'
  import * as CouponCodeUtil from "common/orderSubmit/couponCodeUtil"
  import bus from "common/bus";
  function isValueNumber(value) {
    return /^(0|[1-9][0-9]*)$/.test(value);
  }
  export default {
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      codeObj: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        bonusCanuse: true,       //能否使用红包
        couponCanuse: true,      //能否使用优惠券
        conditionText: ``,
        couponCodeTip: ``,        //优惠码提示
        totalmoney: 0,            //优惠码添加产品的总金额
        count: 0,                 //优惠码添加产品的总数量
        lastNeedCount: 0,
      }
    },
    components:{
      ProductTags
    },
    created(){
      this.bonusCanuse = this.product.bonusText ? true : false
      this.couponCanuse = this.product.couponText ? true : false
      CouponCodeUtil.condition.call(this)
    },
    mounted(){
      bus.$on("dialogShow", (data) => {
        CouponCodeUtil.condition.call(this)
      });
    },
    methods:{
      decrease(product) {
        const { buyCount, minBuyNum } = product;
        if (buyCount > minBuyNum) {
          product.buyCount = buyCount - 1;
          this.updateTips()
        }
      },
      increase(product) {
        const { buyCount, maxBuyNum } = product;
        if (buyCount < maxBuyNum) {
          product.buyCount = buyCount + 1;
          this.updateTips()
        }
      },
      handleChange(product, event) {
        const val = event.target.value.trim();
        if (!isValueNumber(val)) {
          event.target.value = product.buyCount;
          return;
        }
        const { minBuyNum, maxBuyNum } = product;
        product.buyCount =
          val > maxBuyNum ? maxBuyNum : val < minBuyNum ? minBuyNum : val;
        this.updateTips()
      },
      updateTips(){
        CouponCodeUtil.calculateCodeTips.call(this)
      },
    },
    watch:{

    }
  }
</script>

