<template>
  <div class="container product">
    <div v-if="domShow">
      <!--商品头部信息部分-->
      <div class="info">
        <!--左边商品图片-->
        <div class="left-box">
          <product-img :imgs="productInfo.imgsUrl || []"></product-img>
          <!--产品水印图片-->
          <div class="water-mark-logo" v-if="productInfo.enjoyPromotions&&productInfo.enjoyPromotions.length">
            <img v-if="productInfo.enjoyPromotions[0].promotionWatermark" v-lazy="productInfo.enjoyPromotions[0].promotionWatermark" />
          </div>
          <!--产品收藏-->
          <div class="favorite-column" @click="toggleFavorite" v-if="!isVisitor">
            <i :class="{'favorited':productInfo.favorite}"></i>
            <span>{{productInfo.favorite?`取消关注`:`加入商品关注`}}</span>
          </div>
        </div>
        <!--右边商品信息-->
        <div class="right-box">
          <!--商品名称，活动信息-->
          <div class="p-name-column">
            <div class="p-n-c-title">
              <h5>
                <span>{{productInfo.productName}}</span>
              </h5>
              <!-- <span v-if="priceReportShow" @click="goPriceReport">价格举报</span> -->
            </div>
            <div class="p-n-c-activity" v-if="activityInfo.activityId">
              <p class="content">
                该产品正在参加【{{activityInfo.activityName}}】活动
                <span v-if="(!hasNotBegin&&activityInfo.showCountdownTime)||hasNotBegin">，{{hasNotBegin?`距离活动开始仅`:`距离活动结束仅`}}</span>
              </p>
              <div class="time" v-if="(!hasNotBegin&&activityInfo.showCountdownTime)||hasNotBegin">
                <time-count-down @time-end="onTimeEnd" :endTime="Number(activityInfo.endTime)" :startTime="Number(activityInfo.startTime)" timeStyle='1'></time-count-down>
              </div>
              <div class="btn" @click="goToActivity">更多促销商品狂点>>>></div>
            </div>
          </div>
          <!--商品价格-->
          <div class="p-price-column">
            <div v-if="isVisitor" class="c-red">
              ¥<span>?</span>{{productInfo.priceunit}}
            </div>
            <div v-else>
              <!--活动产品价格-->
              <div class="p-p-wrap" v-if="activityInfo.activityId">
                <div class="p-p-c-l">
                  <span v-if="showActivityPrice">活动价</span>
                  <span v-else>{{productInfo.productPrice.priceDisplayType==0?'批价':productInfo.productPrice.priceDisplayType==1?'会员价':'凑单价'}}</span>
                </div>
                <div class="p-p-c-r">
                  <div class="price">
                    <span class="priceunit">¥</span>
                    <span class="num">
                    {{productInfo.productPrice.priceDisplayType==0||productInfo.productPrice.priceDisplayType==1?productInfo.productPrice.price:productInfo.productPrice.gatherOrderPrice}}
                  </span>
                    <span class="priceunit">/{{productInfo.priceunit}}</span>
                    <span class="self-pick-column" v-if="citySelfPickUp&&productInfo.productPrice.selfPickUpPrice">自提价 ¥{{productInfo.productPrice.selfPickUpPrice}}/{{productInfo.priceunit}}</span>
                    <span v-if="productInfo.productPrice.reducePrice&&!productInfo.hiddenPriceText" class="reduce">立减{{productInfo.productPrice.reducePrice}}元</span>
                  </div>
                  <div class="tip" v-if="productInfo.hiddenPriceText">{{productInfo.hiddenPriceText}}</div>
                  <!--显示划掉的价格-->
                  <div class="elide-price">
                    <!--凑单-->
                    <div v-if="productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.gatherOrderPrice<productInfo.productPrice.price">¥{{productInfo.productPrice.price}}</div>
                    <!--非凑单-->
                    <div v-if="!productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.price<productInfo.productPrice.sellPrice">¥{{productInfo.productPrice.sellPrice}}</div>
                  </div>
                </div>
              </div>
              <!--普通产品价格-->
              <div class="p-p-wrap" v-else>
                <div class="p-p-c-l">
                  <span v-if="showActivityPrice">活动价</span>
                  <span v-else>{{productInfo.productPrice.priceDisplayType==0?'批价':productInfo.productPrice.priceDisplayType==1?'会员价':'凑单价'}}</span>
                </div>
                <div class="p-p-c-r">
                  <div class="price">
                    ¥<span class="num">{{productInfo.hiddenPriceText?`？`:productInfo.productPrice.gatherOrderPrice?productInfo.productPrice.gatherOrderPrice:productInfo.productPrice.price}}<span class="priceunit">/{{productInfo.priceunit}}</span></span>
                    <span class="self-pick-column" v-if="citySelfPickUp&&productInfo.productPrice.selfPickUpPrice">自提价 ¥{{productInfo.productPrice.selfPickUpPrice}}/{{productInfo.priceunit}}</span>
                    <span v-if="productInfo.productPrice.reducePrice&&!productInfo.hiddenPriceText" class="reduce">立减{{productInfo.productPrice.reducePrice}}元</span>
                  </div>
                  <div class="tip" v-if="productInfo.hiddenPriceText">{{productInfo.hiddenPriceText}}</div>
                  <!--显示划掉的价格-->
                  <div class="elide-price">
                    <!--凑单-->
                    <div v-if="productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.gatherOrderPrice<productInfo.productPrice.price">¥{{productInfo.productPrice.price}}</div>
                    <!--非凑单-->
                    <div v-if="!productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.price<productInfo.productPrice.sellPrice">¥{{productInfo.productPrice.sellPrice}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="date">
              <span>建议零售价：<i>{{productInfo.productPrice.retailPrice}}</i></span>
              <span>生产日期：<i>{{productInfo.productionDate?productInfo.productionDate:" - "}}</i></span>
              <span>保质期：<i>{{productInfo.shelfLife?productInfo.shelfLife:" - "}}</i></span>
              <span>条形码：<i>{{productInfo.barCode?productInfo.barCode:" - "}}</i></span>
            </div>
          </div>
          <!--能否使用红包优惠券-->
          <!-- 促销标签 限时惠产品不显示促销标签 -->
          <section v-if="this.promotionType!=4">
            <div class="p-tag-column" v-if="(productInfo.accumulationText||productInfo.unAccumulationText||productInfo.bonusText||productInfo.unBonusText||productInfo.couponText||productInfo.unCouponText)">
              <span v-if="productInfo.accumulationText||productInfo.unAccumulationText"><i :class="{'can':productInfo.accumulationText}"></i>{{productInfo.accumulationText?`参与累计`:`不参与累计`}}</span>
              <span v-if="productInfo.bonusText||productInfo.unBonusText"><i :class="{'can':productInfo.bonusText}"></i>{{productInfo.bonusText?`可使用红包`:`不可使用红包`}}</span>
              <span v-if="productInfo.couponText||productInfo.unCouponText"><i :class="{'can':productInfo.couponText}"></i>{{productInfo.couponText?`可使用优惠券`:`不可使用优惠券`}}</span>
            </div>
          </section>
          <!--会员特权-->
          <div class="p-cx-column p-special-column" v-if="productInfo.userLevelPrices&&productInfo.userLevelPrices.length">
            <div class="title">会员特权</div>
            <div class="list">
              <div class="tag">
                <span class="first">会员专享</span>
                <P>{{productInfo.levelNotice}}</P>
              </div>
              <div class="tag" v-for="item in productInfo.userLevelPrices">
                <span class="first">会员特价</span>
                <P>{{item.userLevelName}}{{item.userLevelPrice}}元/{{item.priceUnit}}</P>
              </div>
            </div>
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
                <div :class="{'disable-input':bottomBarState==5||bottomBarState==6||bottomBarState==7}">
                  <number-picker :product="productInfo" :detection="true"></number-picker>
                </div>
                <div class="dw">{{(productInfo.productSkuId == productInfo.productSaleSpecId) ? productInfo.saleUnit : productInfo.minUnit}}</div>
                <div class="kc">库存<span>{{productInfo.inventoryShowText||'充足'}}</span></div>
              </div>
              <!--起购限购提示-->
              <div class="buy-wrap-limit">
                <div v-if="productInfo.minPurchaseNum">
                  起购{{productInfo.minPurchaseNum}}{{(productInfo.productSkuId == productInfo.productSaleSpecId) ? productInfo.saleUnit : productInfo.minUnit}}
                </div>
                <div v-if="productInfo.limitPurchaseNum">
                  限购{{productInfo.limitPurchaseNum}}{{(productInfo.productSkuId == productInfo.productSaleSpecId) ? productInfo.saleUnit : productInfo.minUnit}}
                </div>
                <div v-if="limitPurchaseTxt">{{limitPurchaseTxt}}</div>
              </div>
              <div class="buy-wrap-btn">
                <div v-if="userState==1">
                  <!--产品未下架，正常状态-->
                  <div v-if="productInfo.productState!=0">
                    <!--已抢光-->
                    <div v-if="bottomBarState==7">
                      <span class="gone">已抢光</span>
                    </div>
                    <!--活动中的不能购买情况-->
                    <div v-if="bottomBarState==2||bottomBarState==3||bottomBarState==4">
                      <span class="gone">{{noBuyText(bottomBarState)}}</span>
                    </div>
                    <!--到货通知-->
                    <div v-if="bottomBarState==5||bottomBarState==6">
                      <span :class="productInfo.alreadyArrivalNotice?`gone`:`add`" @click="_getProductNotify">{{productInfo.alreadyArrivalNotice?`已订阅到货通知`:`到货通知`}}</span>
                    </div>
                    <!--申请进货-->
                    <div v-if="bottomBarState==8">
                      <span class="add">申请进货</span>
                    </div>
                    <!--会员等级不够-->
                    <div v-if="bottomBarState==9">
                      <span class="gone">您的会员等级不够,暂时不能购买</span>
                    </div>
                    <!--正常购买-->
                    <div v-if="bottomBarState==0">
                      <span class="buy" @click="goToSettlement">马上进货</span>
                      <span class="add" @click="addToShopCart">加入购物车</span>
                    </div>
                    <!--不能直接购买，只能加入购物车；凑单产品-->
                    <div v-if="bottomBarState==1">
                      <span class="add" @click="addToShopCart">加入购物车</span>
                    </div>
                  </div>
                  <!--产品已下架-->
                  <div v-else>
                    <span class="gone">产品已下架</span>
                  </div>
                </div>
                <div v-else-if="userState==999">
                  <router-link to="/login">登录后可以购买，立即登录</router-link>
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
          <div class="p-service-column" v-if="citySelfPickUp&&productInfo.deliveryMode!=1&&productInfo.saleMode != 2&&productInfo.saleMode != 6">
            <span>自提</span>
            <p>{{productInfo.selfPickUpReduceTag?productInfo.selfPickUpReduceTag.tagDetail:`支持自提`}}</p>
          </div>
        </div>
      </div>

      <!--商品详情部分-->
      <div class="detail">
        <!--为你推荐-->
        <div class="recommend" v-show="!isVisitor">
          <div>
            <h5><span>为你推荐</span></h5>
            <ul class="recommend-wrap clearfix">
              <li>
                <product v-for="(item,i) in showRecommendList" :key="item.productSkuId+i" v-bind:product-item="item"></product>
              </li>
            </ul>
            <div class="refresh-column" @click="switchRecommend()">
              <i></i>换一组看看
            </div>
          </div>
        </div>
        <!--商品介绍-->
        <div class="introduce">
          <div>
            <!--商品文字信息-->
            <div class="content">
              <div class="title">
                <span>商品介绍</span>
              </div>
              <ul class="info-wrap" :class="{'info-transverse':infoTransverse}">
                <li v-for="item in productInfo.productInfoArray" :key="item.key">
                  <span>{{item.key}}</span>
                  <span>{{item.value}}</span>
                </li>
              </ul>
            </div>
            <!--商品图片信息-->
            <ul class="pic-wrap">
              <li v-for="item in productInfo.imgsUrl">
                <img class="img-adapt" v-lazy="item"  />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  @import "./stylus/productDetail.styl"
</style>

<style type="text/css">
  .introduce{
  	margin-left: 328px\9\0;
  }
</style>

<script>
  import { mapGetters, mapActions } from "vuex";
  import avatar from "@/assets/images/duigou_jiarugouwuche@2x.png";
  import AppHeader from './../AppHeader.vue'
  import Navi from './../Navi.vue'
  import AppFooter from './../AppFooter.vue'
  import TimeCountDown from '../../components/common/TimeCountDown.vue'
  import ProductImg from '../../components/productDetail/ProductImg.vue'
  import NumberInput from '../../components/common/NumberInput.vue'
  import numberPicker from "../../components/common/numberPicker.vue"
  import Product from '../../components/common/product-common.vue'
  import * as productApi from "api/product/product"
  import * as ShopCartBaseJs from "../../common/shopCart/shopCartBase"
  import { RecommendProductList } from "api/common/common";
  import { getActivityDetail } from "api/activity/activity"
  import { getProductNotify } from "api/product/product";
  import { transformProductList } from "common/productUtil/list";
  import * as ProductInfoUtil from "../../common/productInfo/productInfoUtil"
  import * as PrepareSettlementUtil from "../../common/orderSubmit/prepareSettlementUtil"
  import * as SwitchAddressJs from "../../common/switchAddress"
  import { AddShopCart } from "api/cart/cart";
  import * as DateUtil from "../../common/DateUtil";
  import * as $cache  from "common/cache";
  import * as homeService from "service/homeService";
  import bus from "common/bus";
  export default {
    data() {
      return {
        timeEndMsg: ``,
        endTime: '',
        productInfo: {},
        promotionType: '',              //活动类型
        activityInfo: {},               //活动信息
        domShow: false,
        promotionTagShow: false,        //促销活动信息是否显示展开按钮
        addressId: '',                //用户地址id
        buyCount: 0,                  //加入购物车的数量
        xs: 1,                          //商品规格系数
        recommendList: [],              //推荐产品列表
        showRecommendList: [],          //显示的推荐产品（一次显示3个产品）
        recommendIdx: 0,
        currentPage: 1,
        pageSize: 60,
        hasNotBegin: false,               //活动未开始
        hasEnd: false,                    //活动已结束
        bottomBarState: 0,                //底部栏状态
        showActivityPrice: false,         //显示活动价
        citySelfPickUp: false,
        addressArr: [],                   //用户启用的收货地址列表
        addressBoxShow: false,
        minBuyAmount: 0,                  //订单起送金额
        priceReportShow: true,             //价格举报
        limitPurchaseTxt: '',
        userState: 1,
        infoTransverse: false,
        toProductParam: '',
        vueName: `productDetail`,
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
      if(to.query.skuId){
        $cache.setCache("toProductParam",'')
      }
      next(vm=>{
        vm.$createTalkingData("Product", "", {},1)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$createTalkingData("Product", "", {},2)
      next()
    },
    beforeCreate: function () {
    },
    mounted(){
      bus.$off("recalculate")
      bus.$on("recalculate", (data) => {
        this.$createTalkingData("Product", "Product_Edit_Count", {SkuId:this.productInfo.productSkuId})
      });
    },
    created: function () {
	  this.toProductParam = $cache.getCache("toProductParam") || ''
      const USER_DETAIL = localStorage.getItem('USER_DETAIL');
      this.userState = this.isVisitor ? 999 : USER_DETAIL&&JSON.parse(USER_DETAIL).state ?
      JSON.parse(USER_DETAIL).state : 1;

	    let query = this.toProductParam ? this.toProductParam : this.decodeUrlQuery(this.$route.query);
      const activityInfo = {
        activityId: query.activityId || '',
        activityName: query.activityName || '',
        activityState: query.activityState || '',
        startTime: query.startTime || '',
        endTime: query.endTime || '',
        enjoyUserLevelDiscount: query.enjoyUserLevelDiscount&&JSON.parse(query.enjoyUserLevelDiscount),
        showCountdownTime: query.showCountdownTime&&JSON.parse(query.showCountdownTime)
      }
      this.activityInfo = Object.assign(this.activityInfo,activityInfo)
      this.promotionType = query.promotionType || ''
      //this.addressId = localStorage.getItem(`addressId`) || '1255172'
      let appSetting = localStorage.getItem('APP_SETTING')
      if(appSetting){
        this.citySelfPickUp = JSON.parse(appSetting).unlockSelfPickup
      }
      let userAddress = localStorage.getItem('USER_ADDRESS')
      let address = []
      if(userAddress){
         address = JSON.parse(userAddress)
      }
      for(let item of address){
        if(item.state == 1) this.addressArr.push(item)
      }
      Object.assign(this, SwitchAddressJs)
      let param = {
        productSkuId: query.skuId
      }
      //限时惠产品从商品列表进入需要查询限时惠活动详情
      if(query.timeLimitPromotionId){
        this.promotionType = 4
        this.getTimeLimitInfo(query.timeLimitPromotionId)
      }else{
        //限时惠产品
        if(this.promotionType==4){
          param = {
            data:{
              productSkuId: query.skuId,
              promotionId: this.activityInfo.activityId
            }
          }
          this.getProductInfo(param,4)
        }else{
          this.getProductInfo(param)
        }
      }
    },
    methods: {
      ...mapActions(["initUserDefaultAddress","saveCartCount"]),
      onTimeEnd(msg){
        this.timeEndMsg = msg
      },
      //获取商品详情
      getProductInfo(param,type){
        productApi.GetProductDetail(param,type)
          .then(res => {
            if (res.success) {
              if(res.data&&!res.data.enjoyPromotions) {
                res.data.enjoyPromotions = [{ promotionType:this.promotionType }]
              }
              let productDetail = ProductInfoUtil.rebuildProduct(res.data,`productDetail`,this.activityInfo.activityId)
              productDetail = this.filterPromotionTag(productDetail)
              //获取订单起送金额
              this.minBuyAmount = ShopCartBaseJs.getQsMoney(productDetail.specialAreaId)
              //获取推荐产品列表
              this.getRecommendList(productDetail.specialAreaId)
              if(productDetail.productInfoArray&&productDetail.productInfoArray.length){
                for(let item of productDetail.productInfoArray){
                  if(item.key == `产品介绍：`) this.infoTransverse = true
                }
              }
              this.productInfo = productDetail
              //活动中的产品
              if(this.activityInfo.activityId){
                this.hasNotBegin = DateUtil.compareDate(this.activityInfo.startTime, $cache.getCache("serviceTime"))
                this.hasEnd = DateUtil.compareDate($cache.getCache("serviceTime"), this.activityInfo.endTime)
              }
              this.bottomBarState = this.getBottomBarState(productDetail)
              if(this.bottomBarState == 5 ||this.bottomBarState == 6 || this.bottomBarState == 7){
                this.productInfo.buyCount = 0
              }
              this.showActivityPrice = this.activityPriceTagShow(productDetail)
              this.domShow = true
            }
          })
          .catch(res => {});
      },
      //获取推荐商品列表
      getRecommendList(id){
        let param = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          data: {
            recommendTarget: 0,
            specialAreaId: id
          }
        }
        RecommendProductList(param)
          .then(res => {
            if (res.success) {
              this.recommendList = transformProductList(res.data)
              this.getShowRecommendProduct()
            }
          })
          .catch(res => {});
      },
      //获取限时惠活动详情
      getTimeLimitInfo(id){
        let param = {
          data: id
        }
        getActivityDetail(param,4)
          .then(res => {
            if (res.success) {
              let activity = res.data
              activity.endDate = new Date(activity.endDate).getTime()
              activity.beginDate = new Date(activity.beginDate).getTime()
              activity.endTime = activity.endDate
              activity.startTime = activity.beginDate
              const activityInfo = {
                activityId: activity.activityId || '',
                activityName: activity.name || '',
                activityState: activity.state || '',
                startTime: activity.startTime || '',
                endTime: activity.endTime || '',
                enjoyUserLevelDiscount: activity.enjoyUserLevelDiscount
              }
              this.activityInfo = Object.assign(this.activityInfo,activityInfo)
              const param = {
                data:{
                  productSkuId: this.$route.query.skuId,
                  promotionId: id
                }
              }
              this.getProductInfo(param,4)
            }
          })
          .catch(res => {});
      },
      //获取显示的推荐产品
      getShowRecommendProduct(){
        if(this.recommendList.length){
          let startIdx = this.recommendIdx == 0 ? 0 : this.recommendIdx*3
          let endIdx = startIdx + 3
          let recommend = this.recommendList.slice(startIdx,endIdx)
          this.showRecommendList = recommend
        }
      },
      //切换推荐产品
      switchRecommend(){
        let idx = this.recommendIdx
        let totals = this.recommendList.length
        idx = idx >= totals/3 - 1 ? 0 : idx+1
        this.recommendIdx = idx
        this.getShowRecommendProduct()
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
      //去活动详情页
      goToActivity(){
        this.$createTalkingData("Product", "", {},2)
        this.$createTalkingData("Product", "Product_More", {PromotionId:this.activityInfo.activityId})
        let routeData = this.$router.resolve({
          name: "activityDetail",
          query: this.encodeUrlQuery({
            activityId: this.activityInfo.activityId,
            promotionType: this.promotionType
          })
        });
        window.open(routeData.href, '_blank');
      },
      //商品收藏
      toggleFavorite(){
        let param = {}
        let type
        //添加收藏
        if(!this.productInfo.favorite){
          param = {
            datas: [{
              favoriteProductType: 0,
              productSkuId:this.productInfo.productSkuId
            }]
          }
          type = `add`
          this.$createTalkingData("Product", "Product_Recomme", {SkuId: this.productInfo.productSkuId,IsFollow: 1})
        }else{
          //移除收藏
          param = {
            datas:[this.productInfo.productSkuId]
          }
          type = `remove`
          this.$createTalkingData("Product", "Product_Recomme", {SkuId: this.productInfo.productSkuId,IsFollow: 0})
        }
        let currentFavorite = this.productInfo.favorite
        productApi.operateProductFavorite(param,type)
          .then(res => {
            if (res.success) {
                if(!currentFavorite){
                   this.$createTalkingData("Product", "Product_Follow_Result", {SkuId: this.productInfo.productSkuId,IsSuccess: 1})
                   this.$confirm( {
                     content: "已成功加入商品关注",
                     yesText: "查看关注",
                     noText: "继续购物",
                   })
                     .then(() => {
                       this.$router.push({ path: "/myOrderEntry/favoriteProduct" });
                     })
                     .catch(() => {});
                }else{
                  this.$createTalkingData("Product", "Product_Follow_Result", {SkuId: this.productInfo.productSkuId,IsSuccess: 0})
                  this.$message( "取消成功")
                }
              this.productInfo.favorite = !currentFavorite
            }
          })
          .catch(res => {});
          //关注 改变cache
          homeService.CacheMyProductBriefList(true);
      },
      //到货通知
      _getProductNotify() {
        if (this.productInfo.alreadyArrivalNotice) {
          this.$message("您已订阅该商品的到货通知");
          return false;
        }
        getProductNotify(this.productInfo.productSkuId)
          .then(res => {
            if (res.success) {
              this.productInfo.alreadyArrivalNotice = true;
              this.$message("商品一旦到货，您将收到通知");
            }
          }).catch(res => { });
      },
      //底部栏状态
      getBottomBarState(productDetail) {
        let bottomBarState = 0
        if (productDetail.saleMode == 2) {
          //合作商不考虑，直接买
          // bottomBarState = productDetail.stockState == 3 ? 7 : 0
        } else if (productDetail.saleMode == 6) {
          //经销商需要考虑是否需要申请进货
          bottomBarState = productDetail.stockState == 3 ? 7 : productDetail.productPrice.price ? 0 : 8
        } else {
          const isActivity = this.promotionType != false
          if (isActivity) {
            const promotionType = this.promotionType
            const activityState = this.activityInfo.activityState
            const hasNotBegin = this.hasNotBegin
            const hasEnd = this.hasEnd
            //酒批活动商品
            if (activityState == -1 && promotionType == 6) {
              bottomBarState = 1
            } else if (activityState == -1) {
              bottomBarState = 0
            } else if (promotionType == 3 || promotionType == 8) {
              //打折促销，产品精选
              bottomBarState = activityState != 2 ? 4 : hasEnd ? 3 : 0
            } else if (promotionType == 4) {
              //限时惠
              bottomBarState = activityState != 2 ? 4 : hasNotBegin ? 2 : hasEnd ? 3 : this.activityInfo.enjoyUserLevelDiscount ? 0 : 9
            } else if (promotionType == 6) {
              //凑单
              bottomBarState = activityState != 2 ? 4 : hasEnd ? 3 : 1
            }
            //无库存
            if (productDetail.stockState == 3) {
              bottomBarState = 7
            }
          } else {
            //酒批普通商品
            if (productDetail.stockState == 3 ) {
              //无库存，到货通知
              bottomBarState = productDetail.alreadyArrivalNotice ? 6 : 5
            }else{
              //凑单产品不能立即购买,没有马上进货
              if (productDetail.productPrice.gatherOrderPrice > 0) {
                bottomBarState = 1
              } else {
                bottomBarState = 0
              }
            }
          }
        }
        return bottomBarState
      },
      //活动价显示
      activityPriceTagShow(productDetail) {
        //限时惠活动，进行中的打折促销（不享受会员价）显示活动价
        let promotionType = this.promotionType
        let enjoyUserLevelDiscount = this.activityInfo.enjoyUserLevelDiscount
        let showActivityPrice = false
        const isActivity = this.promotionType != false
        if (promotionType == 4) {
          showActivityPrice = true
        } else {
          showActivityPrice = false
        }
        if (isActivity && promotionType == 3) {
          const hasNotBegin = this.hasNotBegin
          const hasEnd = this.hasEnd
          if (!hasNotBegin && !hasEnd && (!productDetail.productPrice.userLevelReduceAmount > 0 || !enjoyUserLevelDiscount)) {
            showActivityPrice = true
          } else {
            showActivityPrice = false
          }
        }
        return showActivityPrice
      },
      //不能购买文字
      noBuyText(state){
        let context = ''
        context = state == 2 ? `活动未开始` : state == 3 ? `活动已结束` : state == 4 ? `活动已下架` : ``
        return context
      },
      //产品tag标签筛选
      filterPromotionTag(product){
        /*
        * 限购=1,送红包=2,优惠券=3,送酒币=4,花酒币=5,活动=6,产品满赠=7,满减=8,加价购=9,立减=10,订单满赠=11,凑单=12,促销=13,限红包=14,限优惠券=15,限累计=16,优惠通知=98,自提优惠=99,会员专享=97,店铺优惠券申领=17,全场满减=18
        * 促销标签排序
        * 次序为：立减、满减、凑单、产品满赠、送红包、（送/用）酒币
        * tagType 1:限购；14:红包；15：优惠券；97：会员专享；98：特别提醒 不显示；98：自提优惠 不显示（重复）
        */
        product.promotionTags = product.promotionTags.filter((tag)=>{
          switch (tag.tagType){
            case 10:
              tag.idx = 1
              break;
            case 8:
              tag.idx = 2
              break;
            case 12:
              tag.idx = 3
              break;
            case 7:
              tag.idx = 4
              break;
            case 2:
              tag.idx = 5
              break;
            case 4:
              tag.idx = 6
              break;
            case 5:
              tag.idx = 7
              break;
            case 1:
              this.limitPurchaseTxt = tag.tagDetail
              break;
            default:
          }
          return tag.tagType != 1 && tag.tagType != 14 && tag.tagType != 15 && tag.tagType != 17 && tag.tagType != 97 && tag.tagType != 98 && tag.tagType != 99
        })
        product.promotionTags.sort(function (a,b) {
          return a.idx - b.idx
        })
        return product
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
        //超出购买限制
        if(this.productInfo.buyCount > this.productInfo.limitBuyCount){
          this.$alert("超出当前可购买数量！");
          return
        }
        PrepareSettlementUtil.transferSettlement.call(this,0)
      },
      //新增价格举报
      goPriceReport(){
        let reportProdcutInfo = {
          productInfo: this.productInfo,
          activityInfo: this.activityInfo,
          showActivityPrice: this.showActivityPrice,
          citySelfPickUp: this.citySelfPickUp
        }
        $cache.setCache('reportProdcutInfo', reportProdcutInfo);
        this.$router.push({name: "addPriceReport"});
      }
    },
  }
</script>

