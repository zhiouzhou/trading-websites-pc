//获取优惠券详细减免金额或者赠品字符串
function getSelectCouponReduce(selectCouponList, productList) {
	//滤掉不适合当前优惠券组的商品
	productList = productList.filter(item => fitCoupon(item, selectCouponList[0]))
	let totalCalcAmount = getTotalCalcAmountProdcut(productList)
	let reduceNum = 0
	let couponGiftCount =0
	let reduceStr =''
	if(!selectCouponList || !selectCouponList.length) {
		reduceNum = 0
	} else {
		for(let coupon of selectCouponList) {
			//抵用券(0)),打折券(1)),赠品券(2))
			if(coupon.couponTemplate.couponType == 0) {
				reduceNum += coupon.amount
			}
			if(coupon.couponTemplate.couponType == 2){
				if(coupon.giftCouponProductList){
					for(let it of coupon.giftCouponProductList){
					  couponGiftCount += it.buyCount
					}
				}else{
					  couponGiftCount += 1
				}
			}
		}
		if(couponGiftCount){
			reduceStr = '获得赠品，共' + couponGiftCount
		}
		reduceNum = reduceNum > totalCalcAmount ? totalCalcAmount : reduceNum
	}
	return {
		reduceNum,
		reduceStr
	}
}

//获取参与计算订单总金额
function getTotalCalcAmountProdcut(productList) {
	let totalAmount = 0
	for(let product of productList) {
		totalAmount += product.productAmount
	}
	return totalAmount
}
//TODO :产品是否能用该券
function fitCoupon(product, coupon) {
	if(!product.isUseCoupon || !coupon) {
		return false
	}
	let usableSkuIds = coupon.usableSkuIds
	let canused = usableSkuIds.findIndex(item => item == product.productSkuId)
	//组合商品或者赠品券直接返回true
	if(product.sourceType == 5) {
		return true
	}
	if(canused > -1) {
		return true
	} else {
		return false
	}
}
//判断当前优惠券是否能选中，先不考虑赠品券（全部分为2类，专区券，通用券，赠品券）
function checkCanSelect(coupon, productList, selectCouponList) {
	let canSelect = false
	// 当前点击的优惠券coupon ，所有的商品productList，当前已经选中的优惠券selectCouponList
	/**
	 * 1，如果当前已经选中的优惠券为空，直接可以选择
	 * 2，当前点击的券是专区券,
	 *    1.1当前券与(已经选中券中的专区券)的可用商品是否有交集，如果有交集不能选（置灰），没交集或者交集一样可以选中
	 *    1.2判断当前已经选中的优惠券后剩下的金额是否满足
	 * 3，当前点击的券是通用券
	 *    2.1判断当前已经选中的优惠券后剩下的金额是否满足
	 * 注（  couponType	优惠券类型	number	抵用券(0)),打折券(1)),赠品券(2))
	 *       couponUseType	优惠券定向使用类型	number	定向产品券(0),定向品类券(1),通用券(2)）
	 * */
	//当前没有选中的优惠券,此时一定能选
	if(selectCouponList && selectCouponList.length == 0) {
		canSelect = true
		return getCanUseCouponTitle(productList, coupon)
	}
	//优惠券类型
	let couponType = coupon.couponTemplate.couponType
	//优惠券定向使用类型
	let couponUseType = coupon.couponTemplate.couponUseType
	//优惠券的使用条件：订单起始金额 
	// let useOrderAmountFrom = coupon.couponTemplate.useOrderAmountFrom 
	//当前为专区券
	if(couponUseType != 2) {
		//当前券与(已经选中券中的专区券)的可用商品是没有交集或者可用商品一样，此时才可选（如果此时选中的全是通用券，这里不需要判断交集）
		canSelect = checkCouponProductIntersection(coupon, selectCouponList)
		if(canSelect) {
			canSelect = canSelectCoupon(coupon, productList, selectCouponList)
		}
	}
	//当前为通用券
	if(couponUseType == 2) {
		//判断当前已经选中的优惠券后剩下的金额是否大于当前优惠券的订单起始金额 
		canSelect = checkCommonCouponProductIntersection(coupon, selectCouponList)
		if(canSelect) {
			canSelect = canSelectCoupon(coupon, productList, selectCouponList)
		}
		// canSelect = canSelectCoupon(coupon, productList, selectCouponList)
	}

	//当前可用，如果抵扣过度会有一些提示
	if(canSelect) {
		return getCanUseCouponTitle(productList, coupon)
	} else {
		return {
			success: false,
			desc: "您的订单不满足优惠券使用条件请重新选择"
		}
	}
}
//获取可用优惠券的提示信息
function getCanUseCouponTitle(productList, selectCoupon) {
	let totalCalcAmount = getTotalCalcAmount(productList)
	let diff = selectCoupon.amount - totalCalcAmount
	let desc = diff > 0 ? `您选择了优惠券${selectCoupon.amount}元，其中${(selectCoupon.amount - diff).toFixed(2)}元有效` : ``
	return {
		success: true,
		desc
	}
} //判断当前券与(已经选中券中的专区券)的可用商品是否没有交集或者可用商品一样（如果此时选中的全是通用券，这里不需要判断交集）
function checkCouponProductIntersection(coupon, selectCouponList) {
	//如果当前已选的优惠券全是通用券，不需要判断交集
	let noCommonCoupon = selectCouponList.filter(item => item.couponTemplate.couponUseType != 2)
	if(noCommonCoupon && noCommonCoupon.length == 0) {
		return true
	}
	let couponProductListIds = coupon.usableSkuIds
	//可用商品是否一样
	let canUseProdcutSame = noCommonCoupon.findIndex(item => {
		return JSON.stringify(item.usableSkuIds) ==
			JSON.stringify(couponProductListIds)
	}) != -1
	//可用商品是否完全没交集
	let noIntersectionData = noCommonCoupon.filter(item => {
		//获取交集，交集长度为0时返回
		var intersection = item.usableSkuIds.filter(function(v) {
			return couponProductListIds.indexOf(v) !== -1
		})
		return !intersection.length
	})
	let noIntersection = noIntersectionData.length == noCommonCoupon.length
	return canUseProdcutSame || noIntersection
} //TODO :判断优惠券是否可用
function canSelectCoupon(selectCoupon, list, selectCouponList) {
	//每次调用前，先要将单个商品可分摊的初始化
	let productList = initProductList(list)
	//可能重复
	selectCouponList = selectCouponList.filter(item => item.couponId != selectCoupon.couponId)
	//假装当前可以选中，计算分摊金额，如果分担到商品的可用金额为负数，直接不可选
	selectCouponList.push(selectCoupon)
	let common = []
	let other = []
	for(let item of selectCouponList) {
		if(item.couponTemplate.couponUseType != 2) {
			other.push(item)
		} else {
			common.push(item)
		}
	}
	let canShare = true
	//订单提交商品中可以优惠券的商品
	let canUseProductList = productList.filter(item => item.isUseCoupon)
	//计算通用券是否能用
	for(let item of other) {
		let usableSkuIds = item.usableSkuIds
		//没有分摊时优惠券对应商品的总金额
		let totalUsableSkuIdsAmount = getSkusTotalAmount(usableSkuIds, canUseProductList)
		for(let skuid of usableSkuIds) {
			let skuProduct = canUseProductList.find(item => item.productSkuId == skuid)
			if(skuProduct) {
				//当前商品需要分摊的金额(当前商品金额*当前优惠券启用金额 /当前优惠券中商品的总金额)
				let skuNeedShareAmount = 0
				//如果为0，此时不能分担了，此时券不能选中
				if(totalUsableSkuIdsAmount == 0) {
					canShare = false
				} else {
					skuNeedShareAmount = skuProduct.productAmount * item.useOrderAmountFrom / totalUsableSkuIdsAmount
				}
				//当前商品分摊后剩下的金额
				let skuCanShareAmount = skuProduct.canShareAmount - skuNeedShareAmount
				//设置到productList中去
				for(let ii of canUseProductList) {
					if(ii.productSkuId == skuid) {
						ii.canShareAmount = skuCanShareAmount
					}
				}
			}
		}
	}
	//计算定向商品的分摊金额-
	for(let item of common) {
		let usableSkuIds = item.usableSkuIds
		//没有分摊时优惠券对应商品的总金额
		let totalUsableSkuIdsAmount = getSkusTotalCalcAmount(usableSkuIds, canUseProductList)
		for(let skuid of usableSkuIds) {
			let skuProduct = canUseProductList.find(item => item.productSkuId == skuid)
			if(skuProduct) {
				//当前商品需要分摊的金额(当前商品金额*当前优惠券启用金额 /当前优惠券中商品的总金额)
				let skuNeedShareAmount = 0
				//如果为0，此时不能分担了，此时券不能选中
				if(totalUsableSkuIdsAmount == 0) {
					canShare = false
				} else {
					skuNeedShareAmount = skuProduct.canShareAmount * item.useOrderAmountFrom / totalUsableSkuIdsAmount
				}
				//当前商品分摊后剩下的金额
				let skuCanShareAmount = skuProduct.canShareAmount - skuNeedShareAmount
				//设置到productList中去
				for(let ii of canUseProductList) {
					if(ii.productSkuId == skuid) {
						ii.canShareAmount = skuCanShareAmount
					}
				}
			}
		}
	}
	//查看分摊金额是否有小于o
	let canShareAmountZero = canUseProductList.filter(item => item.canShareAmount < 0)
	let canSelect = canShareAmountZero.length > 0 ? false : true
	return canSelect && canShare
} //未分摊优惠券对应商品的总金额
function getSkusTotalAmount(skuids, canUseProductList) {
	let totalAmount = 0
	for(let product of canUseProductList) {
		let contain = skuids.findIndex(item => item == product.productSkuId) != -1
		if(contain) {
			totalAmount += product.productAmount
		}
	}
	return totalAmount
}

//分摊后优惠券对应商品的总金额
function getSkusTotalCalcAmount(skuids, canUseProductList) {
	let totalAmount = 0
	for(let product of canUseProductList) {
		let contain = skuids.findIndex(item => item == product.productSkuId) != -1
		if(contain) {
			totalAmount += product.canShareAmount
		}
	}
	return totalAmount
}
//获取参与计算订单商品中可以分担的总金额
function getTotalCalcAmount(productList) {
	let totalAmount = 0
	for(let product of productList) {
		totalAmount += product.canShareAmount
	}
	return totalAmount
}

function checkCommonCouponProductIntersection(coupon, selectCouponList) {
	//如果当前已选的优惠券全是通用券，不需要判断交集
	let commonCoupon = selectCouponList.filter(item => item.couponTemplate.couponUseType == 2)
	if(commonCoupon && commonCoupon.length == 0) {
		return true
	}
	let couponProductListIds = coupon.usableSkuIds
	//可用商品是否一样
	let canUseProdcutSame = commonCoupon.findIndex(item => {
		return JSON.stringify(item.usableSkuIds) ==
			JSON.stringify(couponProductListIds)
	}) != -1
	//可用商品是否完全没交集
	let noIntersectionData = commonCoupon.filter(item => {
		//获取交集，交集长度为0时返回
		var intersection = item.usableSkuIds.filter(function(v) {
			return couponProductListIds.indexOf(v) !== -1
		})
		return !intersection.length
	})
	let noIntersection = noIntersectionData.length == commonCoupon.length
	return canUseProdcutSame || noIntersection
}
//每次调用前，先要将单个商品可分摊的初始化
function initProductList(list) {
	let productList = []
	//非组合商品
	for(let item of list) {
		if(item.sourceType != 5) {
			productList.push(item)
		}
	}
	//组合商品
	let compositeList = list.filter(item => item.sourceType == 5)
	for(let compsite of compositeList) {
		for(let ii of compsite.itemSubset) {
			//组合商品中的商品是否跟组合商品一起购买
			let containProduct = productList.filter(item => item.productSkuId == ii.productSkuId &&
				item.productSaleSpecId == ii.productSaleSpecId)
			//如果不包含，添加
			if(containProduct && containProduct.length > 0) {
				productList = this.reBuildProduct(productList, containProduct)
			} else {
				ii.isUseBonus = ii.canUseBonus
				ii.isUseCoupon = ii.canUseCoupon
				productList.push(ii)
			}
		}
	}
	for(let item of productList) {
		item.canShareAmount = item.productAmount
	}
	return productList
}

function reBuildProduct(productList, product) {
	for(let i of productList) {
		if(i.productSkuId == product.productSkuId && i.productSaleSpecId == product.productSaleSpecId) {
			i.productAmount = i.productAmount + product.productAmount
			i.buyCount = i.buyCount + (product.buyCount || 0)
		}
	}
	return productList
}
export {
	fitCoupon,
	getTotalCalcAmount,
	getSelectCouponReduce,
	checkCanSelect
}