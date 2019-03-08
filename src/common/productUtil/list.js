//处理图片水印
const formatPromotionWatermark = function (product) {
    const enjoyPromotions = product.enjoyPromotions;
    const findItemFullReduce = enjoyPromotions.find(item => item.promotionType == 0);
    if (findItemFullReduce) {
        product.promotionWatermark = findItemFullReduce.promotionWatermark;
    }
    const findItemCu = enjoyPromotions.find(item => item.promotionType === 3);
    if (findItemCu) {
        product.isDiscount = true;
        product.promotionType = 3;
        product.promotionWatermark = findItemCu.promotionWatermark;
    }
    const findItemLimit = enjoyPromotions.find(item => item.promotionType === 4);
    if (findItemLimit) {
        product.isLimit = true;
        product.promotionType = 4;
        product.promotionWatermark = findItemLimit.promotionWatermark;
    }
    const findItemCou = enjoyPromotions.find(item => item.promotionType === 6);
    if (findItemCou) {
        product.isCoudan = true;
        product.promotionType = 6;
        product.promotionWatermark = findItemCou.promotionWatermark;
    }

    return;
}

const formatProductTags = function (product) {
    for (let tag of product.productTags) {
        //限购
        if (tag.tagType == 1) {
            product.limitBuyCount = parseInt(tag.value);
        }
        //icon 送红包
        if (tag.tagType == 2) {
            product.songHongBao = true
        }
        //满赠 类目标签
        if (tag.tagType == 7) {
            product.manZeng = true
        }
    }
    return;
}
// 适用于普通商品列表页
export function transformProductList(list) {
    if (!list.length) return [];
    let unlockSelfPickup = false;
    let AppSetting = localStorage.getItem('APP_SETTING');
    if(AppSetting){
        unlockSelfPickup = JSON.parse(AppSetting).unlockSelfPickup
    }
    //list = list.filter(item => item.saleMode != 6);
    for (let product of list) {
        //不考虑经销商
        product.promotionType = ''; //Duplicate key
        product.unlockSelfPickup = unlockSelfPickup;
        Object.assign(product, product.productPrice);
        if (product.productionDate) {
            product.productionDate = new Date(product.productionDate).format('yyyy.MM.dd').slice(0,-3);
        }
          //展示最高一级会员价格
        if( product.userLevelPrices && product.userLevelPrices.length){
            var cusArr = product.userLevelPrices;
            product.customerLevelName = cusArr[cusArr.length-1].userLevelName.substring(0,2);
            product.customerLevelPrice = cusArr[cusArr.length-1].userLevelPrice;
        }
         //拆包商品
        if(product.saleSpecQuantity == product.specQuantity){
            product.XS = 1;
        }else{
            product.XS = product.saleSpecQuantity || 1;
        }
        if (product.productTags && product.productTags.length) {
            formatProductTags(product);
        }
        //getSourceId  产品来源ID,组合,限时惠为活动ID,其他为SKUID
        product.sourceId = product.productSkuId;
        //productType: 普通商品(1), 组合商品(2), 限时惠商品(4);
        product.productType = 1;
        if(product.timeLimitPromotionId){
            product.productType = 4;
            product.sourceId = product.timeLimitPromotionId;
        }
        const enjoyPromotions = product.enjoyPromotions;
        if (enjoyPromotions && enjoyPromotions.length) {
            formatPromotionWatermark(product);
            const promotionType = enjoyPromotions[0].promotionType;
            product.productType = promotionType == 4 ? 4 :1;
        }
        //经销商产品
        if(product.saleMode == 6){
          product.sourceId = product.productSkuId;
          product.productType = 1;
        }
        //起购 限购
        product.minBuyNum = product.minPurchaseNum || 1;
        if (product.saleMode == 2) {
            product.maxBuyNum = 99999;
            product.buyCount = 1;
        } else {
            const kucunCount = product.canSellStoreCount || product.storeCount;
            let { limitPurchaseNum, limitBuyCount } = product;
            product.maxBuyNum = Math.min(limitPurchaseNum || 99999, limitBuyCount || 99999, kucunCount);
            // init buyCount
            product.buyCount = product.minBuyNum
        }
        //产品送红包，送优惠券，送酒币，送赠品标签
        if(product.productTags&&product.productTags.length){
          for(let item of product.productTags){
            //送红包=2,优惠券=3,送酒币=4,产品满赠=7,自提优惠=99
            if(item.tagType == 2||item.tagType == 3||item.tagType == 4||item.tagType == 99) product.jiupiTagShow = true
            if(item.tagType == 2) product.bonusTagShow = true
            if(item.tagType == 3) product.couponTagShow = true
            if(item.tagType == 4) product.jiubiTagShow = true
            if(item.tagType == 7) product.giftsTagShow = true
          }
        }
    }
    return list;
}

//商品关注列表
export function transformFavoriteProductList(list=[]) {
    if (!list.length) return [];
    for (let product of list) {
        Object.assign(product, product.productPrice);

        if (product.productionDate) {
            product.productionDate = new Date(product.productionDate).format('yyyy.MM.dd');
        }
          //展示最高一级会员价格
        if( product.userLevelPrices && product.userLevelPrices.length){
            var cusArr = product.userLevelPrices;
            product.customerLevelName = cusArr[cusArr.length-1].userLevelName.substring(0,2);
            product.customerLevelPrice = cusArr[cusArr.length-1].userLevelPrice;
        }
         //拆包商品
        if(product.saleSpecQuantity == product.specQuantity){
            product.XS = 1;
        }else{
            product.XS = product.saleSpecQuantity || 1;
        }
        if (product.productTags && product.productTags.length) {
            formatProductTags(product);
        }
        //getSourceId  产品来源ID,组合,限时惠为活动ID, 其他为SKUID
        product.sourceId = product.productSkuId;
        //productType: 普通商品(1), 组合商品(2), 限时惠商品(4);
        product.productType = 1;
        if(product.timeLimitPromotionId){
            product.productType = 4;
            product.sourceId = product.timeLimitPromotionId;
        }
        const enjoyPromotions = product.enjoyPromotions;
        if (enjoyPromotions && enjoyPromotions.length) {
            formatPromotionWatermark(product);
            const promotionType = enjoyPromotions[0].promotionType;
            product.productType = promotionType == 4 ? 4 :1;
        }
        //起购 限购
        product.minBuyNum = product.minPurchaseNum || 1;
        if (product.saleMode == 2) {
            product.maxBuyNum = 99999;
            product.buyCount = 1;
        } else {
            const kucunCount = product.canSellStoreCount || product.storeCount;
            let { limitPurchaseNum, limitBuyCount } = product;
            product.maxBuyNum = Math.min(limitPurchaseNum || 99999, limitBuyCount || 99999, kucunCount);
            // init buyCount
            product.buyCount = product.minBuyNum
        }
        //产品送红包，送优惠券，送酒币，送赠品标签
        if(product.productTags&&product.productTags.length){
            for(let item of product.productTags){
              //送红包=2,优惠券=3,送酒币=4,产品满赠=7,自提优惠=99
              if(item.tagType == 2||item.tagType == 3||item.tagType == 4||item.tagType == 99) product.jiupiTagShow = true
              if(item.tagType == 2) product.bonusTagShow = true
              if(item.tagType == 3) product.couponTagShow = true
              if(item.tagType == 4) product.jiubiTagShow = true
              if(item.tagType == 7) product.giftsTagShow = true
            }
        }
    }
    return list;
}

//处理经销商产品列表
export function transformDealerProductList(list) {
  if (!list.length) return [];
  let AppSetting = localStorage.getItem('APP_SETTING');
  list = list.filter(item => item.saleMode == 6);
  for (let product of list) {
    product.promotionType = ''; //Duplicate key
    Object.assign(product, product.productPrice);
    if (product.productionDate) {
      product.productionDate = new Date(product.productionDate).format('yyyy.MM.dd').slice(0,-3);
    }
    //展示最高一级会员价格
    if( product.userLevelPrices && product.userLevelPrices.length){
      var cusArr = product.userLevelPrices;
      product.customerLevelName = cusArr[cusArr.length-1].userLevelName.substring(0,2);
      product.customerLevelPrice = cusArr[cusArr.length-1].userLevelPrice;
    }
    //拆包商品
    if(product.saleSpecQuantity == product.specQuantity){
      product.XS = 1;
    }else{
      product.XS = product.saleSpecQuantity || 1;
    }
    if (product.productTags && product.productTags.length) {
      formatProductTags(product);
    }
    //getSourceId  产品来源ID,经销商产品sourceId=productSkuId
    product.sourceId = product.productSkuId;
    //productType: 普通商品(1),经销商产品(1)
    product.productType = 1;
    //起购 限购
    product.minBuyNum = product.minPurchaseNum || 1;
    const kucunCount = product.canSellStoreCount || product.storeCount;
    let { limitPurchaseNum, limitBuyCount } = product;
    product.maxBuyNum = Math.min(limitPurchaseNum || 99999, limitBuyCount || 99999, kucunCount);
    // init buyCount
    product.buyCount = product.minBuyNum

    //产品送红包，送优惠券，送酒币，送赠品标签
    if(product.productTags&&product.productTags.length){
      for(let item of product.productTags){
        //送红包=2,优惠券=3,送酒币=4,产品满赠=7,自提优惠=99
        if(item.tagType == 2||item.tagType == 3||item.tagType == 4||item.tagType == 99) product.jiupiTagShow = true
        if(item.tagType == 2) product.bonusTagShow = true
        if(item.tagType == 3) product.couponTagShow = true
        if(item.tagType == 4) product.jiubiTagShow = true
        if(item.tagType == 7) product.giftsTagShow = true
      }
    }
  }
  return list;
}

//普通列表
export function makeProductToCartParam(product) {
    const {
        buyCount,
        productSkuId,
        productType,
        productSaleSpecId,
        price,
        saleUnit,
        sourceId
    } = product;
    return {
        count: buyCount,
        productSkuId,
        productType,
        saleSpecId: productSaleSpecId,
        sellingPrice: price,
        sellingPriceUnit: saleUnit,
        sourceId
    };
}


