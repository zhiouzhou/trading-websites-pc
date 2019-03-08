import * as $cache from "common/cache";
import * as ShopCartBaseJs from "../shopCart/shopCartBase"
import { PrepareQuery } from "../../api/orderSubmit/orderSubmit"

//商品详情下单，去结算页
function transferSettlement(sourceType) {
  let specialAreaId =''
  /**
   * sourceType=0，产品详情；sourceType=1，组合产品详情
   * */
  if(sourceType == 0){
    //商品详情的专区id
    let productDetail = this.productInfo
    specialAreaId = this.productInfo.specialAreaId
    if (productDetail.canSellStoreCount < (productDetail.minPurchaseNum || 0) && productDetail.saleMode != 2 && productDetail.saleMode != 6) {
      return this.$alert("该产品库存不足","提示",{
        type: "warning",
        center: true
      })
    }
  }else if(sourceType == 1){
    let productDetail = this.productInfo
    //组合活动的专区id
    specialAreaId = productDetail.items && productDetail.items[0] && productDetail.items[0].productSku&&productDetail.items[0].productSku.specialAreaId||''
    if (productDetail.stockCount < (productDetail.minDeliverCount || 0)) {
      return this.$alert("该产品库存不足","提示",{
        type: "warning",
        center: true
      })
    }
  }
  let detail = {}
  if(sourceType == 0){
    detail = this.productInfo
  }else if(sourceType == 1){
    detail = this.productInfo
    detail.productSaleSpecId = detail.productSkuId = detail.productSpecId = detail.activityId
    detail.saleSpecQuantity = 1
    detail.buyNum = detail.buyCount
    detail.productPrice = {
      gatherOrderPrice: 0,
      price: detail.packagePrice,
      reducePrice: detail.reducePrice,
      sellPrice: detail.regularPrice,
      selfPickUpPrice: 0,
      selfPickUpReduceAmount: 0,
    }
  }
  //订单限制起送金额
  if (detail.productPrice.price * detail.buyCount * detail.saleSpecQuantity < this.minBuyAmount && detail.saleMode != 2 && detail.saleMode != 6) {
    return this.$alert(`订单满${this.minBuyAmount}元起送,还差${(this.minBuyAmount - detail.productPrice.price * detail.buyCount * detail.saleSpecQuantity).toFixed(2)}元`,"提示",{
      type: "warning",
      center: true
    })
  }
  let list = [detail]
  $cache.setCache("prepareProductList", JSON.stringify(list))
  this.$router.push("/settlement/confirmOrder");
}

//购物车下单，去结算页
function  placeOrder(type) {
  let isSelfPickUp = type == `selfPickUp` ? true : false
  let groupList = this.groupList
  let selectList = []
  for(let obj of groupList){
    for(let product of obj.productList){
      if(product.canSelect && product.select) selectList.push(product)
    }
  }
  //不能购买的情况
  let buyLimitCount = 0
  let buyLimitPosIds = []
  selectList.forEach(item => {
    const canSelectResult = ShopCartBaseJs.getCanSelect.call(this,item)
    item.cantSelectReason = canSelectResult.reason
    if (item.cantSelectReason) {
      buyLimitPosIds.push(item.posId)
      ++buyLimitCount
    }
  })

  if (!selectList.length) {
    this.$alert("请选择结算的商品","提示",{
      type: "warning",
      center: true
    })
    return
  } else if (buyLimitCount != 0) {
    //自动定位到第一个超出购买限制的产品
    document.getElementById(buyLimitPosIds[0]).scrollIntoView(true)
    this.$alert(`${buyLimitCount}件产品超出购买限制`,"提示",{
      type: "warning",
      center: true
    })
    return
  }
  let splitPayList = []
  //专区购物车提交
  splitPayList = ShopCartBaseJs.getSplitListAreaCart.call(this, selectList, isSelfPickUp)
  this.splitPayList = splitPayList
  //如果分开结算的对话框的数据源长度只有1则不需要弹窗
  if (splitPayList.length == 1) {
    //单个分组提交
    singleOrderSubmit(this, splitPayList[0])
  } else {
    //如果多组中存在不满足起送的,或者存在合作商，经销商，给出弹框选择
    let splitSubmitDialog = false
    //已选分组的总金额和总数量
    let totalMoney =0
    let totalSelectNum =0
    for (let item of splitPayList){
      if (item.saleMode==0){
        //获取该区域的起送金额
        let orderMinBuyAmount = ShopCartBaseJs.getQsMoney.call(this,item.id)
        //如果满足起送，显示合计，不满足显示去凑单
        if (item.amount<orderMinBuyAmount){
          let cha = orderMinBuyAmount - item.amount
          item.notToMinBuyAmountDesc = "满" + orderMinBuyAmount + "元起送,还差" + cha.toFixed(2)+"元"
          item.select = false
          splitSubmitDialog = true
        }else{
          item.select = true
          totalMoney = totalMoney + parseFloat(item.amount)
          totalSelectNum = totalSelectNum + item.buyCount
        }
      }else{
        splitSubmitDialog = true
      }
    }
    //如果多组中存在不满足起送的,或者存在合作商，经销商
    if (splitSubmitDialog){
      //新的购物车分开结算弹窗
      this.showSplitPayDialog = true
      this.selectAllArea = true
      getReduceMoney(this)
    }else{
      //多组都满足起送，直接提交
      let itemList =[]
      for (let item of splitPayList){
        for (let it of item.list) {
          itemList.push(it)
        }
      }
      //多组一起提交
      goToOrderSubmitPage(this, itemList, isSelfPickUp)
    }
  }
}

//调用预查询获取优惠券自动选中的金额，获取订单满减金额
function getReduceMoney(that){
  let splitPayList = that.splitPayList
  let itemList = []
  let totalMoney = 0
  let totalSelectNum =0
  //是否包含合作商经销商
  let containHzs = false
  //商品立减
  let productTotalReduce = 0
  //自提优惠
  let selfPickUpReduce = 0
  // //是否自提
  //  let isSelfPickUp = splitPayList[0].isSelfPickUp
  //构造预查询参数
  for (let item of splitPayList) {
    if (item.select && !item.notToMinBuyAmountDesc) {
      if (item.saleMode == 2 || item.saleMode == 6){
        containHzs = true
      }
      for (let it of item.list) {
        itemList.push(it)
        productTotalReduce = productTotalReduce + ShopCartBaseJs.getProductReduce.call(that,it)
        //如果自提
        if (item.isSelfPickUp){
          selfPickUpReduce = selfPickUpReduce + ShopCartBaseJs.getProductSelfReduce.call(that,it)
        }
      }
      totalMoney = totalMoney + parseFloat(item.amount)
      totalSelectNum = totalSelectNum + item.buyCount
    }
  }
  //已选中时
  if (totalSelectNum && !containHzs){
    let prepareParams = getPrepareParams(itemList, false)
    that.splitPayTotalInfo = {
      totalMoney,
      totalSelectNum,
      productTotalReduce,
      selfPickUpReduce,
      hadReduce:0
    }
    prepareOrder(prepareParams, that)
  }else{
    that.splitPayTotalInfo = {
      totalMoney:0,
      hadReduce:0,
      totalSelectNum:0,
      productTotalReduce:0,
      selfPickUpReduce:0
    }
  }
}

//获取订单预查询参数
function getPrepareParams(productList, isDealer) {
  let orders = []//订单数组
  let itemList = []//订单项数组
  //酒批订单
  let allPresaleOrder = productList.every(item => item.stockState == 4)//全预售商品
  let allTimeLimitOrder = productList.every(item => item.productType == 4)//全限时惠商品
  for (let product of productList) {
    let itemObj = {
      buyCount: product.buyCount,
      productSaleSpecId: product.productSaleSpecId || ``,
      productSkuId: product.productSkuId || ``,
      sourceId: product.sourceId || product.productSkuId,//组合商品无sourceId
      sourceType: product.stockState == 4 ? 8 :
        product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 4 ? 4 :
          product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 5 ? 5 : 0,
    }
    itemList.push(itemObj)
  }
  let order = {
    classify: allPresaleOrder ? 2 : allTimeLimitOrder ? 1 : 0,//	普通(0),限时惠(1),预售(2),团购(3),
    itemList: itemList,
    orderType: 0,//	酒批订单(0), 合作商订单(1),入驻商订单(2)
    addressId: localStorage.getItem("defaultAddressId")  //地址id
  }
  //如果经销商
  if (isDealer){
    order.companyId = productList[0].companyId
    order.orderType =2
  }
  orders.push(order)
  let prepareParams = {
    datas: orders
  }
  return prepareParams
}

//订单预查询,获取优惠券字段选中的金额以及满减的金额
function prepareOrder(prepareParams, that) {
  PrepareQuery(prepareParams)
    .then(res => {
      if (res.success) {
        let invalidItems = res.data[0].invalidItems
        //TODO:如果预查询成功，但是商品起送配送方式有异常
        if (invalidItems && invalidItems.length > 0) {
          let invalidObj = {
								areaInvalidProduct: [],
								qsInvalid: []
							}
							for(let it of invalidItems) {
								it.product = that.productList.find(item => item.productSkuId == it.productSkuId &&
									item.productSaleSpecId == it.productSaleSpecId)
								if(it.invalidType == 1) {
									invalidObj.qsInvalid.push(it)
								} else {
									invalidObj.areaInvalidProduct.push(it)
								}
							}
							that.showLimitPayDialog = true
							that.showSplitPayDialog = false
							that.invalidObj = invalidObj
        } else {
          //TODO:计算合计优惠的金额
          let selectCouponList = []
          let reduceNum = 0
          for (let item of res.data[0].usableCouponGroups) {
            for (let it of item.coupons) {
              if (it.suggested) {
                it.usableSkuIds = item.usableSkuIds
                selectCouponList.push(it)
              }
            }
          }
          for (let coupon of selectCouponList) {
            if (coupon.couponTemplate.couponType == 0){
              reduceNum += coupon.amount
            }
          }
          //商品总满减
          let mjNum = res.data[0].reduceAmount||0
          //满减加上优惠券优惠的金额
          let hadReduce = parseFloat(reduceNum) + parseFloat(mjNum)
          that.splitPayTotalInfo.hadReduce = hadReduce
					that.showLimitPayDialog = false
        }
      }
    })
    .catch(res => {});
}
//获取起送金额
function getQsMoney(id) {
  let qsMoney = localStorage.getItem(`APP_SETTING`) && JSON.parse(localStorage.getItem(`APP_SETTING`)).minBuyAmount || 0
  //如果是从专区进来的，需要判断专区起送金额
  let channelList = $cache.getCache("purchaseColumnList")
  if (id && channelList) {
    let channel = channelList.find(item => item.columnId == id)
    if (channel && channel.leastBuyAmount > 0) {
      qsMoney = channel.leastBuyAmount
    }
  }
  return qsMoney
}
//去订单结算页
function goToOrderSubmitPage(_this, productList, isSelfPickUp, specialAreaId = '') {
  $cache.setCache("prepareProductList", JSON.stringify(productList))
  _this.$router.push("/settlement/confirmOrder");
}
//选中单个提交（单个专区或者合作商或者经销商）
function singleOrderSubmit(that,selectItem){
  if (selectItem.saleMode == 2) {
    placeSupOrder(that, selectItem.list, selectItem.isSelfPickUp)
  } else if (selectItem.saleMode == 6) {
    placeDealerOrder(that, selectItem.list, selectItem.isSelfPickUp)
  } else {
    //单个酒批分组提交
    jiupiQsOrderSubmit(that, selectItem, selectItem.isSelfPickUp)
  }
}
//单个酒批的分组提交
function jiupiQsOrderSubmit(that, selectItem, isSelfPickUp){
  //非专区酒批id为jiupi，这里特殊处理设为空
  let specialAreaId = selectItem.id
  if (specialAreaId == 'jiupi') {
    specialAreaId = ''
  }
  //获取该区域的起送金额
  let orderMinBuyAmount = getQsMoney(specialAreaId)
  if (parseFloat(selectItem.amount) < orderMinBuyAmount) {
    //起送提示
    //qsToast(specialAreaId, selectItem.companyName, orderMinBuyAmount, selectItem.amount, that.data.isAreaCart)
    let content = selectItem.companyName + `满${orderMinBuyAmount}元起送，还差${(orderMinBuyAmount - parseFloat(selectItem.amount)).toFixed(2)}元`
    that.$confirm( {
      content: content,
      yesText: "去添加商品",
      noText: "取消",
    })
      .then(() => {
        that.$router.push({
          path: "/index/list",
          query: {
            specialAreaId: specialAreaId,
            gatherType: 1,
            searchKey: ``
          }
        });
      })
      .catch(() => {});
  } else {
    //去预查询
    goToOrderSubmitPage(that, selectItem.list, isSelfPickUp, selectItem.id)
  }
}
//经销商下单
function placeDealerOrder(that,productList, isSelfPickUp) {
  if (isSelfPickUp) {
    that.$alert("经销商不支持自提");
  } else {
    goToOrderSubmitPage(that,productList, isSelfPickUp)
  }
}
//合作商下单
function placeSupOrder(that,productList, isSelfPickUp) {
  if (isSelfPickUp) {
    that.$alert("合作商不支持自提");
  } else {
    goToOrderSubmitPage(that,productList, isSelfPickUp)
  }
}
export {
  transferSettlement,
  placeOrder,getReduceMoney,goToOrderSubmitPage,singleOrderSubmit
}
