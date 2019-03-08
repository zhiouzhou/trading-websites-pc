import axios from 'axios'
import { transformProductList } from "common/productUtil/list";
import { uniqBrandList, getSideCategoryList } from 'common/categoryUtil'
import * as $cache from 'common/cache'
import storage from 'common/storage'
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
//针对首页打折促销 限时惠商品
const transformHomeActivityProducts = function (list) {
	if (!list.length) return [];
	for (let product of list) {
		product.homePromotionProduct = true;
		product.promotionType = '';
		const { enjoyPromotions, promotionId, promotionPrice, productSaleSpecId, productSpec, priceUnit, defaultImgUrl } = product;
		if (enjoyPromotions && enjoyPromotions.length) {
			const promotionType = enjoyPromotions[0].promotionType;
			product.promotionType = promotionType;
			product.productType = 1;
			product.sourceId = product.productSkuId;
			if(promotionType == 4){
				product.productType = 4;
				product.sourceId = product.timeLimitPromotionId = promotionId;
			}
		}
		product.promotionId = promotionId;
		product.price = promotionPrice;
		product.saleSpecId = productSaleSpecId;
		product.specName = productSpec;
		product.priceunit = priceUnit;
		product.imgUrl = defaultImgUrl;
		if (product.productPrice) {
			product.reducePrice = product.productPrice.reducePrice
		}
		if (product.productTags && product.productTags.length) {
			formatProductTags(product);
		}
		if (product.saleSpecQuantity == product.specQuantity) {
			product.XS = 1;
		} else {
			product.XS = product.saleSpecQuantity || 1;
		}
		product.minBuyNum = product.minPurchaseNum || 1;
		const kucunCount = product.canSellStoreCount || product.storeCount;
		let { limitPurchaseNum, limitBuyCount } = product;
		product.maxBuyNum = Math.min(limitPurchaseNum || 99999, limitBuyCount || 99999, kucunCount);
		// init buyCount
		product.buyCount = Math.min(1, product.minBuyNum)

	}
	return list;

}
//针对首页组合活动
const transformHomeCompositeProducts = function (list) {

	for (let product of list) {
		const { activityId, stockState, stockCount, minDeliverCount, productTags } = product
		product.promotionType = 5;
		product.promotionId = activityId;
		product.productType = 2
		product.sourceId = activityId;
		if (productTags && productTags.length) {
			formatProductTags(product);
		}
		if (stockState == 2) {
			product.kucun = `仅剩${stockCount}套`
		}
		product.minBuyNum = minDeliverCount || 1;
		product.maxBuyNum = Math.min(product.limitBuyCount || 99999, stockCount);
		product.buyCount = product.minBuyNum 
	}
	return list
}

const makeHomeActivityList = function (pageInfo) {
	let activityList = [];
	const { discountProducts, timelimitProducts, compositeProducts } = pageInfo
	if (discountProducts && discountProducts.length) {
		activityList.push({
			type: 3,
			name: '打折促销',
			products: transformHomeActivityProducts(discountProducts)
		})
	}
	if (timelimitProducts && timelimitProducts.length) {
		activityList.push({
			type: 4,
			name: '限时惠',
			products: transformHomeActivityProducts(timelimitProducts)
		})
	}
	if (compositeProducts && compositeProducts.length) {
		activityList.push({
			type: 5,
			name: '超值组合',
			products: transformHomeCompositeProducts(compositeProducts)
		})
	}
	return activityList;
}
const getSideBrandList = function (categorys) {
	let brandList = [];
	for (let item of categorys) {
		brandList = brandList.concat(item.brandList)
	}
	return brandList.slice(0, 10);
}

const makeHomeColumnProducts = function (originList) {
	
	for(let column of originList){
		column.products = transformProductList(column.products);
		column.sideCategoryList = getSideCategoryList(column.categorys);
		column.brandList = getSideBrandList(column.categorys);
		column.style = {
			backgroundImage: column.backgroundImgUrl
		}
	}	
	return originList;
}
/**********************************************/
const formatHomeInfo = function(data){
	const allBanners = data.banners || [];
	const banners = allBanners.filter(item => item.bannerPosition === 0);
	const middleBanners = allBanners.filter(
	  item => item.bannerPosition === 1
	);
	const notices = data.notices;
	return {banners, middleBanners , notices }
}
//banner params { string } addressId
export function WebPageInfo() {
	const HOME_INFO = $cache.getCache('HomePageInfo')
	if (HOME_INFO && !storage.get('refreshHomePage', false)) {
		return Promise.resolve({data: HOME_INFO})
	}
	const url = '/HomePage/WebPageInfo'
	return axios({
		method: 'post',
		url: url,
		data: {}
	}).then((res) => {
		const response = res.data;
		if(response.success && response.data){
			const homePageInfo = formatHomeInfo(response.data)
			$cache.setCache('HomePageInfo', homePageInfo)
			return Promise.resolve({data: homePageInfo})
		}
		return Promise.reject(response)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
// HomePromotions    
export function HomePromotions() {
    const HomeActivityList = $cache.getCache('HomeActivityList')
	if(HomeActivityList && !storage.get('refreshHomePage', false)){
		return Promise.resolve({data: HomeActivityList})
	}
	const url = '/Promotion/ListWebHomePromotion'
	return axios({
		method: 'post',
		url: url,
		data: {}
	}).then((res) => {
		const response = res.data;
		if(response.success && response.data){
			const activityList = makeHomeActivityList(response.data);
			$cache.setCache('HomeActivityList', activityList)
			storage.set('refreshHomePage', false)
			return Promise.resolve({data: activityList})
		}
		return Promise.reject(response)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
// HomeColumnProducts   
export function HomeColumnProducts() {
	const HomeColumnProducts = $cache.getCache('HomeColumnProducts')
	if(HomeColumnProducts && !storage.get('refreshHomePage', false)){
		return Promise.resolve({data: HomeColumnProducts})
	}
	const url = '/HomeProduct/ListWebProductColumn'
	return axios({
		method: 'post',
		url: url,
		data: {}
	}).then((res) => {
		const response = res.data;
		if(response.success && response.data){
			const ColumnList = makeHomeColumnProducts(response.data);
			$cache.setCache('HomeColumnProducts', ColumnList)
			storage.set('refreshHomePage', false)
			return Promise.resolve({data: ColumnList})
		}
		return Promise.reject(response)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
//choiceProducts   
export function choiceProducts() {
	const homeChoiceProducts = $cache.getCache('HomeChoiceProducts')
	if(homeChoiceProducts && !storage.get('refreshHomePage', false)){
		return Promise.resolve({data: homeChoiceProducts})
	}
	const url = '/HomeProduct/ListProposeProduct'
	return axios({
		method: 'post',
		url: url,
		data: {}
	}).then((res) => {
		const response = res.data;
		if(response.success && response.data){
			const productList = transformProductList(response.data);
			$cache.setCache('HomeChoiceProducts', productList)
			return Promise.resolve({data: productList})
		}
		return Promise.reject(response)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
