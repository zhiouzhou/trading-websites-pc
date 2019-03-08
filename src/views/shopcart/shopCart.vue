<template>
  <div class="container shop-cart-box">
    <!-- 购物车头部操作栏 -->
    <div class="cart-thead clearfix" v-if="!isEmpty">
      <div class="column t-checkbox">
        <div class="cart-checkbox">
          <span class="checker" v-bind:class="{ checked: allSelect}" @click="onTap(`globalSelect`)"></span> 全选
        </div>
      </div>
      <div class="column t-goods-cart">商品</div>
      <div class="column t-price-cart">价格(元)</div>
      <div class="column t-quantity-cart">数量</div>
      <div class="column t-action-cart">操作</div>
    </div>

    <!-- 购物车分组 -->
    <div class="cart-group" v-for="item in groupList">
      <!-- 购物车分组标题栏 -->
      <div class="cart-title-wrap">
        <div class="cart-title-wrap-left w100">
          <i class="checker" v-bind:class="{ checked: item.select}" @click="onTap(`groupSelect`,item.shopCartId)"></i>
          <div class="group-name">
            <span>{{item.groupName}}</span>
          </div>
          <!--经销商店铺领券-->
          <div class="dealer-coupon" v-if="item.saleMode==6&&item.hasCoupon">
            <span class="receive-btn" @click="unwindCoupon(item)">
              <i :class="{'flip':item.dealerCouponShow}"></i>
            </span>
            <!--领券面板-->
            <coupon-panel v-if="item.dealerCouponShow" class="coupon-panel" :coupon-list="item.dealerCouponList"></coupon-panel>
          </div>
        </div>
        <div class="cart-title-wrap-right" v-if="item.qsMoney&&!item.gruopSelectMoney">
          满{{item.qsMoney}}元起送<span class="gather-btn" @click="goToGather(item,1)">去凑单></span>
        </div>
        <div class="cart-title-wrap-right" v-if="item.gruopSelectMoney&&item.qsMoney>item.gruopSelectMoney">
          满{{item.qsMoney}}元起送，还差{{Number(item.qsMoney-item.gruopSelectMoney).toFixed(2)}}元<span class="gather-btn" @click="goToGather(item,1)">去凑单></span>
        </div>
        <div class="cart-title-wrap-right" v-if="item.gruopSelectMoney&&item.qsMoney<=item.gruopSelectMoney">已享受起送</div>
      </div>
      <!-- 购物车分组商品栏 -->
      <div class="cart-goods-box">
        <!-- 购物车分组，优惠提示栏 -->
        <div class="notice-tag-column" v-if="item.groupName && item.areaJiupiUseCouponPrompt">
          <span class="label">优惠</span>
          <p class="content">{{item.areaJiupiUseCouponPrompt}}</p>
          <span class="btn" @click="goToGather(item,2)">{{item.canUseCoupon?`去逛逛`:`去凑单`}}></span>
        </div>
        <!-- 购物车分组商品列表 -->
        <div class="cart-goods-list" v-for="product in item.productList" :id="product.posId">
          <shop-cart-product :key="product.shopCartId"  :product="product"></shop-cart-product>
        </div>
      </div>
    </div>

    <!--失效产品栏-->
    <div class="cart-group failure-group" v-if="invalidProductList.length">
      <div class="cart-title-wrap">
        <div class="cart-title-wrap-left">
          <span>失效产品</span>
        </div>
        <div class="cart-title-wrap-right" @click="clearInvalid"><i class="clear-invalid"></i>清空失效产品</div>
      </div>
      <!-- 购物车失效商品列表 -->
      <div class="cart-goods-box">
        <div class="cart-goods-list" v-for="product in invalidProductList">
          <shop-cart-product :key="product.shopCartId" :product="product"></shop-cart-product>
        </div>
      </div>
    </div>

    <!--购物车为空-->
    <div class="cart-empty" v-if="!groupList.length&&!invalidProductList.length&&domShow">
      <div class="icon"></div>
      <div class="context">
        <h5>您的购物车还没有商品呦~</h5>
        <p>
          <router-link to="/index/home">去首页逛逛吧~</router-link>
        </p>
      </div>
    </div>

    <div class="emptyDom" ref="emptyDom"></div>
		<!--切换地址购买限制弹窗-->
		<el-dialog title="温馨提示" :visible.sync="showLimitPayDialog" width="50%" center>
			<div class="limit-pay-box">

				<div class="lpb-content">
					<ul class="group-list" v-if="invalidObj.qsInvalid&&invalidObj.qsInvalid.length" v-for="item in invalidObj.qsInvalid">
						<li>
							<h5>{{item.zoneName}}</h5>
							<p>{{item.invalidReason}}</p>
						</li>
					</ul>
					<div class="limit-box" v-if="invalidObj.areaInvalidProduct&&invalidObj.areaInvalidProduct.length" v-for="item in invalidObj.areaInvalidProduct">
						<h5>以下商品超出购买限制：</h5>
						<ul class="product-list">
							<li>
								<img v-lazy="item.product.imgUrl" />
								<!--不能购买原因-->
								<div class="no-can-buy-tag">{{item.invalidReason}}</div>
							</li>
						</ul>
					</div>
				</div>
				<!--底部确认取消-->
				<div class="lpb-bottom">
					<span class="confirm" @click="limitPayOperate(`confirm`)">确定</span>
				</div>
			</div>
		</el-dialog>
    <!-- 购物车底部结算栏 -->
    <div :class="{'fixed-bottom':fixedShow}" v-if="domShow&&!isEmpty" style="margin-top: 24px">
      <div class="settlement-group">
        <div class="settlement-left">
          <div class="all-select" @click="onTap(`globalSelect`)">
            <i class="checker" :class="{ checked: allSelect}"></i>
            <span>全选</span>
          </div>
          <div class="delete" @click="batchRemoveShopCart(`remove`)">删除选中的商品</div>
          <div class="batch-fav" @click="batchRemoveShopCart(`add`)">加入我的关注</div>
        </div>
        <div class="settlement-right">
          <div class="gobuy" @click="goToSettlement">去结算</div>
          <div class="total">
            <span :class="{'mt8':!productReduce}">总计：<i>￥{{$options.filters.priceToFixed(payAmount)}}</i></span>
            <span v-if="productReduce">优惠：￥{{$options.filters.priceToFixed(productReduce)}}</span>
          </div>
          <div class="selected">已选<i>{{selectedCount}}</i>商品</div>
        </div>
      </div>
    </div>

    <!-- 悬浮通知栏 -->
    <div class="fixed-notice-wrap" v-if="showFixedNotice && noticeTags[1].show">
      <span class="title">降价</span>
      <div class="content">
        <span>购物车中有{{cutPriceNum}}种商品已降价</span>
        <span class="see" @click="gotoAnchor">去看看</span>
      </div>
      <i class="icon" @click="closeFixedNotice"></i>
    </div>

    <!--分开结算弹窗-->
    <el-dialog title="请分开结算以下商品" :visible.sync="showSplitPayDialog" width="50%" class="evaluateBody" center>
      <div class="split-pay-box">
        <!--循环分组-->
        <div class="spb-group" v-if="splitPayList&&splitPayList.length&&splitPayList[0].saleMode==0">
        	<!--只有包含酒批的商品才出现这个-->
          <div class="column" @click="onSelectAllArea()" >
            <span :class="selectAllArea?'checked':''"></span>
            <div class="content">
              <h5>易久批</h5>
              <p>
                已选{{splitPayTotalInfo.totalSelectNum}}，合计：
                <span class="total" v-if="splitPayTotalInfo.hadReduce>splitPayTotalInfo.totalMoney">￥0</span>
                <span class="total" v-else-if="splitPayTotalInfo.totalMoney">￥{{Number(splitPayTotalInfo.totalMoney-splitPayTotalInfo.hadReduce).toFixed(2)}}
                  <i v-if="splitPayTotalInfo.hadReduce>0">(已减￥{{(splitPayTotalInfo.hadReduce+splitPayTotalInfo.productTotalReduce+splitPayTotalInfo.selfPickUpReduce).toFixed(2)}})</i>
                </span>
                <span class="total" v-else>￥0</span>
              </p>
            </div>
          </div>
          <!--易久批专区分组-->
          <ul class="area-group">
            <!--久批产品分组-->
            <li class="column" v-for="item in splitPayList" v-if="item.saleMode!=2&&item.saleMode!=6" @click="onSplitPaySelect(item)">
              <span v-if="item.notToMinBuyAmountDesc" class="not-choose"></span>
              <span v-else :class="item.select?'checked':''"></span>
              <div class="content">
                <h5>{{item.companyName}}</h5>
                <p v-if="item.notToMinBuyAmountDesc">{{item.notToMinBuyAmountDesc}}<span class="gather" @click="goToGather(item,1)">去凑单></span></p>
                <p v-else>共{{item.buyCount}}，小计：<span class="total">¥{{item.amount}}</span></p>
              </div>
            </li>
          </ul>
        </div>
        <!--非久批产品分组-->
        <div class="spb-group" v-for="item in splitPayList" v-if="item.saleMode==2||item.saleMode==6" @click="onSplitPaySelect(item)">
          <div class="column">
            <span :class="item.select?'checked':''"></span>
            <div class="content">
              <h5>{{item.companyName}}</h5>
              <p>共{{item.buyCount}}，小计：<span class="total">¥{{item.amount}}</span></p>
            </div>
          </div>
        </div>

        <!--底部确认取消-->
        <div class="spb-bottom">
          <span class="confirm" @click="splitPayOperate(`confirm`)">确定</span>
          <span class="cancel" @click="splitPayOperate(`cancel`)">取消</span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="stylus" scoped>
  @import "./stylus/shopCart.styl"
</style>

<script>
  import AppHeader from './../AppHeader.vue'
  import Navi from './../Navi.vue'
  import AppFooter from './../AppFooter.vue'
  import ShopCartProduct from './../../components/shopcart/ShopCartProduct.vue'
  import couponPanel from "components/dealer/couponPanel.vue"
  import { getCouponList } from "../../api/userPurse/userPurse"
  import * as shopCartApi from "../../api/shopCart/shopCart"
  import { purchaseColumnList } from "api/setting/setting"
  import * as ShopCartBaseJs from "../../common/shopCart/shopCartBase"
  import * as ShopCartOperate from "../../common/shopCart/shopCartOperate"
  import * as PrepareSettlementUtil from "../../common/orderSubmit/prepareSettlementUtil"
  import * as DateUtil from "../../common/DateUtil";
  import * as $cache from "../../common/cache";
  import { queryDealerCoupons,receiveDealerCoupon } from "api/dealer/dealer"
  import bus from "common/bus";
  import { mapGetters, mapActions } from "vuex";

  export default {
    data() {
      return {
        allSelect: true,
        currentPage: 1,
        pageSize: 60,
        isEmpty: false, //购物车是否为空
        groupList: [], //购物车产品分组列表
        invalidProductList: [], //失效产品列表
        showFixedNotice: true,
        wineScoreAmount: 0,
        noticeTags: [{
          show: false,
          keyWord: `限购`
        }, {
          show: false,
          keyWord: `降价`
        }, {
          show: false,
          keyWord: `优惠`
        }],
        globalSelect: false, //全选
        editing: false, //编辑
        isFirstEntry: true, //是否第一次进入购物车
        domShow: false,
        gatherList: [], //凑单的所有商品名称以及提示(用于去结算时弹框提示页面信息的显示)
        hasGather: false, //点击去结算时，如果有没满足凑单的商品给出提示
        allGatherNeedAmount: 0, //全部凑单还差多少钱
        extraBuyTotalNeedAmount: 0, //全部凑单总共要多少钱
        isAllGatherSuccess: false, //是否全部参与凑单
        areaCartIds: [],
        gatherOrder: {},
        cutPriceNum: 0,
        productBelowLimitCount: 0,
        productOverLimitCount: 0,
        validBarData: {
          reduce: [],
          skuids: [],
          idx: 0,
        },
        selectedCount: 0,
        productReduce: 0,
        payAmount: 0,
        totalDiscountReduce: 0,
        selfPickUpReduce: 0,
        splitPayList: [], //分开结算group分组
        splitPayTotalInfo: {
          hadReduce: 0
        },
        selectAllArea: false, //分开结算弹窗，易久批大分组栏是否选中
        showSplitPayDialog: false, //分开结算弹窗
        fixedShow: true,
        showLimitPayDialog:false,//异常页面
        //异常信息
				invalidObj: {},
      }
    },
    computed: {

    },
    components: {
      AppHeader,
      Navi,
      AppFooter,
      ShopCartProduct,
      couponPanel
    },
    beforeRouteEnter (to, from, next) {
      next(vm=>{
        vm.$createTalkingData("ShoppingCar", "", {},1)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$createTalkingData("ShoppingCar", "", {},2)
      next()
    },
    beforeCreate: function() {

    },
    created: function() {
      this.saveCartCount()
      if(!$cache.getCache("purchaseColumnList")){
        this.getColumnList()
      }
      this.getCouponData()
      this.getShopCartData()
    },
    beforeDestory(){
    },
    destoryed(){
    },
    mounted() {
      bus.$off("handleShopCart")
      bus.$off("recalculate")
      bus.$off("updateShopCart")
      bus.$on("recalculate", () => {
        //console.log('监听数据变化')
        //勾选产品项，该产品所在分组是否选中，全选是否选中
        this.selectTraverse()
        //重新计算价格，购物车起送提示，优惠提示，凑单提示
        this.creatShopCartPrompt()
      });
      bus.$on("handleShopCart", (data) => {
        this.manoeuvreShopCart(data)
      });
      bus.$on("updateShopCart", (data) => {
        this.$createTalkingData("ShoppingCar", "ShoppingCar_Product_UpdateCount", { SkuId: data.product.productSkuId })
        this.updateShopCartCount(data)
      });
    },
    methods: {
      ...mapActions(["saveCartCount"]),
      closeFixedNotice() {
        this.showFixedNotice = false
      },
      onTap(type, shopCartId) {
        ShopCartOperate.operateItem(this, type, {
          shopCartId
        })
        this.creatShopCartPrompt()
      },
      //降价通知定位
      gotoAnchor() {
        let idx = this.validBarData.idx <= this.validBarData.reduce.length - 1 ? this.validBarData.idx : 0
        let currentPosId = this.validBarData.reduce[idx]
        document.getElementById(currentPosId).scrollIntoView(true)
        idx++
        this.validBarData.idx = idx
        this.$createTalkingData("ShoppingCar", "ShoppingCar_Discount_Notice", { SkuId: this.validBarData.skuids[idx] })
      },
      //勾选产品项，该产品所在分组是否选中，全选是否选中
      selectTraverse() {
        for(let i in this.groupList) {
          let groupSelected = this.groupList[i].productList.every((product) => {
            if(product.canSelect) {
              return product.select
            }
          })
          this.groupList[i].select = groupSelected
        }
        let allSelected = this.groupList.every((item) => {
          if(item.canSelect) {
            return item.select
          }
        })
        this.allSelect = allSelected
      },
      //获取购物车数据
      getShopCartData() {
        shopCartApi.getShopCartList({})
          .then(res => {
            if(res.success) {
              //console.log(res.data)
              if(res.data){
                this.wineScoreAmount = res.data.wineScoreAmount
                this.rebuildShopCartList(res)
                this.creatShopCartPrompt()
                this.domShow = true
              }else{
                this.groupList = []
                this.invalidProductList = []
                this.isEmpty = true
                this.domShow = true
              }
            }
          })
          .catch(res => {});
      },
      //获取专区列表
      getColumnList(){
        purchaseColumnList({})
          .then(res => {
            if(res.success) {
              //console.log(res.data)
              $cache.setCache('purchaseColumnList', res.data)
            }
          })
          .catch(res => {});
      },
      //获取用户优惠券
      getCouponData() {
        let param = {
          currentPage: 1,
          pageSize: 60,
          data: {
            couponState: 1,
            shopCoupon: false
          }
        }
        getCouponList(param)
          .then(res => {
            if(res.success) {
              //console.log(res.data)
              const couponData = this.buildUseCoupon(res)
              $cache.setCache('myCanUseCouponData', couponData)
            }
          })
          .catch(res => {});
      },
      //处理购物车数据
      rebuildShopCartList(data) {
        let rawData = data.data || []
        //数据为空
        if(!rawData || !rawData.groupList || !rawData.groupList.length) {
          this.groupList = []
          this.invalidProductList = []
          this.isEmpty = true
          return
        }
        let list = rawData.groupList
        let invalidProductList = []
        let productList = []
        let groupList = []
        //购物车数据分组
        const shopCartBaseData = ShopCartBaseJs.sortGroupListAreaCart(list)
        invalidProductList = shopCartBaseData.invalidProductList
        productList = shopCartBaseData.productList
        groupList = shopCartBaseData.groupData
        let cutPriceNum = 0 //加入购物车降价的产品数量
        let productBelowLimitCount = 0 //低于购买限制的产品数量
        let productOverLimitCount = 0 //超出购买限制的产品数量
        //第一次进来默认选中所有
        for(let item of groupList) {
          item.select = item.canSelect
          for(let product of item.productList) {
            //产品定位id
            product.posId = product.productSkuId + product.shopCartId
            product.select = product.canSelect
            if(product.viewType == 'product') {
              if(product.productPrice.joinAfterReduceAmount > 0) {
                this.validBarData.reduce.push(product.posId);
                this.validBarData.skuids.push(product.productSkuId);
              }
              product.productPrice.joinAfterReduceAmount > 0 ? cutPriceNum++ : {}
              product.cantSelectReason == `最大库存低于起购数量` || product.cantSelectReason == `购买数量低于起购数量` ? productBelowLimitCount++ : {}
              product.cantSelectReason == `购买数量超过可买数量` ? productOverLimitCount++ : {}
            }
            if(this.isFirstEntry) {
              if(product.canSelect) {
                product.select = true
              }
            }
          }
          if(this.isFirstEntry) {
            if(item.canSelect) {
              item.select = true
            }
          }
        }
        this.isFirstEntry = false
        //取出分区购物车分组id
        let areaCartIds = []
        for(let item of groupList) {
          if(item.viewType == "group") areaCartIds.push(item)
        }

        //处理凑单信息
        this.processGatherOderInfo(rawData.gatherOrder, groupList)
        Object.assign(this, {
          invalidProductList,
          productList,
          areaCartIds,
          groupList,
          gatherOrder: rawData.gatherOrder,
          isEmpty: !groupList.length,
          cutPriceNum,
          productBelowLimitCount,
          productOverLimitCount
        })
        //console.log(this)
      },
      //处理凑单信息
      processGatherOderInfo(gatherOrder, groupList) {
        //把凑单的金额放入产品中
        if(!groupList.length || !gatherOrder) return
        if(!gatherOrder.items || !gatherOrder.items.length) return
        for(let item of gatherOrder.items) {
          for(let productData of groupList) {
            let productItem = productData.productList.find(product => product.productSkuId == item.productSkuId)
            if(productItem) {
              const additionObj = {
                orderAmount: item.orderAmount,
                gatherCount: null,
                originalBuyGatherInfoStr: null,
                productGatherDesc: null,
                buyNeedAmount: null
              }
              productItem = Object.assign(productItem, additionObj)
            }
          }
        }
      },
      //重新计算价格，购物车起送提示，优惠提示，凑单提示
      creatShopCartPrompt() {
        /*				if(this.groupList.length) {
                            const creatData = ShopCartBaseJs.reCalcPrice(this.groupList, this)
                            Object.assign(this, creatData)
                            console.log(this)
                        }*/
        const creatData = ShopCartBaseJs.reCalcPrice(this.groupList, this)
        Object.assign(this, creatData)
        //console.log(this)
      },
      //处理优惠券数据
      buildUseCoupon(data, type) {
        let coupons = data.data
        //筛选出现金抵用券和定向专区券,couponUseType = 2,3
        let serviceTime = data.serviceTime
        if(coupons && coupons.length > 0) {
          coupons = coupons.filter(item => {
            if(item.timeEffective.split(' ').length == 1) {
              serviceTime = serviceTime.split(' ')[0]
            }
            //购物车为空时提示优惠券，考虑所有抵用券
            if(type == 'allVoucher') {
              return DateUtil.compareDayDate(serviceTime, item.timeEffective) && DateUtil.compareDayDate(item.timeExpired, serviceTime) && item.couponTemplate.couponType == 0
            } else {
              return DateUtil.compareDayDate(serviceTime, item.timeEffective) && DateUtil.compareDayDate(item.timeExpired, serviceTime) &&
                item.couponTemplate.couponType == 0 && (item.couponTemplate.couponUseType == 2 || item.couponTemplate.couponUseType == 3)
            }
          })
        }
        //区分全场通用券和定向专区券
        let generalCoupons = []
        let areaCoupons = []
        let obj = {}
        for(let item of coupons) {
          if(item.couponTemplate.specialAreaIds) {
            areaCoupons.push(item)
          } else {
            generalCoupons.push(item)
          }
        }
        obj = {
          generalCoupons,
          areaCoupons
        }
        return obj
      },
      //购物车产品移除，添加关注
      manoeuvreShopCart(data) {
        if(data.type == `remove`) {
          let contentTitle = `确定从购物车删除此商品？`
          let count = -data.buyCount
          //移除
          let param = {
            datas: [data.shopCartId]
          }
          //批量删除
          if(data.batch){
            contentTitle = `确定从购物车删除选中的商品？`
            param = {
              datas: data.ids
            }
            count = ''
          }
          this.$confirm(contentTitle, '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            shopCartApi.removeShopCart(param)
              .then(res => {
                if(res.success) {
                  //this.$message("删除成功");
                  //删除成功后，重新获取购物车数据
                  //单个商品删除，计算购物车角标数量；多个删除，重新获得购物车角标数
                  if(data.batch){
                    this.$createTalkingData("ShoppingCar", "ShoppingCar_Product_Remove", { SkuIds:data.skuids })
                  }else{
                    this.$createTalkingData("ShoppingCar", "ShoppingCar_Delete", { SkuId: data.productSkuId })
                  }
                  this.saveCartCount(count)
                  this.getCouponData()
                  this.getShopCartData()
                }
              })
              .catch(res => {})
          }).catch(() => {})
        } else {
          //添加关注
          let param = {
            datas: [{
              favoriteProductType: 0,
              productSkuId: data.productSkuId
            }]
          }
          //批量关注
          if(data.batch){
            let arr = []
            for(let item of data.ids){
              let obj = {}
              obj.favoriteProductType = 0
              obj.productSkuId = item
              arr.push(obj)
            }
            param = {
              datas: arr
            }
          }
          shopCartApi.addFavorite(param)
            .then(res => {
              if(res.success) {
                if(data.batch){
                  this.$createTalkingData("ShoppingCar", "ShoppingCar_Follow", { SkuIds:data.skuids })
                }else{
                  this.$createTalkingData("ShoppingCar", "ShoppingCar_Follow", { SkuIds: [data.productSkuId] })
                }
                this.$message("成功加入我的关注");
              }
            })
            .catch(res => {})
        }
      },
      //批量删除购物车产品
      batchRemoveShopCart(type) {
        if(!this.groupList.length) return
        let ids = []
        let skuids = []
        let tips = ''
        if(type==`remove`){
          tips = `请选择要删除的商品`
        }else if(type==`add`){
          tips = `请选择要关注的商品`
        }
        for(let obj of this.groupList) {
          for(let product of obj.productList) {
            if(product.canSelect && product.select) {
              if(type==`remove`){
                ids.push(product.shopCartId)
                skuids.push(product.productSkuId)
              }else if(type==`add` && product.productType!=2){
                ids.push(product.productSkuId)
                skuids.push(product.productSkuId)
              }
            }
          }
        }
        if(!ids.length){
          this.$alert(tips)
          return
        }
        this.manoeuvreShopCart({
          type: type,
          ids,
          batch: true,
          skuids
        })
      },
      //清空失效产品
      clearInvalid() {
        const invalids = this.invalidProductList
        let ids = []
        for(let product of invalids) {
          ids.push(product.shopCartId)
        }
        this.$createTalkingData("ShoppingCar", "ShoppingCar_Product_ClearDisabled", { SkuIds:ids })
        this.manoeuvreShopCart({
          type: `remove`,
          ids,
          batch: true
        })
      },
      //批量关注
      batchFav(){
        if(!this.groupList.length) return
      },
      //购物车底部结算栏悬浮
      settlementBarFixed() {
        let emptyDOmHight = this.$refs.emptyDom && this.$refs.emptyDom.offsetTop
        let windowHeight = document.documentElement.clientHeight;
        if(emptyDOmHight<windowHeight){
          this.fixedShow = false
        }
        let _this = this
        window.addEventListener('scroll', function() {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          if(scrollTop + windowHeight >= emptyDOmHight) {
            _this.fixedShow = false
          } else {
            _this.fixedShow = true
          }
        })
      },
      //更新购物车数量
      updateShopCartCount(data) {
        //console.log(data)
        let param = {
          datas: [{
            count: data.buyCount,
            shopCartId: data.shopCartId
          }]
        }
        shopCartApi.updateShopCartCount(param)
          .then(res => {
            if(res.success) {
              //console.log(res)
              //更新购物车角标数
              this.saveCartCount(param.count)
              //更新商品限制提示信息
              const result = ShopCartBaseJs.getCanSelect(data.product)
              data.product.cantSelectReason = result.reason
            }
          })
          .catch(res => {})
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
        let count = 0
        if(type==1){
          count = e.gruopSelectMoney&&e.qsMoney>e.gruopSelectMoney ? Number(e.qsMoney-e.gruopSelectMoney).toFixed(2) : 0
        }
        //去凑单去逛逛事件埋点
        this.$createTalkingData("ShoppingCar", "ShoppingCar_ToStroll", { AreaId: e.groupId || e.id })
        this.$router.push({
          path: "/index/list",
          query: {
            specialAreaId: e.groupId || e.id,
            gatherType: type,
            gatherCount: count,
            searchKey: ``
          }
        });
      },
      //下单去结算
      goToSettlement() {
        PrepareSettlementUtil.placeOrder.call(this)
        this.$createTalkingData("ShoppingCar", "ShoppingCar_Submit", { DeliveryChoice:1})
      },
      //选择分开结算栏中的分类
      onSplitPaySelect(selectItem) {
        //未满足起送时，直接返回
        if(selectItem.notToMinBuyAmountDesc) {
          return
        }
        let list = this.splitPayList
        //改变选中状态
        selectItem.select = !selectItem.select
        //如果是选中酒批商品,此时非酒批商品不能选中
        if(selectItem && selectItem.saleMode != 2 && selectItem.saleMode != 6) {
          //判断是不是专区中的可选酒批专区分组都已选中
          let allSelect = list.findIndex(item => !item.select && !item.notToMinBuyAmountDesc && item.saleMode != 2 && item.saleMode != 6)
          //是否全选专区
          this.selectAllArea = allSelect > -1 ? false : true
          for(let item of list) {
            if(item.saleMode == 2 || item.saleMode == 6) {
              item.select = false
            }
          }
        } else {
          //选中的非酒批商品,此时其他所有都不可选
          for(let item of list) {
            if(item.id != selectItem.id) {
              item.select = false
            }
          }
          //酒批全选设为false
          this.selectAllArea = false
        }
        PrepareSettlementUtil.getReduceMoney.call(this, this)
      },
      //是否全选专区内的提交
      onSelectAllArea() {
        this.selectAllArea = !this.selectAllArea
        //如果非全选,酒批商品设置为不选中
        if(!this.selectAllArea) {
          for(let item of this.splitPayList) {
            if(!item.notToMinBuyAmountDesc && item.saleMode != 2 && item.saleMode != 6) {
              item.select = false
            }
          }
        } else {
          //如果全选,酒批的所有可选商品设置为选中,同时非酒批设置为不选中
          for(let item of this.splitPayList) {
            if(!item.notToMinBuyAmountDesc && item.saleMode != 2 && item.saleMode != 6) {
              item.select = true
            } else {
              item.select = false
            }
          }
        }
        PrepareSettlementUtil.getReduceMoney.call(this, this)
      },
      //分开结算栏
      //分开结算栏
      splitPayOperate(type) {
        if(type == 'confirm') {
          let orderList = this.splitPayList
          //可能选中多个
          let selectItem = []
          for(let item of orderList) {
            if(item.select) {
              selectItem.push(item)
            }
          }
          if(selectItem.length == 0) {
            this.$alert("请选择要结算的商品", "提示", {
              type: "warning",
              center: true
            });
            return
          }
          if(selectItem.length == 1) {
            PrepareSettlementUtil.singleOrderSubmit.call(this, this, selectItem[0])
          }
          if(selectItem.length > 1) {
            //多个专区提交
            let itemList = []
            let amount = 0
            let isSelfPickUp = selectItem[0].isSelfPickUp
            for(let it of selectItem) {
              for(let i of it.list) {
                itemList.push(i)
              }
            }
            PrepareSettlementUtil.goToOrderSubmitPage.call(this, this, itemList, isSelfPickUp)
          }
        }
        this.showSplitPayDialog = false

      },
      limitPayOperate(){
      	this.showLimitPayDialog = false
      },
      //展开经销商优惠券领取面板
      unwindCoupon(e){
        if(e.dealerCouponShow){
          e.dealerCouponShow = false
          return
        }
        if(e.dealerCouponList.length){
          e.dealerCouponShow = true
          return
        }
        let shopId = e.companyId
        let param = {
          data: shopId,
          currentPage: 1,
          pageSize: 60
        }
        queryDealerCoupons(param)
          .then(res => {
            if (res.success) {
              e.dealerCouponList = res.data
              e.dealerCouponShow = true
            }
          })
          .catch(res => {});
      },
    },
    watch: {
      domShow: function(val) {
        if(val) {
          this.$nextTick(() => {
            this.settlementBarFixed()
          })
        }
      }
      /*      groupList:{
                    handler:function(val,oldval){
                      console.log('数据变化')
                      this.creatShopCartPrompt()
                    },
                    deep:true
                  }*/
    }
  }
</script>
