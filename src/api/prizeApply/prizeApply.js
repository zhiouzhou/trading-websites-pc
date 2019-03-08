import axios from 'axios'

//获取兑奖订单列表
export function getApplyList(params) {
	let url = '/AwardOrder/List'
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

//删除兑奖订单
export function deleteApply(params) {
	let url = '/AwardOrder/Delete'
	return axios({
		method: 'post',
		url: url,
		data: {data: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}
//取消兑奖订单
export function cancelApply(params) {
	let url = '/AwardOrder/Cancel'
	return axios({
		method: 'post',
		url: url,
		data: {data: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}
//获取兑奖详情
export function getApplyDetail(params) {
	let url = '/AwardOrder/GetDetail'
	return axios({
		method: 'post',
		url: url,
		data: {data: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}
//新增兑奖
export function addApply(params) {
	let url = '/AwardOrder/Add'
	return axios({
		method: 'post',
		url: url,
		data: {data: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}
//修改兑奖数量
export function changeApply(params) {
	let url = '/AwardOrder/Modify'
	return axios({
		method: 'post',
		url: url,
		data: {data: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

export function getSettingValue() {
	let url = '/Setting/GetSettingValue'
	let params = ['AwardOrderServiceRemark']
	return axios({
		method: 'post',
		url: url,
		data: {datas: params},
    loading: true
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}