import axios from 'axios'

//订单预查询
export function PrepareQuery(params) {
	const url = '/OrderSubmit/PrepareQuery'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}
//订单预提交
export function OrderSubmit(params) {
	const url = '/OrderSubmit/Submit'
	return axios({
		method: 'post',
		url: url,
		data: params,
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}
//订单轮询，用户获得付款后，订单的领券
export function orderPolling(params) {
	const url = '/OrderSubmit/PollingOrder'
	return axios({
		method: 'post',
		url: url,
		data: params,
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}

//获取城市下仓库列表(自提)
export function queryWarehouseList(params) {
	const url = '/Warehouse/QueryWarehouseList'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}

//获取赠品券赠品列表
export function queryGiftProducts(params) {
	const url = '/Coupon/ListGiftProduct'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.reject(res.data)
	})
}

//获取优惠码信息
export function getCouponCodeInfo(params) {
  const url = '/CouponCode/Detail'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch(res => {
    return Promise.reject(res.data)
  })
}
