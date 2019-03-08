<template>
  <div class="container product" >
    <div v-if="domShow">
      <!--商品头部信息部分-->
      <div class="info">
        <!--左边商品图片-->
        <div class="left-box">
          <product-img :imgs="[productInfo.imgUrl] || []"></product-img>
        </div>
        <!--右边商品信息-->
        <div class="right-box">
          <!--商品名称，活动信息-->
          <div class="p-name-column">
            <div class="p-n-c-title">
              <h5>{{productInfo.name}}</h5>
            </div>
          </div>
          <!--商品价格-->
          <div class="group-price-column">
            <div class="gpc-l">
              <div class="l-f">组合价：</div>
              <div class="l-s" v-html="$options.filters.price(productInfo.packagePrice,productInfo.priceUnit)"></div>
              <div class="l-t" v-if="productInfo.regularPrice > productInfo.packagePrice">
                ￥{{$options.filters.priceToFixed(productInfo.regularPrice)}}
              </div>
              <div class="l-r" v-if="productInfo.reducePrice">
                立减{{productInfo.reducePrice}}
              </div>
            </div>
            <!--活动倒计时-->
            <div class="gpc-r" v-if="showTimeCount">
              <div class="title">距离结束还有</div>
              <time-count-down @time-end="onTimeEnd" :endTime="productInfo.endDate" :startTime="productInfo.beginDate" timeStyle='2'></time-count-down>
            </div>
          </div>
          <!--能否使用红包优惠券-->
          <!-- 促销标签 限时惠产品不显示促销标签 -->
          <div class="p-tag-column" v-if="(productInfo.accumulationText||productInfo.unAccumulationText||productInfo.bonusText||productInfo.unBonusText||productInfo.couponText||productInfo.unCouponText)">
            <span v-if="productInfo.accumulationText||productInfo.unAccumulationText"><i :class="{'can':productInfo.accumulationText}"></i>{{productInfo.accumulationText?`参与累计`:`不参与累计`}}</span>
            <span v-if="productInfo.bonusText||productInfo.unBonusText"><i :class="{'can':productInfo.bonusText}"></i>{{productInfo.bonusText?`可使用红包`:`不可使用红包`}}</span>
            <span v-if="productInfo.couponText||productInfo.unCouponText"><i :class="{'can':productInfo.couponText}"></i>{{productInfo.couponText?`可使用优惠券`:`不可使用优惠券`}}</span>
          </div>
          <!--商品提示栏-->
          <div class="p-tips-column" v-if="productInfo.specialNoticeTag">
            <span>{{productInfo.specialNoticeTag.tagName}}</span>
            <p>{{productInfo.specialNoticeTag.tagDetail}}</p>
          </div>
          <!--促销信息-->
          <div class="p-cx-column" v-if="productInfo.promotionTags&&productInfo.promotionTags.length">
            <div class="title">促销</div>
            <div class="list">
              <div class="tag" v-for="item in productInfo.promotionTags" :key="item.tagName">
                <span class="first">{{item.tagName}}</span>
                <P>{{item.tagDetail}}</P>
                <span v-if="promotionTagShow" class="last">展开<i></i></span>
              </div>
            </div>
          </div>
          <!--收货地址-->
          <div class="p-ads-column" @mouseleave="leaveAddressBox" v-if="!isVisitor">
            <span>送货至</span>
            <div class="address" :class="{'address-unfold':addressBoxShow}">
              <div class="default">
                <i class="dw"></i>
                <span>{{userDefaultAddress}}</span>
                <i class="xz" @click="showAddressBox"></i>
              </div>
              <div class="all" v-if="addressBoxShow">
                <p class="title">选择新地址</p>
                <ul class="ads-list">
                  <li v-for="ads in addressArr" @click="swtichAddress(ads)">
                    <i></i>
                    <p>{{ads.province+ads.city+ads.county+ads.street+ads.detailAddress}}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--商品规格-->
          <div class="p-spec-column">
            <span>规格</span>
            <div>
              <div><span class="onlysalespecs">{{productInfo.specName}}</span></div>
            </div>
          </div>
          <!--商品数量加减框，购买，加入购物车-->
          <div class="p-buy-column">
            <span>数量</span>
            <div class="buy-wrap">
              <div class="buy-wrap-tract">
                <div>
                  <number-picker :product="productInfo" :detection="true"></number-picker>
                </div>
                <div class="dw">{{productInfo.priceUnit}}</div>
                <div class="kc">库存<span>{{productInfo.stockText||'充足'}}</span></div>
              </div>
              <div class="buy-wrap-btn">
                <!--正常购买-->
                <div v-if="userState==1&&!noCantBuy">
                  <span class="buy" @click="goToSettlement">马上进货</span>
                  <span class="add" @click="addToShopCart">加入购物车</span>
                </div>
                <!--游客-->
                <div v-else-if="userState==999">
                  <router-link to="/login">登录后可以购买，立即登录</router-link>
                </div>
                <!--不能购买-->
                <div v-else-if="noCantBuy">
                  <span class="gone">{{noCantBuyText}}</span>
                </div>
                <!--待审核用户-->
                <div v-else>
                  <span class="gone">审核通过后可以购买</span>
                </div>
              </div>
            </div>
          </div>
          <!--服务信息-->
          <div class="p-service-column" v-if="productInfo.serverDesc&&productInfo.deliveryMode!=2">
            <span>服务</span>
            <p>{{productInfo.serverDesc}}</p>
          </div>
          <!--自提信息-->
          <div class="p-service-column" v-if="productInfo.citySelfPickUp&&productInfo.deliveryMode!=1&&productInfo.saleMode != 2&&productInfo.saleMode != 6">
            <span>自提</span>
            <p>{{productInfo.selfPickUpReduceTag?productInfo.selfPickUpReduceTag.tagDetail:`支持自提`}}</p>
          </div>
        </div>
      </div>

      <!--组合产品清单列表-->
      <div class="groups-wrap">
        <h4>组合清单</h4>
        <div class="groups-column">
          <div>商品</div>
          <div>价格(元)</div>
          <div>数量</div>
        </div>
        <ul class="groups-list">
          <li class="list-column" v-for="item in productInfo.items">
            <div class="column-l">
              <div class="pic" @click="goToProductDetail(item)">
                <img v-lazy="item.productSku.imgUrl" class="img-adapt" />
              </div>
              <div class="info" @click="goToProductDetail(item)">
                <h5>{{item.productSku.productName}}</h5>
                <div class="date" v-if="item.productSkuproductionDate">生产日期：{{item.productSku.productionDate}}</div>
              </div>
            </div>
            <div class="column-m">
              <div v-if="item.productSku.productPrice.price">
                <span>批价：</span>
                <span v-html="$options.filters.price(item.productSku.productPrice.price,item.productSku.priceunit)"></span>
              </div>
              <div v-else>
                <div>{{item.hiddenPriceText}}</div>
              </div>
            </div>
            <div class="column-r">
              <div  v-if="item.productUnitParams!=item.productSku.minUnit">
                {{item.productCount}}*{{item.productSku.specName}}
              </div>
              <div v-else>
                {{item.productCount}} {{item.productSku.minUnit}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import "./stylus/groupProductDetail.styl"
</style>

<script>
  import avatar from "@/assets/images/duigou_jiarugouwuche@2x.png";
  import { mapGetters, mapActions } from "vuex";
  import AppHeader from './../AppHeader.vue'
  import Navi from './../Navi.vue'
  import AppFooter from './../AppFooter.vue'
  import TimeCountDown from '../../components/common/TimeCountDown.vue'
  import ProductImg from '../../components/productDetail/ProductImg.vue'
  import NumberInput from '../../components/common/NumberInput.vue'
  import numberPicker from "../../components/common/numberPicker.vue"
  import Product from '../../components/common/product-common.vue'
  import * as $cache from "common/cache";
  import * as productApi from "api/product/product"
  import * as DateUtil from "../../common/DateUtil";
  import { RecommendProductList } from "api/common/common";
  import * as ProductInfoUtil from "../../common/productInfo/productInfoUtil"
  import * as ShopCartBaseJs from "../../common/shopCart/shopCartBase"
  import * as PrepareSettlementUtil from "../../common/orderSubmit/prepareSettlementUtil"
  import * as SwitchAddressJs from "../../common/switchAddress"
  import { AddShopCart } from "api/cart/cart";
  import bus from "common/bus";

  export default {
    data() {
      return {
        timeEndMsg: ``,
        productInfo: {},
        activityId: '',                 //活动id
        activityName: '',               //活动名称
        domShow: false,
        promotionTagShow: false,        //促销活动信息是否显示展开按钮
        addressId: '',                //用户地址id
        buyCount: 0,                  //加入购物车的数量
        recommendList: [],              //推荐产品列表
        showRecommendList: [],          //显示的推荐产品（一次显示3个产品）
        recommendIdx: 0,
        currentPage: 1,
        pageSize: 18,
        citySelfPickUp: false,
        addressBoxShow: false,
        addressArr: [],                   //用户启用的收货地址列表
        minBuyAmount: 0,                  //订单起送金额
        showTimeCount: false,             //活动距离结束3天才显示倒计时
        noCantBuy: '',
        noCantBuyText: '',
        userState: 1,
      }
    },
    computed: {
      ...mapGetters(["userDefaultAddress"])
    },
    components: {
      AppHeader,
      Navi,
      AppFooter,
      TimeCountDown,
      ProductImg,
      numberPicker,
      Product
    },
    beforeRouteEnter (to, from, next) {
      next(vm=>{
        vm.$createTalkingData("Product", "", {},1)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$createTalkingData("Product", "", {},2)
      next()
    },
    mounted(){
      bus.$off("recalculate")
      bus.$on("recalculate", (data) => {
        this.$createTalkingData("Product", "Product_Edit_Count", {SkuId:this.productInfo.productSkuId})
      });
    },
    beforeCreate: function () {

    },
    created: function () {
      this.userState = this.isVisitor ? 999 : localStorage.getItem('USER_DETAIL')&&JSON.parse(localStorage.getItem('USER_DETAIL')).state ?
        JSON.parse(localStorage.getItem('USER_DETAIL')).state : 1
      let query = this.decodeUrlQuery(this.$route.query)
      this.activityId = query.activityId || ''
      this.activityName = query.activityName || ''
      this.citySelfPickUp = JSON.parse(localStorage.getItem(`APP_SETTING`)).unlockSelfPickup
      let address = JSON.parse(localStorage.getItem('USER_ADDRESS')) || []
      for(let item of address){
        if(item.state == 1) this.addressArr.push(item)
      }
      const param = {
        activityId: query.activityId || '47239'
      }
      this.getProductInfo(param)
    },
    methods: {
      ...mapActions(["initUserDefaultAddress","saveCartCount"]),
      onTimeEnd(msg){
        this.timeEndMsg = msg
      },
      //获取组合商品详情
      getProductInfo(param){
        productApi.GetGroupProductDetail(param)
          .then(res => {
            if (res.success) {
              let productDetail = ProductInfoUtil.rebuildProduct(res.data,`compositeProductDetail`)
              console.log(productDetail)
              //获取订单起送金额
              this.minBuyAmount = ShopCartBaseJs.getQsMoney(productDetail.specialAreaId)
              let serviceTime = new Date($cache.getCache('serviceTime')).getTime()
              productDetail.endDate = new Date(productDetail.endDate).getTime()
              productDetail.beginDate = new Date(productDetail.beginDate).getTime()
              this.showTimeCount = DateUtil.showTimeCount(productDetail.endDate,serviceTime)
              this.hasNotBegin = DateUtil.compareDate(productDetail.beginDate, serviceTime)
              this.hasEnd = DateUtil.compareDate(serviceTime, productDetail.endDate)
              this.getActivityState(productDetail,serviceTime)
              productDetail.deliveryMode = productDetail.items[0].productSku.deliveryMode
              this.productInfo = productDetail
              this.domShow = true
            }
          })
          .catch(res => {});
      },
      //获取活动状态
      getActivityState(productDetail,serviceTime) {
        const {hasNotBegin,hasEnd} = this
        //活动状态不为已发布
        let cantBuy = productDetail.state != 2 || hasNotBegin || hasEnd || !productDetail.enjoyUserLevelDiscount || (productDetail.stockCount == 0 && !hasNotBegin && !hasEnd && productDetail.state != 3)
        let cantBuyText = productDetail.state != 2 ? `活动已下架` :
          hasNotBegin ? `活动未开始` :
            hasEnd ? `活动已结束` :
              !productDetail.enjoyUserLevelDiscount ? `您的会员等级不够，暂时不能购买` :
                (productDetail.stockCount == 0 && !hasNotBegin && !hasEnd && productDetail.state != 3) ? `商品已抢光` : ``
        this.noCantBuy = cantBuy
        this.noCantBuyText = cantBuyText
      },
      //跳转到商品详情
      goToProductDetail: function(e) {
        this.$router.push({
          name: 'productDetail',
          query: this.encodeUrlQuery({
            skuId: e.productSku.productSkuId
          })
        })
      },
      //加入购物车
      addToShopCart() {
        this.$createTalkingData("Product", "Product_To_Car", {SkuId:this.productInfo.productSkuId})
        const {
          buyCount,
          productSkuId,
          productType,
          productSaleSpecId,
          price,
          saleUnit,
          sourceId
        } = this.productInfo
        const param ={count: buyCount,
          productSkuId,
          productType,
          saleSpecId: productSaleSpecId,
          sellingPrice: price,
          sellingPriceUnit: saleUnit,
          sourceId
        }
        AddShopCart(param).then(res => {
          if (res.success) {
            this.saveCartCount(param.count)
            this.$confirm({
                        content: "已成功加入购物车",
                        imgUrl: avatar,
                        yesText: "去购物车",
                        noText: "继续购物",
                        showDuration: true
              }).then(() => {
              this.$createTalkingData("Product", "Product_To_Car_Pop", {ProductCarButton:2})
              let routeData = this.$router.resolve({
                name: "shopCart"
              });
              window.open(routeData.href, "_self");
            })
            .catch(() => {
              this.$createTalkingData("Product", "Product_To_Car_Pop", {ProductCarButton:1})
            });
          }
        });
      },
      //显示地址切换栏
      showAddressBox(){
        this.addressBoxShow = !this.addressBoxShow
      },
      leaveAddressBox(){
        this.addressBoxShow = false
      },
      //切换地址
      swtichAddress(e){
        SwitchAddressJs.swtich.call(this,e,`productDetail`)
      },
      //立即购买
      goToSettlement(){
        this.$createTalkingData("Product", "Product_Revise_Quantity", {SkuId:this.productInfo.productSkuId})
        PrepareSettlementUtil.transferSettlement.call(this,1)
      },
    },
  }
</script>

