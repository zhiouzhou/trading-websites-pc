import * as $cache from "common/cache";
import * as ShopCartBaseJs from "common/shopCart/shopCartBase"


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


/*升序*/
function ascend(useOrderAmountFrom) {
  return function(a, b) {
    let value1 = a[useOrderAmountFrom]
    let value2 = b[useOrderAmountFrom]
    return value1 - value2
  }
}

//优惠券以及起送提示信息
function getUserCouponPrompt() {
  const { gatherType } = this.gatherObj
  this.promptObj.title = gatherType == 1 ? `起送` :
                         gatherType == 2 ? `优惠券` :
                         gatherType == 3 ? `凑单` : ``
  const goods = $cache.getCache('currentGoods') || []
  //totalCouponMoney 商品能使用优惠券的总金额，totalMoney 商品总金额
  let totalMoney = 0,XS = 1, totalCount = 0,totalCouponMoney = 0;
  for(let item of goods) {
    if(item.saleSpecQuantity && item.saleSpecQuantity == item.specQuantity){
      XS = item.saleSpecQuantity;
    }
    if(item.saleMode != 6 && item.saleMode != 2 ){
      totalMoney = totalMoney + (item.price - item.reducePrice)*
        (item.saleSpecQuantity == item.specQuantity? item.buyCount: item.buyCount* item.saleSpecQuantity)*XS*1000/1000;
      totalCount += item.buyCount;
      if(item.isUseCoupon){
        totalCouponMoney = totalCouponMoney + (item.price - item.reducePrice)*
          (item.saleSpecQuantity == item.specQuantity? item.buyCount: item.buyCount* item.saleSpecQuantity)*XS*1000/1000;
      }
    }
  }
  let prompt = getPrompt.call(this,totalMoney, totalMoney)
  this.promptObj = Object.assign(this.promptObj,prompt)
  this.totalCount = totalCount
  this.totalMoney = totalMoney
}
/**
 * 列表中获取当前商品金额应该给出的优惠卷提示
 */
function getPrompt(currentProductMoney, canUseCouponMoney) {
  const { gatherType,specialAreaId,gatherCount } = this.gatherObj
  let meetTip,conditionTip
  let shopCartTitle = ``
  if (!shopCartTitle){
    if (specialAreaId) {
      shopCartTitle = shopCartColumnTitle(specialAreaId)
    } else {
      shopCartTitle = `自营`
    }
  }
  //起送提示
  if(gatherType==1){
    //起送金额
    let qsMoney = ShopCartBaseJs.getQsMoney(this.gatherObj.specialAreaId)
    let contrastMoney = gatherCount ? gatherCount : qsMoney
    //如果当前商品金额小于订单起送金额，直接给出起送提示
    let cha = (currentProductMoney * 1000 - contrastMoney * 1000) / 1000
    cha = String(cha).indexOf('.') >= 0 ? cha.toFixed(2) : cha
    meetTip = shopCartTitle+"产品购满" + qsMoney + "元起送"
    if(cha < 0) {
      conditionTip = "还差" + Math.abs(cha) + "元，即可享受起送"
    }else{
      conditionTip = "已享受起送"
    }
  }
  //优惠券提示
  else if(gatherType==2){
    let canUseCoupon = $cache.getCache('myCanUseCouponData') && $cache.getCache('myCanUseCouponData') || []    //我的可用优惠券，包括全场通用券和专区抵用券
    let myCoupons = canUseCoupon.generalCoupons               //全场通用券
    myCoupons = areaCouponInsert(canUseCoupon,myCoupons,specialAreaId)
    currentProductMoney = currentProductMoney > 0 ? currentProductMoney : 0
    //可用劵通过启用金额升序排列
    let riseCoupon = myCoupons.sort(ascend('useOrderAmountFrom'))
    //分别找到优惠券启用金额刚刚大于和小于商品总额的优惠卷
    let dxyCoupon = getdxyCoupon(currentProductMoney, riseCoupon)
    //如果购买金额未达到优惠券启用金额
    if (!dxyCoupon.x.amount && dxyCoupon.d.amount){
      let nb = (dxyCoupon.d.useOrderAmountFrom*1000 - currentProductMoney*1000)/1000
      meetTip = "购买" + shopCartTitle + "商品，用券可享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount
      conditionTip = "再购"+nb+"元，可减"+dxyCoupon.d.amount+"元"
    }else{
      if (dxyCoupon.x.amount) {
        meetTip = "购买" + shopCartTitle + "商品，用券可享满" + dxyCoupon.x.useOrderAmountFrom + "减" + dxyCoupon.x.amount
        conditionTip = "已享满"+dxyCoupon.x.useOrderAmountFrom+"减"+dxyCoupon.x.amount+"元"
      }
      if (dxyCoupon.d.amount) {
        let nextBuy = (dxyCoupon.d.useOrderAmountFrom * 1000 - currentProductMoney * 1000) / 1000
        conditionTip = conditionTip + "，再购" + nextBuy + "元，立享满" + dxyCoupon.d.useOrderAmountFrom + "减" + dxyCoupon.d.amount
      }
    }
  }
  //凑单提示
  else if(gatherType==3){
    meetTip = "以上商品金额购满"+gatherCount+"元，即可享受凑单优惠"
    let cha = (currentProductMoney * 1000 - gatherCount * 1000) / 1000
    cha = String(cha).indexOf('.') >= 0 ? cha.toFixed(2) : cha
    conditionTip = "还差140元，即可享受凑单优惠"
    if(cha < 0) {
      conditionTip = "还差" + Math.abs(cha) + "元，即可享受凑单优惠"
    }else{
      conditionTip = "已享受凑单优惠"
    }
  }
  //优惠券产品列表
  else if(gatherType == 4){
    this.promptObj.title = '优惠券'
    const couponInfo = $cache.getCache('couponList')||{}
    //如果购买金额未达到优惠券启用金额
    if (currentProductMoney<couponInfo.useOrderAmountFrom){
      let nb = (couponInfo.useOrderAmountFrom*1000 - currentProductMoney*1000)/1000
      meetTip = "购买以上商品，用券可享满" + couponInfo.useOrderAmountFrom + "减" + couponInfo.amount
      conditionTip = "还差" + nb + "元,即可使用优惠券"
      if(couponInfo.couponType ==2){
        meetTip = "购买以上商品，满" + couponInfo.useOrderAmountFrom + "元可获得指定赠品"
      }
    }else{
      if (couponInfo.amount) {
        meetTip = "购买以上商品，用券可享满" + couponInfo.useOrderAmountFrom + "减" + couponInfo.amount
        conditionTip = "已享满"+couponInfo.useOrderAmountFrom+"减"+couponInfo.amount+"元"
      }else if(couponInfo.couponType ==2){
        meetTip = "购买以上商品，满" + couponInfo.useOrderAmountFrom + "元可获得指定赠品"
        conditionTip = "已满足优惠条件，下单可获得指定赠品"
      }
    }
  }
  return {
    meetTip,conditionTip
  }
}

/**
 * 比较两个时间的年月日大小，前者大于等于则返回true，否则为false
 */
function compareDayDate(d1, d2) {
  return d1 && d2 && (new Date(d1.replace(/-/g, "\/"))).getTime() >= (new Date(d2.replace(/-/g, "\/"))).getTime();
}
/**
 * 插入定向专区券
 */
function areaCouponInsert(canUseCoupon,arr,id){
  let areaCoupons = canUseCoupon.areaCoupons || [];
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
    selectionSort(arr, 'useOrderAmountFrom', 'couponTemplate','amount')
    return arr
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

function shopCartColumnTitle(id){
  const cartChannelList = $cache.getCache("purchaseColumnList") || []
  let title
  if(cartChannelList.length){
    for (let item of cartChannelList){
      if (item.columnId == id){
        title = item.columnName
      }
    }
  }else{
    title = `自营`
  }
  return title
}


export {
  getUserCouponPrompt
}
