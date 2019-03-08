
import * as ProductInfoUtil from "../productInfo/productInfoUtil"
import * as ShopCartUtil from "./shopCartUtil"
import * as $cache  from "./../cache"

//更新顶部的提示
function updateNoticeTagsShow($vue, selfPickUpReduce, jiupiUseCouponPrompt) {
  let {
    noticeTags,
    cutPriceNum,
    productBelowLimitCount,
    productOverLimitCount
    
  } = $vue
  for (let item of noticeTags) {
    if (item.keyWord == `限购`) {
      item.show = (productBelowLimitCount != 0) || (productOverLimitCount != 0) 
    } else if (item.keyWord == `降价`) {
      item.show = cutPriceNum != 0
    } else if (item.keyWord == `自提`) {
      item.show = selfPickUpReduce != 0 && that.data.canSelfPickUp
    } else if (item.keyWord == `优惠`) {
      item.show = !!jiupiUseCouponPrompt
    }
  }
  return noticeTags
}

//专区购物车数据分类
function sortGroupListAreaCart(groupList) {
  let invalidProductList = []
  let productList = []
  let groupData = []
  let hasFullReduce = groupList.findIndex(item => item.groupType == 0 && item.discountVO) != -1
  for (let group of groupList) {
    let obj = {}
    //失效商品组
    if (group.groupType == 3) {
      for (let product of group.productSkus) {
        product.invalid = true
        invalidProductList.push(product)
      }
    } else if ( group.groupType == 5  || group.groupType == 0) {
      let groupItem = getGroupItemAreaCart(group, hasFullReduce)
      if (groupItem) {
        productList.push(groupItem)
      }
      let rebuildProducts = getRebuildProducts(group)
      productList.push(...rebuildProducts)
      //构造groupData的列表项
      Object.assign(obj,groupItem)
      obj.productList = rebuildProducts
      groupData.push(obj)
    } else if (group.groupType == 4) {
      //去掉限时惠产品（暂时用不上）
    }
  }
  //购物车商品排序，合作商和经销商在最后面
  for (let group of groupList) {
    let obj = {}
    if (group.groupType == 1 || group.groupType == 2) {
      let groupItem = getGroupItemAreaCart(group, hasFullReduce)
      if (groupItem) {
        productList.push(groupItem)
      }
      let rebuildProducts = getRebuildProducts(group)
      productList.push(...rebuildProducts)
      //构造groupData的列表项
      Object.assign(obj,groupItem)
      obj.productList = rebuildProducts
      groupData.push(obj)
    }
  }
  return {
    invalidProductList,
    productList,
    groupData
  }
}


//获取专区分组标题
function getGroupItemAreaCart(group, hasFullReduce) {
  const initObj = {
    areaJiupiUseCouponPrompt:null,
    canUseCoupon:null,
    channel:null,
    gruopSelectMoney:null,
    qsMoney:null
  }
  if (group.groupType == 0) {
    return {
      groupId: `jiuPi`,
      groupName: `易久批`,
      companyId: ``,
      viewType: `group`,
      saleMode: 1,
      shopCartId: `jiuPi`,
      isSubGroup: false,
      select: false,
      canSelect: true,
      ...initObj
    }
  } else if (group.groupType == 1) {
    //判断经销商是否有优惠券可以领
    let hasCoupon = group.productSkus[0].productTags.findIndex((tag) => tag.tagType == 17) >= 0
    let dealerCouponShow = !hasCoupon//经销商领券面板是否展开
    let dealerCouponList = []//经销商优惠券
    return {
      groupId: group.companyId,
      groupName: group.companyName,
      companyId: group.companyId,
      viewType: `group`,
      saleMode: 6,
      hasCoupon,
      dealerCouponShow,
      dealerCouponList,
      shopCartId: group.companyId,
      isSubGroup: false,
      select: false,
      canSelect: true,
      ...initObj
    }
  } else if (group.groupType == 2) {
    return {
      groupId: group.companyId,
      groupName: group.companyName,
      companyId: group.companyId,
      viewType: `group`,
      saleMode: 2,
      shopCartId: group.companyId,
      isSubGroup: false,
      select: false,
      canSelect: true,
      ...initObj
    }
  } else if (group.groupType == 5){
    //TODO ：专区购物车商品分组
    return {
      groupId: group.companyId,
      groupName: group.companyName,
      companyId: group.companyId,
      viewType: `group`,
      saleMode: 1,
      shopCartId: group.companyId,
      isSubGroup: false,
      select: false,
      canSelect: true,
      ...initObj
    }
  }
}

//获取重构的产品
function getRebuildProducts(group) {
  for (let product of group.productSkus) {
    product = ProductInfoUtil.rebuildProduct(product, `shopCart`)
    product.discountVO = group.discountVO
    if (product.discountVO) {
      product.showCornerImg = true
      product.cornerImgUrl = App.globalData.settingValue.ProductListFullReduceWatermark
    }else {
      product.showCornerImg = product.enjoyPromotions && product.enjoyPromotions.length
      product.cornerImgUrl = product.enjoyPromotions && product.enjoyPromotions.length ? product.enjoyPromotions[0].promotionWatermark : ``
    }
    product.viewType = `product`
    //酒批商品有可能会有companyId,合作商，经销商以及专区类型时，用companyId
    product.groupId = (product.saleMode == 2 || product.saleMode == 6 || group.groupType==5) ? group.companyId : `jiuPi`
    const canSelectResult = getCanSelect(product)
    product.canSelect = canSelectResult.canSelect
    product.cantSelectReason = canSelectResult.reason
    product.select = false
    product.groupName = group.companyName
  }
  return group.productSkus
}


//商品是否可以点击
function getCanSelect(product) {
  //超出当日限购或者不足，或者需要重新进货，这三种情况没有加入失效列表
  if (product.saleMode == 6 && !product.productPrice.price && product.productPrice.lastBuyPrice)
    return {
      canSelect: false,
      reason: '价格已过期'
    }
  else if (product.saleMode == 6 && !product.productPrice.price && !product.productPrice.lastBuyPrice)
    return {
      canSelect: false,
      reason: `请申请进货`
    }
  else if (product.timeNotice == `活动未开始` || product.timeNotice == `活动已结束`)
    return {
      canSelect: false,
      reason: product.timeNotice
    }
  else if (product.limitBuyTag && product.limitBuyCount == 0)
    return {
      canSelect: false,
      reason: product.limitBuyTag.tagDetail
    }
  else if (product.minBuyNum > product.maxBuyNum && product.canSellStoreCount != 0)
    return {
      canSelect: false,
      reason: '最大库存低于起购数量'
    }
  else if (!product.enjoyUserLevelDiscount)
    return {
      canSelect: false,
      reason: '会员等级不够，不能购买'
    }
  else if (product.minBuyNum > product.buyCount && product.canSellStoreCount != 0)
    return {
      canSelect: true,
      reason: '购买数量低于起购数量'
    }
  else if (product.buyCount > product.maxBuyNum && product.canSellStoreCount != 0)
    return {
      canSelect: true,
      reason: '购买数量超过可买数量'
    }
  else if (product.stockState == 2 && product.buyCount > product.canSellStoreCount && product.canSellStoreCount == 0) {
    //针对于库存紧张但是返回的canSellStoreCount却为0
    return {
      canSelect: false,
      reason: '购买数量超过可买数量'
    }
  } else
    return {
      canSelect: true
    }
}

//构造groupList
function rebuildGroupList(productList){
  let groupList = []
  for(let item of productList){
    let obj = {}

  }
}

//购物车中久批商品对应的优惠卷提示
function getJiupiCanUseCoupon(jiupiSelectList) {
  //久批商品可用优惠卷的金额
  let jiupiCanUseCouponAmount = 0
  //久批商品对应的优惠卷提示
  for (let product of jiupiSelectList) {
    let price = getProductPrice(product)
    let reduce = getProductReduce(product)
    if (product.isUseCoupon) {
      jiupiCanUseCouponAmount = jiupiCanUseCouponAmount + (price * 1000 - reduce * 1000) / 1000
    }
  }
  jiupiCanUseCouponAmount = parseFloat(jiupiCanUseCouponAmount).toFixed(2)
  let jiupiUseCouponPrompt = ''
  return {
    jiupiUseCouponPrompt,
    jiupiCanUseCouponAmount
  }
}
//重新计算价格
function reCalcPrice(groupList,$vue) {
  //if (!groupList.length) return
  //是否有未选中的商品，订单提交结果页面跳转购物车需要
  let hasNotSelectProduct = false
  //选中的产品列表
  let selectList = []
  //选中的酒批商品列表
  let jiupiSelectList = []
  //是否有多个分组(多个合作商视为一个分组)
  let hasMultiGroup = groupList.length > 1 && groupList.some(item => item.saleMode != 2)

  for(let obj of groupList){
    for(let item of obj.productList){
      if(!item.select) hasNotSelectProduct = true
      if(item.select) selectList.push(item)
      if(item.select && item.saleMode != 2 && item.saleMode != 6 && item.groupId =='jiuPi') jiupiSelectList.push(item)
    }
  }
  //处理凑单相关信息
  if($vue.gatherOrder){
    getGatherResultAreaCart($vue, selectList)
  }
  //TODO：处理专区的起送以及优惠券提示
  dealminBuyAndCouponAreaCart($vue, groupList)

  //自提相关信息
  let selfPickUpReduce = getSelfPickUpReduce(selectList)
  // 所有选择的商品的总价，立减，总数信息
  let totalAmount = 0
  let productReduce = 0
  let selectedCount = 0
  for (let product of selectList) {
    let price = getProductPrice(product)
    let reduce = getProductReduce(product)
    totalAmount += price
    productReduce += reduce
    selectedCount += product.productSkuId == product.productSaleSpecId ? product.buyCount : product.buyCount * product.saleSpecQuantity
  }
  //酒批商品的总价，立减（用于计算起送金额）
  let jiupiTotalAmount = 0
  let jiupiProductReduce = 0

  for (let product of jiupiSelectList) {
    let price = getProductPrice(product)
    let reduce = getProductReduce(product)
    jiupiTotalAmount += price
    jiupiProductReduce += reduce
  }
  let jiupiUseCoupon = getJiupiCanUseCoupon(jiupiSelectList)
  //这里需要取当前计算过程中的值，取this.data的值会造成不一致
  let noticeTags = updateNoticeTagsShow($vue, selfPickUpReduce, jiupiUseCoupon.jiupiUseCouponPrompt.prompt)
  return {
    noticeTags,
    selectedCount,
    selfPickUpReduce,
    productReduce,
    canBackShopCart: hasNotSelectProduct || hasMultiGroup,
    payAmount: totalAmount - productReduce, //支付总金额，减去了凑单,会员立减，商品立减的优惠金额
    jiupiPayAmount: jiupiTotalAmount - jiupiProductReduce, //酒批商品的支付总金额，减去了凑单,会员立减，商品立减的优惠金额
    jiupiUseCouponPrompt: jiupiUseCoupon.jiupiUseCouponPrompt.prompt,
    wiiUseCoupon: jiupiUseCoupon.jiupiUseCouponPrompt.wiiUseCoupon,
    jiupiCanUseCouponAmount: jiupiUseCoupon.jiupiCanUseCouponAmount
  }
}
//处理专区的起送以及优惠券提示
function dealminBuyAndCouponAreaCart($vue,groupList){
  //在分组的属性上面添加当前组下的商品选中总金额，以及当前组的起送金额
  let needSetData = {}
  let currentindex = 0;
  for (let i in groupList){
    currentindex = i
    let groupId = groupList[i].groupId
    if (groupList[i].viewType == 'group' && groupId && groupList[i].saleMode != 2 && groupList[i].saleMode != 6){
      //设置当前组的起送金额
      let channelList = $cache.getCache("purchaseColumnList") || []
      groupList[i].channel = channelList.find(item => item.columnId == groupId)
      $vue.groupList[currentindex].qsMoney = groupList[i].channel&&groupList[i].channel.leastBuyAmount||0
      //设置当前组下面的所有商品总额
      $vue.groupList[currentindex].gruopSelectMoney = getCurrentGruopSelectMoney(groupList[i].productList, groupId)
      //$vue.$set($vue.groupList[currentindex],'gruopSelectMoney',getCurrentGruopSelectMoney(groupList[i].productList, groupId))
      //当前专区的优惠券提示
      let areaJiupiUseCouponPrompt = getAreaJiupiUseCouponPrompt(groupList[i].productList, groupId)
      $vue.groupList[currentindex].areaJiupiUseCouponPrompt = areaJiupiUseCouponPrompt.prompt
      $vue.groupList[currentindex].canUseCoupon = areaJiupiUseCouponPrompt.wiiUseCoupon&&areaJiupiUseCouponPrompt.wiiUseCoupon.canUse||false
    }
  }
}

//当前专区商品可用优惠券总额
function getAreaJiupiUseCouponPrompt(productList, groupId) {
  let areaCanUseCouponMoney = 0
  for (let item of productList) {
    if (item.viewType == `product` && item.select && item.groupId == groupId && item.isUseCoupon) {
      areaCanUseCouponMoney += getProductPrice(item) - getProductReduce(item)
    }
  }
  areaCanUseCouponMoney = parseFloat(areaCanUseCouponMoney).toFixed(2)
  let areaJiupiUseCouponPrompt = ShopCartUtil.getUserCouponPromptForCart(areaCanUseCouponMoney, groupId)
  return areaJiupiUseCouponPrompt
}


//获取当前组的所有选中商品总额
function getCurrentGruopSelectMoney(productList, groupId){
  let gruopSelectMoney = 0
  for (let item of productList) {
    if (item.viewType == `product` && item.select && item.groupId == groupId){
      gruopSelectMoney += getProductPrice(item) - getProductReduce(item)
    }
  }
  return gruopSelectMoney
}
//取得当前购物车的凑单相关数据
function getGatherResult(that, productList) {
  let allGatherNeedAmount = 0 //全部凑单完毕还差多少钱
  let extraBuyTotalNeedAmount = 0 //另购满多少凑单完毕
  let extraBuyAmount = 0 //已经参与另购的商品总额
  /****商品分组****/
  let gatherList = [] //勾选的参与凑单商品
  let otherList = [] //选择的商品中不属于凑单商品的列表
  let gatherOtherList = [] //满足另购的商品列表
  for (let product of productList) {
    if (product.saleMode != 2 && product.saleMode != 6 && product.productPrice.gatherOrderPrice > 0) {
      gatherList.push(product)
    } else {
      otherList.push(product)
    }
  }
  //过滤出可以算另购金额的商品商品
  let gatherBlackList = that.data.gatherOrder.productSkuBlackList || []
  for (let product of otherList) {
    let isSup = product.saleMode == 2 //是合作商
    let isDealer = product.saleMode == 6 //是经销商
    let isPreSale = product.stockState == 4 //是预售
    let isTimeLimit = product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 4 //是限时惠
    let isInBlackList = gatherBlackList.length && gatherBlackList.findIndex(item => item == product.productSkuId) != -1 //是黑名单商品
    if (product.select && !isSup && !isDealer && !isPreSale && !isTimeLimit && !isInBlackList) { //满足所有条件才能算入另购
      gatherOtherList.push(product)
    }
  }
  //计算完全满足凑单另购所需总金额
  for (let product of gatherList) {
    //购买数量可能会超过正常库存，超出的部分会按照预售处理，所以这里取库存和购买数量的最小值
    extraBuyTotalNeedAmount += product.orderAmount * Math.min(product.storeCount, product.buyCount);
  }
  //取得已选的另购商品的总价
  for (let gatherOtherProduct of gatherOtherList) {
    extraBuyAmount += getProductPrice(gatherOtherProduct, false) - getProductReduce(gatherOtherProduct, false)
  }
  let buyAmount = extraBuyAmount
  for (let product of gatherList) {
    let num = buyAmount / product.orderAmount
    //计算凑单商品成功凑单了多少件
    product.gatherCount = Math.min(product.storeCount, product.buyCount, Math.floor(num))
    //有多个凑单商品时，另购金额要减去满足上一个凑单商品的金额，依次减
    buyAmount -= product.gatherCount * product.orderAmount
    buyAmount = buyAmount > 0 ? buyAmount.toFixed(2) : 0
    //当前商品底下凑单相关提示
    product.productGatherDesc = productGatherDesc(product, buyAmount)
  }
  //完全满足凑单还需要多少钱
  allGatherNeedAmount = Math.max(0, parseFloat(extraBuyTotalNeedAmount - extraBuyAmount).toFixed(2))
  //往setData中设置商品的凑单相关信息以及结算时凑单提示相关信息
  updateShopcartGatherCount(that, gatherList, allGatherNeedAmount, extraBuyTotalNeedAmount)
}
//取得专区购物车的凑单相关数据
function getGatherResultAreaCart($vue, productList) {
  let allGatherNeedAmount = 0 //全部凑单完毕还差多少钱
  let extraBuyTotalNeedAmount = 0 //另购满多少凑单完毕
  let extraBuyAmount = 0 //已经参与另购的商品总额
  /****商品分组****/
  let gatherList = [] //勾选的参与凑单商品
  let otherList = [] //选择的商品中不属于凑单商品的列表
  let gatherOtherList = [] //满足另购的商品列表
  for (let product of productList) {
    if (product.saleMode != 2 && product.saleMode != 6 && product.productPrice.gatherOrderPrice > 0) {
      gatherList.push(product)
    } else {
      otherList.push(product)
    }
  }
  //过滤出可以算另购金额的商品商品
  let gatherBlackList = $vue.gatherOrder.productSkuBlackList || []
  for (let product of otherList) {
    let isSup = product.saleMode == 2 //是合作商
    let isDealer = product.saleMode == 6 //是经销商
    let isPreSale = product.stockState == 4 //是预售
    let isTimeLimit = product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 4 //是限时惠
    let isInBlackList = gatherBlackList.length && gatherBlackList.findIndex(item => item == product.productSkuId) != -1 //是黑名单商品
    if (product.select && !isSup && !isDealer && !isPreSale && !isTimeLimit && !isInBlackList) { //满足所有条件才能算入另购
      gatherOtherList.push(product)
    }
  }
  //计算完全满足凑单另购所需总金额
  for (let product of gatherList) {
    //购买数量可能会超过正常库存，超出的部分会按照预售处理，所以这里取库存和购买数量的最小值
    extraBuyTotalNeedAmount += product.orderAmount * Math.min(product.storeCount, product.buyCount);
  }
  //取得已选的另购商品的总价
  for (let gatherOtherProduct of gatherOtherList) {
    extraBuyAmount += getProductPrice(gatherOtherProduct, false) - getProductReduce(gatherOtherProduct, false)
  }
  let buyAmount = extraBuyAmount
  for (let product of gatherList) {
    //TODO:获取已经参与另购的商品总额中该专区的金额
    let areaGathAmount = getAreaGathAmount(gatherOtherList, product.specialAreaId)
    let num = areaGathAmount / product.orderAmount
    //计算凑单商品成功凑单了多少件
    product.gatherCount = Math.min(product.storeCount, product.buyCount, Math.floor(num))
    //有多个凑单商品时，另购金额要减去满足上一个凑单商品的金额，依次减
    areaGathAmount -= product.gatherCount * product.orderAmount
    areaGathAmount = areaGathAmount > 0 ? areaGathAmount.toFixed(2):0
    //当前商品底下凑单相关提示
    product.productGatherDesc = productGatherDesc(product, areaGathAmount)
  }
  //完全满足凑单还需要多少钱
  allGatherNeedAmount = Math.max(0, parseFloat(extraBuyTotalNeedAmount - extraBuyAmount).toFixed(2))
  //往setData中设置商品的凑单相关信息以及结算时凑单提示相关信息
  updateShopcartGatherCount($vue, gatherList, allGatherNeedAmount, extraBuyTotalNeedAmount)
}
//TODO:获取已经参与另购的商品总额中该专区的金额
function getAreaGathAmount(gatherOtherList, specialAreaId){
  let areaExtraBuyAmount = 0
  for (let gatherOtherProduct of gatherOtherList) {
    if (specialAreaId && gatherOtherProduct.specialAreaId == specialAreaId){
      areaExtraBuyAmount += getProductPrice(gatherOtherProduct, false) - getProductReduce(gatherOtherProduct, false)
    }
  }
  return areaExtraBuyAmount
}


/**
 * 勾选，0件享受凑单：另购商品金额满300元，即可享受凑单价，省15元，还差300元 去凑单 >
 * 勾选，部分产品享受凑单：2件已享受凑单，再购指定产品100元，剩余1件即可享受凑单价，省5元
 * 勾选，全部享受凑单：3件已享受凑单，已省15元
 */
function productGatherDesc(product, extraBuyAmount){
  let productGatherDesc =''
  let num = Math.min(product.storeCount, product.buyCount)
  //当前商品还差多少才能全部参与凑单
  let buyNeedAmount = product.orderAmount * num - extraBuyAmount
  //都不参与凑单时商品底下的提示
  if (product.gatherCount==0){
    let totalNeed = product.orderAmount * num
    let reduceMoney = (product.productPrice.price - product.productPrice.gatherOrderPrice) * product.saleSpecQuantity * num
    reduceMoney = Number(reduceMoney).toFixed(2)
    productGatherDesc = '另购商品金额满' + totalNeed + '元，即可享受凑单价，省' + reduceMoney + '元，还差' + buyNeedAmount+'元'
  }
  //部分参与凑单时商品底下的提示
  if (product.gatherCount > 0 && product.gatherCount < num){
    let nogatherNum = product.buyCount - product.gatherCount
    buyNeedAmount = product.orderAmount * nogatherNum - extraBuyAmount
    let reduceMoney = (product.productPrice.price - product.productPrice.gatherOrderPrice) * product.saleSpecQuantity * nogatherNum
    reduceMoney = Number(reduceMoney).toFixed(2)
    productGatherDesc = product.gatherCount + '件已享受凑单，再购指定产品' + buyNeedAmount + '元，剩余' + nogatherNum + '件即可享受凑单价，省' + reduceMoney+'元'
  }
  //全部参与凑单时商品底下的提示
  if (product.gatherCount > 0 && product.gatherCount == num){
    let reduceMoney = (product.productPrice.price - product.productPrice.gatherOrderPrice) * product.saleSpecQuantity * num
    reduceMoney = Number(reduceMoney).toFixed(2)
    productGatherDesc = num + '件已享受凑单，已省' + reduceMoney+'元'
  }
  //用于此时去凑单还差的金额
  product.buyNeedAmount = buyNeedAmount > 0 ? buyNeedAmount:0
  return productGatherDesc
}


//返回商品的计算价格(是否考虑超出库存的商品数量)
function getProductPrice(product, includePresale = true) {
  let price = 0.00,
    saleSpec = product.saleSpecQuantity,
    orPrice = product.productPrice.price,
    gaPrice = product.productPrice.gatherOrderPrice,
    gaCount = product.gatherCount,
    buyCount = includePresale ? product.buyCount : Math.min(product.storeCount, product.buyCount);
  if (gaCount > 0) { //凑单商品
    price = gaPrice * gaCount * saleSpec + orPrice * (buyCount - gaCount) * saleSpec
  } else {
    price = orPrice * saleSpec * buyCount;
  }
  return price;
}
//返回商品的立减价格(是否考虑超出库存的商品数量)
function getProductReduce(product, includePresale = true) {
  let buyCount = includePresale ? product.buyCount : Math.min(product.storeCount, product.buyCount)
  return product.productPrice.reducePrice * product.saleSpecQuantity * buyCount;
}
//返回商品的自提优惠
function getProductSelfReduce(product) {
  return product.productPrice.selfPickUpReduceAmount * product.saleSpecQuantity * product.buyCount;
}
//判断一个数组是否为空，如果为空，将当前加入，如果不为空，直接插入
function createMp(arr,name,product){
  if (!arr[name]){
    arr[name] = [product]
  }else{
    arr[name].push(product)
  }
}
//分组提示时频道酒批相关信息处理
function dealAreaJiuPiData(splitPayList, data, isSelfPickUp){
  let groupName = data[0].groupName
  let groupId = data[0].groupId
  let obj = {
    companyName: groupName,
    id: groupId,
    select: false,
    buyCount: 0,
    amount: 0,
    list: [],
    saleMode: 0,
    isSelfPickUp
  }
  for (let item of data) {
    obj.buyCount += item.productSkuId == item.productSaleSpecId ? item.buyCount : item.buyCount * item.saleSpecQuantity
    obj.amount += (getProductPrice(item) - getProductReduce(item))
    obj.list.push(item)
  }
  obj.amount -= isSelfPickUp ? this.selfPickUpReduce : 0
  obj.amount -= this.totalDiscountReduce
  obj.amount = obj.amount.toFixed(2)
  splitPayList.push(obj)
}
//分组提示时非频道酒批相关信息处理
function dealJiupiData(splitPayList, map, isSelfPickUp){
  let obj = {
    companyName: '易久批',
    id: `jiupi`,
    select: false,
    buyCount: 0,
    amount: 0,
    list: [],
    saleMode: 0,
    isSelfPickUp
  }
  for (let item of map['jiuPi']) {
    obj.buyCount += item.productSkuId == item.productSaleSpecId ? item.buyCount : item.buyCount * item.saleSpecQuantity
    obj.amount += (getProductPrice(item) - getProductReduce(item))
    obj.list.push(item)
  }
  obj.amount -= isSelfPickUp ? this.selfPickUpReduce : 0
  obj.amount -= this.totalDiscountReduce
  obj.amount = obj.amount.toFixed(2)
  splitPayList.push(obj)
}
//分组提示时合作商相关信息处理
function dealCooperationData(splitPayList, map, isSelfPickUp){

  for (let item of map['sup']) {
  	 let obj = {
	    companyName: item.companyName,
	    id: item.companyId,
	    select: false,
	    buyCount: 0,
	    amount: 0,
	    list: [],
	    saleMode: 2,
	    isSelfPickUp
	  }
    obj.buyCount += item.buyCount
    obj.amount += (getProductPrice(item) - getProductReduce(item))
    obj.amount = obj.amount.toFixed(2)
    obj.list.push(item)
    splitPayList.push(obj)
  }
}
//分组提示时经销商商相关信息处理
function dealDistributionData(splitPayList, data, isSelfPickUp){
  let companyName = data[0].companyName
  let companyId = data[0].companyId
  let obj = {
    companyName: companyName,
    id: companyId,
    select: false,
    buyCount: 0,
    amount: 0,
    list: [],
    saleMode: 6,
    isSelfPickUp
  }
  for (let item of data) {
    obj.buyCount += item.buyCount
    obj.amount += (getProductPrice(item) - getProductReduce(item))
    obj.list.push(item)
  }
  obj.amount = obj.amount.toFixed(2)
  splitPayList.push(obj)
}
//分开结算分组
function getSplitList(selectList, isSelfPickUp) {
  //根据商品来源分组(合作商是一组的)
  let map = {}
  for (let product of selectList) {
    if (product.saleMode == 6) {
      if (!map[product.companyId]) {
        map[product.companyId] = [product]
      } else {
        map[product.companyId].push(product)
      }
    } else if (product.saleMode == 2) {
      if (!map['sup']) {
        map['sup'] = [product]
      } else {
        map['sup'].push(product)
      }
    } else {
      if (!map['jiuPi']) {
        map['jiuPi'] = [product]
      } else {
        map['jiuPi'].push(product)
      }
    }
  }
  let splitPayList = []
  //酒批商品排在第一位
  if (map['jiuPi']) {
    let obj = {
      companyName: '易久批',
      id: `jiupi`,
      select: false,
      buyCount: 0,
      amount: 0,
      list: [],
      saleMode: 0,
      isSelfPickUp
    }
    for (let item of map['jiuPi']) {
      obj.buyCount += item.productSkuId == item.productSaleSpecId ? item.buyCount : item.buyCount * item.saleSpecQuantity
      obj.amount += (getProductPrice(item) - getProductReduce(item))
      obj.list.push(item)
    }
    obj.amount -= isSelfPickUp ? this.selfPickUpReduce : 0
    obj.amount -= this.totalDiscountReduce
    obj.amount = obj.amount.toFixed(2)
    splitPayList.push(obj)
  }
  //处理经销商分组
  for (let key in map) {
    if (key == 'jiuPi' || key == 'sup') continue
    let companyName = map[key][0].companyName
    let companyId = map[key][0].companyId
    let obj = {
      companyName: companyName,
      id: companyId,
      select: false,
      buyCount: 0,
      amount: 0,
      list: [],
      saleMode: 6,
      isSelfPickUp
    }
    for (let item of map[key]) {
      obj.buyCount += item.buyCount
      obj.amount += (getProductPrice(item) - getProductReduce(item))
      obj.list.push(item)
    }
    obj.amount = obj.amount.toFixed(2)
    splitPayList.push(obj)
  }
  //合作商品排在最后一位
  if (map['sup']) {
    let obj = {
      companyName: '其他',
      id: `sup`,
      select: false,
      buyCount: 0,
      amount: 0,
      list: [],
      saleMode: 2,
      isSelfPickUp
    }
    for (let item of map['sup']) {
      obj.buyCount += item.buyCount
      obj.amount += (getProductPrice(item) - getProductReduce(item))
      obj.list.push(item)
    }
    obj.amount = obj.amount.toFixed(2)
    splitPayList.push(obj)
  }
  return splitPayList
}

//专区购物车分开结算分组
function getSplitListAreaCart(selectList, isSelfPickUp) {
  //根据商品来源分组
  let map = {}
  for (let product of selectList) {
    if (product.saleMode == 6) {
      //经销商
      createMp(map, product.companyId, product)
    } else if (product.saleMode == 2) {
      //合作商
      createMp(map,'sup', product)
    } else {
      //如果是酒批的专区的分组商品
      if (product.groupId){
        createMp(map, product.groupId, product)
      }else{
        //酒批非专区
        createMp(map, 'jiuPi', product)
      }
    }
  }
  let splitPayList = []
  //处理非专区酒批商品
  if (map['jiuPi']) {
    dealJiupiData.call(this,splitPayList, map, isSelfPickUp)
  }
  //专区酒批商品分组
  for (let key in map) {
    //非经销商，非合作商，未分专区酒批
    if (map[key][0].saleMode != 6 && map[key][0].saleMode != 2 && key != 'jiuPi') {
      dealAreaJiuPiData.call(this,splitPayList, map[key], isSelfPickUp)
    }
  }
  //处理经销商
  for (let key in map) {
    //经销商直接
    if (map[key][0].saleMode == 6) {
      dealDistributionData(splitPayList, map[key], isSelfPickUp)
    }
  }
  //处理合作商品
  if (map['sup']) {
    dealCooperationData(splitPayList, map, isSelfPickUp)
  }
  return splitPayList
}
//取得当前购物车的自提相关数据
function getSelfPickUpReduce(productList) {
  // 计算自提优惠
  let selfPickUpReduce = 0
  for (let item of productList) {
    selfPickUpReduce += getProductSelfReduce(item)
  }
  return selfPickUpReduce
}


//更新购物车凑单商品的凑单成功数量,将凑单成功的数量反馈到货物列表
function updateShopcartGatherCount($vue, gatherList, allGatherNeedAmount, extraBuyTotalNeedAmount) {
  let groupList = $vue.groupList
  if (gatherList && gatherList.length) {
    //用于去结算时弹框提示页面信息的显示
    let originalBuy = []
    for (let gatherProduct of gatherList) {
      for(let obj of groupList){
        let product = obj.productList.find(item => item.shopCartId == gatherProduct.shopCartId)
        if(!!product){
          //这个字段用来展示原价购买对话框，每个商品的凑单情况
          let minStoreNum = Math.min(product.storeCount, product.buyCount)
          let originalBuyGatherInfoStr = (gatherProduct.gatherCount ? `${gatherProduct.gatherCount}件已享受凑单价` : ``) +
            (gatherProduct.gatherCount && minStoreNum != gatherProduct.gatherCount ? `，另外` : ``) +
            (minStoreNum != gatherProduct.gatherCount ? `${minStoreNum - gatherProduct.gatherCount}件未满足凑单条件` : ``)
          //当前商品中参与凑单的个数
          product.gatherCount = gatherProduct.gatherCount
          //凑单商品底下的凑单相关提示
          product.productGatherDesc = gatherProduct.productGatherDesc
          //凑单商品底下的,去凑单的金额
          product.buyNeedAmount = gatherProduct.buyNeedAmount
          originalBuy.push(
            {
              productName: gatherProduct.productName,
              //去结算时弹框中商品凑单信息的相关显示
              originalBuyGatherInfoStr: originalBuyGatherInfoStr
            })
        }
      }
    }
    //凑单的所有商品名称以及提示(用于去结算时弹框提示页面信息的显示)
    $vue.gatherList = originalBuy
    //点击去结算时，如果有没满足凑单的商品给出提示
    $vue.hasGather = true
    //全部凑单还差多少钱
    $vue.allGatherNeedAmount = allGatherNeedAmount
    //全部凑单总共要多少钱
    $vue.extraBuyTotalNeedAmount = extraBuyTotalNeedAmount
    //是否全部参与凑单
    $vue.isAllGatherSuccess = allGatherNeedAmount > 0 ? false : true
  } else {
    for(let obj of groupList){
      for(let product of obj.productList){
        product.gatherCount = 0
        product.originalBuyGatherInfoStr = ``
        product.productGatherDesc = ``
        product.buyNeedAmount = 0
      }
    }
    $vue.hasGather = false
  }
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

export {
  getQsMoney,
  getProductReduce,
  getProductSelfReduce,
  getCanSelect,
  reCalcPrice,
  getSplitList,
  getSplitListAreaCart,
  sortGroupListAreaCart
}
