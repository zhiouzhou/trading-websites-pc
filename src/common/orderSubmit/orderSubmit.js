import * as $cache from "common/cache";
import * as ShopCartBaseJs from "../shopCart/shopCartBase"

//获取订单预查询参数
function getPrepareParams(addressId) {
	let orders = [] //订单数组
	let itemList = [] //订单项数组
	let {
		productList,
		isSup,
		isDealer,
		isGroupBuy,
		couponCode,
		groupPurchaseId,
		specialAreaId
	} = this
	if(isSup) {
		//合作商需要拆单
		orders = getSupPrepareParams(productList)
	} else if(isDealer) {
		//经销商一次只能有一家提交
		for(let product of productList) {
			let itemObj = {
				buyCount: product.buyCount,
				productSaleSpecId: product.productSaleSpecId || ``,
				productSkuId: product.productSkuId || ``,
				sourceId: product.sourceId || ``,
				sourceType: 0, // 普通商品(0), 产品满赠(1), 订单满赠(2), 订单加价购(3), 限时惠(4), 组合活动商品(5), 优惠券赠送商品(6), 凑单商品(7), 预售商品(8), 团购商品(9), 大宗商品(10);
			}
			itemList.push(itemObj)
		}
		let order = {
			companyId: productList[0].companyId,
			classify: 0, //	普通(0),限时惠(1),预售(2),团购(3),
			itemList: itemList,
			orderType: 2 //	酒批订单(0), 合作商订单(1),入驻商订单(2)
		}
		orders.push(order)
	} else {
		//酒批订单
		//全预售商品
		let allPresaleOrder = productList.every(item => item.stockState == 4)
		//全限时惠商品
		let allTimeLimitOrder = productList.every(item => item.productType == 4)
		for(let product of productList) {
			let itemObj = {
				buyCount: product.buyCount,
				productSaleSpecId: product.productSaleSpecId || ``,
				productSkuId: product.productSkuId || ``,
				sourceId: product.sourceId || product.productSkuId, //组合商品无sourceId
				sourceType: product.stockState == 4 ? 8 : product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 4 ? 4 : product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 5 ? 5 : 0,
			}
			//团购
			if(isGroupBuy) {
				itemObj.sourceType = 9
				itemObj.sourceId = product.promotionId
			}
			itemList.push(itemObj)
		}
		let order = {
			classify: isGroupBuy ? 3 : allPresaleOrder ? 2 : allTimeLimitOrder ? 1 : 0, //	普通(0),限时惠(1),预售(2),团购(3),
			itemList: itemList,
			couponCodes: couponCode ? [couponCode] : [],
			orderType: 0 //	酒批订单(0), 合作商订单(1),入驻商订单(2)
		}
		if(isGroupBuy) {
			order.grouponGroupId = groupPurchaseId
		}
		orders.push(order)
	}
	//添加专区id.地址id
	let selectAddressId = addressId||localStorage.getItem("defaultAddressId")
	for(let order of orders) {
		order.specialAreaId = specialAreaId
		order.addressId = selectAddressId
	}
	let prepareParams = {
		datas: orders,
		addressId:selectAddressId
	}
	return prepareParams
}
  //获取合作商预查询参数
  function getSupPrepareParams(productList) {
    let orders = []//订单数组
    let map = {}
    //按合作商分组，存入map，合作商companyId为键，产品数组为值
    for (let product of productList) {
      if (!map[product.companyId]) {
        map[product.companyId] = [product]
      } else {
        map[product.companyId].push(product)
      }
    }
    for (let key in map) {
      let itemList = []//订单项数组
      //每个合作商一个订单
      for (let product of map[key]) {
        let itemObj = {
          buyCount: product.buyCount,
          productSaleSpecId: product.productSaleSpecId || ``,
          productSkuId: product.productSkuId || ``,
          sourceId: product.sourceId || ``,
          sourceType: 0, // 普通商品(0), 产品满赠(1), 订单满赠(2), 订单加价购(3), 限时惠(4), 组合活动商品(5), 优惠券赠送商品(6), 凑单商品(7), 预售商品(8), 团购商品(9), 大宗商品(10);
        }
        itemList.push(itemObj)
      }
      //添加专区id.地址id
	  let selectAddressId = localStorage.getItem("defaultAddressId")
      let order = {
        classify: 0,//	普通(0),限时惠(1),预售(2),团购(3),
        companyId: key,
        itemList: itemList,
        addressId: selectAddressId,
        orderType: 1//	酒批订单(0), 合作商订单(1),入驻商订单(2)
      }
      orders.push(order)
    }
    return orders
  }
//获取订单提交的参数
function getOrderSubmitParams() {
	let {
		orders,
		productList,
		selectCouponList,
		selectBonusList,
		couponCode,
		couponCodeNotice,
    codeSuccessDesc,
		currentLocation,
		currentAddress,
		currentWareHouse,
		currentDeliveryMode,
		currentPayType,
		fromShoppingCar,
		isSup,
		isDealer,
		isGroupBuy,
		groupPurchaseId,
		specialAreaId,
    remark
	} = this
	//多个订单提交参数
	let submitOrdersParams = []
	for(let order of orders) {
		//单个订单提交参数
		let submitOrderParams = {}
		//订单明细(经销商合作商商品不会有组合商品拆分的情况出现，所以直接取orders里返回的productItems)
		let itemList = []
		if(isSup || isDealer) {
			for(let product of order.itemGroups[0].productItems) {
				let itemObj = {}
				itemObj.buyCount = product.buyCount
				itemObj.productSaleSpecId = product.productSaleSpecId
				itemObj.sourceId = product.sourceId
				itemObj.productSkuId = product.productSkuId
				itemObj.sourceType = product.sourceType
				itemList.push(itemObj)
			}
		} else {
			for(let product of productList) {
				let itemObj = {}
				itemObj.buyCount = product.buyCount
				itemObj.productSaleSpecId = product.productSaleSpecId || ``
				itemObj.productSkuId = product.productSkuId || ``
				itemObj.sourceId = product.sourceId || product.productSkuId //组合商品无sourceId
				itemObj.sourceType = product.stockState == 4 ? 8 :
					product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 4 ? 4 :
					product.enjoyPromotions && product.enjoyPromotions.length && product.enjoyPromotions[0].promotionType == 5 ? 5 : 0
				//团购
				if(isGroupBuy) {
					itemObj.sourceType = 9
					itemObj.sourceId = product.promotionId
				}
				itemList.push(itemObj)
			}
		}
		//红包优惠券id列表
		selectBonusList = selectBonusList.map(item => item.bonusId)
		selectCouponList = selectCouponList.map(item => item.couponId)
		//单个订单提交参数
		submitOrderParams = {
			addressId: currentAddress.addressId ? currentAddress.addressId : ``,
			classify: order.classify,
			companyId: order.companyId || ``,
			//通过下面的提示是否为空字符串去看是否使用了优惠码
			couponCodes: codeSuccessDesc && couponCode ? [couponCode] : [],
			deliveryMode: currentDeliveryMode,
			fromShoppingCar,
			itemList,
			latitude: 0,
			longitude: 0,
			orderNo: order.orderNo,
			orderType: order.orderType,
			payType: isSup ? 0 : isDealer ? 0 : currentPayType,
			selfWarehouseId: currentDeliveryMode == 4 ? currentWareHouse.warehouseId : ``,
			useBonusIds: selectBonusList,
			useCouponIds: selectCouponList,
			userRemark: remark,
			specialAreaId: specialAreaId
		}
		if(isGroupBuy) {
			submitOrderParams.grouponGroupId = groupPurchaseId
		}
		submitOrdersParams.push(submitOrderParams)
	}
	return submitOrdersParams
}
export {
	getPrepareParams,
	getOrderSubmitParams
}
