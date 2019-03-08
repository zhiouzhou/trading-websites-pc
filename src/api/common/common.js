import axios from 'axios'
import * as $cache from 'common/cache'
//商品查询 新
export function ListProduct(params = {}) {
	let param = {
		currentPage: params.currentPage || 1,
		data: params,
		pageSize: params.pageSize || 20
	}
	param.data.brandId = "";
	let url = '/Product/ListProduct'
	//凑单列表
	if (params.gatherType && params.gatherType == 3) {
		url = '/GatherOrder/SearchProductList'
		param = {
			...params,
			currentPage: params.currentPage || 1,
			pageSize: params.pageSize || 20
		}
	}
	//优惠券适用产品列表
	if (params.gatherType && params.gatherType == 4) {
		url = '/Coupon/ListUseProduct'
	}
	return axios({
		url,
		method: 'post',
		data: param
	}).then(res => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}


//推荐商品列表 params {recommendTarget,specialAreaId}
export function RecommendProductList(params = {}) {
	const url = '/UserProduct/ListRecommend'
	return axios({
		url,
		method: 'post',
		data: params,
	}).then(res => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}

//获取产品搜索类目列表【新】
export function ListProductCategory(params = {}) {

	const url = '/ProductCategory/ListProductCategory'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

//所有类目列表
//common commonCategoryList
export function ListBigCategory() {
	const commonCategoryList = $cache.getCache('commonCategoryList')
	if (commonCategoryList) {
		return Promise.resolve({ data: commonCategoryList })
	}
	const url = '/ProductCategory/ListCategory'
	return axios({
		method: 'post',
		url: url,
		data: {}
	}).then((res) => {
		const response = res.data;
		if (response.success && response.data) {
			const commonCategoryList = response.data.categoryList
			for (let item of commonCategoryList) {
				if (item.sonCategorys) {
					const Index = item.sonCategorys.findIndex(son => son.sonName == '全部品牌')
					item.sonCategorys.splice(Index, 1)
				}
			}
			$cache.setCache('commonCategoryList', commonCategoryList)
			return Promise.resolve({ data: commonCategoryList })
		}
		return Promise.reject(response);
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

//获取二级主页类目信息  @params  {string}  专区id
export function requestSecondPageCategory(params) {
	const url = '/ProductCategory/SecondPageCategory'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
//searchKey ==> 品牌
export function ListProductBrand(params) {

	const url = '/Brand/ListProductBrand'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

