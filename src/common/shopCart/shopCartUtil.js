import * as $cache  from "./../cache"

/**
 * 更新加入购物车数据
 */
function updateProductNumToStorage(productItem, buyNum) {
  productItem.buyNum = buyNum
  let productList = wx.getStorageSync('goods')||[]
  //异步获取success  ==>  res.data为Array类型
  const goods = updateItem(productList, productItem);
  wxSetStorageAsync('goods', goods)
}
//当前列表是否包含商品
function includeProduct(productList, product){
  let sku = productList.find(item => {
    return product.productSkuId == item.productSkuId
  })
  return !!sku
}
//获取加入购物车的商品来源（subType=1:打折促销活动，subType=2限时惠活动，subType=3组合活动,subType=4凑单活动,subType=5拼团活动,subType=6为你推荐推荐产品,subType=7类目中的"我的货架"的商品编辑商品数量）
function getSubType(product){
  let promotionType = product.enjoyPromotions && product.enjoyPromotions[0]&&product.enjoyPromotions[0].promotionType||0
  let subType = 0
  if (promotionType == 3) {
    subType = 1
  }
  if (promotionType == 4) {
    subType = 2
  }
  if (promotionType == 5 || product.productType==2) {
    subType = 3
  }
  if (promotionType == 6) {
    subType = 4
  }
  if (promotionType == 8) {
    subType = 5
  }
  if (product.productFromCategory){
    subType = 7
  }
  return subType
}
//如果当前商品不在缓存购物车中，添加埋点数据,加入购物车
function addToCarTalkingData(storageObj,product){
  let addArr = []
  if (storageObj) {
    for (let key in storageObj) {
      for (let item of storageObj[key]) {
        addArr.push(item)
      }
    }
  }
  //当前商品不在缓存购物车中
  if (!includeProduct(addArr, product)) {
    //获取埋点加入购物车数据来源
    let subType = getSubType(product)
    let actionFromType =""
    //如果来源活动要加actionFromType，actionFromId
    if (subType in [1,2,3,4,5]){
      actionFromType = subType
    }
    FunctionUtils.bindNomalTalkingDataEvent({ eventName: '加入购物车', eventType: 701, actionFromType: actionFromType, actionId: product.productSkuId, subType: subType })
  }
}
/**
 * 获取单个商品的加入购物车数量
 */
function getSingleProductBuyNumFromStorage(product) {
  let arr = wx.getStorageSync(`goods`) || []
  let count = 0
  if (arr && arr.length>0){
    let current = arr.find(item => item.productSkuId == product.productSkuId)
    if (current) {
      count = current.buyNum
    }
  }
  return count
}
/**
 * 获取当前购物车所有商品的加入购物车总数(经销商别的地方单独处理)
 */
function getAddToShopCartNumFromStorage() {
  let arr = wx.getStorageSync(`goods`) || []
  let count = 0
  if (arr && arr.length > 0) {
    for (let item of arr) {
      count += item.productSkuId == item.productSaleSpecId ? item.buyNum : item.buyNum * item.saleSpecQuantity
    }
  }
  return count
}

/**
 * 第一次打开列表时获取当前购物车所有商品的加入购物车金额(只考虑酒批自营和可用优惠卷的)，和提示
 */
function getUserCouponMoneyforDefault() {
  let arr = wx.getStorageSync(`goods`) || []
  let price = 0
  if (arr && arr.length>0){
    for (let item of arr) {
      //过滤掉经销商,合作商
      if (item.saleMode != 6 && item.saleMode != 2 && item.isUseCoupon) {
        let reductMoney = item.productPrice && item.productPrice.reducePrice || 0
        let productPrice = item.productPrice && item.productPrice.price || 0
        price += (productPrice - reductMoney) * item.buyNum * item.saleSpecQuantity
      }
    }
  }

  return parseFloat(price).toFixed(2)
}
/**
 * 第一次打开列表时获取当前购物车所有商品的加入购物车金额(只考虑酒批自营,限时惠)，和提示
 */
function getUserMoneyforDefault() {
  return getAddToShopCartPriceFromStorage()
}
/********************列表优惠卷提示 结束********************/

/**
 * 获取当前购物车所有商品的加入购物车金额,返回一个金额字符串
 */
function getAddToShopCartPriceFromStorage(keyword) {
  let arr = wx.getStorageSync(`goods`) || []
  let price = 0
  if (arr && arr.length > 0) {
    for (let item of arr) {
      //过滤掉经销商,合作商
      if (item.saleMode != 6 && item.saleMode != 2) {
        let reductMoney = item.productPrice && item.productPrice.reducePrice || 0
        let productPrice = item.productPrice && item.productPrice.price || 0
        price += (productPrice - reductMoney) * item.buyNum * item.saleSpecQuantity
      }
    }
  }

  return parseFloat(price).toFixed(2)
}



/********************列表优惠卷提示 开始********************/
/*升序*/
function ascend(useOrderAmountFrom) {
  return function (a, b) {
    let value1 = a[useOrderAmountFrom]
    let value2 = b[useOrderAmountFrom]
    return value1 - value2
  }
}
function conversion(useOrderAmountFrom){
  return function (a, b) {
    let value1 = a[useOrderAmountFrom]
    let value2 = b[useOrderAmountFrom]
    //启用金额相同，则按照优惠金额从大到小排序
    if (value1 == value2 && a.couponTemplate.couponUseType == b.couponTemplate.couponUseType){
      return b.amount - a.amount
    }
    return value1 - value2 >= 0
  }
}
function selectionSort(arr,a,b,c) {
  var length= arr.length;
  var minIndex;
  for (var i = 0; i < length - 1; i++) {
    minIndex = i;
    for (var j = i + 1; j < length; j++) {
      /**
       * 优惠券排序
       * 1.按启用金额从小到大排列
       * 2.启用金额相同，按优惠券类型排列，定向券排在通用券前
       * 3.启用金额相同，优惠券类型相同，按照优惠金额从大到小排列
       */
      if (arr[j][a] < arr[minIndex][a] ||
        (arr[j][a] == arr[minIndex][a] && arr[j][b].couponUseType == arr[minIndex][b].couponUseType && arr[j][c] > arr[minIndex][c] ||
          arr[j][a] == arr[minIndex][a] && arr[j][b].couponUseType == 3 && arr[minIndex][b].couponUseType != 3)) {
        minIndex = j;
      }
    }
    if(i != minIndex){
      var temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }

  }
  return arr;
}
/**
 * 插入定向专区券
 */
function areaCouponInsert(arr,id){
  let areaCoupons = $cache.getCache('myCanUseCouponData') && $cache.getCache('myCanUseCouponData').areaCoupons || [];
  let sortArr = []
  if (!areaCoupons.length){
    return arr
  }else{
    //取出当前专区对应的优惠券
    let currentArea = []
    for (let item of areaCoupons){
      if (item.couponTemplate.specialAreaIds.indexOf(id) >= 0){
        currentArea.push(item)
      }
    }
    arr = arr.concat(currentArea)
    //将当前的定向专区券插入到通用券数组，按启用金额升序排序，启用金额相同，专区券排在通用券前面
    //arr.sort(conversion('useOrderAmountFrom'))
    selectionSort(arr, 'useOrderAmountFrom', 'couponTemplate','amount')
    return arr
  }
}

/**
 * 商品金额正好小于和大于当前优惠卷金额的优惠卷
 */
function getdxyCoupon(currentProductMoney, riseCoupon) {
  let coupon = { x:{}, d:{} }
  for (let i = 0; i < riseCoupon.length; i++) {
    if (currentProductMoney >= riseCoupon[i].useOrderAmountFrom) {
      coupon.x = riseCoupon[i]
      //bug 8087修改
      //把相同启用金额的券取出来，取优惠金额最高的券给出优惠提示
      let someAmountFromArr = []
      if (i>0 && riseCoupon[i].useOrderAmountFrom == riseCoupon[i - 1].useOrderAmountFrom){
        for (let ii of riseCoupon){
          if (ii.useOrderAmountFrom == riseCoupon[i].useOrderAmountFrom){
            someAmountFromArr.push(ii)
          }
        }
        selectionSort(someAmountFromArr, 'useOrderAmountFrom', 'couponTemplate', 'amount')
        coupon.x = someAmountFromArr[0]
      }
    }
  }
  for (let i = 0; i < riseCoupon.length; i++) {
    if (currentProductMoney < riseCoupon[i].useOrderAmountFrom) {
      coupon.d = riseCoupon[i]
      break
    }
  }
  return coupon
}
//获取起送金额
function getQsMoney() {
  let qsMoney = App.globalData.appSetting && App.globalData.appSetting.minBuyAmount || 0
  //如果是从专区进来的，需要判断专区起送金额
  let channelList = App.globalData.cartChannelList
  let currentAreaId = App.globalData.currentAreaId
  if (currentAreaId && channelList) {
    let channel = channelList.find(item => item.channelId == currentAreaId)
    if (channel && channel.leastBuyAmount > 0) {
      qsMoney = channel.leastBuyAmount
    }
  }
  return qsMoney
}

/**
 *
 * 限时惠商品起送提示
 */
function getUserSendPrompt(currentProductMoney) {
  //非专区限时惠不显示起送,直接显示空
  if (!App.globalData.currentAreaId){
    return ''
  }
  //获取提示的商品所属类别标题
  let shopCartTitle = shopCartColumnTitle(App.globalData.currentAreaId)
  currentProductMoney = currentProductMoney > 0 ? currentProductMoney : 0
  let prompt =""
  //TP2-958
  let qsMoney = getQsMoney()
  //如果当前商品金额小于订单起送金额，直接给出起送提示
  let cha = (currentProductMoney * 1000 - qsMoney * 1000) / 1000
  if (cha < 0) {
    prompt = shopCartTitle+"产品购满" + qsMoney + "元起送，还差" + Math.abs(cha) + "元"
  }
  //如果大于等于起购金额，给出提示已享受起送条件
  if (cha >= 0 && qsMoney > 0) {
    prompt = "已享受起送条件"
  }
  return prompt
}

/**
 * 列表中获取当前商品金额应该给出的优惠卷提示
 */
function getUserCouponPrompt(currentProductMoney, canUseCouponMoney) {
  currentProductMoney = currentProductMoney > 0 ? currentProductMoney : 0
  //获取提示的商品所属类别标题
  let shopCartTitle = shopCartColumnTitle(App.globalData.currentAreaId)
  let isAreaCart = App.globalData.appSetting.enableSpecialAreaHome || false
  //城市开了专区模式: 拿不到专区id的情况，不再判起送，只判优惠券，其他情况先判断起送，再判断优惠券
  if (isAreaCart && !App.globalData.currentAreaId) {
    return getCouponPrompt(currentProductMoney, canUseCouponMoney, 0, shopCartTitle)
  }else{
    //获取起送金额
    let qsMoney = getQsMoney()
    //如果当前商品金额小于订单起送金额，直接给出起送提示
    let cha = (currentProductMoney * 1000 - qsMoney * 1000) / 1000
    if (cha < 0) {
      return shopCartTitle + "产品购满" + qsMoney + "元起送，还差" + Math.abs(cha) + "元"
    }else{
      return getCouponPrompt(currentProductMoney, canUseCouponMoney, qsMoney, shopCartTitle)
    }
  }
}
//获取优惠券提示
function getCouponPrompt(currentProductMoney, canUseCouponMoney, qsMoney, shopCartTitle) {
  canUseCouponMoney = parseFloat(canUseCouponMoney).toFixed(2)
  let prompt = ""
  //当前商品总额
  let myCoupons = wx.getStorageSync("myCanUseCouponData").generalCoupons || [];
  //可用劵通过启用金额升序排列
  let riseCoupon = myCoupons.sort(ascend('useOrderAmountFrom'))
  //如果是在专区中，需要考虑定向专区券
  const cartChannelList = $cache.getCache("purchaseColumnList")||[]
  if (cartChannelList.length && App.globalData.currentAreaId) {
    riseCoupon = areaCouponInsert(riseCoupon, App.globalData.currentAreaId)
  }
  //分别找到优惠券启用金额刚刚大于和小于商品总额的优惠卷
  let dxyCoupon = getdxyCoupon(canUseCouponMoney, riseCoupon)
  if (!dxyCoupon.x.amount && dxyCoupon.d.amount) {
    let nextBuyfirst = (dxyCoupon.d.useOrderAmountFrom * 1000 - canUseCouponMoney * 1000) / 1000
    prompt = "再购" + shopCartTitle + "商品" + nextBuyfirst + "元，立享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount
  } else {
    if (dxyCoupon.x.amount) {
      prompt = "已享满" + dxyCoupon.x.useOrderAmountFrom + "减" + dxyCoupon.x.amount
    }
    if (dxyCoupon.x.amount && dxyCoupon.d.amount) {
      prompt = prompt + ","
    }
    if (dxyCoupon.d.amount) {
      let nextBuy = (dxyCoupon.d.useOrderAmountFrom * 1000 - canUseCouponMoney * 1000) / 1000
      prompt = prompt + "再购" + nextBuy + "元，立享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount
    }
    //如果没有优惠券提示，同时大于等于起购金额，给出提示已享受起送条件
    let cha = (currentProductMoney * 1000 - qsMoney * 1000) / 1000
    if (!prompt && cha >= 0 && qsMoney > 0) {
      return "已享受起送条件"
    }
  }
  return prompt
}

/**
 * 购物车中获取当前商品金额应该给出的优惠卷提示以及即将被用到的优惠卷
 */
function getUserCouponPromptForCart(currentProductMoney, areaId) {
  let shopCartTitle = shopCartColumnTitle(areaId)
  let prompt = ""
  let myCoupons = $cache.getCache('myCanUseCouponData') && $cache.getCache('myCanUseCouponData').generalCoupons || []
  let wiiUseCoupon ={}
  //可用劵通过启用金额升序排列
  let riseCoupon = myCoupons.sort(ascend('useOrderAmountFrom'))
  //如果是在专区中，需要考虑定向专区券;开通专区的购物车，不考虑全场通用券
  const cartChannelList = $cache.getCache("purchaseColumnList")||[]
  if (cartChannelList.length && areaId) {
    riseCoupon = areaCouponInsert(riseCoupon, areaId)
  }
  //分别找到优惠券启用金额刚刚大于和小于商品总额的优惠卷
  let dxyCoupon = getdxyCoupon(currentProductMoney, riseCoupon)
  //如果购买金额未达到优惠券启用金额
  if (!dxyCoupon.x.amount && dxyCoupon.d.amount){
    let nb = (dxyCoupon.d.useOrderAmountFrom*1000 - currentProductMoney*1000)/1000
    prompt = "购买" + shopCartTitle + "商品，用券可享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount+",还差"+
      nb+"元"
    wiiUseCoupon.canUse = false
  }else{
    if (dxyCoupon.x.amount) {
      prompt = "已享满" + dxyCoupon.x.useOrderAmountFrom + "减" + dxyCoupon.x.amount
      wiiUseCoupon.canUse = true
    }
    if (dxyCoupon.x.amount && dxyCoupon.d.amount) {
      prompt = prompt + ","
    }
    if (dxyCoupon.d.amount) {
      let nextBuy = (dxyCoupon.d.useOrderAmountFrom * 1000 - currentProductMoney * 1000) / 1000
      prompt = prompt + "再购" + nextBuy + "元，立享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount
      wiiUseCoupon.canUse = true
    }
  }
  //如果没有大于的优惠卷，返回小于的
  if (dxyCoupon.d.amount){
    wiiUseCoupon.useOrderAmountFrom = dxyCoupon.d.useOrderAmountFrom
    wiiUseCoupon.amount = dxyCoupon.d.amount
  }
  if (!dxyCoupon.d.amount && dxyCoupon.x.amount){
    wiiUseCoupon.useOrderAmountFrom = dxyCoupon.x.useOrderAmountFrom
    wiiUseCoupon.amount = dxyCoupon.x.amount
  }
  return {prompt, wiiUseCoupon}
}


function shopCartColumnTitle(id){
  const cartChannelList = $cache.getCache("purchaseColumnList") || []
  let title = '自营'
  for (let item of cartChannelList){
    if (item.columnId == id){
      title = item.columnName
    }
  }
  return title
}

export {
  updateProductNumToStorage,
  getSingleProductBuyNumFromStorage,
  getAddToShopCartNumFromStorage,
  getAddToShopCartPriceFromStorage,
  getUserCouponMoneyforDefault,
  getUserMoneyforDefault,
  getUserCouponPrompt,
  getUserSendPrompt,
  getUserCouponPromptForCart
}
