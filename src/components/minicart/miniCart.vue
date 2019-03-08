<template>
  <div class="cart-wrap">
    <div v-clickoutside="handleClose">
      <!--头部全选-->
      <div class="cart-head">
        <span>
          <i class="checker mr-8" :class="{ checked: allSelect}" @click="onTap(`globalSelect`)"></i>全选
        </span>
        <span @click="goToShopCart">查看全部</span>
      </div>

      <div class="cart-content">
        <!--购物车分组-->
        <div class="cart-group" v-for="item in groupList">
          <!--group分组-->
          <div class="cart-title-wrap">
            <div class="cart-title-wrap-left">
              <i
                class="checker"
                v-bind:class="{ checked: item.select}"
                @click="onTap(`groupSelect`,item.shopCartId)"
              ></i>
            </div>
            <div class="cart-title-wrap-right">
              <div class="name">{{item.groupName}}</div>
              <div class="tips">
                <div v-if="item.qsMoney&&!item.gruopSelectMoney">
                  <i>满{{item.qsMoney}}元起送</i>
                  <i class="coudan" @click="goToGather(item,1)">去凑单></i>
                </div>
                <div v-if="item.gruopSelectMoney&&item.qsMoney>item.gruopSelectMoney">
                  <i>满{{item.qsMoney}}元起送，还差{{Number(item.qsMoney-item.gruopSelectMoney).toFixed(2)}}元</i>
                  <i class="coudan" @click="goToGather(item,1)">去凑单></i>
                </div>
                <div v-if="item.gruopSelectMoney&&item.qsMoney<=item.gruopSelectMoney">
                  <i>已享受起送</i>
                </div>
              </div>
            </div>
          </div>
          <!-- 购物车分组商品栏 -->
          <div class="cart-goods-box">
            <!-- 购物车分组，优惠提示栏 -->
            <div
              class="notice-tag-column clearfix"
              v-if="item.groupName && item.areaJiupiUseCouponPrompt"
            >
              <span class="label">优惠</span>
              <p class="content">{{item.areaJiupiUseCouponPrompt}}</p>
              <span class="btn" @click="goToGather(item,2)">{{item.canUseCoupon?`去逛逛`:`去凑单`}}></span>
            </div>
            <!-- 购物车分组商品列表 -->
            <div class="cart-goods-list" v-for="product in item.productList" :key="product.shopCartId" :id="product.posId">
              <!--凑单提示栏-->
              <div
                class="notice-tag-column cd-notice-column clearfix"
                v-if="product.select&&product.productGatherDesc"
              >
                <span class="label">凑单</span>
                <p class="content">{{product.productGatherDesc}}</p>
                <span class="btn" v-if="product.gatherCount==0" @click="goToGather(product,3)">去凑单></span>
              </div>
              <div class="cart-list">
                <div class="list-l" @click="onTap(`miniProductSelect`,product)">
                  <i class="checker" v-bind:class="{ checked: product.select}"></i>
                </div>
                <div class="list-m" @click="goToProductDetail(product)">
                  <img v-lazy="product.imgUrl" class="img-adapt">
                </div>
                <div class="list-r">
                  <div class="name" @click="goToProductDetail(product)">{{product.productName}}</div>
                  <div class="price">
                    <!--经销商产品-->
                    <div v-if="product.saleMode == 6">
                      <div>
                        <div class="fw-b" v-if="product.productPrice.price">
                          <span>¥</span>
                          <span>{{$options.filters.priceToFixed(product.productPrice.price)}}</span>
                          <span>/{{product.priceunit}}</span>
                        </div>
                        <div class="fw-b" v-if="!product.productPrice.price&&product.productPrice.intervalPrice">
                          <span>¥</span>
                          <span>/{{$options.filters.priceToFixed(product.productPrice.intervalPrice)}}</span>
                        </div>
                        <span
                          v-if="product.productPrice.lastBuyPrice&&!product.productPrice.price"
                        >上次进货价 ¥{{$options.filters.priceToFixed(product.productPrice.lastBuyPrice)}}{{product.priceunit}}</span>
                      </div>
                    </div>
                    <!--普通产品-->
                    <div v-else>
                      <div class="fw-b">
                        <span>¥</span>
                        <span>{{product.productPrice.priceDisplayType==2?$options.filters.priceToFixed(product.productPrice.gatherOrderPrice):$options.filters.priceToFixed(product.productPrice.price)}}</span>
                        <span>/{{product.priceunit}}</span>
                      </div>
                    </div>
                  </div>
                  <div style="flex:1;"></div>
                  <div class="spec">
                    <div class="spec-l">规格：{{product.specName}}</div>
                    <div class="spec-r">
                      <i
                        class="reduce-icon"
                        :class="{ 'reduce-icon-disable': product.buyCount <= product.minBuyNum }"
                        @click="buyCountEdit(product,`reduce`)"
                      ></i>
                      <span
                        class="buy-count"
                      >x{{product.productSkuId==product.productSaleSpecId?product.buyCount:product.buyCount*product.saleSpecQuantity}}
                        {{product.productSkuId==product.productSaleSpecId?product.saleUnit:product.minUnit}}</span>
                      <i
                        class="add-icon"
                        :class="{ 'add-icon-disable': product.buyCount >=product.maxBuyNum }"
                        @click="buyCountEdit(product,`add`)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--购物车为空icon-->
        <div class="cart-empty" v-if="!groupList.length">
          <div class="icon"></div>
          <div class="context">
            <h5>您的购物车还没有商品呦~</h5>
          </div>
        </div>
      </div>

      <!--底部结算栏-->
      <div class="cart-bottom">
        <div class="total">
          <span class="pay-amount">总计：¥{{$options.filters.priceToFixed(payAmount)}}</span>
          <span
            class="reduce-amount"
            v-if="productReduce"
          >优惠：¥{{$options.filters.priceToFixed(productReduce)}}</span>
        </div>
        <div class="settlement" @click="goToShopCart">去购物车({{selectedCount}})</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCouponList } from "../../api/userPurse/userPurse";
import * as shopCartApi from "../../api/shopCart/shopCart";
import * as ShopCartBaseJs from "../../common/shopCart/shopCartBase";
import * as ShopCartOperate from "../../common/shopCart/shopCartOperate";
import * as DateUtil from "../../common/DateUtil";
import * as $cache from "../../common/cache";
import bus from "common/bus";
import { mapGetters, mapActions } from "vuex";

const clickoutside = {
    // 初始化指令
    inserted(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};

export default {
  directives: {clickoutside},
  props: {
    isShow:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      allSelect: true,
      currentPage: 1,
      pageSize: 60,
      isEmpty: false, //购物车是否为空
      groupList: [], //购物车产品分组列表
      invalidProductList: [], //失效产品列表
      showFixedNotice: true,
      noticeTags: [
        { show: false, keyWord: `限购` },
        { show: false, keyWord: `降价` },
        { show: false, keyWord: `优惠` }
      ],
      globalSelect: false, //全选
      editing: false, //编辑
      isFirstEntry: true, //是否第一次进入购物车
     // domShow: false,
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
      productReduce: 0,
      validBarData: {
        reduce: [],
        idx: 0
      },
      selectedCount: 0,
      payAmount: 0
    };
  },
  components: {},
  beforeCreate() {},
  created() {
    this.getCouponData();
    this.getShopCartData();
  },
  mounted(){
    bus.$off("updatePrompt")
    bus.$on("updatePrompt", () => {
      let name = this.$route.name
      if(name==`home`|| name==`activityList`){
        this.getShopCartData()
      }
    });
  },
  methods: {
    ...mapActions(["saveCartCount"]),
    handleClose(e){
       const clientW = document.body.clientWidth || document.documentElement.clientWidth;
       if(!this.isShow || clientW - e.pageX < 320){
         return false;
       }
       bus.$emit("toggleMiniCart", "");
       window.event? window.event.cancelBubble = true : e.stopPropagation();
    },
    //获取购物车数据
    getShopCartData() {
      shopCartApi
        .getShopCartList({})
        .then(res => {
          if (res.success) {
            this.rebuildShopCartList(res);
            this.creatShopCartPrompt();
            this.$nextTick(() => {
              this.setContentHeight();
            });
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
      };
      getCouponList(param)
        .then(res => {
          if (res.success) {
            const couponData = this.buildUseCoupon(res);
            $cache.setCache("myCanUseCouponData", couponData);
          }
        })
        .catch(res => {});
    },
    //处理购物车数据
    rebuildShopCartList(data) {
      let rawData = data.data || undefined;
      //数据为空
      if (!rawData || !rawData.groupList || !rawData.groupList.length) {
        this.groupList = [];
        this.invalidProductList = [];
        this.isEmpty = true;
        return;
      }
      let list = rawData.groupList;
      let invalidProductList = [];
      let productList = [];
      let groupList = [];
      //购物车数据分组
      const shopCartBaseData = ShopCartBaseJs.sortGroupListAreaCart(list);
      invalidProductList = shopCartBaseData.invalidProductList;
      productList = shopCartBaseData.productList;
      groupList = shopCartBaseData.groupData;
      let cutPriceNum = 0; //加入购物车降价的产品数量
      let productBelowLimitCount = 0; //低于购买限制的产品数量
      let productOverLimitCount = 0; //超出购买限制的产品数量
      //第一次进来默认选中所有
      for (let item of groupList) {
        item.select = item.canSelect;
        for (let product of item.productList) {
          //产品定位id
          product.posId = product.productSkuId + product.shopCartId;
          product.select = product.canSelect;
          if (product.viewType == "product") {
            if (product.productPrice.joinAfterReduceAmount > 0) {
              this.validBarData.reduce.push(product.posId);
            }
            product.productPrice.joinAfterReduceAmount > 0 ? cutPriceNum++ : {};
            product.cantSelectReason == `最大库存低于起购数量` ||
            product.cantSelectReason == `购买数量低于起购数量`
              ? productBelowLimitCount++
              : {};
            product.cantSelectReason == `购买数量超过可买数量`
              ? productOverLimitCount++
              : {};
          }
          if (this.isFirstEntry) {
            if (product.canSelect) {
              product.select = true;
            }
          }
        }
        if (this.isFirstEntry) {
          if (item.canSelect) {
            item.select = true;
          }
        }
      }
      this.isFirstEntry = false;
      //取出分区购物车分组id
      let areaCartIds = [];
      for (let item of groupList) {
        if (item.viewType == "group") areaCartIds.push(item);
      }

      //处理凑单信息
      this.processGatherOderInfo(rawData.gatherOrder, groupList);
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
      });

    },
    //处理凑单信息
    processGatherOderInfo(gatherOrder, groupList) {
      //把凑单的金额放入产品中
      if (!groupList.length || !gatherOrder) return;
      if (!gatherOrder.items || !gatherOrder.items.length) return;
      for (let item of gatherOrder.items) {
        for (let productData of groupList) {
          let productItem = productData.productList.find(
            product => product.productSkuId == item.productSkuId
          );
          if (productItem) {
            const additionObj = {
              orderAmount: item.orderAmount,
              gatherCount: null,
              originalBuyGatherInfoStr: null,
              productGatherDesc: null,
              buyNeedAmount: null
            };
            productItem = Object.assign(productItem, additionObj);
          }
        }
      }
    },
    //重新计算价格，购物车起送提示，优惠提示，凑单提示
    creatShopCartPrompt() {
      if (this.groupList.length) {
        const creatData = ShopCartBaseJs.reCalcPrice(this.groupList, this);
        Object.assign(this, creatData);

      }
    },
    //处理优惠券数据
    buildUseCoupon(data, type) {
      let coupons = data.data;
      //筛选出现金抵用券和定向专区券,couponUseType = 2,3
      let serviceTime = data.serviceTime;
      if (coupons && coupons.length > 0) {
        coupons = coupons.filter(item => {
          if (item.timeEffective.split(" ").length == 1) {
            serviceTime = serviceTime.split(" ")[0];
          }
          //购物车为空时提示优惠券，考虑所有抵用券
          if (type == "allVoucher") {
            return (
              DateUtil.compareDayDate(serviceTime, item.timeEffective) &&
              DateUtil.compareDayDate(item.timeExpired, serviceTime) &&
              item.couponTemplate.couponType == 0
            );
          } else {
            return (
              DateUtil.compareDayDate(serviceTime, item.timeEffective) &&
              DateUtil.compareDayDate(item.timeExpired, serviceTime) &&
              item.couponTemplate.couponType == 0 &&
              (item.couponTemplate.couponUseType == 2 ||
                item.couponTemplate.couponUseType == 3)
            );
          }
        });
      }
      //区分全场通用券和定向专区券
      let generalCoupons = [];
      let areaCoupons = [];
      let obj = {};
      for (let item of coupons) {
        if (item.couponTemplate.specialAreaIds) {
          areaCoupons.push(item);
        } else {
          generalCoupons.push(item);
        }
      }
      obj = { generalCoupons, areaCoupons };
      return obj;
    },
    //设置购物车的可滚动区域
    setContentHeight() {
      let contentDom = document.querySelector(".cart-content");
      let headerDom = document.querySelector(".cart-head");
      let bottomDom = document.querySelector(".cart-bottom");
      let windowH = document.documentElement.clientHeight;
      if (contentDom) {
        contentDom.style.height =
          windowH - headerDom.offsetHeight - bottomDom.offsetHeight + "px";
      }
    },
    onTap(type, shopCartId) {
      if (type == `miniProductSelect`) {
        let product = shopCartId;
        ShopCartOperate.operateItem(this, type, { product });
      } else {
        ShopCartOperate.operateItem(this, type, { shopCartId });
      }
      this.creatShopCartPrompt();
      this.selectTraverse();
    },
    //勾选产品项，该产品所在分组是否选中，全选是否选中
    selectTraverse() {
      for (let i in this.groupList) {
        let groupSelected = this.groupList[i].productList.every(product => {
          if (product.canSelect) {
            return product.select;
          }
        });
        this.groupList[i].select = groupSelected;
      }
      let allSelected = this.groupList.every(item => {
        if (item.canSelect) {
          return item.select;
        }
      });
      this.allSelect = allSelected;
    },
    //跳转到商品详情
    goToProductDetail: function(product) {
      let routeData;
      //判断产品类型promotionType=5
      if (
        product.enjoyPromotions &&
        product.enjoyPromotions.length &&
        product.enjoyPromotions[0].promotionType == 5
      ) {
        routeData = this.$router.resolve({
          name: "groupProductDetail",
          query: this.encodeUrlQuery({ activityId: product.productSkuId })
        });
      } else {
        routeData = this.$router.resolve({
          name: "productDetail",
          query: this.encodeUrlQuery({ skuId: product.productSkuId })
        });
      }
      window.open(routeData.href, "_blank");
    },
    //去购物车
    goToShopCart() {
      this.$createTalkingData("Index", "", {}, 2);
      let skus = []
      for(let list of this.groupList){
        for(let product of list.productList){
          skus.push(product.productSkuId)
        }
      }
      this.$createTalkingData("Index", "Index_Right_To_Car", {SkuIdList:skus});
      this.$router.push({
        name: "shopCart",
        query: {}
      });
    },
    //购物车加减
    buyCountEdit(product, type) {
      const { buyCount, minBuyNum, maxBuyNum } = product;
      if (type == `reduce`) {
        if (buyCount > minBuyNum) {
          product.buyCount = buyCount - 1;
          this.updateShopCartCount(product);
        } else {
          //this.$alert("不能低于起购数量");
          this.$message("不能低于起购数量");
        }
      } else if (type == `add`) {
        if (buyCount < maxBuyNum) {
          product.buyCount = buyCount + 1;
          this.updateShopCartCount(product);
        } else {
          this.$message("不能超过限购数量");
        }
      }
    },
    //更新购物车数量
    updateShopCartCount(data) {
      let param = {
        datas: [
          {
            count: data.buyCount,
            shopCartId: data.shopCartId
          }
        ]
      };
      shopCartApi
        .updateShopCartCount(param)
        .then(res => {
          if (res.success) {
            this.saveCartCount()
            this.creatShopCartPrompt()
          }
        })
        .catch(res => {});
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
      this.$router.push({
        path: "/index/list",
        query: {
          specialAreaId: e.groupId,
          gatherType: type,
          gatherCount: e.buyNeedAmount || 0,
          searchKey: ``
        }
      });
    },
  },
  // watch: {
  //   domShow: function(val) {
  //     if (val) {
  //       this.$nextTick(() => {
  //         this.setContentHeight();
  //       });
  //     }
  //   }
  // }
};
</script>

<style lang="stylus" scoped>
@import './cart.styl';
</style>
