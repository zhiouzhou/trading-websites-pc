import axios from 'axios'

//修改密码
export function changePassword(params) {
	const url = '/UserInfo/ChangePassword'
	return axios({
		method: 'post',
		url: url,
		data: {
			data: params
		}
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//获取用户信息
export function getUserInfo(params) {
	const url = '/UserInfo/GetUserDetail'
	return axios({
		method: 'post',
        url: url,
        data: {
            data: params
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//更新用户信息
export function updataUserInfo(params) {
	// params.token = localStorage.getItem("token")
	const url = '/UserInfo/Modify'
	return axios({
		method: 'post',
        url: url,
        data: {
            data: params
        },
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//修改手机号码
export function changeMobile(params) {
	const url = '/UserInfo/ModifyMobileNo'
	return axios({
		method: 'post',
        url: url,
        data: {
            data: params
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//获取收藏店铺列表
export function getFavoriteShop(params) {
	const url = '/Shop/ListFavoriteShop'
	return axios({
		method: 'post',
        url: url,
        data: {
            ...params
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//获取商品收藏列表
export function getFavoriteProduct(params) {
	const url = '/User/QueryUserFavorites'
	return axios({
		method: 'post',
        url: url,
		data: params,
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//获取用户浏览产品历史记录
export function getHistory(params) {
	const url = '/User/QueryProductVisitHistorys';
	return axios({
		method: 'post',
        url: url,
		data: params,
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//取消收藏店铺
export function cancelShop(params) {
	const url = '/Shop/UnFavorite';
	return axios({
		method: 'post',
        url: url,
        data: {
			data: params
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//清空我的足迹
export function cleanHistory() {
	const url = '/User/CleanProductVisitHistory';
	return axios({
		method: 'post',
        url: url,
        data: {
			
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//取消商品关注
export function cancelProduct(params) {
	const url = '/UserFavorite/Remove';
	return axios({
		method: 'post',
        url: url,
        data: {
			datas: params
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//清空商品关注
export function cleanProduct() {
	const url = '/User/CleanFavoriteProduct';
	return axios({
		method: 'post',
        url: url,
        data: {
			
		},
		loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}