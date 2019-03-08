<template>
  <div>
    <div v-if="!product.invalid">
      <!-- 凑单提示栏 -->
      <div class="notice-tag-column" v-if="product.select&&product.productGatherDesc">
        <span class="label">凑单</span>
        <p class="content">{{product.productGatherDesc}}</p>
        <span class="btn" v-if="product.gatherCount==0" @click="goToGather(product,3)">去凑单></span>
      </div>
      <div class="item-box" :class="{ 'select-bg': product.select}">
        <div class="item-left">
          <span class="checker" :class="[{'not-choose': !product.canSelect},{'checked': product.select}]" @click="onTap(`productSelect`)"></span>
        </div>
        <div class="item-right">
          <div class="product-wrap-shop">
            <!-- 商品信息 -->
            <div class="product-info">
              <div class="product-pic" @click="goToProductDetail">
                <img v-lazy="product.imgUrl" />
              </div>
              <div class="product-detail">
                <h5 @click="goToProductDetail">
                  <!--活动标签-->
                  <span v-if="product.enjoyPromotions&&product.enjoyPromotions.length">【{{product.enjoyPromotions[0].promotionText}}】</span>
                  {{product.productName}}
                </h5>
                <!--参与的活动-->
                <div class="product-join-activity" v-if="product.sourceDesc" @click="goToAcitityDetail">该产品正在参与「{{product.sourceDesc}}」活动 ></div>
                <div class="product-detail-spec">
                  <span class="spec">规格：{{product.specName}}</span>
                  <span class="production" v-if="product.productionDate">生产日期：{{product.productionDate}}</span>
                </div>
                <div style="flex: 1;"></div>
                <!--限时惠不显示-->
                <product-tags v-if="product.productType!=4" :bonusCanuse="bonusCanuse" :couponCanuse="couponCanuse"></product-tags>
              </div>
            </div>
            <!-- 价格 -->
            <div class="product-price">
              <div class="price-amount">
                <!--经销商产品-->
                <div v-if="product.saleMode == 6">
                  <div>
                    <div v-if="product.productPrice.price">
                      <span>¥</span>
                      <span>{{$options.filters.priceToFixed(product.productPrice.price)}}</span>
                      <span>/{{product.priceunit}}</span>
                    </div>
                    <div v-if="!product.productPrice.price&&product.productPrice.intervalPrice">
                      <span>¥</span>
                      <span>{{$options.filters.priceToFixed(product.productPrice.intervalPrice)}}</span>
                    </div>
                    <span v-if="product.productPrice.lastBuyPrice&&!product.productPrice.price">上次进货价 ¥{{$options.filters.priceToFixed(product.productPrice.lastBuyPrice)}}{{product.priceunit}}</span>
                  </div>
                </div>
                <!--普通产品-->
                <div v-else>
                  <div v-if="product.productPrice.price">
                    <div class="product-price-column">
                      <!--活动tag标签-->
                      <div class="price-tag" v-if="product.enjoyPromotions&&product.enjoyPromotions.length&&(product.enjoyPromotions[0].promotionType == 3||product.enjoyPromotions[0].promotionType == 4||product.enjoyPromotions[0].promotionType == 6)">{{priceTagText()}}</div>
                      <div>
                        <span>¥</span>
                        <span>{{product.productPrice.priceDisplayType==2?$options.filters.priceToFixed(product.productPrice.gatherOrderPrice):$options.filters.priceToFixed(product.productPrice.price)}}</span>
                        <span>/{{product.priceunit}}</span>
                      </div>
                    </div>
                    <div class="price-elide">
                      <!--组合商品划掉原价， 限时惠产品显示划掉的原价 ，活动价和原价相等时，不需要显示划掉的原价-->
                      <span class="text-through" v-if="product.productPrice.priceDisplayType!=2&&(product.productType==2 || product.productType==4 || (product.enjoyPromotions&&product.enjoyPromotions.length&&product.enjoyPromotions[0].promotionType==3))&& product.productPrice.price != product.productPrice.sellPrice">
                    ¥{{$options.filters.priceToFixed(product.productPrice.sellPrice)}}
                  </span>
                      <!-- 凑单价划掉原价 -->
                      <span class="text-through" v-if="product.productPrice.priceDisplayType==2">
                    ¥{{$options.filters.priceToFixed(product.productPrice.price)}}
                  </span>
                    </div>
                  </div>
                  <div v-else>{{product.hiddenPriceText}}</div>
                </div>
              </div>
              <div class="price-tip-column" v-if="product.productPrice.joinAfterReduceAmount||product.productPrice.reducePrice||product.productPrice.selfPickUpReduceAmount">
                <div class="price-reduce" v-if="product.productPrice.reducePrice">立减{{product.productPrice.reducePrice}}元/{{product.priceunit}}</div>
                <div class="price-reduce" v-if="product.productPrice.joinAfterReduceAmount">比加入时降{{product.productPrice.joinAfterReduceAmount}}元</div>
                <div class="price-reduce" v-if="product.productPrice.selfPickUpReduceAmount">自提省{{product.productPrice.selfPickUpReduceAmount}}元</div>
              </div>
            </div>
            <!-- 加减框 -->
            <div class="product-subtract">
              <div class="product-subtract-t">
                <number-picker :product="product" :detection="true"></number-picker>
                <!--单位-->
                <div class="dw">{{product.productSkuId==product.productSaleSpecId?product.saleUnit:product.minUnit}}</div>
              </div>
              <!-- 起购限购，消耗酒币，享受凑单提示 -->
              <div class="limit-label" v-if="product.hasMinBuy||product.limitBuyTag">
                <span class="black" v-if="product.hasMinBuy&&product.minBuyNum>1">起购{{product.productSkuId==product.productSaleSpecId?product.minBuyNum:product.minBuyNum*product.saleSpecQuantity}}{{product.productSkuId==product.productSaleSpecId?product.saleUnit:product.minUnit}}</span>
                <span class="black" v-if="product.limitBuyTag">限购{{product.productSkuId==product.productSaleSpecId?product.maxBuyNum:product.maxBuyNum*product.saleSpecQuantity}}{{product.productSkuId==product.productSaleSpecId?product.saleUnit:product.minUnit}}</span>
              </div>
              <!--超出购买限制-->
              <div class="purchase-label" v-if="product.cantSelectReason">{{product.cantSelectReason}}</div>
            </div>
            <!-- 商品操作项 -->
            <div class="product-edit">
              <div><span @click="manoeuvre(`remove`)">删除</span></div>
              <div><span @click="manoeuvre(`add`)" v-if="product.productType!=2">{{product.userFavorite ? `已关注` : `加入我的关注`}}</span></div>
            </div>
          </div>
          <!-- 产品满赠，送红包 -->
          <div class="tags-wrap-b" v-if="product.productTags&&product.productTags.length">
            <div class="product-bottom" v-for="(tag,i) in product.productTags">
              <span>【{{tag.tagName}}】</span>
              <span>{{tag.tagDetail}}</span>
              <i v-if="product.productTags.length>1&&i==0"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--失效产品-->
    <div v-else>
      <div class="item-box item-invalid-box">
        <div class="item-left">
          <span class="checker" style="visibility: hidden"></span>
        </div>
        <div class="item-right">
          <div class="product-wrap-shop">
            <!-- 商品信息 -->
            <div class="product-info">
              <div class="product-pic" @click="goToProductDetail">
                <img v-lazy="product.imgUrl" />
              </div>
              <div class="product-detail">
                <h5 @click="goToProductDetail">
                  {{product.productName}}
                </h5>
                <div class="product-detail-spec">
                  <span class="spec">规格：{{product.specName}}</span>
                  <span class="production" v-if="product.productionDate">生产日期：{{product.productionDate}}</span>
                </div>
                <!--失效原因-->
                <div class="invalid-reason"><span>{{product.invalidDesc}}</span></div>
                <div style="flex: 1;"></div>
              </div>
            </div>
            <!-- 价格 -->
            <div class="product-price">
              <div class="price-amount">
                <!--经销商产品-->
                <div v-if="product.saleMode == 6">
                  <div>
                    <div v-if="product.productPrice.price">
                      <span>¥</span>
                      <span>{{$options.filters.priceToFixed(product.productPrice.price)}}</span>
                      <span>/{{product.priceunit}}</span>
                    </div>
                    <div v-if="!product.productPrice.price&&product.productPrice.intervalPrice">
                      <span>¥</span>
                      <span>{{$options.filters.priceToFixed(product.productPrice.intervalPrice)}}</span>
                    </div>
                    <span v-if="product.productPrice.lastBuyPrice&&!product.productPrice.price">上次进货价 ¥{{$options.filters.priceToFixed(product.productPrice.lastBuyPrice)}}{{product.priceunit}}</span>
                  </div>
                </div>
                <!--普通产品-->
                <div v-else>
                  <div v-if="product.productPrice.price">
                    <div class="product-price-column">
                      <!--活动tag标签-->
                      <div class="price-tag" v-if="product.enjoyPromotions&&product.enjoyPromotions.length&&(product.enjoyPromotions[0].promotionType == 3||product.enjoyPromotions[0].promotionType == 4||product.enjoyPromotions[0].promotionType == 6)">{{priceTagText()}}</div>
                      <div>
                        <span>¥</span>
                        <span>{{product.productPrice.priceDisplayType==2?$options.filters.priceToFixed(product.productPrice.gatherOrderPrice):$options.filters.priceToFixed(product.productPrice.price)}}</span>
                        <span>/{{product.priceunit}}</span>
                      </div>
                    </div>
                    <div class="price-elide">
                      <!--组合商品划掉原价， 限时惠产品显示划掉的原价 ，活动价和原价相等时，不需要显示划掉的原价-->
                      <span class="text-through" v-if="product.productPrice.priceDisplayType!=2&&(product.productType==2 || product.productType==4 )&& product.productPrice.price != product.productPrice.sellPrice">
                    ¥{{$options.filters.priceToFixed(product.productPrice.sellPrice)}}
                  </span>
                      <!-- 凑单价划掉原价 -->
                      <span class="text-through" v-if="product.productPrice.priceDisplayType==2">
                    ¥{{$options.filters.priceToFixed(product.productPrice.price)}}
                  </span>
                    </div>
                  </div>
                  <div v-else>{{product.hiddenPriceText}}</div>
                </div>
              </div>
            </div>
            <!-- 加减框 -->
            <div class="product-subtract">
              <!--<number-input @on-change="onChangeCount" v-model="productBuyCount" :max="product.maxBuyNum" :min="product.minBuyNum" :xs="xs"></number-input>-->
              <number-picker :product="product"></number-picker>
            </div>
            <!-- 商品操作项 -->
            <div class="product-edit">
              <div><span @click="manoeuvre(`remove`)">删除</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="stylus" scoped>
  @import "./ShopCartProduct.styl"
</style>

<script>
  import ProductTags from './../../components/common/ProductTags.vue'
  import numberPicker from "./../common/numberPicker.vue"
  import * as ShopCartOperate from "../../common/shopCart/shopCartOperate"
  import bus from "common/bus";

  export default {
    props: {
      title: String,
      showBack: Boolean,
      product: {
        type: Object,
        default: {}
      },
      groupState: {
        type: Number
      }
    },
    data() {
      return {
        buyCount: 0,
        xs: 1,                 //产品规格系数
        productSelect: false,
        bonusCanuse: true,       //能否使用红包
        couponCanuse: true,      //能否使用优惠券
        vueName: `shopCartProduct`,
      }
    },
    components:{
      ProductTags,
      numberPicker
    },
    created(){
      this.bonusCanuse = this.product.bonusText ? true : false
      this.couponCanuse = this.product.couponText ? true : false
      this.product.hasMinBuy = this.product.hasMinBuy || ''
      this.product.limitBuyTag = this.product.limitBuyTag || ''
      this.productBuyCount = this.product.productSkuId==this.product.productSaleSpecId?this.product.buyCount:this.product.buyCount*this.product.saleSpecQuantity
      //自提优惠tagType=99
      this.product.productTags = this.product.productTags && this.product.productTags.filter((item)=>{
        return item.tagType != 99 && item.tagType != 1
      })
    },
    methods:{
      onTap(type){
        ShopCartOperate.operateItem(this,type)
        bus.$emit("recalculate", '')
      },
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
        if(this.product.saleMode==6){
          routeData = this.$router.resolve({
            path: "/dealer/productDetail",
            query: this.encodeUrlQuery({skuId: this.product.productSkuId,shopId: this.product.companyId})
          });
        }
        this.$createTalkingData("ShoppingCar", "", {},2)
        this.$createTalkingData("ShoppingCar", "ShoppingCar_Product_View", { SkuId: this.product.productSkuId })
        window.open(routeData.href, '_blank');
      },
      //跳转到活动详情
      goToAcitityDetail(){
        let routeData = this.$router.resolve({
          name: "activityDetail",
          query: this.encodeUrlQuery({
            activityId: this.product.sourceId,
            promotionType: this.product.enjoyPromotions[0].promotionType,
            specialAreaId: this.product.specialAreaId
          })
        });
        window.open(routeData.href, '_blank');
      },
      priceTagText(enjoyPromotions){
        let tag = ''
        tag =
          this.product.enjoyPromotions[0].promotionType == 3 ? `促` :
            this.product.enjoyPromotions[0].promotionType == 4 ? `限` :
              this.product.enjoyPromotions[0].promotionType == 6 ? `凑` : ''
        return tag
      },
      onChangeCount: function (data) {
        this.product.buyCount = data
      },
      //删除或添加关注购物车产品
      manoeuvre(type){
        if(type==`add`&&this.product.userFavorite) return
        //加入关注,删除商品事件埋点
/*        if(type==`add`){
          let skuIds = [this.product.productSkuId]
          this.$createTalkingData("ShoppingCar", "ShoppingCar_Follow", { SkuIds:skuIds })
        }else if(type==`remove`){
          this.$createTalkingData("ShoppingCar", "ShoppingCar_Delete", { SkuId: this.product.productSkuId })
        }*/
        let param = {
          type: type,
          shopCartId: this.product.shopCartId,
          productSkuId: this.product.productSkuId,
          buyCount: this.product.buyCount
        }
        bus.$emit("handleShopCart", param)
      },
      //去凑单
      goToGather(e,type) {
        /*
        * type 类型 1：起送；2：优惠；3：凑单
        * 优惠提示去逛逛，列表页不需要底部栏，type值设为0
         */
        if(e.canUseCoupon && type == 2){
          type = 0
        }
        let PromotionId = this.$parent.gatherOrder ? this.$parent.gatherOrder.activityId : ''
        this.$createTalkingData("ShoppingCar", "ShoppingCar_ToStroll", { AreaId: e.groupId || e.id, PromotionType: 6, PromotionId })
        //产品去凑单事件埋点
        this.$router.push({
          path: "/index/list",
          query: {
            specialAreaId: e.specialAreaId,
            gatherType: type,
            gatherCount: e.buyNeedAmount,
            searchKey: ``
          }
        });
      },
    },
    watch:{

    }
  }
</script>

