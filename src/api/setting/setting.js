import axios from 'axios'
//获取所有专区
export function purchaseColumnList() {

	const url = '/PurchaseColumn/List'
	return axios({
		method: 'post',
		url: url,
		data: {},
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}

//APP配置信息  
//@params {}  
export function GetAppSetting() {

	return axios({
		url: '/Setting/GetAppSetting',
		method: 'post',
		data: {
		}
	}).then(res => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}
//专区类目 cache   城市id  
// @ { params } string  专区id  
export function SecondPageCategory(params) {

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

//全局热搜 
export function GetHotKeyWords() {

	const url = '/Setting/GetHotKeyWords'
	return axios({
		method: 'post',
		url: url,
		data: {

		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	});
}
//首页模糊搜索
export function ListSearchKeyRecommend(param) {
	const url = '/Product/ListSearchKeyRecommend'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: param
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
        return Promise.reject(res.data)
    })
}

//购物车统计信息 {param}  专区id 
export function GetShopCartCount(param) {
	const url = '/ShopCar/GetShopCartCount'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: param
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
        return Promise.reject(res.data)
    })
}