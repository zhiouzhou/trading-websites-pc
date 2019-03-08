//    joinMode	起用条件    0 - 按产品购买金额；1 - 按产品购买件数
// couponCodeType	优惠码类型	number	0- 抵用码；1 - 打折码；2 - 赠品码; 3 - 特价码

import * as DateUtil from 'common/DateUtil'
import * as orderSubmitApi from "api/orderSubmit/orderSubmit"
import * as productApi from "api/product/product"
import * as ProductInfoUtil from "common/productInfo/productInfoUtil"
import bus from "common/bus";

//输入优惠码
function changeCouponCode(e){
  //优惠码只能是字母或数字，不能包含O,I,L,0
  let re = /^[A-HJ-KM-NP-Za-hj-km-np-z1-9]+$/;
  let code = event.target.value,codeVerify = re.test(code);
  if(!codeVerify){
    if(code !== ""){
      this.codeFaildDesc = "您输入的优惠码有误！";
    }
    code = code.replace(/[^A-HJ-KM-NP-Za-hj-km-np-z1-9]+/ig,"");
  }else{
    this.codeFaildDesc = ""
  }
  this.couponCode = code
  this.resetCouponCodeShow = this.couponCode.length == 6 ? true : false
}

//点击使用优惠码
function confrimCouponCode(){
  if(this.couponCode.length == 6 && !this.couponCodeReadonly){
    verifyCouponCode.call(this)
  }
}
//重新输入验证码
function resetCouponCode(){
  //取消已使用的优惠码，并重新请求预查询接口

}
//验证优惠码
function verifyCouponCode(){
  let param = {data:this.couponCode}
  orderSubmitApi.getCouponCodeInfo(param)
    .then(res => {
      if (res.success) {
        this.faildDesc = "";
        this.couponCodeTipTitle = '该优惠码';
        this.couponCodeColumn = true;
        this.noRefreshProducs = false
        let orderParams = this.prepareParams
        orderParams.datas[0].couponCodes = [];
        //如果该优惠码符合使用条件，则再次调用预查询接口
        //joinMode,启用条件。 0-按产品购买金额；1-按产品购买件数
        //couponCodeType,优惠码类型。 0-抵用码；1-打折码；2-赠品码; 3-特价码
        //判断产品数组中是否有该优惠码定向的产品，依据产品skuid判断
        if(this.orderGoodsSpecIdArr.indexOf(String(res.data.productSkuId)) < 0){
          //console.log(this.orderGoodsSpecIdArr)
          couponCodeHint.call(this,res.data,1)
          return false;
        }else{
          //遍历出优惠码定向产品
          let couponCodeGood;
          const { orders } = this
          let productItems = orders[0].itemGroups[0].productItems
          for(let product of productItems){
            if(product.productSkuId == res.data.productSkuId){
              couponCodeGood = product
            }
          }
          /**
           * 特价码添加的产品会被拆分，计算添加产品数量时，应该把该产品数量累加
           **/
          if(res.data.couponCodeType == 3){
            let codeGoodsArr = [];
            for(let product of productItems){
              if(product.productSkuId == res.data.productSkuId && product.sourceType == 0){
                codeGoodsArr.push(product);
              }
            }
            let codeGoodNum = 0;
            for(let item of codeGoodsArr){
              codeGoodNum += item.buyCount;
            }
            couponCodeGood.buyCount = codeGoodNum;
          }
          //按产品购买件数,优惠码定向产品最小购买数量不足;按产品购买金额,优惠码定向产品最小购买金额不足
          if((res.data.joinMode == 1 && couponCodeGood.buyCount < res.data.minBuyCount) || (res.data.joinMode == 0 && couponCodeGood.productAmount < res.data.minBuyAmount)){
            couponCodeHint.call(this,res.data,2,couponCodeGood)
            return false;
          }else{
            //优惠码可用，则重新请求订单预查询接口
            couponCodeHint.call(this,res.data,3,couponCodeGood)
            orderParams.datas[0].couponCodes = [this.couponCode]
            //订单商品满足优惠码使用条件，重新订单预查询后不需要更新商品数据
            this.noRefreshProducs = true
            this.prepareTypeObj = {prepareType:2}
            preferentialCheck.call(this)
            //this.prepareOrder({prepareType:2})
          }
        }
      }else {
        this.codeFaildDesc = res.desc
      }
    })
    .catch(res => {
      this.codeFaildDesc = res.desc
    });
}

//优惠码不可用提示信息
function couponCodeHint(data,type,product){
  let {
    joinMode,
    minBuyAmount,
    couponAmount,
    percent,
    giveCount,
    giveUnit,
    specialPrice,
    specialPriceUnit,
    productSkuId,
    limitPurchaseNum,
    minBuyCount,
    productName,
    couponCodeType
    } = data
  var conText,balanceText,needCount,couponCodeTerm = [];
  if(joinMode == 0){
    couponCodeTerm = [
      '「购满'+minBuyAmount+'元该产品可减'+couponAmount+'元」',
      '「购满'+minBuyAmount+'元该产品可打'+percent*10+'折」',
      '「购满'+minBuyAmount+'元送该产品'+giveCount+giveUnit+'」',
      '「购满'+minBuyAmount+'元享特价'+specialPrice+'元/'+specialPriceUnit+'」',
    ];
  }else if(joinMode == 1){
    //遍历取出该商品的销售单位和销售规格系数
    var goodsUnit,goodsXS;
    for(let item of this.productList){
      if(item.productSkuId == productSkuId){
        //拆包商品点击加减时要乘以系数
        if(item.saleSpecQuantity == item.specQuantity){
          goodsXS = 1;
        }else{
          goodsXS = item.saleSpecQuantity;
        }
        if(item.productSkuId == item.productSaleSpecId){
          goodsUnit = item.saleUnit;
        }else{
          goodsUnit = item.minUnit;
        }
      }
    }
    couponCodeTerm = [
      '「购满该产品'+minBuyCount*goodsXS+goodsUnit+'可减'+couponAmount+'元」',
      '「购满该产品'+minBuyCount*goodsXS+goodsUnit+'可打'+percent*10+'折」',
      '「购满该产品'+minBuyCount*goodsXS+goodsUnit+'送该产品'+giveCount+giveUnit+'」'
    ];
    if(limitPurchaseNum > 0){
      couponCodeTerm.push('「购满该产品'+minBuyCount*goodsXS+goodsUnit+'享特价'+specialPrice+'元/'+specialPriceUnit+'（注：最多'+limitPurchaseNum*goodsXS+goodsUnit+'享特价）」');
    }else{
      couponCodeTerm.push('「购满该产品'+minBuyCount*goodsXS+goodsUnit+'享特价'+specialPrice+'元/'+specialPriceUnit+'」');
    }
    //如果当前订单没有改优惠码定向产品，找不到改产品的销售单位，则不显示购买提示
    if(!goodsUnit){
      couponCodeTerm = [];
    }
  }
  if(type == 1){
    balanceText = "，当前订单无此产品，是否继续添加商品？";
    needCount = joinMode == 0 ? minBuyAmount : minBuyCount
  }else if(type == 2){
    if(joinMode == 0){
      needCount = minBuyAmount - product.productAmount;
      balanceText = "，再购"+Number(needCount.toFixed(2))+"元该产品可用，是否继续添加商品？";
    }else if(joinMode == 1){
      needCount = minBuyCount - product.buyCount;
      balanceText = "，再购"+needCount*goodsXS+goodsUnit+"该产品可用，是否继续添加商品？";
    }
  }
  if(type == 1 || type == 2 ){
    if(couponCodeTerm.length > 0){
      conText = "该优惠码定向产品【"+productName+"】"+"<span class='cRed'>"+couponCodeTerm[couponCodeType]+"</span>"+balanceText;
    }else{
      conText = "该优惠码定向产品【"+productName+"】"+balanceText;
    }
    this.couponCodeDialog.show = true
    this.couponCodeDialog.type = 1
    this.couponCodeDialog.content = conText
    const transData = {
      couponCodeTerm:couponCodeTerm[couponCodeType],
      couponCodeData:data,
      productSkuId:productSkuId,
      needCount:needCount
    }
    this.couponCodeTransData = Object.assign(this.couponCodeTransData,transData)
  }
  if(type == 3){
    if(couponCodeTerm.length > 0){
      conText = "该优惠码定向产品【"+productName+"】"+"<span class='cRed'>"+couponCodeTerm[couponCodeType]+"</span>"+balanceText;
    }else{
      conText = "该优惠码定向产品【"+productName+"】"+balanceText;
    }
    const transData = {
      couponCodeTerm:couponCodeTerm[couponCodeType],
      couponCodeData:data,
      productSkuId:productSkuId,
      needCount:needCount
    }
    this.couponCodeTransData = Object.assign(this.couponCodeTransData,transData)
  }
}

//获取优惠码定向产品
function getCouponCodeProduct(){
  let transData = this.couponCodeTransData
  let param = {
    productSkuId:transData.productSkuId,
  };
  productApi.GetProductDetail(param)
    .then(res => {
      if (res.success) {
        //拆包商品点击加减时要乘以系数
        if(res.data.saleSpecQuantity == res.data.specQuantity){
          res.data.XS = 1;
        }else{
          res.data.XS = res.data.saleSpecQuantity;
        }
        transData.product = ProductInfoUtil.rebuildProduct(res.data,`productDetail`,'')
        //遍历出订单提交页该优惠码定向产品的数量
        let confrimBuyNum = 0
        for(let product of this.productList){
          if(product.productSkuId == transData.productSkuId){
            confrimBuyNum = product.buyCount*product.XS
          }
        }
        transData.confrimBuyNum = confrimBuyNum
        //从0件开始加
        transData.product.buyCount = 0
        this.couponCodeTransData = Object.assign(this.couponCodeTransData,transData)
        bus.$emit("dialogShow", '')
        this.couponCodeAddDialog = true
      }
    })
    .catch(res => {});
}

//初始化优惠码优惠提示信息
function condition(){
  const { couponCodeData,needCount } = this.codeObj
  let goodsXS = this.codeObj.product.XS
  let goodsUnit = this.codeObj.product.productSkuId == this.codeObj.product.productSaleSpecId ? this.codeObj.product.saleUnit : this.codeObj.product.minUnit
  let couponCodeCondition = []
  //joinMode,启用条件。 0-按产品购买金额；1-按产品购买件数
  if(couponCodeData.joinMode == 0){
    couponCodeCondition = [
      '购买以下商品满'+couponCodeData.minBuyAmount+'元，可减'+couponCodeData.couponAmount+'元',
      '购买以下商品满'+couponCodeData.minBuyAmount+'元，可打'+couponCodeData.percent*10+'折'+'，可减'+(couponCodeData.minBuyAmount - couponCodeData.minBuyAmount*couponCodeData.percent)+'元',
      '购买以下商品满'+couponCodeData.minBuyAmount+'元，送该产品'+couponCodeData.giveCount+couponCodeData.giveUnit,
      '购买以下商品满'+couponCodeData.minBuyAmount+'元，享特价'+couponCodeData.specialPrice+'元/'+couponCodeData.specialPriceUnit,
    ];
  }else if(couponCodeData.joinMode == 1){
    couponCodeCondition = [
      '购买以下商品满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，可减'+couponCodeData.couponAmount+'元',
      '购买以下商品满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，可打'+couponCodeData.percent*10+'折',
      '购买以下商品满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，送该产品'+couponCodeData.giveCount+couponCodeData.giveUnit
    ];
    if(couponCodeData.limitPurchaseNum > 0){
      couponCodeCondition.push('购买以下商品满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，享特价'+couponCodeData.specialPrice+'元/'+couponCodeData.specialPriceUnit+'（注：最多'+couponCodeData.limitPurchaseNum*goodsXS+goodsUnit+'享特价）');
    }else{
      couponCodeCondition.push('购买以下商品满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，享特价'+couponCodeData.specialPrice+'元/'+couponCodeData.specialPriceUnit);
    }
  }
  let conditionText = couponCodeCondition[couponCodeData.couponCodeType];
  let couponCodeTip
  if(couponCodeData.joinMode == 0){
    couponCodeTip = conditionText + '，还差' + needCount + '元';
  }else{
    couponCodeTip = conditionText + '，还差' + needCount*goodsXS + goodsUnit;
  }
  this.conditionText = conditionText;
  this.couponCodeTip = couponCodeTip;
  bus.$emit("initCondition", conditionText)
}

//更新优惠码提示信息
function calculateCodeTips() {
  const { couponCodeData,needCount,confrimBuyNum } = this.codeObj
  let goodsXS = this.codeObj.product.XS
  let goodsUnit = this.codeObj.product.productSkuId == this.codeObj.product.productSaleSpecId ? this.codeObj.product.saleUnit : this.codeObj.product.minUnit
  const product = this.product
  let totalmoney = 0,count = 0;
  let lastNeedCount,minNum;
  //当前勾选商品的总数量，总金额
  count = product.buyCount
  //特价码计算总金额时不用考虑立减，其他类型的码需要考虑立减金额
  if(couponCodeData.couponCodeType == 3){
    totalmoney = totalmoney + product.productPrice.price*product.buyCount*goodsXS*1000/1000;
  }else{
    totalmoney = totalmoney + (product.productPrice.price-product.productPrice.reducePrice)*product.buyCount*goodsXS*1000/1000;
  }

  if(totalmoney >= 0 && count >= 0){
    if(couponCodeData.joinMode == 0){
      lastNeedCount = needCount - totalmoney;
      lastNeedCount = Number(lastNeedCount.toFixed(2));
      if(lastNeedCount > 0){
        this.couponCodeTip = this.conditionText + '，还差' + lastNeedCount + '元';
      }else{
        /**
         * 1.优惠码满足使用条件，则重新计算总金额（总金额=当前选择商品总金额+订单提交页该商品总金额）
         * 2.特价码新增件数限购数量，计算总金额和优惠金额时，需要比较选中的商品数量和限购数量，取其小值计算
         * */
        if(couponCodeData.limitPurchaseNum > 0){
          minNum = Math.min((product.buyCount+confrimBuyNum),couponCodeData.limitPurchaseNum*goodsXS);
        }else{
          minNum = product.buyCount+confrimBuyNum;
        }
        if(product.saleSpecQuantity == product.specQuantity){
          if(couponCodeData.couponCodeType == 3){
            totalmoney = minNum*product.productPrice.price*product.saleSpecQuantity;
          }else{
            totalmoney = minNum*(product.productPrice.price-product.productPrice.reducePrice)*product.saleSpecQuantity;
          }
        }else{
          if(couponCodeData.couponCodeType == 3){
            totalmoney = minNum*product.productPrice.price;
          }else{
            totalmoney = minNum*(product.productPrice.price-product.productPrice.reducePrice);
          }
        }
        //options.data.couponCodeTip = vm.conditionText + '，已满足使用条件';
        //couponCodeType	优惠码类型	number	0-抵用码；1-打折码；2-赠品码; 3-特价码
        let reduceAmount = 0;
        if(couponCodeData.couponCodeType == 0){
          reduceAmount = couponCodeData.couponAmount;
        }else if(couponCodeData.couponCodeType == 1){
          let discountAmount = Number(Number(totalmoney*(1-couponCodeData.percent)).toFixed(2));
          if(discountAmount <= couponCodeData.maxDiscountAmount){
            reduceAmount = discountAmount;
          }else{
            reduceAmount = couponCodeData.maxDiscountAmount;
          }
        }else if(couponCodeData.couponCodeType == 3){
          /**
           *
           * 1,特价优惠码单位跟当前商品的小单位比较，如果相同，就是特惠价格*选中个数*销售规格；如果不同，就是特惠价格*选中个数
           * 2,如果是拆包商品，不需要乘以销售规格（拆包商品对应的都是小单位）
           *
           * 1,针对于拆包商品   特价优惠码单位跟当前商品的价格单位比较，如果相同，特惠价格*选中个数     注：拆包商品的选中个数已经乘了销售规格数
           *                                                       如果不同，特惠价格*选中个数*包装规格
           *
           * 2，非拆包商品商品  特价优惠码单位跟当前商品的小单位比较，如果相同，特惠价格*选中个数*销售规格，
           * 														 如果不同就是 特惠价格*选中个数
           *
           */
          if(product.saleSpecQuantity != product.specQuantity){
            if(couponCodeData.specialPriceUnit == product.priceunit){
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice;
            }else{
              reduceAmount = totalmoney - minNum*product.specQuantity*couponCodeData.specialPrice;
            }
          }else{
            if(couponCodeData.specialPriceUnit == product.minUnit){
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice*product.saleSpecQuantity;
            }else{
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice;
            }
          }
          reduceAmount = Number(reduceAmount.toFixed(2));
        }
        if(couponCodeData.couponCodeType == 2){
          this.couponCodeTip = '已购满'+couponCodeData.minBuyAmount+'元，已获得赠品';
        }else{
          this.couponCodeTip = '已购满'+couponCodeData.minBuyAmount+'元，已减'+reduceAmount+'元';
        }
      }
    }else{
      lastNeedCount = needCount*goodsXS - count;
      lastNeedCount = Number(lastNeedCount.toFixed(2));
      if(lastNeedCount > 0){
        this.couponCodeTip = this.conditionText + '，还差' + lastNeedCount + goodsUnit;
      }else{
        /**
         * 1.优惠码满足使用条件，则重新计算总金额（总金额=当前选择商品总金额+订单提交页该商品总金额）
         * 2.特价码新增件数限购数量，计算总金额和优惠金额时，需要比较选中的商品数量和限购数量，取其小值计算
         * */
        if(couponCodeData.limitPurchaseNum > 0){
          minNum = Math.min((product.buyCount+confrimBuyNum),couponCodeData.limitPurchaseNum*goodsXS);
        }else{
          minNum = product.buyCount+confrimBuyNum;
        }
        if(product.saleSpecQuantity == product.specQuantity){
          if(couponCodeData.couponCodeType == 3){
            totalmoney = minNum*product.productPrice.price*product.saleSpecQuantity;
          }else{
            totalmoney = minNum*(product.productPrice.price-product.productPrice.reducePrice)*product.saleSpecQuantity;
          }
        }else{
          if(couponCodeData.couponCodeType == 3){
            totalmoney = minNum*product.productPrice.price;
          }else{
            totalmoney = minNum*(product.productPrice.price-product.productPrice.reducePrice);
          }
        }
        //couponCodeType	优惠码类型	number	0-抵用码；1-打折码；2-赠品码; 3-特价码
        let reduceAmount = 0;
        if(couponCodeData.couponCodeType == 0){
          reduceAmount = couponCodeData.couponAmount;
        }else if(couponCodeData.couponCodeType == 1){
          let discountAmount = Number(Number(totalmoney*(1-couponCodeData.percent)).toFixed(2));
          if(discountAmount <= couponCodeData.maxDiscountAmount){
            reduceAmount = discountAmount;
          }else{
            reduceAmount = couponCodeData.maxDiscountAmount;
          }
        }else if(couponCodeData.couponCodeType == 3){
          /**
           *
           * 1,特价优惠码单位跟当前商品的小单位比较，如果相同，就是特惠价格*选中个数*销售规格；如果不同，就是特惠价格*选中个数
           * 2,如果是拆包商品，不需要乘以销售规格（拆包商品对应的都是小单位）
           *
           * 1,针对于拆包商品   特价优惠码单位跟当前商品的价格单位比较，如果相同，特惠价格*选中个数     注：拆包商品的选中个数已经乘了销售规格数
           *                                                       如果不同，特惠价格*选中个数*包装规格
           *
           * 2，非拆包商品商品  特价优惠码单位跟当前商品的小单位比较，如果相同，特惠价格*选中个数*销售规格，
           * 														 如果不同就是 特惠价格*选中个数
           *
           */
          if(product.saleSpecQuantity != product.specQuantity){
            if(couponCodeData.specialPriceUnit == product.priceunit){
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice;
            }else{
              reduceAmount = totalmoney - minNum*product.specQuantity*couponCodeData.specialPrice;
            }
          }else{
            if(couponCodeData.specialPriceUnit == product.minUnit){
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice*product.saleSpecQuantity;
            }else{
              reduceAmount = totalmoney - minNum*couponCodeData.specialPrice;
            }
          }
          reduceAmount = Number(reduceAmount.toFixed(2));
        }
        if(couponCodeData.couponCodeType == 2){
         this.couponCodeTip = '已购满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，已获得赠品';
        }else if(couponCodeData.couponCodeType == 3 && couponCodeData.limitPurchaseNum > 0){
          this.couponCodeTip = '已购满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'（注：最多'+couponCodeData.limitPurchaseNum*goodsXS+goodsUnit+'享特价），已减'+reduceAmount+'元';
        }else{
          this.couponCodeTip = '已购满'+couponCodeData.minBuyCount*goodsXS+goodsUnit+'，已减'+reduceAmount+'元';
        }
      }
    }
  }
  this.lastNeedCount = lastNeedCount >= 0 ? lastNeedCount : 0 ;
  bus.$emit("needCountChange", this.lastNeedCount)
}

//确认添加商品
function addComfirm(){
  const { product } = this.couponCodeTransData
  if(product.buyCount>0){
    //需要重新组装之前的预查询的参数,然后再重新预查询
    reerectionOrderParam.call(this)
  }
}





//之前预查询时的参数，如果之前预查询商品包括现在添加的商品，修改其数量，如果不包含则直接添加
function reerectionOrderParam(){
  const { product,lastNeedCount } = this.couponCodeTransData
  //此处不考虑合作商和经销商商品，这里不存在2条orderList的情况
  let oldPrepareParams = this.prepareParams.datas
  let items = oldPrepareParams[0].itemList
  let idx = 0
  let containCouponCodeGoods = items.some((list,i)=>{
    if(list.productSkuId == product.productSkuId && list.productSaleSpecId == product.productSaleSpecId){
      idx = i
    }
    return list.productSkuId == product.productSkuId
  })
  if(containCouponCodeGoods){
    oldPrepareParams[0].itemList[idx].buyCount += product.buyCount
    //this.productList[idx].buyCount += product.buyCount
  }else{
    let orderItem = {
      buyCount: product.buyCount,
      productSaleSpecId: product.productSaleSpecId,
      productSkuId: product.productSkuId,
      sourceId: product.productSkuId,
      sourceType: 0
    }
    oldPrepareParams[0].itemList.push(orderItem)
    //this.productList.push(product)
    console.log(oldPrepareParams,this.productList)
  }
  //调用订单预查询方法
  if(lastNeedCount<=0){
    //满足优惠码使用条件
    oldPrepareParams[0].couponCodes = [this.couponCode]
    this.prepareTypeObj = {prepareType:2}
    preferentialCheck.call(this)
    //this.prepareOrder({prepareType:2})
  }else{
    this.prepareTypeObj = {prepareType:0}
    preferentialCheck.call(this)
    //this.prepareOrder({prepareType:0})
  }
}

function couponCodeUptae() {
  let {productList,orderGoodsSpecIdArr,noRefreshProducs} = this
  if(noRefreshProducs) return
  const { product } = this.couponCodeTransData
  if(this.couponCode){
    let idx = 0
    let containCouponCodeGoods = productList.some((list,i)=>{
      if(list.productSkuId == product.productSkuId && list.productSaleSpecId == product.productSaleSpecId){
        idx = i
      }
      return list.productSkuId == product.productSkuId
    })
    if(containCouponCodeGoods){
      productList[idx].buyCount += product.buyCount
    }else{
      productList.push(product)
    }
    if(orderGoodsSpecIdArr.indexOf(product.productSkuId)<0){
      orderGoodsSpecIdArr.push(product.productSkuId)
    }
  }
  console.log(this.orderGoodsSpecIdArr,this.productList)
}

//重置优惠码
function resetCode() {
  let oldPrepareParams = this.prepareParams.datas
  oldPrepareParams[0].couponCodes = []
  this.prepareOrder({prepareType:1})
}


function preferentialCheck(type) {
  if(type == `confrimCouponCode`){
    //确认使用优惠码，已选优惠券置为空，并且关闭不可点击
    this.couponLock = true
    this.preferentialShow.coupon = false
    this.couponReduceNotice.reduceNum = 0
    this.couponReduceNotice.reduceStr = ``
    this.selectCouponList = []
    this.prepareOrder(this.prepareTypeObj)
  }else{
    //有选中的优惠券时才会弹窗提示，优惠码优惠券不能同时使用
    if(this.selectCouponList.length > 0){
      //优惠码和优惠券不能同时使用提示
      this.couponCodeDialog.show = true
      this.couponCodeDialog.type = 0
      this.couponCodeDialog.content = `该优惠码不能与优惠券同时使用，是否使用该优惠码`
      return
    }
    this.prepareOrder(this.prepareTypeObj)
  }
}

export {
  changeCouponCode,
  confrimCouponCode,
  getCouponCodeProduct,
  condition,
  calculateCodeTips,
  addComfirm,
  couponCodeUptae,
  resetCode,
  preferentialCheck
}
